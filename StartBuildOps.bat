@echo off

start "" "%~dp0start_backend.vbs"

timeout /t 5 >nul

start "" "%~dp0start_frontend.vbs"

timeout /t 10 >nul

start http://localhost:8080/dashboard