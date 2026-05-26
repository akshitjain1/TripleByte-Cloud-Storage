# 📋 Deployment Checklist

## Pre-Deployment (Local Testing)

### Code Verification
- [x] No `localhost:8000` hardcoded in source code
- [x] All API calls use relative paths (`/auth`, `/files`, `/health`)
- [x] Configuration centralized in `src/config/api.js`
- [x] Environment variables in `.env` and `.env.example`
- [x] Frontend loads on `http://localhost:3000`
- [x] Backend accessible on `http://localhost:8000`

### Local Testing
- [ ] Test User Registration
- [ ] Test User Login
- [ ] Test Dashboard Access
- [ ] Test File Upload (with progress)
- [ ] Test File List (with search/sort)
- [ ] Test File Download
- [ ] Test File Delete
- [ ] Test Logout
- [ ] Check browser console (no errors)
- [ ] Test on mobile (responsive)

### Environment Setup
- [x] `.env` configured for local dev: `VITE_API_BASE_URL=http://localhost:8000`
- [ ] Verify backend running on `http://localhost:8000`
- [ ] Verify frontend running on `http://localhost:3000`
- [ ] Verify CORS enabled in backend

---

## Build & Prepare

### Production Build
```bash
cd Frontend

# For Production: Update .env
VITE_API_BASE_URL=    # ← Empty for nginx reverse proxy

# Build production bundle
npm run build

# Output: dist/ folder with optimized files
```

### Verify Build Output
- [ ] `dist/` folder created
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` has .js and .css files
- [ ] No errors in build log
- [ ] No warnings about missing files

### Check for Localhost References
```bash
# Verify no localhost in bundle
grep -r "localhost" dist/
# Should return: (empty - no matches)

grep -r "http://" dist/
# Should return: (empty - no http:// URLs)
```

---

## Production Deployment

### Prerequisites
- [ ] Server has nginx installed
- [ ] Domain configured: `https://triplebyte-storage.duckdns.org`
- [ ] SSL certificate configured
- [ ] Backend service configured on same server
- [ ] Backend running on `localhost:8000` (or configured port)

### Server Setup
```bash
# 1. Create web directory
sudo mkdir -p /var/www/triplebyte-storage

# 2. Set permissions
sudo chown -R www-data:www-data /var/www/triplebyte-storage
```

### Deploy Frontend
```bash
# 1. Upload dist folder
scp -r dist/* user@triplebyte-storage.duckdns.org:/var/www/triplebyte-storage/

# 2. Verify files uploaded
ssh user@triplebyte-storage.duckdns.org
ls -la /var/www/triplebyte-storage/
# Should show: index.html, assets/, etc.
```

### Configure Nginx
```bash
# 1. Check nginx config exists
sudo nano /etc/nginx/sites-available/triplebyte-storage

# 2. Should include these blocks:
# - location / { root /var/www/triplebyte-storage; try_files $uri $uri/ /index.html; }
# - location /auth { proxy_pass http://localhost:8000; }
# - location /files { proxy_pass http://localhost:8000; }
# - location /health { proxy_pass http://localhost:8000; }

# 3. Test nginx config
sudo nginx -t
# Output: "nginx: configuration file test is successful"

# 4. Restart nginx
sudo systemctl restart nginx
```

### Verify Deployment
- [ ] Visit `https://triplebyte-storage.duckdns.org`
- [ ] Page loads (not 404 or 503)
- [ ] CSS styles applied (not blank white page)
- [ ] Logo and header visible
- [ ] No console errors (press F12)

---

## Production Testing

### Test All Features (In Order)

**1. Registration**
- [ ] Navigate to Sign Up page
- [ ] Fill in email
- [ ] Fill in password (8+ chars, uppercase, number)
- [ ] Submit form
- [ ] User created successfully
- [ ] Redirected to login

**2. Login**
- [ ] Enter email
- [ ] Enter password
- [ ] Click Sign In
- [ ] Token received (check localStorage in DevTools)
- [ ] Redirected to dashboard

**3. Dashboard**
- [ ] Page loads completely
- [ ] Storage stats display
- [ ] Files list visible (may be empty)
- [ ] Upload zone visible
- [ ] Search bar visible
- [ ] Sort dropdown visible

**4. File Upload**
- [ ] Drag file to dropzone (or click to browse)
- [ ] Progress bar shows
- [ ] Upload completes
- [ ] File appears in list
- [ ] Storage stats updated

**5. File List**
- [ ] All files displayed
- [ ] File names visible
- [ ] File sizes correct (in MB/KB)
- [ ] Upload dates visible
- [ ] Download/delete buttons visible

**6. Search & Sort**
- [ ] Type in search box
- [ ] File list filters in real-time
- [ ] Clear search
- [ ] Sort by name ascending/descending
- [ ] Sort by size ascending/descending
- [ ] Sort by date ascending/descending

**7. File Download**
- [ ] Click download button on file
- [ ] Browser downloads file
- [ ] Downloaded filename matches
- [ ] File content correct

**8. File Delete**
- [ ] Click delete button on file
- [ ] Confirmation dialog shows
- [ ] Click confirm
- [ ] File removed from list
- [ ] Storage stats updated

**9. Logout**
- [ ] Click logout button
- [ ] Redirected to login
- [ ] Token cleared from localStorage
- [ ] Cannot access dashboard without login

