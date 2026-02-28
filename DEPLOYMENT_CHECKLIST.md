# Deployment Checklist

## Pre-Deployment Verification

### Backend Verification
- [ ] All dependencies installed: `npm install`
- [ ] Server starts without errors: `npm start`
- [ ] Health check endpoint works: `http://localhost:5000/api/health`
- [ ] Database connection successful
- [ ] All API endpoints tested
- [ ] Error handling working
- [ ] CORS configured correctly
- [ ] Environment variables set

### Frontend Verification
- [ ] All dependencies installed: `npm install`
- [ ] Development server runs: `npm start`
- [ ] No console errors
- [ ] All components render correctly
- [ ] Routing works properly
- [ ] Forms validate correctly
- [ ] API calls successful
- [ ] Responsive design tested

### Database Verification
- [ ] Database created: `digvijay`
- [ ] Users table created
- [ ] Indexes created
- [ ] Schema matches requirements
- [ ] Test data inserted (optional)
- [ ] Backup created

---

## Backend Deployment Checklist

### Environment Configuration
- [ ] Update `.env` with production values:
  ```
  PORT=5000
  DB_HOST=production_host
  DB_USER=production_user
  DB_PASSWORD=strong_password
  DB_NAME=digvijay
  DB_PORT=3306
  JWT_SECRET=generate_strong_random_string
  JWT_EXPIRE=7d
  NODE_ENV=production
  ```
- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Update database credentials
- [ ] Remove .env from git (already in .gitignore)

### Server Setup
- [ ] Install Node.js on server
- [ ] Install npm packages: `npm install --production`
- [ ] Install process manager (PM2):
  ```bash
  npm install -g pm2
  ```
- [ ] Create PM2 ecosystem file:
  ```bash
  pm2 init
  ```
- [ ] Configure PM2 to start on boot:
  ```bash
  pm2 startup
  pm2 save
  ```

### Reverse Proxy Setup (Nginx)
- [ ] Install Nginx
- [ ] Create Nginx config:
  ```nginx
  server {
    listen 80;
    server_name your_domain.com;
    
    location / {
      proxy_pass http://localhost:5000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
  ```
- [ ] Enable Nginx config
- [ ] Test Nginx: `nginx -t`
- [ ] Start Nginx: `systemctl start nginx`

### SSL/HTTPS Setup
- [ ] Install Certbot: `apt-get install certbot python3-certbot-nginx`
- [ ] Generate SSL certificate:
  ```bash
  certbot certonly --nginx -d your_domain.com
  ```
- [ ] Update Nginx config for HTTPS
- [ ] Set up auto-renewal:
  ```bash
  certbot renew --dry-run
  ```

### Database Setup
- [ ] Install MySQL on server
- [ ] Create database: `CREATE DATABASE digvijay;`
- [ ] Import schema: `mysql digvijay < schema.sql`
- [ ] Create database user with limited permissions
- [ ] Test database connection
- [ ] Set up automated backups

### Monitoring & Logging
- [ ] Set up PM2 monitoring
- [ ] Configure log rotation
- [ ] Set up error logging
- [ ] Monitor server resources
- [ ] Set up alerts

### Security Hardening
- [ ] Disable SSH password login
- [ ] Configure firewall rules
- [ ] Set up fail2ban
- [ ] Regular security updates
- [ ] Backup strategy in place

---

## Frontend Deployment Checklist

### Build Configuration
- [ ] Update API URL to production backend
- [ ] Build for production:
  ```bash
  ng build --prod
  ```
- [ ] Verify build output in `dist/` folder
- [ ] Check bundle size
- [ ] Verify no console errors in build

### Web Server Setup
- [ ] Install web server (Nginx/Apache)
- [ ] Configure to serve `dist/` folder
- [ ] Set up routing to serve `index.html` for all routes
- [ ] Enable gzip compression
- [ ] Set cache headers appropriately

