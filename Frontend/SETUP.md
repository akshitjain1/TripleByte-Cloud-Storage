# 🚀 Quick Start Guide

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd Frontend
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Make sure your `.env` file has:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Cloud File Storage
VITE_MAX_FILE_SIZE_MB=5
```

### Step 3: Start Development Server

```bash
npm run dev
```

The frontend will run at `http://localhost:3000`

**Note:** Ensure your backend FastAPI server is running at `http://localhost:8000`

### Step 4: Test the Application

1. Go to `http://localhost:3000`
2. Register a new account
3. Login
4. Upload a file by dragging and dropping or clicking
5. List, download, and delete files

---

## Backend Setup (If Not Already Running)

If you haven't set up the backend yet:

```bash
cd ..
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Set up environment variables in .env
uvicorn app.main:app --reload
```

Backend will run at `http://localhost:8000`

---

## API Endpoints Used by Frontend

### Authentication
- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - Login (uses form data, not JSON)
- **GET** `/auth/me` - Get current user

### Files
- **POST** `/files/upload` - Upload file (multipart/form-data)
- **GET** `/files` - List files (requires JWT)
- **GET** `/files/{file_id}/download` - Get download URL
- **DELETE** `/files/{file_id}` - Delete file

### Health Checks
- **GET** `/health` - API health
- **GET** `/health/db` - Database health
- **GET** `/health/s3` - S3 health

---

## Frontend Architecture

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx      # Login form component
│   │   └── RegisterForm.jsx   # Registration form component
│   ├── FileUpload/
│   │   └── FileUploadDropzone.jsx  # Drag-drop upload
│   ├── FileList/
│   │   ├── FileList.jsx       # Main file list container
│   │   ├── FileSearch.jsx     # Search input
│   │   ├── FileListTable.jsx  # Table with sorting
│   │   └── FileRow.jsx        # Individual file row
│   └── Layout/
│       ├── Navbar.jsx         # Top navigation bar
│       └── StorageStats.jsx   # Storage statistics cards
├── pages/
│   ├── LoginPage.jsx          # Login page
│   ├── RegisterPage.jsx       # Registration page
│   ├── Dashboard.jsx          # Main dashboard (protected route)
│   └── DashboardPage.jsx      # Dashboard content
├── services/
│   ├── api.js                 # API service methods
│   ├── apiClient.js           # Axios instance with interceptors
│   └── index.js               # Exports
├── context/
│   ├── AuthContext.js         # Authentication state (Zustand)
│   ├── FileContext.js         # File state (Zustand)
│   └── index.js               # Exports
├── hooks/
│   ├── useAuth.js             # Auth hook
│   ├── useFiles.js            # Files hook
│   ├── useToggle.js           # Toggle hook
│   └── index.js               # Exports
├── utils/
│   ├── helpers.js             # Utility functions
│   ├── icons.js               # Lucide icon mappings
│   └── index.js               # Exports
├── App.jsx                    # Main app component with routing
├── main.jsx                   # React entry point
└── index.css                  # Global styles with Tailwind

public/                        # Static assets

index.html                     # HTML template
vite.config.js                # Vite configuration
tailwind.config.js            # Tailwind configuration
postcss.config.js             # PostCSS configuration
package.json                  # Dependencies and scripts
.env.example                  # Environment template
.gitignore                    # Git ignore patterns
README.md                     # Documentation
```

---

## Key Features Implementation

### 1. JWT Authentication Flow
```
User clicks Login
  ↓
LoginForm sends email + password
  ↓
Backend validates and returns access_token
  ↓
Token stored in localStorage
  ↓
Token automatically added to all requests via axios interceptor
  ↓
401 response triggers logout + redirect to login
```

### 2. File Upload Flow
```
User drags file or clicks to select
  ↓
File validation (type, size)
  ↓
Multipart form-data sent to POST /files/upload
  ↓
Upload progress tracked and displayed
  ↓
File added to list on success
  ↓
Toast notification shown
```

### 3. File Management Flow
```
GET /files → List all files
Sort/Filter in frontend
User clicks Download → GET /files/{id}/download → Open S3 URL
User clicks Delete → DELETE /files/{id} → Remove from list
```

---

## Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Check request headers include `Authorization: Bearer {token}`
4. Verify response status codes

### Check Storage
1. Open DevTools (F12)
2. Go to Application tab
3. Check localStorage for `token` key

### Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. Check for error messages
4. Look for "Login failed" or "Upload failed" messages

### Backend Logs
Check FastAPI terminal for:
- Request logs
- Database queries
- S3 operations
- Validation errors

---

## Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel deploy
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir dist
```

### Deploy to AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Production Checklist

- [ ] Set `VITE_API_BASE_URL` to your production backend URL
- [ ] Update backend CORS settings if using different domain
- [ ] Set up HTTPS for production
- [ ] Enable security headers (CSP, X-Frame-Options, etc.)
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure analytics
- [ ] Test file upload with larger files
- [ ] Test across different browsers
- [ ] Test on mobile devices
- [ ] Set up automated backups
- [ ] Configure CDN for static assets

---

## Troubleshooting

### "Cannot find module"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "CORS error"
- Check backend CORS settings
- Verify `VITE_API_BASE_URL` matches backend URL
- Check vite.config.js proxy settings

### "401 Unauthorized"
- Clear localStorage: `localStorage.clear()`
- Login again
- Check token expiration

### "File upload fails"
- Check file type is allowed
- Check file size is under 5MB
- Check S3 credentials in backend
- Check backend logs for errors

### "Page won't load"
- Check browser console for errors
- Verify backend is running
- Check network tab for failed requests
- Clear browser cache

---

## Performance Tips

- Use production build: `npm run build`
- Enable gzip compression on server
- Use CDN for static assets
- Optimize images
- Enable browser caching
- Monitor bundle size: `npm run build --stats`

---

**You're all set! Happy uploading! 🎉**