**10. Protected Routes**
- [ ] Try visiting `/dashboard` while logged out
- [ ] Redirected to login
- [ ] Try visiting `/login` while logged in
- [ ] Redirected to dashboard

**11. Error Handling**
- [ ] Stop backend
- [ ] Try login
- [ ] Error message displayed
- [ ] Restart backend
- [ ] Login works again

**12. CORS Verification**
- [ ] Open DevTools Network tab
- [ ] Make request (e.g., login)
- [ ] Check request URL: `https://triplebyte-storage.duckdns.org/auth/login`
- [ ] No CORS error in console
- [ ] Response status 200 (success) or 4xx (expected error)

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Frontend loads on `https://triplebyte-storage.duckdns.org`
- [ ] All 6 features work (login, upload, download, delete, search, sort)
- [ ] No errors in browser console
- [ ] No 5xx errors in server logs
- [ ] SSL certificate valid

### Weekly Checks
- [ ] Check disk space
- [ ] Review error logs
- [ ] Verify backups running
- [ ] Check file uploads working
- [ ] Monitor performance

### Monthly Checks
- [ ] SSL certificate renewal (auto via Let's Encrypt)
- [ ] Security updates applied
- [ ] Dependency updates checked
- [ ] Performance metrics reviewed

---

## Rollback Plan (If Issues)

### Issue: Frontend Not Loading (404)
```bash
# Check files exist
ls -la /var/www/triplebyte-storage/index.html

# Check nginx config
sudo nginx -t

# Check nginx logs
sudo tail -f /var/nginx/error.log
```

### Issue: API Calls Failing (CORS)
```bash
# Verify nginx proxy config
cat /etc/nginx/sites-available/triplebyte-storage | grep proxy_pass

# Verify backend running
curl http://localhost:8000/health

# Restart nginx
sudo systemctl restart nginx
```

### Issue: Need to Rollback Build
```bash
# Revert to previous dist/
git checkout dist/

# Rebuild
npm run build

# Redeploy
scp -r dist/* user@server:/var/www/triplebyte-storage/
```

---

## Post-Deployment

### Update DNS (If Needed)
- [ ] Point domain to server IP
- [ ] Verify DNS resolution: `nslookup triplebyte-storage.duckdns.org`
- [ ] SSL certificate updated

### Security Hardening
- [ ] Enable HTTP/2
- [ ] Add security headers in nginx
- [ ] Enable GZIP compression
- [ ] Set cache headers
- [ ] Disable directory listing

Nginx config addition:
```nginx
# Add to server block
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### Monitoring Setup
- [ ] Set up error logging
- [ ] Set up uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure alerting

---

## Troubleshooting Guide

### Problem: "Cannot GET /"
- Check nginx is running: `sudo systemctl status nginx`
- Check files exist: `ls /var/www/triplebyte-storage/index.html`
- Check file permissions: `sudo chown -R www-data:www-data /var/www/triplebyte-storage`
- Check nginx config: `sudo nginx -t`

### Problem: API Returns 404
- Check backend is running: `curl http://localhost:8000/health`
- Check nginx proxy config has correct locations
- Verify backend process: `ps aux | grep uvicorn`
- Check port 8000 is listening: `sudo netstat -tlnp | grep 8000`

### Problem: CORS Errors
- Should NOT happen with reverse proxy on same domain
- If it does, check nginx has these headers:
  - `proxy_set_header Host $host;`
  - `proxy_set_header X-Real-IP $remote_addr;`
  - `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`

### Problem: Login Fails
- Check backend CORS: `POST /auth/login` returns 401 or 200
- Verify credentials in database
- Check JWT secret matches between frontend and backend
- Clear localStorage and try again

### Problem: File Upload Fails
- Check backend has `/files/upload` endpoint
- Verify S3 credentials configured in backend
- Check file size < 5MB (or configured limit)
- Check nginx `client_max_body_size` is large enough (add: `client_max_body_size 50M;`)

---

## Performance Optimization

### Frontend Optimization (Already Done)
- [x] Code splitting enabled
- [x] Minification enabled
- [x] CSS purging enabled
- [x] Image optimization ready
- [x] Lazy loading ready

### Nginx Optimization
```nginx
# Add to nginx config
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Don't cache index.html (so updated code is always served)
location = /index.html {
    add_header Cache-Control "public, max-age=0, must-revalidate";
}
```

---

## Success Criteria

**Deployment is successful when:**
- ✅ Frontend loads at `https://triplebyte-storage.duckdns.org`
- ✅ All 6 features work (login, upload, download, delete, search, sort)
- ✅ No console errors
- ✅ No CORS errors
- ✅ No 5xx server errors
- ✅ API requests go to backend successfully
- ✅ File uploads work with progress tracking
- ✅ File downloads work
- ✅ Search and sort work
- ✅ Authentication persists across page refresh

---

## Next Steps

1. ✅ Build: `npm run build` (in `Frontend/` directory)
2. ✅ Deploy: Upload `dist/` to `/var/www/triplebyte-storage/`
3. ✅ Configure: Verify nginx config has all proxy rules
4. ✅ Test: Run through all 12 test cases above
5. ✅ Monitor: Watch logs and performance metrics
6. ✅ Share: Let users know frontend is ready!

---

**Status:** Ready for Production Deployment ✅
**Last Updated:** May 26, 2026
**Frontend Version:** 1.1.0
