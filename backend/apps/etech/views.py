from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Max, Q
from django.db.models.functions import Cast
from django.db import models

from .models import ETechProject, ETechCategory, ETechAssignment, ETechAssignmentDetail
from .serializers import (
    ETechProjectSerializer,
    ETechCategorySerializer,
    ETechAssignmentReadSerializer,
    ETechAssignmentWriteSerializer,
    ETechFlatAssignmentSerializer,
)


class ETechProjectViewSet(viewsets.ModelViewSet):
    queryset = ETechProject.objects.all().prefetch_related("categories")
    serializer_class = ETechProjectSerializer
    permission_classes = [IsAuthenticated]


class ETechCategoryCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        try:
            project = ETechProject.objects.get(pk=project_id)
        except ETechProject.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        name = request.data.get("name")
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

        category, created = ETechCategory.objects.get_or_create(project=project, name=name)
        serializer = ETechCategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, project_id, category_id):
        try:
            category = ETechCategory.objects.get(pk=category_id, project_id=project_id)
            category.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ETechCategory.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)


class ETechAssignmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        assignments = ETechAssignment.objects.all().prefetch_related("details", "details__category")
        serializer = ETechAssignmentReadSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ETechAssignmentWriteSerializer(data=request.data)
        if serializer.is_valid():
            assignment = serializer.save()
            return Response(ETechAssignmentReadSerializer(assignment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ETechAssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return ETechAssignment.objects.get(pk=pk)
        except ETechAssignment.DoesNotExist:
            return None

    def get(self, request, pk):
        assignment = self.get_object(pk)
        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ETechAssignmentReadSerializer(assignment)
        return Response(serializer.data)

    def delete(self, request, pk):
        assignment = self.get_object(pk)
        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Consolidation Fix: Delete all assignments for this project on this date
        ETechAssignment.objects.filter(
            project=assignment.project,
            work_date=assignment.work_date
        ).delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        """Update a grouped E Tech assignment."""
        assignment = self.get_object(pk)
        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        old_project = assignment.project
        old_date = assignment.work_date
        
        serializer = ETechAssignmentWriteSerializer(data=request.data)
        if serializer.is_valid():
            # Delete old group
            ETechAssignment.objects.filter(
                project=old_project,
                work_date=old_date
            ).delete()
            
            new_assignment = serializer.save()
            return Response(ETechAssignmentReadSerializer(new_assignment).data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
