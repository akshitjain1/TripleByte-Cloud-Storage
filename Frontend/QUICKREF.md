# ⚡ Quick Reference Card

## 🚀 Getting Started (2 Minutes)

```bash
# 1. Navigate to frontend
cd Frontend

# 2. Install dependencies
npm install

# 3. Configure backend URL
cp .env.example .env
# Edit VITE_API_BASE_URL if needed

# 4. Start dev server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## 📖 Documentation Map

| Need | File | Time |
|------|------|------|
| Get started | README.md | 5 min |
| Setup step-by-step | SETUP.md | 10 min |
| Understand API | API.md | 15 min |
| Deploy to production | DEPLOYMENT.md | 20 min |
| Understand code structure | ARCHITECTURE.md | 15 min |
| Quick overview | SUMMARY.md | 10 min |
| This card | QUICKREF.md | 2 min |

---

## 🔑 Key Concepts

### State Management (Zustand)

```javascript
import { useAuthStore } from './context/AuthContext'

// Get state
const { user, token, isAuthenticated } = useAuthStore()

// Set state
useAuthStore.setState({ user: newUser })

// Or use in hooks
const { user } = useAuth()
```

### API Calls

```javascript
import { fileService } from './services/api'

// Upload file
const response = await fileService.uploadFile(file, onProgress)

// List files
const files = await fileService.listFiles()

// Download
const { download_url } = await fileService.getDownloadUrl(fileId)
```

### Components

```javascript
// Function component
export function MyComponent() {
  const { user } = useAuth()
  return <div>{user?.email}</div>
}

// Hook usage
const { files, uploadFile } = useFiles()

// Effect
useEffect(() => {
  if (isAuthenticated) loadFiles()
}, [isAuthenticated])
```

---

## 🛠️ Common Tasks

### Add New Page

1. Create `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`:
```javascript
<Route path="/mypage" element={<MyPage />} />
```

### Add New Component

1. Create folder `src/components/MyComponent/`
2. Create `MyComponent.jsx`
3. Export from `src/components/MyComponent/index.js`
4. Import and use:
```javascript
import { MyComponent } from '../components/MyComponent'
```

### Add API Endpoint

1. Add to `src/services/api.js`:
```javascript
export const myService = {
  myMethod: async () => {
    const response = await apiClient.get('/my-endpoint')
    return response.data
  }
}
```

### Add State

1. Add to Zustand store in `src/context/`:
```javascript
export const useMyStore = create((set) => ({
  myState: null,
  setMyState: (value) => set({ myState: value })
}))
```

---

## 🎨 Styling with Tailwind

```jsx
// Classes
<div className="bg-blue-500 text-white p-4 rounded-lg">

// Responsive
<div className="p-4 md:p-8 lg:p-12">

// States
<button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800">

// Dark mode (infrastructure ready)
<div className="bg-white dark:bg-gray-900">

// Gradients
<div className="bg-gradient-to-br from-blue-50 to-blue-100">

// Grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

---

## 🔄 Component Flow

```
User Action
    ↓
Event Handler
    ↓
API Call (fileService/authService)
    ↓
State Update (Zustand store)
    ↓
Component Re-render
    ↓
Toast Notification
```

---

## 🔐 Authentication Flow

```
/login → LoginForm → authService.login()
           ↓
    Backend validates email/password
           ↓
    Returns access_token
           ↓
    useAuthStore.setToken(token)
           ↓
    Navigate to /dashboard
           ↓
    Navbar shows user email
```

---

## 📤 File Upload Flow

```
FileUploadDropzone (drag/drop or click)
           ↓
    Validate file (type, size)
           ↓
    fileService.uploadFile(file, onProgress)
           ↓
    Multipart POST /files/upload
           ↓
    Track progress (0-100%)
           ↓
    Receive file object
           ↓
    useFileStore.addFile(file)
           ↓
    FileList re-renders with new file
           ↓
    Toast notification
```

---

## ❌ Error Handling

```javascript
try {
  await apiCall()
} catch (err) {
  // Get error message
  const message = err.response?.data?.detail || 'Error'
  
  // Show to user
  toast.error(message)
  
  // Update state
  setError(message)
}
```

