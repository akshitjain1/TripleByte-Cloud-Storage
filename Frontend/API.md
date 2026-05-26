# API Integration Documentation

This document details how the frontend integrates with the FastAPI backend.

## Overview

The frontend communicates with the backend via REST API using Axios. All requests automatically include JWT tokens in the Authorization header.

## Base Configuration

**Base URL:** `http://localhost:8000` (configurable via `VITE_API_BASE_URL`)

**Default Timeout:** 30 seconds

**Headers:**
- `Content-Type: application/json` (or `multipart/form-data` for file uploads)
- `Authorization: Bearer {token}` (added automatically for authenticated requests)

## Authentication Endpoints

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one number

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Email already registered
- `422 Unprocessable Entity` - Invalid email format or password too short

**Frontend Implementation:**
```javascript
// In useAuth hook
const register = async (email, password) => {
  const userData = await authService.register(email, password)
  toast.success('Registration successful! Please login.')
}
```

---

### Login User

**Endpoint:** `POST /auth/login`

**Request Format:** `application/x-www-form-urlencoded` (NOT JSON)

**Request Body:**
```
username=user@example.com&password=SecurePass123
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid email or password
- `403 Forbidden` - User account is disabled

**Frontend Implementation:**
```javascript
// In apiClient.js - Form data handling
const formData = new FormData()
formData.append('username', email)
formData.append('password', password)

const response = await apiClient.post('/auth/login', formData, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

const token = response.data.access_token
localStorage.setItem('token', token)
```

---

### Get Current User

**Endpoint:** `GET /auth/me`

**Authentication:** Required (Bearer token)

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Token missing or invalid

**Frontend Implementation:**
```javascript
// In useAuth hook
const getCurrentUser = async () => {
  const userData = await authService.getCurrentUser()
  setUser(userData)
  return userData
}

// Called in Dashboard component to verify token on page load
useEffect(() => {
  if (token && !user) {
    getCurrentUser()
  }
}, [token, user])
```

---

## File Endpoints

### Upload File

**Endpoint:** `POST /files/upload`

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

**Request Body:**
```
uploaded_file: <binary file data>
```

**Allowed File Types:**
- `application/pdf` - PDF documents
- `text/plain` - Text files
- `image/png` - PNG images
- `image/jpeg` - JPEG images
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` - Word documents

**Constraints:**
- Max file size: 5 MB (5242880 bytes)

**Response (201 Created):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "filename": "document.pdf",
    "size_bytes": 1024000,
    "content_type": "application/pdf",
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - File type not allowed or file too large
- `401 Unauthorized` - Token missing or invalid
- `500 Internal Server Error` - Failed to upload to S3

**Frontend Implementation:**
```javascript
// In useFiles hook
const uploadFile = async (file) => {
  try {
    const response = await fileService.uploadFile(file, (progress) => {
      setUploadProgress(progress)
    })
    addFile(response.file)
    toast.success('File uploaded successfully!')
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Upload failed')
  }
}

// In FileUploadDropzone component
const handleFiles = async (files) => {
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`File type not allowed: ${file.type}`)
      continue
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 5MB limit')
      continue
    }
    await uploadFile(file)
  }
}
```

---

### List Files

**Endpoint:** `GET /files`

**Authentication:** Required (Bearer token)

**Query Parameters:** None

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "filename": "document.pdf",
    "size_bytes": 1024000,
    "content_type": "application/pdf",
    "uploaded_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "filename": "image.jpg",
    "size_bytes": 2048000,
    "content_type": "image/jpeg",
    "uploaded_at": "2024-01-14T15:20:00Z"
  }
]
```

**Notes:**
- Returns only files owned by current user
- Excludes deleted files (is_deleted = false)
- Sorted by upload date (newest first)

**Error Responses:**
- `401 Unauthorized` - Token missing or invalid

**Frontend Implementation:**
```javascript
// In useFiles hook
const loadFiles = async () => {
  setIsLoading(true)
  try {
    const data = await fileService.listFiles()
    setFiles(data)
  } finally {
    setIsLoading(false)
  }
}

