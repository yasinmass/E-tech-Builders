from rest_framework import serializers
from .models import BuildingAccountTransaction

class BuildingAccountTransactionSerializer(serializers.ModelSerializer):
    building_name = serializers.ReadOnlyField(source='building.name')
    
    class Meta:
        model = BuildingAccountTransaction
        fields = [
            'id', 'building', 'building_name', 'transaction_type', 
            'category', 'amount', 'notes', 'date', 'created_at'
        ]

class BuildingAccountSummarySerializer(serializers.Serializer):
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expense = serializers.DecimalField(max_digits=12, decimal_places=2)
    current_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
