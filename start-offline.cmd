@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Need Node.js 22+ from https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo First run: npm install...
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo Opening http://localhost:8080
start "" http://localhost:8080
call npm run dev
pause
