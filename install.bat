@echo off
REM Installation script for Full Stack Authentication Application

echo.
echo ========================================
echo Full Stack Authentication App Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version

echo.
echo ========================================
echo Installing Backend Dependencies
echo ========================================
echo.

cd backend
if exist node_modules (
    echo Backend dependencies already installed.
) else (
    echo Installing backend packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo Backend dependencies installed successfully!

cd ..

echo.
echo ========================================
echo Installing Frontend Dependencies
echo ========================================
echo.

cd frontend
if exist node_modules (
    echo Frontend dependencies already installed.
) else (
    echo Installing frontend packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo Frontend dependencies installed successfully!

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create the database in MySQL:
echo    - Open MySQL and run: CREATE DATABASE digvijay;
echo    - Import the schema from backend/database/schema.sql
echo.
echo 2. Start the backend:
echo    - Open terminal and run: cd backend && npm start
echo.
echo 3. Start the frontend (in another terminal):
echo    - Open terminal and run: cd frontend && npm start
echo.
echo 4. Open browser and go to: http://localhost:4200
echo.
echo For more information, see README.md and SETUP.md
echo.
pause