// Called in Dashboard component on mount
useEffect(() => {
  if (isAuthenticated()) {
    loadFiles()
  }
}, [isAuthenticated])

// Sorting and filtering done in FileContext
const getFilteredAndSortedFiles = () => {
  let filtered = files
  
  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(f =>
      f.filename.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  // Apply sorting
  return filtered.sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.uploaded_at) - new Date(a.uploaded_at)
        : new Date(a.uploaded_at) - new Date(b.uploaded_at)
    }
    // ... other sort options
  })
}
```

---

### Get Download URL

**Endpoint:** `GET /files/{file_id}/download`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `file_id` - UUID of the file (format: `550e8400-e29b-41d4-a716-446655440001`)

**Response (200 OK):**
```json
{
  "download_url": "https://s3.amazonaws.com/bucket/users/.../file.pdf?X-Amz-Signature=..."
}
```

**Notes:**
- Returns presigned S3 URL valid for 15 minutes
- URL includes all necessary credentials and signatures
- URL can be opened directly in browser

**Error Responses:**
- `401 Unauthorized` - Token missing or invalid
- `404 Not Found` - File not found or not owned by user

**Frontend Implementation:**
```javascript
// In useFiles hook
const downloadFile = async (fileId, filename) => {
  try {
    const response = await fileService.getDownloadUrl(fileId)
    window.open(response.download_url, '_blank')
    toast.success('Download started')
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Download failed')
  }
}

// In FileRow component
<button onClick={() => downloadFile(file.id, file.filename)}>
  <Download size={18} />
</button>
```

---

### Delete File

**Endpoint:** `DELETE /files/{file_id}`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `file_id` - UUID of the file

**Request Body:** Empty

**Response (200 OK):**
```json
{
  "message": "File deleted successfully"
}
```

**Notes:**
- Soft delete - marks file as deleted (is_deleted = true)
- File is removed from S3
- File no longer appears in file list

**Error Responses:**
- `401 Unauthorized` - Token missing or invalid
- `404 Not Found` - File not found or not owned by user

**Frontend Implementation:**
```javascript
// In useFiles hook
const deleteFile = async (fileId) => {
  try {
    await fileService.deleteFile(fileId)
    removeFile(fileId)
    toast.success('File deleted successfully!')
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Delete failed')
  }
}

// In FileRow component
const handleDelete = async () => {
  if (!window.confirm('Are you sure you want to delete this file?')) return
  await deleteFile(file.id)
}
```

---

## Health Check Endpoints

### API Health

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

### Database Health

**Endpoint:** `GET /health/db`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "db": "ok",
  "result": 1
}
```

---

### S3 Health

**Endpoint:** `GET /health/s3`

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "status": "ok",
  "bucket": "your-bucket-name",
  "region": "ap-south-1"
}
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input (file type, size, etc.) |
| 401 | Unauthorized | Token missing, invalid, or expired |
| 403 | Forbidden | User account disabled |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email already registered |
| 422 | Unprocessable Entity | Validation error |
| 500 | Server Error | S3 upload or database error |

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Frontend Error Handling

All errors are caught and displayed as toast notifications:

```javascript
try {
  await apiCall()
} catch (err) {
  const message = err.response?.data?.detail || 'Operation failed'
  toast.error(message)
}
```

---

## Rate Limiting

No explicit rate limiting is configured, but S3 and database may have implicit limits.

---

## Token Expiration

- JWT tokens expire after **60 minutes**
- Expired tokens trigger automatic logout and redirect to login
- Users must re-login after expiration

---

## CORS Configuration

Frontend is at `http://localhost:3000`
Backend should allow this origin in CORS settings:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Testing API Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=SecurePass123"

# Get current user
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# List files
curl http://localhost:8000/files \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create new collection
2. Set environment variable: `BASE_URL = http://localhost:8000`
3. Set environment variable: `TOKEN = your_jwt_token`
4. Import endpoints and test

---

## Backend Implementation Notes

- Uses SQLAlchemy ORM for database
- PostgreSQL for data storage
- AWS S3 for file storage
- JWT for authentication
- Pydantic for request validation
- Logging for debugging

---

**Last Updated:** 2024-01-15
**API Version:** 1.0
