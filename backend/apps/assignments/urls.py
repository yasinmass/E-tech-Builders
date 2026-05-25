from django.urls import path
from .views import AssignmentListCreateView, AssignmentDetailView, FilterView

urlpatterns = [
    path("assignments/", AssignmentListCreateView.as_view(), name="assignment-list-create"),
    path("assignments/<int:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("filter/", FilterView.as_view(), name="filter"),
]
