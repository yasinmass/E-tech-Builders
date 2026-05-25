from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model. Extends Django's AbstractUser so we can add
    role-based fields in the future. The admin is the only user for
    this local supervisor system.
    """

    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("supervisor", "Supervisor"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="admin")

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.username} ({self.role})"
