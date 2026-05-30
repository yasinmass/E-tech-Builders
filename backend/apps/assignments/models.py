from django.db import models
from apps.buildings.models import Building


CATEGORY_CHOICES = [
    ("Electrician", "Electrician"),
    ("Plumber", "Plumber"),
    ("Painter", "Painter"),
    ("Centering", "Centering"),
    ("Carpenter", "Carpenter"),
    ("Mason", "Mason"),
    ("Men Worker", "Men Worker"),
    ("Women Worker", "Women Worker"),
]


class WorkSession(models.Model):
    """
    A single day's work session for a building.
    One building can have multiple sessions on different dates.
    """

    building = models.ForeignKey(
        Building,
        on_delete=models.CASCADE,
        related_name="sessions",
    )
    work_date = models.DateField()
    work_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-work_date", "-created_at"]
        verbose_name = "Work Session"
        verbose_name_plural = "Work Sessions"

    def __str__(self):
        return f"{self.building.name} — {self.work_date}"


class WorkDetail(models.Model):
    """
    A single worker category entry within a WorkSession.
    e.g., 6 Masons, 2 Electricians on a given day.
    """

    work_session = models.ForeignKey(
        WorkSession,
        on_delete=models.CASCADE,
        related_name="details",
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    count = models.DecimalField(max_digits=6, decimal_places=1, default=0)

    class Meta:
        verbose_name = "Work Detail"
        verbose_name_plural = "Work Details"

    def __str__(self):
        return f"{self.category}: {self.count} @ {self.work_session}"
