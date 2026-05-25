from django.apps import AppConfig
import os

class BackupConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.backup'

    def ready(self):
        # Prevent multiple scheduler instances during development (runserver starts twice)
        if os.environ.get('RUN_MAIN') == 'true':
            from .scheduler import start_scheduler
            start_scheduler()