### Nginx Configuration
```nginx
server {
  listen 80;
  server_name your_domain.com;
  
  root /var/www/your_app/dist/auth-frontend;
  index index.html;
  
  gzip on;
  gzip_types text/plain text/css text/javascript 
             application/javascript application/json;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### SSL/HTTPS
- [ ] Install SSL certificate
- [ ] Update Nginx config for HTTPS
- [ ] Redirect HTTP to HTTPS
- [ ] Set HSTS header

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Set cache headers
- [ ] Minify assets
- [ ] Optimize images
- [ ] Use CDN if available

---

## Testing in Production

### Functionality Testing
- [ ] Test signup with new account
- [ ] Test login with created account
- [ ] Test user dashboard
- [ ] Test seller dashboard
- [ ] Test logout
- [ ] Test all API endpoints
- [ ] Test error handling
- [ ] Test form validation

### Security Testing
- [ ] Test HTTPS connection
- [ ] Test CORS headers
- [ ] Test token validation
- [ ] Test protected routes
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Test CSRF protection

### Performance Testing
- [ ] Measure page load time
- [ ] Measure API response time
- [ ] Test with multiple concurrent users
- [ ] Monitor server resources
- [ ] Check database performance

### Browser Compatibility
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile browsers

---

## Post-Deployment

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Monitor server resources
- [ ] Monitor database performance
- [ ] Set up alerts for issues

### Maintenance
- [ ] Regular security updates
- [ ] Database backups (daily)
- [ ] Log rotation
- [ ] SSL certificate renewal
- [ ] Performance optimization

### Documentation
- [ ] Document deployment process
- [ ] Document server configuration
- [ ] Document backup procedures
- [ ] Document recovery procedures
- [ ] Create runbook for common issues

### Backup & Recovery
- [ ] Test backup restoration
- [ ] Document recovery procedure
- [ ] Store backups securely
- [ ] Test disaster recovery plan
- [ ] Document RTO/RPO

---

## Rollback Plan

### If Deployment Fails
1. [ ] Stop new deployment
2. [ ] Revert to previous version
3. [ ] Verify previous version works
4. [ ] Investigate issue
5. [ ] Fix and test locally
6. [ ] Redeploy

### Rollback Steps
```bash
# Backend
pm2 stop app
pm2 delete app
git checkout previous_version
npm install
pm2 start app

# Frontend
# Restore previous build from backup
# Restart web server
```

---

## Production Checklist Summary

### Before Going Live
- [ ] All tests passed
- [ ] Security review completed
- [ ] Performance acceptable
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback plan ready
- [ ] Team trained
- [ ] Documentation complete

### Day 1 Monitoring
- [ ] Monitor error logs
- [ ] Monitor performance
- [ ] Monitor user feedback
- [ ] Check database performance
- [ ] Verify backups working

### Week 1 Monitoring
- [ ] Review error logs
- [ ] Analyze performance metrics
- [ ] Check user feedback
- [ ] Verify security
- [ ] Optimize if needed

---

## Environment Variables for Production

### Backend .env (Production)
```
PORT=5000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_strong_password
DB_NAME=digvijay
DB_PORT=3306
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=production
CORS_ORIGIN=https://your_domain.com
```

### Frontend Configuration
Update API URL in `auth.service.ts`:
```typescript
private apiUrl = 'https://your_domain.com/api/auth';
```

---

## Deployment Commands

### Backend Deployment
```bash
# SSH into server
ssh user@your_server

# Navigate to app directory
cd /var/www/your_app/backend

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Update environment variables
nano .env

# Restart with PM2
pm2 restart app
pm2 save
```

### Frontend Deployment
```bash
# Build locally
ng build --prod

# Upload to server
scp -r dist/auth-frontend/* user@your_server:/var/www/your_app/frontend/

# Or deploy via CI/CD pipeline
# (GitHub Actions, GitLab CI, etc.)
```

---

## Monitoring Commands

### PM2 Monitoring
```bash
# View all processes
pm2 list

# View logs
pm2 logs app

# Monitor in real-time
pm2 monit

# View process details
pm2 show app
```

### System Monitoring
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check network
netstat -an
```

### Database Monitoring
```bash
# Connect to MySQL
mysql -u root -p

# Check database size
SELECT table_schema, ROUND(SUM(data_length+index_length)/1024/1024,2) 
FROM information_schema.tables 
GROUP BY table_schema;

# Check user count
SELECT COUNT(*) FROM users;
```

---

## Troubleshooting Production Issues

### Backend Not Starting
1. Check logs: `pm2 logs app`
2. Check environment variables: `cat .env`
3. Check database connection
4. Check port availability: `netstat -an | grep 5000`
5. Restart: `pm2 restart app`

### Frontend Not Loading
1. Check web server logs
2. Check browser console
3. Check API connectivity
4. Check CORS headers
5. Restart web server

### Database Connection Issues
1. Check MySQL is running
2. Check credentials in .env
3. Check network connectivity
4. Check firewall rules
5. Check database permissions

### Performance Issues
1. Check server resources
2. Check database queries
3. Check API response times
4. Check frontend bundle size
5. Optimize as needed

---

## Deployment Success Criteria

- ✅ Application loads without errors
- ✅ Signup works correctly
- ✅ Login works correctly
- ✅ Dashboards display correctly
- ✅ All API endpoints respond
- ✅ HTTPS working
- ✅ No console errors
- ✅ Performance acceptable
- ✅ Monitoring active
- ✅ Backups working

---

## Post-Deployment Verification

- [ ] Application accessible at domain
- [ ] HTTPS working
- [ ] All features functional
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Backups working
- [ ] Team notified
- [ ] Documentation updated

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Status**: _______________
**Notes**: _______________
