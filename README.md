# ☁️ Cloud File Storage System

A modern, full-stack cloud file storage application with user authentication, file management, and AWS S3 integration. Built with FastAPI backend and React frontend, ready for production deployment.

**🌐 Live Demo:** [https://triplebyte-storage.duckdns.org](https://triplebyte-storage.duckdns.org)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Cloud File Storage is a secure, scalable application for managing files in the cloud. Users can register, authenticate, upload files, manage their files, and download them on demand. All files are stored on AWS S3 with secure presigned URLs for downloads.

**Key Highlights:**
- ✅ User authentication with JWT tokens
- ✅ File upload/download with progress tracking
- ✅ Real-time search and sorting
- ✅ Responsive mobile-friendly UI
- ✅ AWS S3 integration with presigned URLs
- ✅ PostgreSQL database for metadata
- ✅ Production-ready with nginx reverse proxy

---

## ✨ Features

### 🔐 Authentication & Security
- User registration with email validation
- Secure login with JWT tokens (60-minute expiration)
- Password validation (8+ characters, uppercase letter, number)
- Protected routes with automatic redirect
- Secure logout with token cleanup
- Automatic token injection in API requests
- 401 error handling with auto-logout

### 📁 File Management
- **Upload:** Drag-and-drop or click-to-browse
- **Progress Tracking:** Real-time upload percentage
- **Validation:** File type and size checks (max 5MB)
- **Listing:** View all files with metadata
- **Search:** Real-time filtering by filename
- **Sorting:** By name, size, or upload date (ascending/descending)
- **Download:** Presigned URLs from AWS S3
- **Delete:** Remove files with confirmation
- **Storage Stats:** Total files and storage used

### 📊 Dashboard
- Storage statistics cards
- Quick access to all features
- User profile information
- Member since date
- Real-time updates

### 🎨 User Experience
- Professional SaaS UI with Tailwind CSS
- Responsive design (mobile to desktop)
- Dark mode support (infrastructure ready)
- Loading states and spinners
- Toast notifications (success/error)
- Error messages with guidance
- Accessibility features (ARIA labels, keyboard nav)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                            │
│              https://triplebyte-storage.duckdns.org         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (Reverse Proxy)                    │
│  ┌──────────────────┬──────────────────┬──────────────────┐ │
│  │  Static Files    │   /auth/*        │  /files/* &      │ │
│  │  (React SPA)     │   (API Routes)   │  /health/*       │ │
│  └──────────────────┴──────────────────┴──────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (internal)
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
    ┌──────────┐  ┌─────────────┐  ┌────────────┐
    │ Frontend │  │ FastAPI     │  │ PostgreSQL │
    │ (React)  │  │ Backend     │  │ Database   │
    │ Port 3000│  │ Port 8000   │  │ Port 5432  │
    └──────────┘  └─────────────┘  └────────────┘
                         │
                         ↓
                  ┌─────────────────┐
                  │   AWS S3        │
                  │   (File Store)  │
                  └─────────────────┘
```

### Data Flow

1. **User Registration/Login**
   - Browser sends credentials to `/auth/register` or `/auth/login`
   - Backend validates and generates JWT token
   - Token stored in browser localStorage
   - Token sent with all subsequent requests

2. **File Upload**
   - File selected in browser
   - Validation (type, size) on frontend
   - Multipart form data sent to `/files/upload`
   - Backend saves to AWS S3
   - Metadata stored in PostgreSQL
   - Frontend displays progress

3. **File Download**
   - User clicks download button
   - Backend generates presigned S3 URL
   - Browser receives URL and downloads directly from S3

4. **File Management**
   - List: GET `/files` returns all user files
   - Delete: DELETE `/files/{id}` removes from S3 and DB
   - Search/Sort: Done on frontend (real-time)

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.9+)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT (HS256)
- **Storage:** AWS S3
- **Server:** Uvicorn
- **CORS:** Enabled for frontend origins

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5.4.21
- **State Management:** Zustand 4.4
- **HTTP Client:** Axios 1.6
- **Routing:** React Router v6.20
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React 0.294
- **Notifications:** React Hot Toast 2.4

### Infrastructure
- **Reverse Proxy:** Nginx
- **Domain:** duckdns.org
- **SSL/TLS:** HTTPS
- **Port:** 443 (HTTPS)

---

## 📦 Prerequisites

### System Requirements
- Node.js 16+ (for frontend)
- Python 3.9+ (for backend)
- PostgreSQL 12+ (database)
- AWS S3 account (file storage)
- Nginx (reverse proxy)

### Required Accounts
- AWS account with S3 access
- Email (for future notifications)

---

## 📥 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/cloud-file-storage-system.git
cd cloud-file-storage-system
```

### Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration (see Configuration section)

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with backend URL (see Configuration section)

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cloud_storage
SQLALCHEMY_ECHO=False

# JWT
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_REGION=us-east-1

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173", "https://triplebyte-storage.duckdns.org"]

# Logging
LOG_LEVEL=INFO
```

### Frontend Configuration (.env)

```bash
# For Local Development (backend on localhost:8000)
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Cloud File Storage
VITE_MAX_FILE_SIZE_MB=5

# For Production (empty = uses nginx reverse proxy on same domain)
# VITE_API_BASE_URL=
```

### Database Setup

```bash
# Create database
createdb cloud_storage

# Run migrations
cd alembic
alembic upgrade head
```

---

## 🚀 Running Locally

### Development Setup

**Terminal 1: Backend**
```bash
cd cloud-file-storage-system
. venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate     # Linux/Mac
uvicorn app.main:app --reload --port 8000
```

**Terminal 2: Frontend**
```bash
cd Frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Testing Features

1. **Register**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Enter email and password (8+ chars, uppercase, number)
   - Submit

2. **Login**
   - Click "Sign In"
   - Enter credentials
   - Verify redirect to dashboard

3. **Upload File**
   - Drag file to dropzone or click to browse
   - Watch progress bar
   - File appears in list

4. **Download File**
   - Click download icon
   - File downloads from S3

5. **Delete File**
   - Click delete icon
   - Confirm deletion

---

## 📚 API Documentation

### Base URL
- **Development:** `http://localhost:8000`
- **Production:** `https://triplebyte-storage.duckdns.org`

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2026-05-26T10:30:00Z"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=SecurePass123

Response (200):
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {access_token}

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2026-05-26T10:30:00Z"
}
```

### File Endpoints

#### Upload File
```http
POST /files/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

file: <binary>

Response (201):
{
  "id": "uuid",
  "filename": "document.pdf",
  "size": 1024000,
  "content_type": "application/pdf",
  "created_at": "2026-05-26T10:30:00Z"
}
```

#### List Files
```http
GET /files
Authorization: Bearer {access_token}

Response (200):
[
  {
    "id": "uuid",
    "filename": "document.pdf",
    "size": 1024000,
    "content_type": "application/pdf",
    "created_at": "2026-05-26T10:30:00Z"
  }
]
```

#### Download File
```http
GET /files/{file_id}/download
Authorization: Bearer {access_token}

Response (200):
{
  "url": "https://s3.amazonaws.com/..."  // Presigned URL
}
```

#### Delete File
```http
DELETE /files/{file_id}
Authorization: Bearer {access_token}

Response (204): No Content
```

### Health Endpoints

#### API Health
```http
GET /health

Response (200):
{
  "status": "healthy"
}
```

#### Database Health
```http
GET /health/db

Response (200):
{
  "status": "connected"
}
```

#### S3 Health
```http
GET /health/s3

Response (200):
{
  "status": "connected"
}
```

### Error Responses

```http
401 Unauthorized:
{
  "detail": "Invalid credentials"
}

403 Forbidden:
{
  "detail": "Not authenticated"
}

404 Not Found:
{
  "detail": "File not found"
}

422 Validation Error:
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}

500 Server Error:
{
  "detail": "Internal server error"
}
```

---

## 🌐 Deployment

### Production Deployment

#### Prerequisites
- Server with Ubuntu 20.04+ (or similar)
- Nginx installed and configured
- PostgreSQL installed
- Python 3.9+ installed
- AWS S3 credentials

#### Step 1: Build Frontend

```bash
cd Frontend
npm install
npm run build
# Creates dist/ folder with optimized build
```

#### Step 2: Deploy Frontend

```bash
# Copy dist folder to server
scp -r dist/* user@triplebyte-storage.duckdns.org:/var/www/triplebyte-storage/
```

#### Step 3: Deploy Backend

```bash
# Copy backend files to server
scp -r app alembic requirements.txt .env user@triplebyte-storage.duckdns.org:/opt/cloud-storage/

# SSH into server
ssh user@triplebyte-storage.duckdns.org

# Create virtual environment
cd /opt/cloud-storage
python -m venv venv
. venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start backend (using systemd or supervisor)
```

#### Step 4: Configure Nginx

```nginx
server {
    listen 443 ssl;
    server_name triplebyte-storage.duckdns.org;
    
    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/triplebyte-storage.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/triplebyte-storage.duckdns.org/privkey.pem;
    
    # Serve frontend static files
    location / {
        root /var/www/triplebyte-storage;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
        
        # Don't cache index.html
        location = /index.html {
            add_header Cache-Control "public, max-age=0, must-revalidate";
        }
    }
    
    # Proxy API requests to backend
    location /auth {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /files {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;  # Allow large file uploads
    }
    
    location /health {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    gzip_min_length 1024;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name triplebyte-storage.duckdns.org;
    return 301 https://$server_name$request_uri;
}
```

#### Step 5: Start Services

```bash
# Restart nginx
sudo systemctl restart nginx

# Start backend (using systemd service)
sudo systemctl start cloud-storage
sudo systemctl enable cloud-storage  # Auto-start on reboot
```

#### Step 6: Verify Deployment

```bash
# Test frontend
curl https://triplebyte-storage.duckdns.org

# Test backend
curl https://triplebyte-storage.duckdns.org/health

# Test login endpoint
curl -X POST https://triplebyte-storage.duckdns.org/auth/login
```

---

## 📂 Project Structure

```
cloud-file-storage-system/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app and routes
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection
│   ├── dependencies.py         # FastAPI dependencies (JWT)
│   ├── core/
│   │   ├── security.py         # JWT token handling
│   ├── models/
│   │   ├── user.py             # User database model
│   │   ├── file.py             # File database model
│   ├── routers/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── files.py            # File management endpoints
│   ├── schemas/
│   │   ├── user.py             # User request/response schemas
│   │   ├── file.py             # File request/response schemas
│   ├── services/
│   │   ├── s3_service.py       # AWS S3 integration
│   
├── alembic/
│   ├── env.py                  # Migration environment
│   ├── script.py.mako          # Migration script template
│   ├── versions/
│   │   ├── 0afef5bf18e2_create_users_and_files_tables.py
│
├── Frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── context/            # Zustand stores
│   │   ├── hooks/              # Custom React hooks
│   │   ├── config/             # Application config
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                 # Static assets
│   ├── dist/                   # Production build (generated)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env                    # Environment variables
│   └── README.md
│
├── alembic.ini                 # Alembic configuration
├── requirements.txt            # Python dependencies
├── .env.example                # Example environment variables
├── .gitignore
└── README.md                   # This file
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue: "Database connection refused"**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Create database if missing
createdb cloud_storage

# Run migrations
alembic upgrade head
```

**Issue: "AWS S3 access denied"**
```bash
# Verify AWS credentials in .env
# Check S3 bucket exists and is accessible
# Verify IAM permissions (s3:GetObject, s3:PutObject, s3:DeleteObject)
```

**Issue: "Port 8000 already in use"**
```bash
# Use different port
uvicorn app.main:app --reload --port 8001

# Or kill process using port 8000
lsof -i :8000
kill -9 <PID>
```

### Frontend Issues

**Issue: "Cannot connect to backend"**
```bash
# Check backend is running
curl http://localhost:8000/health

# Verify VITE_API_BASE_URL in .env
# Check backend is accessible from frontend URL
```

**Issue: "CORS error"**
```bash
# Ensure backend has CORS enabled
# Check CORS_ORIGINS includes frontend URL in backend .env
```

**Issue: "npm install fails"**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Deployment Issues

**Issue: "Frontend shows 404"**
```bash
# Check nginx config has correct root path
# Verify dist/ uploaded to correct location
# Check nginx is reloaded: sudo systemctl reload nginx
```

**Issue: "API calls fail on production"**
```bash
# Verify nginx proxy configuration
# Check backend is running
# Verify CORS headers in nginx config
# Check VITE_API_BASE_URL is empty in production .env
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add feature description"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Code Style

- **Python:** Follow PEP 8 (use `black` formatter)
- **JavaScript:** Use ESLint config
- **Git:** Write clear commit messages
- **Documentation:** Update README for significant changes

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues first
- Provide detailed error messages and steps to reproduce

---

## 🔐 Security

### Best Practices Implemented
- ✅ JWT token-based authentication
- ✅ HTTPS enforced in production
- ✅ CORS properly configured
- ✅ SQL injection prevention (ORM)
- ✅ Password hashing (bcrypt)
- ✅ Secure file upload validation
- ✅ AWS S3 presigned URLs

### Security Considerations
- Change JWT_SECRET_KEY in production
- Use environment variables for all secrets
- Enable HTTPS with valid certificate
- Regular security updates
- Monitor logs for suspicious activity
- Use strong database passwords
- Enable S3 bucket encryption

---

## 📊 Performance

### Optimization Features
- ✅ Frontend code splitting
- ✅ CSS purging (Tailwind)
- ✅ Gzip compression (Nginx)
- ✅ Static asset caching
- ✅ Database indexing
- ✅ AWS S3 presigned URLs
- ✅ React lazy loading ready

### Benchmarks
- **Frontend bundle:** ~70KB (gzipped)
- **API response time:** <200ms (average)
- **File upload:** Depends on file size and connection
- **Database queries:** Optimized with indexes

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## 🚀 Roadmap

Future enhancements planned:
- [ ] File sharing with links
- [ ] File versioning
- [ ] Trash/recovery
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Usage analytics
- [ ] Mobile app (iOS/Android)
- [ ] End-to-end encryption
- [ ] Advanced permissions system

---

## ✨ Credits

- **Frontend:** React, Vite, Tailwind CSS, Zustand, Axios
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Infrastructure:** Nginx, AWS S3, Ubuntu
- **Inspired by:** Dropbox, Google Drive, OneDrive

---

## 📅 Changelog

### Version 1.0.0 (Production Release)
- ✅ User authentication (registration, login, logout)
- ✅ File upload with progress tracking
- ✅ File download via presigned S3 URLs
- ✅ File deletion
- ✅ Real-time search and sorting
- ✅ Responsive mobile UI
- ✅ Production deployment with nginx

---

## 📝 Notes

- **Live Demo:** https://triplebyte-storage.duckdns.org
- **Backend API:** Available at `/docs` endpoint (Swagger UI)
- **Status:** Production Ready ✅
- **Last Updated:** May 26, 2026

---

Made with ❤️ for secure cloud storage.
