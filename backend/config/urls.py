"""
URL configuration for BuildOps backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # JWT token refresh
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # App APIs
    path("api/", include("apps.accounts.urls")),
    path("api/", include("apps.buildings.urls")),
    path("api/", include("apps.assignments.urls")),
    path("api/etech/", include("apps.etech.urls")),
    path("api/", include("apps.backup.urls")),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
