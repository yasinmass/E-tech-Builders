from django.db import models


class ETechProject(models.Model):
    """Represents an E Tech project."""

    name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255, blank=True, default="")
    location = models.CharField(max_length=255, blank=True, default="")
    contact = models.CharField(max_length=50, blank=True, default="")
    description = models.TextField(blank=True, default="")
    owner_photo = models.ImageField(
        upload_to="etech/owners/", blank=True, null=True,
        help_text="Photo of the E Tech owner"
    )
    site_photo = models.ImageField(
        upload_to="etech/sites/", blank=True, null=True,
        help_text="Photo of the project site"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "E Tech Project"
        verbose_name_plural = "E Tech Projects"

    def __str__(self):
        return self.name


class ETechCategory(models.Model):
    """Dynamic categories for an E Tech project."""

    project = models.ForeignKey(
        ETechProject, on_delete=models.CASCADE, related_name="categories"
    )
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "E Tech Category"
        verbose_name_plural = "E Tech Categories"
        unique_together = ("project", "name")

    def __str__(self):
        return f"{self.name} ({self.project.name})"


class ETechAssignment(models.Model):
    """A day's work session for an E Tech project."""

    project = models.ForeignKey(
        ETechProject, on_delete=models.CASCADE, related_name="assignments"
    )
    work_date = models.DateField()
    work_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-work_date", "-created_at"]
        verbose_name = "E Tech Assignment"
        verbose_name_plural = "E Tech Assignments"

    def __str__(self):
        return f"{self.project.name} — {self.work_date}"


class ETechAssignmentDetail(models.Model):
    """Breakdown of workers by category for an E Tech assignment."""

    assignment = models.ForeignKey(
        ETechAssignment, on_delete=models.CASCADE, related_name="details"
    )
    category = models.ForeignKey(ETechCategory, on_delete=models.CASCADE)
    count = models.DecimalField(max_digits=6, decimal_places=1, default=0)

    class Meta:
        verbose_name = "E Tech Assignment Detail"
        verbose_name_plural = "E Tech Assignment Details"

    def __str__(self):
        return f"{self.category.name}: {self.count} @ {self.assignment}"
