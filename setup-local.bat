@echo off
echo ==========================================================
echo   Sable Circle — Windows Local Machine Setup
echo   Where vision meets precision
echo ==========================================================
echo.

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18 or newer: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js is installed.

if not exist .env (
    copy .env.example .env
    echo [OK] Created .env file from .env.example
) else (
    echo [OK] .env file already exists.
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Initializing Drizzle SQLite migrations...
call npm run db:generate

echo.
echo Starting Sable Circle development server on http://localhost:3000...
call npm run dev
