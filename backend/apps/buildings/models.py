from django.db import models


class Building(models.Model):
    """Represents a registered construction site / building."""

    name = models.CharField(max_length=255)
    address = models.TextField(blank=True, default="")
    phone = models.CharField(max_length=50, blank=True, default="")
    owner_photo = models.ImageField(
        upload_to="owners/", blank=True, null=True,
        help_text="Photo of the building owner"
    )
    site_photo = models.ImageField(
        upload_to="sites/", blank=True, null=True,
        help_text="Photo of the construction site"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Building"
        verbose_name_plural = "Buildings"

    def __str__(self):
        return self.name
