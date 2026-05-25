from rest_framework import serializers
from .models import Building


class BuildingReadSerializer(serializers.ModelSerializer):
    """
    Serializer for GET responses.
    Returns camelCase fields and full absolute URLs for photos
    to match the TypeScript frontend types exactly.
    """

    id = serializers.SerializerMethodField()
    ownerPhoto = serializers.SerializerMethodField()
    sitePhoto = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Building
        fields = ["id", "name", "address", "phone", "ownerPhoto", "sitePhoto", "createdAt"]

    def get_id(self, obj):
        return str(obj.id)

    def get_ownerPhoto(self, obj):
        request = self.context.get("request")
        if obj.owner_photo and hasattr(obj.owner_photo, "url"):
            if request:
                return request.build_absolute_uri(obj.owner_photo.url)
            return obj.owner_photo.url
        return ""

    def get_sitePhoto(self, obj):
        request = self.context.get("request")
        if obj.site_photo and hasattr(obj.site_photo, "url"):
            if request:
                return request.build_absolute_uri(obj.site_photo.url)
            return obj.site_photo.url
        return ""


class BuildingWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for POST / PUT / PATCH requests.
    Accepts snake_case fields and file uploads via multipart/form-data.
    """

    class Meta:
        model = Building
        fields = ["name", "address", "phone", "owner_photo", "site_photo"]
        extra_kwargs = {
            "owner_photo": {"required": False},
            "site_photo": {"required": False},
        }

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Building name cannot be blank.")
        return value.strip()

    def to_representation(self, instance):
        """After write, return the full read representation."""
        return BuildingReadSerializer(instance, context=self.context).data
