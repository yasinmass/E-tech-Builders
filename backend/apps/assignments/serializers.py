from rest_framework import serializers
from .models import WorkSession, WorkDetail, CATEGORY_CHOICES


class WorkDetailSerializer(serializers.ModelSerializer):
    """Nested serializer for individual worker category rows."""

    class Meta:
        model = WorkDetail
        fields = ["id", "category", "count"]


class WorkSessionReadSerializer(serializers.ModelSerializer):
    """Full work session with nested details and building info."""

    buildingId = serializers.SerializerMethodField()
    buildingName = serializers.SerializerMethodField()
    workDate = serializers.DateField(source="work_date")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    details = WorkDetailSerializer(many=True, read_only=True)

    class Meta:
        model = WorkSession
        fields = ["id", "buildingId", "buildingName", "workDate", "createdAt", "updatedAt", "details"]

    def get_buildingId(self, obj):
        return str(obj.building_id)

    def get_buildingName(self, obj):
        return obj.building.name


class WorkDetailWriteSerializer(serializers.Serializer):
    """Incoming detail row: category + count."""

    category = serializers.ChoiceField(choices=[c[0] for c in CATEGORY_CHOICES])
    count = serializers.DecimalField(max_digits=6, decimal_places=1, min_value=0.1)


class WorkSessionWriteSerializer(serializers.Serializer):
    """
    Create a WorkSession + its WorkDetails in one request.
    Expected payload:
    {
        "building": 1,
        "work_date": "2024-05-23",
        "details": [
            {"category": "Mason", "count": 6},
            {"category": "Electrician", "count": 2}
        ]
    }
    """

    building = serializers.IntegerField()
    work_date = serializers.DateField()
    work_time = serializers.TimeField(required=False, allow_null=True)
    details = WorkDetailWriteSerializer(many=True)

    def validate_details(self, value):
        if not value:
            raise serializers.ValidationError("At least one worker detail is required.")
        return value

    def validate_building(self, value):
        from apps.buildings.models import Building
        try:
            Building.objects.get(pk=value)
        except Building.DoesNotExist:
            raise serializers.ValidationError(f"Building with id={value} does not exist.")
        return value

    def create(self, validated_data):
        from apps.buildings.models import Building
        building = Building.objects.get(pk=validated_data["building"])
        session = WorkSession.objects.create(
            building=building,
            work_date=validated_data["work_date"],
            work_time=validated_data.get("work_time"),
        )
        details_data = validated_data["details"]
        WorkDetail.objects.bulk_create([
            WorkDetail(
                work_session=session,
                category=d["category"],
                count=d["count"],
            )
            for d in details_data
        ])
        return session


class FlatAssignmentSerializer(serializers.Serializer):
    """
    Flat representation of grouped assignments for the filter API.
    Handles dictionary data from .values().annotate()
    """

    id = serializers.CharField(source="max_id")
    buildingId = serializers.CharField(source="building")
    buildingName = serializers.CharField()
    category = serializers.SerializerMethodField()
    count = serializers.DecimalField(source="total_workers", max_digits=6, decimal_places=1)
    date = serializers.SerializerMethodField()
    updatedAt = serializers.DateTimeField(source="max_updated_at", read_only=True)
    details = serializers.SerializerMethodField()

    def get_category(self, obj):
        count = obj.get("total_categories", 0)
        return f"{count} Categories"

    def get_date(self, obj):
        # obj is a dict from .values()
        date_str = obj['work_date'].isoformat()
        time_str = obj['work_time'].isoformat() if obj.get('work_time') else "00:00:00"
        return f"{date_str}T{time_str}.000Z"

    def get_details(self, obj):
        from .models import WorkDetail
        from django.db.models import Sum
        
        # Get category-wise breakdown for this building and date
        details = (
            WorkDetail.objects.filter(
                work_session__building_id=obj["building"],
                work_session__work_date=obj["work_date"],
            )
            .values("category")
            .annotate(total=Sum("count"))
            .order_by("category")
        )
        return [{"category": d["category"], "count": d["total"]} for d in details]
