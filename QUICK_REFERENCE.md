# Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies
```bash
# Windows
install.bat

# Linux/Mac
chmod +x install.sh && ./install.sh
```

### Step 2: Create Database
```sql
CREATE DATABASE digvijay;
USE digvijay;

CREATE TABLE users (
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

### Step 3: Start Backend
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

### Step 4: Start Frontend (New Terminal)
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:4200`

### Step 5: Test Application
1. Open `http://localhost:4200`
2. Click "Sign up here"
3. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Type: User
   - Password: password123
4. Click "Sign Up"
5. You'll see the User Dashboard

## 📋 Test Accounts

### User Account
- Email: user@example.com
- Password: password123
- Type: User

### Seller Account
- Email: seller@example.com
- Password: password123
- Type: Seller

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| http://localhost:4200 | Frontend Application |
| http://localhost:5000/api/health | Backend Health Check |
| http://localhost:4200/login | Login Page |
| http://localhost:4200/signup | Signup Page |
| http://localhost:4200/dashboard | User Dashboard |
| http://localhost:4200/seller-dashboard | Seller Dashboard |

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Create account
POST   /api/auth/login       - Login
GET    /api/auth/profile     - Get profile (requires token)
```

### Users
```
GET    /api/users/all        - Get all users (requires token)
GET    /api/users/type/:type - Get users by type (requires token)
```

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=digvijay
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| backend/server.js | Main backend server |
| backend/config/database.js | Database connection |
| backend/controllers/authController.js | Auth logic |
| frontend/src/app/app.module.ts | Main Angular module |
| frontend/src/app/app-routing.module.ts | Routes |
| frontend/src/app/services/auth.service.ts | Auth service |

## 🛠️ Common Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with nodemon (auto-reload)
```

### Frontend
```bash
cd frontend
npm install         # Install dependencies
npm start          # Start dev server
ng build           # Build for production
ng build --prod    # Production build
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Backend: Change PORT in .env
# Frontend: ng serve --port 4300
```

### Database Connection Error
- Check MySQL is running
- Verify credentials in .env
- Ensure database "digvijay" exists

### Module Not Found
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### CORS Error
- Ensure backend is running on port 5000
- Check CORS configuration in server.js

### Token Expired
- Logout and login again
- Token expires after 7 days

## 📊 Project Structure

```
backend/
├── config/database.js
├── controllers/authController.js
├── middleware/authMiddleware.js
├─��� routes/authRoutes.js
├── utils/tokenUtils.js
├── server.js
└── .env

frontend/
├── src/app/
│   ├── components/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── dashboard/
│   │   └── seller-dashboard/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   └── app-routing.module.ts
└── package.json
```

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens for authentication
- [x] CORS protection enabled
- [x] Input validation implemented
- [x] Environment variables for secrets
- [x] SQL injection prevention
- [x] Protected routes with middleware

## 📚 Documentation Files

1. **README.md** - Full project documentation
2. **SETUP.md** - Detailed setup instructions
3. **DOCUMENTATION.md** - Technical documentation
4. **PROJECT_SUMMARY.md** - Project overview
5. **QUICK_REFERENCE.md** - This file

## 🎯 Features

- ✅ User signup and login
- ✅ JWT authentication
- ✅ User and seller accounts
- ✅ Separate dashboards
- ✅ User management
- ✅ Password hashing
- ✅ Responsive UI
- ✅ Error handling
- ✅ Token management

## 💡 Tips

1. **Development**: Use `npm run dev` in backend for auto-reload
2. **Testing**: Create multiple test accounts
3. **Debugging**: Check browser console and backend terminal
4. **Security**: Change JWT_SECRET before production
5. **Database**: Backup before making schema changes

## 🚀 Deployment

### Before Deploying
1. Change JWT_SECRET to strong random string
2. Update database credentials
3. Set NODE_ENV=production
4. Build frontend: `ng build --prod`
5. Use process manager (PM2) for backend
6. Set up HTTPS/SSL

### Deployment Steps
1. Deploy backend to server
2. Deploy frontend build to web server
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificate
5. Configure environment variables
6. Test all endpoints

## 📞 Support

- Check README.md for detailed documentation
- Check SETUP.md for troubleshooting
- Review DOCUMENTATION.md for technical details
- Check browser console for frontend errors
- Check backend terminal for server errors

## ✅ Verification Checklist

- [ ] Database created and schema imported
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 4200
- [ ] Can access http://localhost:4200
- [ ] Can create new account
- [ ] Can login with account
- [ ] Can see dashboard
- [ ] Can logout

## 🎓 Learning Path

1. Understand the project structure
2. Review authentication flow
3. Explore API endpoints
4. Test signup and login
5. Examine dashboard components
6. Review security implementation
7. Customize UI as needed
8. Add new features

---

**Status**: ✅ Ready to Use
**Last Updated**: 2024
**Version**: 1.0.0
