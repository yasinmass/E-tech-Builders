from django.urls import path
from .views import CSVBackupView, BackupHistoryView

urlpatterns = [
    path("backup/csv/", CSVBackupView.as_view(), name="backup-csv"),
    path("backup/history/", BackupHistoryView.as_view(), name="backup-history"),
]
