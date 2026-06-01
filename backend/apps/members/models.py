from django.db import models

class Member(models.Model):
    """Represents a persistent staff/labour member."""
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, default="")
    address = models.TextField(blank=True, default="")
    photo = models.ImageField(upload_to="members/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Member"
        verbose_name_plural = "Members"

    def __str__(self):
        return self.name
