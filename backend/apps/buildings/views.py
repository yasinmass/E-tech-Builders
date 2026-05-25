from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import Building
from .serializers import BuildingReadSerializer, BuildingWriteSerializer


class BuildingListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/buildings/  — List all buildings (newest first)
    POST /api/buildings/  — Create a new building (multipart/form-data for photos)
    """

    queryset = Building.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BuildingWriteSerializer
        return BuildingReadSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class BuildingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/buildings/<id>/  — Retrieve a building
    PUT    /api/buildings/<id>/  — Full update
    PATCH  /api/buildings/<id>/  — Partial update
    DELETE /api/buildings/<id>/  — Delete
    """

    queryset = Building.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return BuildingWriteSerializer
        return BuildingReadSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Clean up uploaded files on delete
        if instance.owner_photo:
            instance.owner_photo.delete(save=False)
        if instance.site_photo:
            instance.site_photo.delete(save=False)
        self.perform_destroy(instance)
        return Response(
            {"detail": "Building deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
