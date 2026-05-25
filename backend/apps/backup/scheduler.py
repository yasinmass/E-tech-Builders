import io
from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
from .views import generate_builders_csv, generate_etech_csv, save_backup_to_disk

def weekly_backup_task():
    """
    Automated task to generate and save backups locally every week.
    """
    today_str = date.today().strftime("%d-%m-%Y")
    
    # 1. Builders Backup
    builder_buf = io.StringIO()
    generate_builders_csv(builder_buf)
    save_backup_to_disk(builder_buf.getvalue(), "builders", f"weekly-builders-{today_str}.csv")
    
    # 2. E Tech Backup
    etech_buf = io.StringIO()
    generate_etech_csv(etech_buf)
    save_backup_to_disk(etech_buf.getvalue(), "etech", f"weekly-etech-{today_str}.csv")
    
    print(f"[{today_str}] Weekly automatic backup completed.")

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Schedule to run every 7 days
    scheduler.add_job(weekly_backup_task, 'interval', days=7, id='weekly_backup_001', replace_existing=True)
    scheduler.start()
    print("APScheduler started: Weekly backup task registered.")
