# CloudStore Frontend

A production-ready React + Vite + Tailwind CSS frontend for CloudStore - a secure cloud file storage system powered by FastAPI and AWS S3.

## Features

✨ **Authentication**
- User registration and login with JWT tokens
- Protected routes
- Secure token storage and automatic refresh
- Logout functionality

📁 **File Management**
- Drag-and-drop file upload
- Upload progress tracking
- File listing with sorting and searching
- Download files from S3
- Delete files
- File type and size validation

📊 **Dashboard**
- Storage statistics
- Total files counter
- Storage usage display
- Member since information

🎨 **Design**
- Professional SaaS UI with Tailwind CSS
- Responsive mobile-first layout
- Dark mode ready
- Loading states and skeletons
- Toast notifications
- Lucide React icons

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Auth/              # Login and Register forms
│   │   ├── FileUpload/        # Drag-drop upload component
│   │   ├── FileList/          # File listing and management
│   │   └── Layout/            # Navbar and stats
│   ├── pages/                 # Page components
│   ├── services/              # API integration layer
│   ├── context/               # Zustand stores for auth and files
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Helper functions and utilities
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── public/                    # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and set the API base URL:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Cloud File Storage
VITE_MAX_FILE_SIZE_MB=5
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## API Integration

The frontend communicates with the FastAPI backend via axios. All API calls are made through the `services/api.js` file:

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email and password
- `GET /auth/me` - Get current user info

### File Endpoints
- `POST /files/upload` - Upload file with progress tracking
- `GET /files` - List all user files
- `GET /files/{file_id}/download` - Get S3 download URL
- `DELETE /files/{file_id}` - Delete file

### Health Checks
- `GET /health` - API health status
- `GET /health/db` - Database connection status
- `GET /health/s3` - S3 connection status

## State Management

Uses **Zustand** for lightweight state management:

- **AuthContext**: User authentication state, token management
- **FileContext**: File list, upload progress, search/sort state

## Key Features Implementation

### JWT Authentication
- Tokens are stored in localStorage
- Automatically included in request headers via axios interceptor
- 401 responses trigger automatic logout and redirect to login

### File Upload
- Drag-and-drop support
- Progress tracking with percentage display
- File type validation (PDF, Text, PNG, JPEG, DOCX)
- 5MB file size limit
- Multipart form data upload

### File Management
- Sort by name, size, or upload date
- Search with real-time filtering
- Download via presigned S3 URLs
- Delete with confirmation dialog
- Display file sizes in human-readable format

## Component Hierarchy

```
App
├── LoginPage
│   └── LoginForm
├── RegisterPage
│   └── RegisterForm
└── Dashboard
    ├── Navbar
    ├── StorageStats
    └── DashboardPage
        ├── FileUploadDropzone
        └── FileList
            ├── FileSearch
            └── FileListTable
                └── FileRow (x n)
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

## Error Handling

- Try-catch blocks in all async operations
- Toast notifications for user feedback
- Graceful fallbacks for failed requests
- Automatic logout on 401 responses
- Form validation before submission

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of routes
- Memoization where appropriate
- Image optimization
- CSS minification (production)
- JavaScript minification (production)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] File preview functionality
- [ ] Folder organization
- [ ] File sharing with permissions
- [ ] Version history
- [ ] Advanced search filters
- [ ] Batch operations
- [ ] Two-factor authentication
- [ ] Dark mode toggle
- [ ] File encryption options

## Troubleshooting

### CORS Errors
- Ensure backend is running on `http://localhost:8000`
- Check `vite.config.js` proxy configuration
- Verify `VITE_API_BASE_URL` matches backend URL

### 401 Unauthorized Errors
- Token may have expired - try logging out and back in
- Check browser localStorage for valid token
- Verify backend JWT_SECRET_KEY is set correctly

### Upload Failures
- Check file type is in allowed list
- Verify file size is under 5MB
- Ensure S3 bucket is accessible from backend
- Check CORS settings if uploading directly to S3

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
1. Check the GitHub issues
2. Review FastAPI backend logs
3. Check browser console for errors
4. Verify all environment variables are set

---

**Happy coding! 🚀**
