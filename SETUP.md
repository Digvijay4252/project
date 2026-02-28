# Quick Start Guide

## Step 1: Database Setup

1. Open MySQL Command Line or MySQL Workbench
2. Run these commands:

```sql
CREATE DATABASE IF NOT EXISTS digvijay;
USE digvijay;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  user_type ENUM('user', 'seller') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_user_type (user_type)
);
```

## Step 2: Backend Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

Backend will run on: `http://localhost:5000`

## Step 3: Frontend Installation

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will run on: `http://localhost:4200`

## Step 4: Test the Application

1. Open browser and go to `http://localhost:4200`
2. Click "Sign up here"
3. Create an account:
   - Full Name: John User
   - Email: user@example.com
   - Account Type: User
   - Password: password123
   - Confirm Password: password123
4. Click "Sign Up"
5. You'll be redirected to the User Dashboard

## Test Seller Account

1. Click "Logout"
2. Click "Sign up here"
3. Create a seller account:
   - Full Name: Jane Seller
   - Email: seller@example.com
   - Account Type: Seller
   - Password: password123
   - Confirm Password: password123
4. Click "Sign Up"
5. You'll be redirected to the Seller Dashboard

## Environment Configuration

Backend `.env` file is already configured with:
- Database: digvijay
- Host: 127.0.0.1
- Port: 5000
- JWT Secret: your_jwt_secret_key_change_this_in_production

For production, update the JWT_SECRET to a strong random string.

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running
- Check if database name is "digvijay"
- Verify username is "root" and password is correct

### Port 5000 Already in Use
- Edit `backend/.env` and change PORT to 5001 or another available port
- Update frontend API URL accordingly

### Port 4200 Already in Use
- Run: `ng serve --port 4300`

### Module Not Found Errors
- Delete `node_modules` folder
- Run `npm install` again

## File Structure

```
backend/
├── config/database.js          # Database connection
├── controllers/authController.js # Auth logic
├── middleware/authMiddleware.js # JWT verification
├── routes/authRoutes.js        # Auth endpoints
├── utils/                      # Helper functions
├── database/schema.sql         # Database schema
├── .env                        # Environment variables
└── server.js                   # Main server

frontend/
├── src/app/
│   ├── components/
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── dashboard/         # User dashboard
│   │   └── seller-dashboard/  # Seller dashboard
│   ├── services/
│   │   ├── auth.service.ts    # Auth service
│   │   └── user.service.ts    # User service
│   └── app-routing.module.ts  # Routes
└── src/index.html             # Main HTML
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new account
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get profile (requires token)

### Users
- GET `/api/users/all` - Get all users (requires token)
- GET `/api/users/type/:userType` - Get users by type (requires token)

## Next Steps

1. Customize the UI in component CSS files
2. Add more features like product management for sellers
3. Implement email verification
4. Add password reset functionality
5. Deploy to production

## Support

For issues, check:
1. MySQL is running
2. Backend is running on port 5000
3. Frontend is running on port 4200
4. Check browser console for errors
5. Check backend terminal for error messages
