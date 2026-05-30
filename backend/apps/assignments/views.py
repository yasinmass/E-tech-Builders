from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.db.models.functions import Cast
from django.db.models import CharField

from .models import WorkSession, WorkDetail
from .serializers import (
    WorkSessionReadSerializer,
    WorkSessionWriteSerializer,
    FlatAssignmentSerializer,
)


class AssignmentListCreateView(APIView):
    """
    GET  /api/assignments/  — List all work sessions (newest first)
    POST /api/assignments/  — Create session + details in one request
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = (
            WorkSession.objects.select_related("building")
            .prefetch_related("details")
            .all()
        )
        serializer = WorkSessionReadSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WorkSessionWriteSerializer(data=request.data)
        if serializer.is_valid():
            session = serializer.save()
            read_serializer = WorkSessionReadSerializer(session)
            return Response(read_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentDetailView(APIView):
    """
    GET /api/assignments/<id>/  — Retrieve a single work session with its details
    """

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return (
                WorkSession.objects.select_related("building")
                .prefetch_related("details")
                .get(pk=pk)
            )
        except WorkSession.DoesNotExist:
            return None

    def get(self, request, pk):
        session = self.get_object(pk)
        if session is None:
            return Response(
                {"detail": "Work session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = WorkSessionReadSerializer(session)
        return Response(serializer.data)

    def delete(self, request, pk):
        session = self.get_object(pk)
        if session is None:
            return Response(
                {"detail": "Work session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # Consolidation Fix: Delete all sessions for this building on this date
        WorkSession.objects.filter(
            building=session.building,
            work_date=session.work_date
        ).delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        """
        Update a grouped assignment.
        Since assignments are grouped by Building+Date in Filter,
        updating one (via max_id) should replace the entire group's session data.
        """
        session = self.get_object(pk)
        if session is None:
            return Response(
                {"detail": "Work session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # 1. Delete the old group
        # (This ensures we don't have duplicates or orphan sessions when building/date changes)
        old_building = session.building
        old_date = session.work_date
        
        # 2. Validate and Save new data
        serializer = WorkSessionWriteSerializer(data=request.data)
        if serializer.is_valid():
            # Delete after validation to be safe
            WorkSession.objects.filter(
                building=old_building,
                work_date=old_date
            ).delete()
            
            new_session = serializer.save()
            read_serializer = WorkSessionReadSerializer(new_session)
            return Response(read_serializer.data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.db.models import Sum, Count, Max

from apps.etech.models import ETechAssignment
from apps.etech.serializers import ETechFlatAssignmentSerializer

class FilterView(generics.ListAPIView):
    """
    GET /api/filter/?search=<query>&type=<all|builder|etech>

    Returns grouped assignment records matching the search query.
    Supports filtering by type.
    """

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # We handle merging and filtering in the list() method for flexibility
        return None

    def list(self, request, *args, **kwargs):
        search = self.request.query_params.get("search", "").strip()
        type_filter = self.request.query_params.get("type", "all").lower()

        results = []

        # 1. Builders
        if type_filter in ["all", "builder"]:
            builder_qs = WorkSession.objects.select_related("building")
            if search:
                builder_qs = builder_qs.annotate(
                    date_str=Cast("work_date", output_field=CharField())
                ).filter(
                    Q(building__name__icontains=search)
                    | Q(details__category__icontains=search)
                    | Q(date_str__icontains=search)
                )
            
            builder_grouped = (
                builder_qs.values("building", "work_date")
                .annotate(
                    total_categories=Count("details__category", distinct=True),
                    total_workers=Sum("details__count"),
                    work_time=Max("work_time"),
                    max_id=Max("id"),
                    max_updated_at=Max("updated_at"),
                    buildingName=Max("building__name"),
                )
            )
            
            builder_data = FlatAssignmentSerializer(builder_grouped, many=True).data
            for d in builder_data:
                d["type"] = "builder"
            results.extend(builder_data)

        # 2. E Tech
        if type_filter in ["all", "etech"]:
            etech_qs = ETechAssignment.objects.select_related("project")
            if search:
                etech_qs = etech_qs.annotate(
                    date_str=Cast("work_date", output_field=CharField())
                ).filter(
                    Q(project__name__icontains=search)
                    | Q(details__category__name__icontains=search)
                    | Q(date_str__icontains=search)
                )
            
            etech_grouped = (
                etech_qs.values("project", "work_date")
                .annotate(
                    total_categories=Count("details__category", distinct=True),
                    total_workers=Sum("details__count"),
                    work_time=Max("work_time"),
                    max_id=Max("id"),
                    max_updated_at=Max("updated_at"),
                    projectName=Max("project__name"),
                )
            )
            
            etech_data = ETechFlatAssignmentSerializer(etech_grouped, many=True).data
            for d in etech_data:
                d["type"] = "etech"
            results.extend(etech_data)

        # Sort combined results by date (desc) and then id (desc)
        results.sort(key=lambda x: (x["date"], x["id"]), reverse=True)

        return Response(results)


class StatsView(APIView):
    """
    GET /api/stats/
    Returns summary counts for the dashboard.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.buildings.models import Building
        from apps.etech.models import ETechProject
        from apps.finance.models import BuildingAccountTransaction

        # 1. Builder Stats
        builder_count = Building.objects.count()
        builder_total_assigned = WorkDetail.objects.aggregate(total=Sum("count"))["total"] or 0
        builder_sessions = WorkSession.objects.values("building", "work_date").distinct().count()

        # 2. E Tech Stats
        etech_count = ETechProject.objects.count()
        from apps.etech.models import ETechAssignmentDetail
        etech_total_assigned = ETechAssignmentDetail.objects.aggregate(total=Sum("count"))["total"] or 0
        etech_sessions = ETechAssignment.objects.values("project", "work_date").distinct().count()

        # 3. Finance Stats
        finance_qs = BuildingAccountTransaction.objects.all()
        total_income = finance_qs.filter(transaction_type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = finance_qs.filter(transaction_type='expense').aggregate(total=Sum('amount'))['total'] or 0
        current_balance = total_income - total_expense

        # 4. Recent Activity
        recent_activity = []
        
        # Recent Assignments (Builders)
        recent_builder = WorkSession.objects.select_related('building').order_by('-work_date', '-id')[:5]
        for session in recent_builder:
            recent_activity.append({
                "type": "builder",
                "message": f"Assigned workers to {session.building.name}",
                "date": session.work_date.isoformat(),
                "time": session.work_time.isoformat() if session.work_time else "00:00:00"
            })

        # Recent Transactions
        recent_tx = BuildingAccountTransaction.objects.select_related('building').order_by('-created_at')[:5]
        for tx in recent_tx:
            recent_activity.append({
                "type": "transaction",
                "message": f"{tx.get_transaction_type_display()} recorded for {tx.building.name}: {tx.category}",
                "date": tx.created_at.isoformat(),
                "time": tx.created_at.strftime("%H:%M:%S")
            })

        # Sort combined activity and take top 8
        recent_activity.sort(key=lambda x: (x["date"], x["time"]), reverse=True)
        recent_activity = recent_activity[:8]

        return Response({
            "builders": {
                "count": builder_count,
                "total_assigned": builder_total_assigned,
                "sessions": builder_sessions,
            },
            "etech": {
                "count": etech_count,
                "total_assigned": etech_total_assigned,
                "sessions": etech_sessions,
            },
            "finance": {
                "total_income": total_income,
                "total_expense": total_expense,
                "current_balance": current_balance,
            },
            "recent_activity": recent_activity
        })
