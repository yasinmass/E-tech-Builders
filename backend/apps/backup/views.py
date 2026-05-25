import csv
import io
import os
import zipfile
from datetime import date, datetime

from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.assignments.models import WorkSession, WorkDetail
from apps.etech.models import ETechAssignment, ETechAssignmentDetail


BASE_BACKUP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "backups")


def _fmt_date(d):
    """Format date as d/m/y."""
    if d is None:
        return ""
    return d.strftime("%d/%m/%Y")


def _fmt_time(t):
    """Format time as HH:MM AM/PM."""
    if t is None:
        return "--:--"
    return datetime.strptime(str(t)[:5], "%H:%M").strftime("%I:%M %p")


def generate_builders_csv(output):
    """Write all builder assignment records to a CSV writer/file-like object."""
    writer = csv.writer(output)
    writer.writerow(["Date", "Time", "Building Name", "Category", "Count"])

    details = (
        WorkDetail.objects.select_related("work_session", "work_session__building")
        .order_by("work_session__work_date", "work_session__building__name")
    )

    for detail in details:
        session = detail.work_session
        writer.writerow([
            _fmt_date(session.work_date),
            _fmt_time(session.work_time),
            session.building.name,
            detail.category,
            detail.count,
        ])

    return output


def generate_etech_csv(output):
    """Write all E Tech assignment records to a CSV writer/file-like object."""
    writer = csv.writer(output)
    writer.writerow(["Date", "Time", "Project Name", "Member / Category", "Count"])

    details = (
        ETechAssignmentDetail.objects.select_related(
            "assignment", "assignment__project", "category"
        ).order_by("assignment__work_date", "assignment__project__name")
    )

    for detail in details:
        assignment = detail.assignment
        writer.writerow([
            _fmt_date(assignment.work_date),
            _fmt_time(assignment.work_time),
            assignment.project.name,
            detail.category.name,
            detail.count,
        ])

    return output


def save_backup_to_disk(csv_content: str, folder: str, filename: str):
    """Persist backup CSV file to local backups directory."""
    folder_path = os.path.join(BASE_BACKUP_DIR, folder)
    os.makedirs(folder_path, exist_ok=True)
    filepath = os.path.join(folder_path, filename)
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        f.write(csv_content)
    return filepath


class CSVBackupView(APIView):
    """
    GET /api/backup/csv/?type=all|builders|etech

    Returns a ZIP file containing CSV backups for the requested data type.
    Also saves copies to the local backups/ directory.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        backup_type = request.query_params.get("type", "all").lower()
        today_str = date.today().strftime("%d-%m-%Y")

        zip_buffer = io.BytesIO()

        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            if backup_type in ("all", "builders"):
                buf = io.StringIO()
                generate_builders_csv(buf)
                content = buf.getvalue()
                filename = f"builders-backup-{today_str}.csv"
                zf.writestr(filename, content)
                save_backup_to_disk(content, "builders", filename)

            if backup_type in ("all", "etech"):
                buf = io.StringIO()
                generate_etech_csv(buf)
                content = buf.getvalue()
                filename = f"etech-backup-{today_str}.csv"
                zf.writestr(filename, content)
                save_backup_to_disk(content, "etech", filename)

        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer.read(), content_type="application/zip")
        response["Content-Disposition"] = f'attachment; filename="backup-{today_str}.zip"'
        return response


class BackupHistoryView(APIView):
    """
    GET /api/backup/history/
    Returns list of saved backup files grouped by type.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = {"builders": [], "etech": []}

        for folder in ("builders", "etech"):
            folder_path = os.path.join(BASE_BACKUP_DIR, folder)
            if os.path.isdir(folder_path):
                files = sorted(os.listdir(folder_path), reverse=True)
                for filename in files:
                    if filename.endswith(".csv"):
                        filepath = os.path.join(folder_path, filename)
                        stat = os.stat(filepath)
                        history[folder].append({
                            "filename": filename,
                            "size_kb": round(stat.st_size / 1024, 1),
                            "created_at": datetime.fromtimestamp(stat.st_mtime).strftime("%d/%m/%Y %H:%M"),
                        })

        return Response(history)
