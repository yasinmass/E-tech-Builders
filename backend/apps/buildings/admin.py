from django.contrib import admin
from .models import Building


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "address", "phone", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["name", "address", "phone"]
    readonly_fields = ["created_at"]
    ordering = ["-created_at"]
    fieldsets = (
        ("Basic Information", {
            "fields": ("name", "address", "phone")
        }),
        ("Photos", {
            "fields": ("owner_photo", "site_photo"),
        }),
        ("Metadata", {
            "fields": ("created_at",),
            "classes": ("collapse",),
        }),
    )
