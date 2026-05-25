@echo off
start cmd /k "cd /d %~dp0backend && python manage.py runserver"
start cmd /k "npm run dev"
echo BuildOps is starting... Please wait a few seconds then open http://localhost:5173
