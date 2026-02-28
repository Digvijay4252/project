# Full Stack Authentication Application

A complete full-stack authentication system with Angular frontend, Node.js backend, and MySQL database. Supports both user and seller accounts with separate dashboards.

## Project Structure

```
project/
├── backend/                 # Node.js Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── database/          # Database schema
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
│
├── frontend/              # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Angular components
│   │   │   ├── services/      # Angular services
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── index.html
│   │   └── main.ts
│   ├── package.json       # Frontend dependencies
│   └── tsconfig.json      # TypeScript configuration
│
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Dual Account Types**: Support for both regular users and sellers
- **Single Database Table**: Users and sellers stored in same table with type differentiation
- **Password Hashing**: Bcrypt for secure password storage
- **JWT Tokens**: Token-based authentication
- **Dashboards**: Separate dashboards for users and sellers
- **User Management**: View all users and sellers
- **Responsive UI**: Mobile-friendly interface

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn
- Angular CLI (for frontend development)

## Installation

### 1. Database Setup

1. Open MySQL and create the database:
```sql
CREATE DATABASE IF NOT EXISTS digvijay;
USE digvijay;
```

2. Run the schema file to create tables:
```sql
-- Execute the contents of backend/database/schema.sql
```

Or manually create the users table:
```sql
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

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
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

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200`

## API Endpoints

### Authentication Routes

- **POST** `/api/auth/signup` - Register new user/seller
  - Body: `{ email, password, fullName, userType }`
  - Returns: `{ token, user }`

- **POST** `/api/auth/login` - Login user/seller
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- **GET** `/api/auth/profile` - Get user profile (requires token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### User Routes

- **GET** `/api/users/all` - Get all users (requires token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ users, total }`

- **GET** `/api/users/type/:userType` - Get users by type (requires token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ users, total }`

## Usage

### Sign Up

1. Navigate to `http://localhost:4200`
2. Click "Sign up here" on the login page
3. Fill in the form:
   - Full Name
   - Email
   - Account Type (User or Seller)
   - Password
   - Confirm Password
4. Click "Sign Up"

### Login

1. Enter your email and password
2. Click "Login"
3. You'll be redirected to your dashboard

### Dashboards

**User Dashboard:**
- Overview with statistics
- View all users and sellers
- See your profile information

**Seller Dashboard:**
- Overview with statistics
- View all users in the system
- See your seller profile information

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | Hashed password |
| full_name | VARCHAR(255) | User's full name |
| user_type | ENUM('user', 'seller') | Account type |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Cross-origin resource sharing configured
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data stored in .env file

## Git Configuration

The `.gitignore` file is configured to exclude:
- `node_modules/`
- `.env` files
- Build outputs
- IDE configurations
- OS-specific files

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database name is correct

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Use `ng serve --port 4300`

### CORS Errors
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in `server.js`

### Token Expired
- Logout and login again
- Token expiration is set to 7 days by default

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start    # Starts dev server with hot reload
```

## Production Deployment

1. Update `.env` with production values
2. Change `JWT_SECRET` to a strong random string
3. Set `NODE_ENV=production`
4. Build frontend: `ng build --prod`
5. Deploy backend and frontend to your hosting

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
