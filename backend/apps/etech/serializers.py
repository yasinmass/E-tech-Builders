from rest_framework import serializers
from .models import ETechProject, ETechCategory, ETechAssignment, ETechAssignmentDetail
from django.db.models import Sum, Count


class ETechCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ETechCategory
        fields = ["id", "name"]


class ETechProjectSerializer(serializers.ModelSerializer):
    categories = ETechCategorySerializer(many=True, read_only=True)
    ownerPhoto = serializers.ImageField(source="owner_photo", required=False, allow_null=True)
    sitePhoto = serializers.ImageField(source="site_photo", required=False, allow_null=True)
    ownerName = serializers.CharField(source="owner_name")

    class Meta:
        model = ETechProject
        fields = ["id", "name", "ownerName", "location", "contact", "description", "categories", "ownerPhoto", "sitePhoto", "created_at"]


class ETechAssignmentDetailSerializer(serializers.ModelSerializer):
    categoryName = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = ETechAssignmentDetail
        fields = ["id", "category", "categoryName", "count"]


class ETechAssignmentReadSerializer(serializers.ModelSerializer):
    projectId = serializers.CharField(source="project.id")
    projectName = serializers.CharField(source="project.name")
    workDate = serializers.DateField(source="work_date")
    details = ETechAssignmentDetailSerializer(many=True, read_only=True)

    class Meta:
        model = ETechAssignment
        fields = ["id", "projectId", "projectName", "workDate", "details"]


class ETechAssignmentWriteSerializer(serializers.Serializer):
    project = serializers.IntegerField()
    work_date = serializers.DateField()
    work_time = serializers.TimeField(required=False, allow_null=True)
    details = serializers.ListField(
        child=serializers.DictField()
    )

    def create(self, validated_data):
        project = ETechProject.objects.get(pk=validated_data["project"])
        assignment = ETechAssignment.objects.create(
            project=project,
            work_date=validated_data["work_date"],
            # Support the new work_time field if provided in validated_data
            work_time=validated_data.get("work_time")
        )
        for d in validated_data["details"]:
            category_id = d.get("category")
            category_name = d.get("category_name")
            
            if category_name:
                category, _ = ETechCategory.objects.get_or_create(
                    project=project, name=category_name
                )
            else:
                category = ETechCategory.objects.get(pk=category_id)
                
            ETechAssignmentDetail.objects.create(
                assignment=assignment,
                category=category,
                count=d.get("count", 1),
            )
        return assignment


class ETechFlatAssignmentSerializer(serializers.Serializer):
    """
    Matches the shape of building assignments for the merged filter view.
    """
    id = serializers.CharField(source="max_id")
    buildingId = serializers.CharField(source="project") # For compatibility with FE type naming
    buildingName = serializers.CharField(source="projectName")
    category = serializers.SerializerMethodField()
    count = serializers.IntegerField(source="total_workers")
    date = serializers.SerializerMethodField()
    details = serializers.SerializerMethodField()
    type = serializers.ReadOnlyField(default="etech")

    def get_category(self, obj):
        count = obj.get("total_categories", 0)
        return f"{count} Categories"

    def get_date(self, obj):
        date_str = obj['work_date'].isoformat()
        time_str = obj['work_time'].isoformat() if obj.get('work_time') else "00:00:00"
        return f"{date_str}T{time_str}.000Z"

    def get_details(self, obj):
        details = (
            ETechAssignmentDetail.objects.filter(
                assignment__project_id=obj["project"],
                assignment__work_date=obj["work_date"],
            )
            .values("category__name")
            .annotate(total=Sum("count"))
            .order_by("category__name")
        )
        return [{"category": d["category__name"], "count": d["total"]} for d in details]
