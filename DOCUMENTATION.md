# Project Documentation

## Overview

This is a complete full-stack authentication application built with:
- **Frontend**: Angular 16
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Architecture

### Frontend (Angular)
- **Components**: Login, Signup, Dashboard, Seller Dashboard
- **Services**: Authentication Service, User Service
- **Routing**: Protected routes with navigation
- **Styling**: CSS with responsive design

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MySQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **Middleware**: CORS, Body Parser, Authentication

### Database (MySQL)
- **Single Users Table**: Stores both users and sellers
- **Differentiation**: `user_type` column (user/seller)
- **Security**: Indexed email and user_type for performance

## Key Features

### 1. User Authentication
- Secure signup with email validation
- Login with email and password
- JWT token generation and verification
- Token stored in localStorage

### 2. Dual Account Types
- **User Account**: Regular user with access to user dashboard
- **Seller Account**: Seller with access to seller dashboard
- Single database table with type differentiation

### 3. Dashboards
- **User Dashboard**: View all users and sellers, profile information
- **Seller Dashboard**: View all users, seller profile information
- Statistics and overview cards
- Tabbed interface for different views

### 4. Security
- Password hashing with bcrypt
- JWT token-based authentication
- CORS protection
- Input validation
- Environment variables for sensitive data

## File Structure

```
project/
├── backend/
│   ├── config/
│   │   └── database.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (signup, login, profile)
│   │   └── userController.js        # User management logic
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── userRoutes.js            # User endpoints
│   ├── utils/
│   │   ├── tokenUtils.js            # JWT token generation/verification
│   │   └── passwordUtils.js         # Password hashing/comparison
│   ├── database/
│   │   └── schema.sql               # Database schema
│   ├── server.js                    # Main server file
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env file
│   └── package.json                 # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.css
│   │   │   │   ├── signup/
│   │   │   │   │   ├── signup.component.ts
│   │   │   │   │   ├── signup.component.html
│   │   │   │   │   └── signup.component.css
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   ├── dashboard.component.html
│   │   │   │   │   └── dashboard.component.css
│   │   │   │   └── seller-dashboard/
│   │   │   │       ├── seller-dashboard.component.ts
│   │   │   │       ��── seller-dashboard.component.html
│   │   │   │       └── seller-dashboard.component.css
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts  # Authentication service
│   │   │   │   └── user.service.ts  # User management service
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.html
│   │   │   ├── app.component.css
│   │   │   ├── app.module.ts        # Main module
│   │   │   └── app-routing.module.ts # Routing configuration
│   │   ├── index.html               # Main HTML file
│   │   ├── main.ts                  # Bootstrap file
│   │   └── styles.css               # Global styles
│   ├── angular.json                 # Angular configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tsconfig.app.json            # App TypeScript configuration
│   └── package.json                 # Dependencies
│
├── .gitignore                       # Git ignore rules
├── README.md                        # Main documentation
├── SETUP.md                         # Quick start guide
├── install.bat                      # Windows installation script
├── install.sh                       # Linux/Mac installation script
└── DOCUMENTATION.md                 # This file
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user or seller account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "userType": "user"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "userType": "user"
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "userType": "user"
  }
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "user_type": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### User Endpoints

#### GET /api/users/all
Get all users and sellers (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "user_type": "user",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "email": "seller@example.com",
      "full_name": "Jane Seller",
      "user_type": "seller",
      "created_at": "2024-01-15T11:00:00Z"
    }
  ],
  "total": 2
}
```

#### GET /api/users/type/:userType
Get users by type (requires authentication).

**Parameters:**
- `userType`: "user" or "seller"

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 2,
      "email": "seller@example.com",
      "full_name": "Jane Seller",
      "user_type": "seller",
      "created_at": "2024-01-15T11:00:00Z"
    }
  ],
  "total": 1
}
```

## Database Schema

### Users Table

```sql
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

**Columns:**
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `full_name`: User's full name
- `user_type`: Account type (user or seller)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

## Authentication Flow

### Signup Flow
1. User fills signup form
2. Frontend validates input
3. Frontend sends POST request to `/api/auth/signup`
4. Backend validates input
5. Backend checks if email exists
6. Backend hashes password with bcrypt
7. Backend inserts user into database
8. Backend generates JWT token
9. Backend returns token and user data
10. Frontend stores token in localStorage
11. Frontend redirects to dashboard

### Login Flow
1. User fills login form
2. Frontend validates input
3. Frontend sends POST request to `/api/auth/login`
4. Backend validates input
5. Backend finds user by email
6. Backend compares password with hash
7. Backend generates JWT token
8. Backend returns token and user data
9. Frontend stores token in localStorage
10. Frontend redirects to appropriate dashboard

### Protected Route Flow
1. User accesses protected route
2. Frontend checks if token exists
3. If no token, redirect to login
4. If token exists, include in Authorization header
5. Backend middleware verifies token
6. If invalid, return 401 error
7. If valid, allow access to resource

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Never store plain text passwords
- Passwords are never returned in API responses

### Token Security
- JWT tokens are signed with a secret key
- Tokens expire after 7 days (configurable)
- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- Always use HTTPS in production

### Input Validation
- Email format validation
- Password length validation (minimum 6 characters)
- Required field validation
- SQL injection prevention through parameterized queries

### CORS Protection
- CORS is configured to allow requests from frontend
- In production, specify exact origin instead of "*"

## Environment Variables

### Backend (.env)
```
PORT=5000                                    # Server port
DB_HOST=127.0.0.1                           # Database host
DB_USER=root                                # Database user
DB_PASSWORD=                                # Database password
DB_NAME=digvijay                            # Database name
DB_PORT=3306                                # Database port
JWT_SECRET=your_jwt_secret_key              # JWT signing key
JWT_EXPIRE=7d                               # Token expiration
NODE_ENV=development                        # Environment
```

## Development Guidelines

### Adding New Features

1. **Backend**:
   - Create controller in `controllers/`
   - Create routes in `routes/`
   - Add middleware if needed in `middleware/`
   - Update `server.js` to register routes

2. **Frontend**:
   - Create component in `src/app/components/`
   - Create service in `src/app/services/` if needed
   - Add route in `app-routing.module.ts`
   - Import component in `app.module.ts`

### Code Style

- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Use UPPER_SNAKE_CASE for constants
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Test signup with valid and invalid data
- Test login with correct and incorrect credentials
- Test token expiration
- Test protected routes without token
- Test CORS with different origins

## Deployment

### Backend Deployment
1. Update `.env` with production values
2. Change `JWT_SECRET` to a strong random string
3. Set `NODE_ENV=production`
4. Use a process manager like PM2
5. Set up reverse proxy (nginx/Apache)
6. Enable HTTPS

### Frontend Deployment
1. Build: `ng build --prod`
2. Deploy `dist/` folder to web server
3. Configure server to serve `index.html` for all routes
4. Update API URL to production backend

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env`
   - Check database exists

2. **CORS Error**
   - Ensure backend is running
   - Check CORS configuration
   - Verify frontend URL in CORS settings

3. **Token Expired**
   - Logout and login again
   - Check JWT_EXPIRE in `.env`

4. **Port Already in Use**
   - Change PORT in `.env`
   - Or kill process using the port

5. **Module Not Found**
   - Delete `node_modules`
   - Run `npm install` again

## Support and Contribution

For issues or questions:
1. Check README.md and SETUP.md
2. Review error messages in console
3. Check backend logs
4. Create an issue with detailed description

## License

This project is open source and available under the MIT License.
