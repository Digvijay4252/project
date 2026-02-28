# Testing Guide

## Manual Testing Checklist

### 1. Signup Functionality

#### Test Case 1.1: Valid User Signup
- [ ] Navigate to http://localhost:4200/signup
- [ ] Fill form:
  - Full Name: John User
  - Email: john@example.com
  - Account Type: User
  - Password: password123
  - Confirm Password: password123
- [ ] Click "Sign Up"
- [ ] Expected: Redirected to User Dashboard
- [ ] Verify: User name displayed in navbar

#### Test Case 1.2: Valid Seller Signup
- [ ] Navigate to http://localhost:4200/signup
- [ ] Fill form:
  - Full Name: Jane Seller
  - Email: jane@example.com
  - Account Type: Seller
  - Password: password123
  - Confirm Password: password123
- [ ] Click "Sign Up"
- [ ] Expected: Redirected to Seller Dashboard
- [ ] Verify: "Seller Dashboard" title displayed

#### Test Case 1.3: Duplicate Email
- [ ] Try to signup with existing email
- [ ] Expected: Error message "Email already registered"

#### Test Case 1.4: Password Mismatch
- [ ] Fill form with mismatched passwords
- [ ] Click "Sign Up"
- [ ] Expected: Error message "Passwords do not match"

#### Test Case 1.5: Short Password
- [ ] Fill form with password less than 6 characters
- [ ] Click "Sign Up"
- [ ] Expected: Error message "Password must be at least 6 characters"

#### Test Case 1.6: Missing Fields
- [ ] Leave any field empty
- [ ] Click "Sign Up"
- [ ] Expected: Error message "Please fill in all fields"

### 2. Login Functionality

#### Test Case 2.1: Valid Login
- [ ] Navigate to http://localhost:4200/login
- [ ] Enter email: john@example.com
- [ ] Enter password: password123
- [ ] Click "Login"
- [ ] Expected: Redirected to User Dashboard
- [ ] Verify: User name displayed

#### Test Case 2.2: Invalid Email
- [ ] Enter email: nonexistent@example.com
- [ ] Enter password: password123
- [ ] Click "Login"
- [ ] Expected: Error message "Invalid email or password"

#### Test Case 2.3: Invalid Password
- [ ] Enter email: john@example.com
- [ ] Enter password: wrongpassword
- [ ] Click "Login"
- [ ] Expected: Error message "Invalid email or password"

#### Test Case 2.4: Missing Fields
- [ ] Leave email or password empty
- [ ] Click "Login"
- [ ] Expected: Error message "Email and password are required"

#### Test Case 2.5: Seller Login
- [ ] Login with seller account
- [ ] Expected: Redirected to Seller Dashboard

### 3. Dashboard Functionality

#### Test Case 3.1: User Dashboard Overview
- [ ] Login as user
- [ ] Verify Overview tab shows:
  - [ ] Total Users count
  - [ ] Total Sellers count
  - [ ] Account Type: USER
  - [ ] Member Since date
  - [ ] Profile information section

#### Test Case 3.2: User Dashboard - All Users Tab
- [ ] Click "All Users" tab
- [ ] Verify table displays:
  - [ ] ID column
  - [ ] Name column
  - [ ] Email column
  - [ ] Type column (with badges)
  - [ ] Joined date column
- [ ] Verify all users are listed

#### Test Case 3.3: User Dashboard - Sellers Tab
- [ ] Click "Sellers" tab
- [ ] Verify table displays only sellers
- [ ] Verify seller badges are correct

#### Test Case 3.4: Seller Dashboard Overview
- [ ] Login as seller
- [ ] Verify Overview tab shows:
  - [ ] Total Users count
  - [ ] Account Type: SELLER
  - [ ] Member Since date
  - [ ] Seller profile section

#### Test Case 3.5: Seller Dashboard - All Users Tab
- [ ] Click "All Users" tab
- [ ] Verify all users are displayed
- [ ] Verify user types are correct

### 4. Navigation and Routing

#### Test Case 4.1: Login to Signup Navigation
- [ ] On login page, click "Sign up here"
- [ ] Expected: Redirected to signup page

#### Test Case 4.2: Signup to Login Navigation
- [ ] On signup page, click "Login here"
- [ ] Expected: Redirected to login page

#### Test Case 4.3: Protected Routes
- [ ] Try to access /dashboard without login
- [ ] Expected: Redirected to login page
- [ ] Try to access /seller-dashboard without login
- [ ] Expected: Redirected to login page

#### Test Case 4.4: Logout
- [ ] Login to dashboard
- [ ] Click "Logout" button
- [ ] Expected: Redirected to login page
- [ ] Try to access dashboard
- [ ] Expected: Redirected to login page

### 5. Token Management

#### Test Case 5.1: Token Storage
- [ ] Login successfully
- [ ] Open browser DevTools (F12)
- [ ] Go to Application > Local Storage
- [ ] Verify "token" is stored
- [ ] Verify "user" is stored

#### Test Case 5.2: Token Persistence
- [ ] Login and refresh page
- [ ] Expected: Still logged in
- [ ] Verify dashboard still displays

