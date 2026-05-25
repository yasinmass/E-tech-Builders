from django.contrib import admin
from .models import WorkSession, WorkDetail


class WorkDetailInline(admin.TabularInline):
    model = WorkDetail
    extra = 1
    fields = ["category", "count"]


@admin.register(WorkSession)
class WorkSessionAdmin(admin.ModelAdmin):
    list_display = ["id", "building", "work_date", "created_at", "total_workers"]
    list_filter = ["work_date", "building"]
    search_fields = ["building__name"]
    readonly_fields = ["created_at"]
    inlines = [WorkDetailInline]
    ordering = ["-work_date", "-created_at"]

    def total_workers(self, obj):
        return sum(d.count for d in obj.details.all())
    total_workers.short_description = "Total Workers"


@admin.register(WorkDetail)
class WorkDetailAdmin(admin.ModelAdmin):
    list_display = ["id", "work_session", "category", "count"]
    list_filter = ["category"]
    search_fields = ["work_session__building__name", "category"]
