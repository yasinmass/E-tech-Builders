from django.urls import path
from .views import AssignmentListCreateView, AssignmentDetailView, FilterView, StatsView
from .pdf_report import WorkforceReportView

urlpatterns = [
    path("assignments/", AssignmentListCreateView.as_view(), name="assignment-list-create"),
    path("assignments/<int:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("filter/", FilterView.as_view(), name="filter"),
    path("stats/", StatsView.as_view(), name="stats"),
    path("workforce-report/", WorkforceReportView.as_view(), name="workforce-report"),
]
