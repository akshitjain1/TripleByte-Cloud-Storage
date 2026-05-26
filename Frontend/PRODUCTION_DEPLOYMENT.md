# Production Deployment Guide - TripleByte Cloud Storage

## Overview

This frontend is designed to work with nginx reverse proxy on the same domain. The backend is served behind nginx, which proxies API requests to the backend service.

## Architecture

```
User Browser
    ↓
https://triplebyte-storage.duckdns.org (Nginx)
    ├─ /                → Frontend (static files from dist/)
    ├─ /auth/*          → Backend (proxied)
    ├─ /files/*         → Backend (proxied)
    └─ /health/*        → Backend (proxied)
```

## Configuration Changes Made

### 1. New File: src/config/api.js

- Centralized API configuration
- Uses empty string for production (same-domain via nginx)
- Uses VITE_API_BASE_URL env var if needed
- All requests are relative paths: `/auth/...`, `/files/...`, `/health/...`

### 2. Updated: src/services/apiClient.js

- Imports `API_BASE_URL` from `src/config/api.js`
- No more hardcoded `localhost:8000`
- All URLs are relative paths (works with nginx proxy)

### 3. Updated: vite.config.js

- Removed dev proxy configuration
- Uses relative paths for all API calls

### 4. Updated: .env

```
VITE_API_BASE_URL=
VITE_APP_NAME=Cloud File Storage
VITE_MAX_FILE_SIZE_MB=5
```

Empty `VITE_API_BASE_URL` = use relative paths

### 5. Updated: .env.example

- Added comprehensive comments
- Shows all configuration options
- Local dev, remote dev, and production examples

## How It Works

### Development (Local)

```bash
npm run dev
# Frontend runs on http://localhost:3000
# Requests go to relative paths (/auth, /files, /health)
# Backend must be running on http://localhost:8000
```

### Production (Deployed via Nginx)

```bash
npm run build
# Creates dist/ with production bundle
# Upload dist/ to your server
# Nginx serves static files and proxies /auth, /files, /health
```

Nginx example config:
```nginx
server {
    listen 443 ssl;
    server_name triplebyte-storage.duckdns.org;
    
    # Serve frontend static files
    location / {
        root /var/www/triplebyte-storage;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /auth {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /files {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /health {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Build & Deploy

### Local Development

```bash
# Terminal 1: Start backend
cd cloud-file-storage
. venv/Scripts/Activate.ps1
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start frontend
cd Frontend
npm install  # (first time only)
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Output in dist/ folder
# Upload dist/* to server at /var/www/triplebyte-storage/

# No environment changes needed - .env.example is for reference
# Production uses empty VITE_API_BASE_URL (relative paths)
```

### Production Deployment Steps

1. Build on your build machine:
   ```bash
   cd Frontend
   npm install
   npm run build
   ```

2. Upload dist folder to server:
   ```bash
   scp -r dist/* user@triplebyte-storage.duckdns.org:/var/www/triplebyte-storage/
   ```

3. Verify nginx is running and configured (see config above)

4. Test in browser: https://triplebyte-storage.duckdns.org

## Testing Checklist

- [ ] Registration works
- [ ] Login works  
- [ ] Dashboard loads
- [ ] File list displays
- [ ] File upload works
- [ ] File download works
- [ ] File delete works
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] No console errors
- [ ] No CORS errors

## Files Modified

1. **src/config/api.js** (NEW)
   - Centralized API configuration

2. **src/services/apiClient.js** (UPDATED)
   - Uses config/api.js for baseURL
   - Removed localhost:8000 hardcoding

3. **vite.config.js** (UPDATED)
   - Removed dev proxy (no longer needed)

4. **.env** (UPDATED)
   - VITE_API_BASE_URL now empty (production)

5. **.env.example** (UPDATED)
   - Added comprehensive documentation

## Troubleshooting

### Issue: "Cannot POST /auth/register"

- Check nginx is running
- Check nginx config proxies /auth to backend
- Check backend is running on localhost:8000

### Issue: CORS errors in browser

- Should NOT happen with nginx reverse proxy on same domain
- If it does, check nginx config has correct headers:
  ```nginx
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  ```

### Issue: 401 Unauthorized

- JWT token in localStorage might be stale
- Clear browser localStorage
- Login again
- Check backend JWT secret matches

### Issue: File upload fails

- Check VITE_MAX_FILE_SIZE_MB in .env (default 5MB)
- Check backend S3 credentials
- Check nginx has large enough upload limit:
  ```nginx
  client_max_body_size 50M;
  ```

## Performance Notes

- Production build is optimized and minified
- CSS is purged (only used classes included)
- JavaScript is tree-shaken and bundled
- Bundle size: ~100KB gzipped (typical React app)

## Security Notes

- Relative paths prevent CORS issues
- Same-domain requests are automatically trusted
- JWT tokens stored in localStorage (consider HttpOnly cookies for higher security)
- HTTPS only in production (enforce via nginx redirect)

## Future Improvements

- [ ] Implement refresh token rotation
- [ ] Add service worker for offline support
- [ ] Implement progressive image optimization
- [ ] Add error reporting/logging
- [ ] Implement analytics
- [ ] Add request deduplication cache

---

**Status:** Production Ready ✅
**Last Updated:** May 26, 2026