---

## 🧪 Testing API Endpoints

### Using Postman

1. Create environment variable: `token = your_jwt_token`
2. Add header: `Authorization: Bearer {{token}}`
3. POST to `http://localhost:8000/auth/login`
4. Copy token from response
5. Use token in subsequent requests

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -d "username=test@example.com&password=SecurePass123"

# List files (replace TOKEN)
curl http://localhost:8000/files \
  -H "Authorization: Bearer TOKEN"
```

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel deploy --prod

# Deploy to Netlify
netlify deploy --prod --dir dist

# Build Docker image
docker build -t cloudstore-frontend .
```

---

## 🐛 Debugging

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Look for failed requests
4. Check request/response headers and body

### Check State
1. Open DevTools Console
2. Run: `JSON.parse(localStorage.getItem('zustand-store'))`
3. Check token and user data

### Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check for "Login failed" or "Upload failed"

### Backend Logs
Check terminal running FastAPI for:
- Request logs
- SQL queries
- S3 operations
- Error traces

---

## 📱 Responsive Breakpoints

```
Mobile:     < 640px (default styles)
Tablet:     ≥ 768px (md: prefix)
Desktop:    ≥ 1024px (lg: prefix)
Large:      ≥ 1280px (xl: prefix)
```

Example:
```jsx
<div className="p-2 md:p-4 lg:p-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 🎯 Environment Variables

```
VITE_API_BASE_URL          # Backend API URL (http://localhost:8000)
VITE_APP_NAME              # App name (Cloud File Storage)
VITE_MAX_FILE_SIZE_MB      # Max file size (5)
```

Set in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

Access in code:
```javascript
import.meta.env.VITE_API_BASE_URL
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color'
      }
    }
  }
}
```

### Change App Name

Edit `.env`:
```env
VITE_APP_NAME=Your App Name
```

### Change Max File Size

Edit `.env`:
```env
VITE_MAX_FILE_SIZE_MB=10
```

### Add File Types

Edit `src/components/FileUpload/FileUploadDropzone.jsx`:
```javascript
const ALLOWED_TYPES = [
  // ... existing types
  'video/mp4'
]
```

---

## 📚 File Sizes & Formats

```
5 MB      = 5 * 1024 * 1024 bytes = 5242880 bytes
1 KB      = 1024 bytes
1 MB      = 1024 KB
1 GB      = 1024 MB

# File types
PDF       = application/pdf
Text      = text/plain
PNG       = image/png
JPEG      = image/jpeg
DOCX      = application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| **CORS Error** | Update backend CORS settings, check API URL |
| **401 Unauthorized** | Clear localStorage, login again |
| **Upload fails** | Check file type/size, verify S3 in backend |
| **Page blank** | Check console for errors, verify build |
| **Token expires** | Token valid for 60 min, auto-logout occurs |
| **No files shown** | Verify backend /files endpoint, check token |

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| **Dev Tools** | F12 |
| **Console** | F12 → Console tab |
| **Network** | F12 → Network tab |
| **Search** | Ctrl+F (or Cmd+F on Mac) |
| **Reload** | Ctrl+R (or Cmd+R on Mac) |
| **Hard Reload** | Ctrl+Shift+R (or Cmd+Shift+R on Mac) |

---

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios Docs](https://axios-http.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

---

## 📞 Support Resources

- **README.md** - Feature overview
- **SETUP.md** - Step-by-step setup
- **API.md** - API documentation
- **ARCHITECTURE.md** - Code structure
- **DEPLOYMENT.md** - Deployment guides
- **Browser Console** - Debug errors
- **Backend Logs** - Server issues

---

## ✅ Pre-Launch Checklist

- [ ] Backend running at correct URL
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Registration works
- [ ] Login works
- [ ] File upload works
- [ ] File list displays
- [ ] Download works
- [ ] Delete works
- [ ] Logout works

---

**Quick Start:** `npm install && npm run dev`

**Production Build:** `npm run build`

**Ready to deploy:** Check DEPLOYMENT.md

---

**Last Updated:** January 15, 2024
