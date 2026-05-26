from django.db import models
from django.utils import timezone
from apps.buildings.models import Building

class BuildingAccountTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    INCOME_CATEGORIES = [
        ('owner_payment', 'Owner Payment'),
        ('advance', 'Advance'),
        ('other', 'Other'),
    ]

    EXPENSE_CATEGORIES = [
        ('sand', 'Sand'),
        ('cement', 'Cement'),
        ('steel', 'Steel'),
        ('painting', 'Painting'),
        ('plumbing', 'Plumbing'),
        ('electrical', 'Electrical'),
        ('labour', 'Labour'),
        ('other', 'Other'),
    ]

    ALL_CATEGORIES = INCOME_CATEGORIES + EXPENSE_CATEGORIES

    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=50) # We'll validate this in serializer or form
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True, default="")
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = "Building Account Transaction"
        verbose_name_plural = "Building Account Transactions"

    def __str__(self):
        return f"{self.building.name} - {self.transaction_type} - {self.amount}"
