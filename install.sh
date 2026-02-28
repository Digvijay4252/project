#!/bin/bash

# Installation script for Full Stack Authentication Application

echo ""
echo "========================================"
echo "Full Stack Authentication App Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "Node.js is installed:"
node --version

echo ""
echo "========================================"
echo "Installing Backend Dependencies"
echo "========================================"
echo ""

cd backend

if [ -d "node_modules" ]; then
    echo "Backend dependencies already installed."
else
    echo "Installing backend packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
fi

echo "Backend dependencies installed successfully!"

cd ..

echo ""
echo "========================================"
echo "Installing Frontend Dependencies"
echo "========================================"
echo ""

cd frontend

if [ -d "node_modules" ]; then
    echo "Frontend dependencies already installed."
else
    echo "Installing frontend packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies"
        exit 1
    fi
fi

echo "Frontend dependencies installed successfully!"

cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Create the database in MySQL:"
echo "   - Open MySQL and run: CREATE DATABASE digvijay;"
echo "   - Import the schema from backend/database/schema.sql"
echo ""
echo "2. Start the backend:"
echo "   - Open terminal and run: cd backend && npm start"
echo ""
echo "3. Start the frontend (in another terminal):"
echo "   - Open terminal and run: cd frontend && npm start"
echo ""
echo "4. Open browser and go to: http://localhost:4200"
echo ""
echo "For more information, see README.md and SETUP.md"
echo ""
