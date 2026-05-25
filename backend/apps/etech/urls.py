from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ETechProjectViewSet, ETechCategoryCreateView, ETechAssignmentView, ETechAssignmentDetailView

router = DefaultRouter()
router.register(r"projects", ETechProjectViewSet, basename="etech-projects")

urlpatterns = [
    path("", include(router.urls)),
    path("projects/<int:project_id>/categories/", ETechCategoryCreateView.as_view(), name="etech-category-create"),
    path("projects/<int:project_id>/categories/<int:category_id>/", ETechCategoryCreateView.as_view(), name="etech-category-delete"),
    path("assignments/", ETechAssignmentView.as_view(), name="etech-assignments"),
    path("assignments/<int:pk>/", ETechAssignmentDetailView.as_view(), name="etech-assignment-detail"),
]
