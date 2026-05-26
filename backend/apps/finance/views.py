from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from .models import BuildingAccountTransaction
from .serializers import BuildingAccountTransactionSerializer, BuildingAccountSummarySerializer
from apps.buildings.models import Building

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = BuildingAccountTransaction.objects.all()
    serializer_class = BuildingAccountTransactionSerializer

    def get_queryset(self):
        queryset = BuildingAccountTransaction.objects.all()
        building_id = self.request.query_params.get('building_id')
        if building_id:
            queryset = queryset.filter(building_id=building_id)
        
        # Filtering
        transaction_type = self.request.query_params.get('transaction_type')
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)
            
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

    @action(detail=False, methods=['get'], url_path='summary/(?P<building_id>[^/.]+)')
    def summary(self, request, building_id=None):
        if not building_id:
            return Response({"error": "Building ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        transactions = BuildingAccountTransaction.objects.filter(building_id=building_id)
        
        total_income = transactions.filter(transaction_type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expense = transactions.filter(transaction_type='expense').aggregate(total=Sum('amount'))['total'] or 0
        
        current_balance = total_income - total_expense
        
        data = {
            "total_income": total_income,
            "total_expense": total_expense,
            "current_balance": current_balance
        }
        
        return Response(data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        building_id = self.request.query_params.get('building_id')
        
        # If building_id is provided, we can calculate running balance
        # For simplicity and efficiency, we'll calculate it on the fly for the returned page
        # Note: In a large system, this would be computed differently
        
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        
        if building_id:
            # Sort by created_at ascending to calculate running balance
            # However, the queryset is descending by default
            # Let's calculate total balance first and then backtrack or just fetch everything and compute
            # For this MVP, let's just return the list and let frontend handle running balance if needed,
            # but the requirement says "Backend should calculate: Current Balance"
            # I'll add a 'running_balance' field to the serialized output if building_id is present
            
            transactions_asc = queryset.order_by('created_at')
            balance = 0
            balance_map = {}
            for t in transactions_asc:
                if t.transaction_type == 'income':
                    balance += t.amount
                else:
                    balance -= t.amount
                balance_map[t.id] = balance
            
            for item in data:
                item['running_balance'] = balance_map.get(item['id'], 0)
                
        return Response(data)
