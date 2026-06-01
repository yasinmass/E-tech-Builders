from django.urls import path
from .views import MemberListCreateView, MemberDetailView

urlpatterns = [
    path("members/", MemberListCreateView.as_view(), name="member-list-create"),
    path("members/<int:pk>/", MemberDetailView.as_view(), name="member-detail"),
]