#### Test Case 5.3: Token Removal on Logout
- [ ] Login and logout
- [ ] Open DevTools > Local Storage
- [ ] Verify "token" is removed
- [ ] Verify "user" is removed

### 6. API Testing

#### Test Case 6.1: Health Check
```bash
curl http://localhost:5000/api/health
```
- [ ] Expected: `{"message":"Server is running"}`

#### Test Case 6.2: Signup API
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "fullName":"Test User",
    "userType":"user"
  }'
```
- [ ] Expected: 201 status with token and user data

#### Test Case 6.3: Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```
- [ ] Expected: 200 status with token and user data

#### Test Case 6.4: Get Profile API
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>"
```
- [ ] Expected: 200 status with user profile

#### Test Case 6.5: Get All Users API
```bash
curl -X GET http://localhost:5000/api/users/all \
  -H "Authorization: Bearer <token>"
```
- [ ] Expected: 200 status with users array

#### Test Case 6.6: Get Users by Type API
```bash
curl -X GET http://localhost:5000/api/users/type/seller \
  -H "Authorization: Bearer <token>"
```
- [ ] Expected: 200 status with sellers array

### 7. Error Handling

#### Test Case 7.1: Invalid Token
- [ ] Modify token in Local Storage
- [ ] Refresh page
- [ ] Expected: Redirected to login

#### Test Case 7.2: Expired Token
- [ ] Wait for token to expire (7 days)
- [ ] Try to access protected route
- [ ] Expected: Redirected to login

#### Test Case 7.3: Missing Authorization Header
```bash
curl -X GET http://localhost:5000/api/users/all
```
- [ ] Expected: 401 status with "No token provided"

#### Test Case 7.4: Database Connection Error
- [ ] Stop MySQL server
- [ ] Try to login
- [ ] Expected: Error message displayed

### 8. UI/UX Testing

#### Test Case 8.1: Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify layout adjusts properly

#### Test Case 8.2: Form Validation
- [ ] Test email format validation
- [ ] Test password length validation
- [ ] Test required field validation
- [ ] Verify error messages display

#### Test Case 8.3: Loading States
- [ ] Verify loading spinner shows during API calls
- [ ] Verify buttons are disabled during loading
- [ ] Verify loading text updates

#### Test Case 8.4: Success/Error Messages
- [ ] Verify success messages display on signup
- [ ] Verify error messages display on failed login
- [ ] Verify messages auto-dismiss or have close button

### 9. Data Validation

#### Test Case 9.1: Email Validation
- [ ] Try invalid email formats
- [ ] Expected: Error message or validation failure

#### Test Case 9.2: Password Requirements
- [ ] Try password with less than 6 characters
- [ ] Expected: Error message

#### Test Case 9.3: Name Validation
- [ ] Try empty name
- [ ] Expected: Error message

### 10. Performance Testing

#### Test Case 10.1: Page Load Time
- [ ] Measure login page load time
- [ ] Measure dashboard load time
- [ ] Expected: < 2 seconds

#### Test Case 10.2: API Response Time
- [ ] Measure signup API response time
- [ ] Measure login API response time
- [ ] Expected: < 500ms

#### Test Case 10.3: Large Data Set
- [ ] Create 100+ users
- [ ] Load dashboard
- [ ] Verify table displays correctly
- [ ] Verify no performance issues

## Automated Testing (Optional)

### Unit Tests
```bash
cd frontend
ng test
```

### E2E Tests
```bash
cd frontend
ng e2e
```

## Test Data

### Sample User Accounts
```
User 1:
- Email: user1@example.com
- Password: password123
- Type: User

User 2:
- Email: user2@example.com
- Password: password123
- Type: User

Seller 1:
- Email: seller1@example.com
- Password: password123
- Type: Seller

Seller 2:
- Email: seller2@example.com
- Password: password123
- Type: Seller
```

## Browser DevTools Debugging

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform login
4. Verify requests:
   - POST /api/auth/login (200)
   - GET /api/users/all (200)

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Perform actions
4. Verify no errors displayed

### Check Local Storage
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Verify token and user data stored
4. Verify data cleared on logout

## Regression Testing

After making changes, verify:
- [ ] Signup still works
- [ ] Login still works
- [ ] Dashboards display correctly
- [ ] Logout works
- [ ] Protected routes are protected
- [ ] API endpoints respond correctly
- [ ] No console errors
- [ ] No network errors

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Page Load | < 2s | |
| API Response | < 500ms | |
| Dashboard Load | < 1s | |
| Table Render | < 500ms | |

## Known Issues

(Document any known issues found during testing)

## Test Results Summary

| Test Category | Status | Notes |
|---------------|--------|-------|
| Signup | ✅ | |
| Login | ✅ | |
| Dashboard | ✅ | |
| Navigation | ✅ | |
| Token Management | ✅ | |
| API | ✅ | |
| Error Handling | ✅ | |
| UI/UX | ✅ | |
| Data Validation | ✅ | |
| Performance | ✅ | |

---

**Last Updated**: 2024
**Tester**: [Your Name]
**Date**: [Date]
