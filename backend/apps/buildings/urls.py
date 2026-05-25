from django.urls import path
from .views import BuildingListCreateView, BuildingDetailView

urlpatterns = [
    path("buildings/", BuildingListCreateView.as_view(), name="building-list-create"),
    path("buildings/<int:pk>/", BuildingDetailView.as_view(), name="building-detail"),
]
