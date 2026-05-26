# 📁 Frontend Project Structure Overview

## Complete Directory Tree

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx          # Login form with email/password
│   │   │   ├── RegisterForm.jsx       # Registration with validation
│   │   │   └── index.js               # Component exports
│   │   │
│   │   ├── FileUpload/
│   │   │   ├── FileUploadDropzone.jsx # Drag-drop upload component
│   │   │   └── index.js               # Component exports
│   │   │
│   │   ├── FileList/
│   │   │   ├── FileList.jsx           # Main file list container
│   │   │   ├── FileSearch.jsx         # Search/filter input
│   │   │   ├── FileListTable.jsx      # Table with sorting
│   │   │   ├── FileRow.jsx            # Individual file row
│   │   │   └── index.js               # Component exports
│   │   │
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx             # Top navigation bar
│   │   │   ├── StorageStats.jsx       # Storage statistics cards
│   │   │   └── index.js               # Component exports
│   │   │
│   │   └── index.js                   # (Optional) root exports
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx              # Login page wrapper
│   │   ├── RegisterPage.jsx           # Registration page wrapper
│   │   ├── Dashboard.jsx              # Protected dashboard wrapper
│   │   └── DashboardPage.jsx          # Dashboard content
│   │
│   ├── services/
│   │   ├── api.js                     # API methods (auth, files, health)
│   │   ├── apiClient.js               # Axios instance with interceptors
│   │   └── index.js                   # Service exports
│   │
│   ├── context/
│   │   ├── AuthContext.js             # Auth state (Zustand)
│   │   ├── FileContext.js             # File state (Zustand)
│   │   └── index.js                   # Context exports
│   │
│   ├── hooks/
│   │   ├── useAuth.js                 # Authentication hook
│   │   ├── useFiles.js                # File management hook
│   │   ├── useToggle.js               # Toggle state hook
│   │   └── index.js                   # Hook exports
│   │
│   ├── utils/
│   │   ├── helpers.js                 # Utility functions
│   │   ├── icons.js                   # Icon mappings
│   │   └── index.js                   # Utils exports
│   │
│   ├── App.jsx                        # Main app component with routing
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Global styles with Tailwind
│
├── public/                            # Static assets
│
├── index.html                         # HTML template
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── postcss.config.js                  # PostCSS configuration
├── package.json                       # Dependencies and scripts
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
│
├── README.md                          # Project documentation
├── SETUP.md                           # Setup instructions
├── API.md                             # API documentation
└── DEPLOYMENT.md                      # Deployment guide
```

## File-by-File Breakdown

### src/components/Auth/LoginForm.jsx
**Purpose:** Login form component
**Key Features:**
- Email and password inputs
- Form validation
- Loading state
- Error display
- Link to registration

### src/components/Auth/RegisterForm.jsx
**Purpose:** Registration form component
**Key Features:**
- Email validation
- Password strength validation
- Password confirmation
- Password requirements display
- Error accumulation

### src/components/FileUpload/FileUploadDropzone.jsx
**Purpose:** Drag-and-drop file upload
**Key Features:**
- Drag-and-drop support
- Click to upload
- File type validation
- File size validation
- Progress bar with percentage
- Multiple file support

### src/components/FileList/FileList.jsx
**Purpose:** Main file list container
**Key Features:**
- Loading state
- Error handling with retry
- Empty state message
- Integration with FileSearch and FileListTable

### src/components/FileList/FileSearch.jsx
**Purpose:** File search/filter input
**Key Features:**
- Real-time search
- Updates FileContext on input change
- Search icon
- Placeholder text

### src/components/FileList/FileListTable.jsx
**Purpose:** File list table with sorting
**Key Features:**
- Table headers with sort buttons
- Sortable columns: name, size, date
- Sort direction indicator
- Integration with FileRow components

### src/components/FileList/FileRow.jsx
**Purpose:** Individual file row component
**Key Features:**
- File icon based on type
- File name display
- File size formatted
- Upload date formatted
- Download button
- Delete button with confirmation
- Loading state for delete

### src/components/Layout/Navbar.jsx
**Purpose:** Top navigation bar
**Key Features:**
- App logo and title
- User email display
- Logout button
- Mobile menu toggle
- Responsive design

### src/components/Layout/StorageStats.jsx
**Purpose:** Storage statistics cards
**Key Features:**
- Total files count
- Storage used (formatted)
- Member since date
- Icon indicators
- Grid layout

### src/pages/LoginPage.jsx
**Purpose:** Login page wrapper
**Key Features:**
- Gradient background
- LoginForm component
- Redirect to dashboard if authenticated
- Responsive layout

### src/pages/RegisterPage.jsx
**Purpose:** Registration page wrapper
**Key Features:**
- Gradient background
- RegisterForm component
- Redirect to dashboard if authenticated
- Responsive layout

### src/pages/Dashboard.jsx
**Purpose:** Protected dashboard wrapper
**Key Features:**
- Route protection (redirects to login if not authenticated)
- User data fetching on mount
- File list loading on mount
- Loading state while fetching user data
- Navbar integration

### src/pages/DashboardPage.jsx
**Purpose:** Dashboard content
**Key Features:**
- Title and description
- StorageStats component
- FileUploadDropzone component
- FileList component
- Responsive grid layout

### src/services/api.js
**Purpose:** API service methods
**Key Features:**
- authService.register()
- authService.login()
- authService.getCurrentUser()
- fileService.uploadFile()
- fileService.listFiles()
- fileService.getDownloadUrl()
- fileService.deleteFile()
- healthService methods

### src/services/apiClient.js
**Purpose:** Axios HTTP client
**Key Features:**
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Error handling
- Automatic logout on 401

### src/context/AuthContext.js
**Purpose:** Authentication state (Zustand)
**State:**
- user (user object)
- token (JWT token)
- isLoading (loading flag)
- error (error message)

**Actions:**
- setUser()
- setToken()
- setIsLoading()
- setError()
- logout()
- isAuthenticated()

### src/context/FileContext.js
**Purpose:** File management state (Zustand)
**State:**
- files (array of file objects)
- isLoading (loading flag)
- error (error message)
- uploadProgress (percentage 0-100)
- searchQuery (search text)
- sortBy ('date', 'name', 'size')
- sortOrder ('asc', 'desc')

**Actions:**
- setFiles()
- setIsLoading()
- setError()
- setUploadProgress()
- setSearchQuery()
- setSortBy()
- setSortOrder()
- addFile()
- removeFile()
- getFilteredAndSortedFiles() (computed)
- getTotalStorageUsed() (computed)

### src/hooks/useAuth.js
**Purpose:** Authentication hook
**Methods:**
- login(email, password)
- register(email, password)
- getCurrentUser()
- logout()

**Returns:**
- user
- token
- isLoading
- error
- isAuthenticated()

### src/hooks/useFiles.js
**Purpose:** File management hook
**Methods:**
- loadFiles()
- uploadFile(file)
- deleteFile(fileId)
- downloadFile(fileId, filename)

**Returns:**
- files
- isLoading
- error
- uploadProgress
- searchQuery
- setSearchQuery()
- getFilteredAndSortedFiles()
- getTotalStorageUsed()

### src/hooks/useToggle.js
**Purpose:** Simple toggle state hook
**Returns:**
- [state, toggle]

### src/utils/helpers.js
**Purpose:** Utility functions
**Functions:**
- formatBytes(bytes) - Convert bytes to readable format
- formatDate(date) - Format ISO date to readable format
- getFileIcon(contentType) - Get icon name for file type
- isValidEmail(email) - Validate email format
- validatePassword(password) - Validate password strength

### src/utils/icons.js
**Purpose:** Icon mappings
**Functions:**
- getFileIconComponent(contentType) - Get Lucide icon component

### src/App.jsx
**Purpose:** Main app component
**Features:**
- React Router setup
- Route definitions
- Toast provider
- Error boundaries (implicit)

### src/main.jsx
**Purpose:** React entry point
**Features:**
- React and ReactDOM imports
- Root element mounting
- Strict mode enabled

### src/index.css
**Purpose:** Global styles
**Features:**
- Tailwind directives
- Custom reset styles
- Typography defaults
- Transition utilities

### index.html
**Purpose:** HTML template
**Features:**
- React root div
- Main script import
- Meta tags
- Title

### vite.config.js
**Purpose:** Vite configuration
**Features:**
- React plugin
- Dev server on port 3000
- API proxy to backend

### tailwind.config.js
**Purpose:** Tailwind CSS configuration
**Features:**
- Content paths
- Color theme extensions
- Plugin configurations

### postcss.config.js
**Purpose:** PostCSS configuration
**Features:**
- Tailwind plugin
- Autoprefixer plugin

### package.json
**Purpose:** Project metadata and dependencies
**Scripts:**
- dev - Start dev server
- build - Build for production
- preview - Preview production build

**Dependencies:**
- react, react-dom
- react-router-dom
- axios
- react-hot-toast
- lucide-react
- zustand

### .env.example
**Purpose:** Environment variables template
**Variables:**
- VITE_API_BASE_URL
- VITE_APP_NAME
- VITE_MAX_FILE_SIZE_MB

---

## Component Hierarchy

```
App
├── Router
│   ├── Route /login
│   │   └── LoginPage
│   │       └── LoginForm
│   │
│   ├── Route /register
│   │   └── RegisterPage
│   │       └── RegisterForm
│   │
│   └── Route /dashboard
│       └── Dashboard
│           ├── Navbar
│           │   └── (user info, logout)
│           └── DashboardPage
│               ├── StorageStats
│               │   ├── Total Files card
│               │   ├── Storage Used card
│               │   └── Member Since card
│               └── Grid Layout
│                   ├── Left Column (MD: 1 col)
│                   │   └── FileUploadDropzone
│                   │       └── (drag-drop upload area)
│                   │
│                   └── Right Column (MD: 2 cols)
│                       └── FileList
│                           ├── FileSearch
│                           │   └── (search input)
│                           └── FileListTable
│                               └── FileRow (x n)
│                                   ├── File icon
│                                   ├── File name
│                                   ├── File size
│                                   ├── Upload date
│                                   ├── Download button
│                                   └── Delete button
└── Toaster (react-hot-toast)
```

## State Flow

```
User Login
  ↓
authService.login()
  ↓
Token stored → useAuthStore.setToken()
  ↓
User data fetched → useAuthStore.setUser()
  ↓
Redirect to /dashboard
  ↓
FileContext initialized
  ↓
Files loaded → useFileStore.setFiles()
  ↓
Display Dashboard
```

## Data Flow

```
File Upload
  ↓
FileUploadDropzone captures file
  ↓
Validation (type, size)
  ↓
fileService.uploadFile()
  ↓
Multipart form-data sent
  ↓
Progress tracked
  ↓
Response received
  ↓
File added to FileContext
  ↓
FileList re-renders
  ↓
Toast notification shown
```

---

## Responsive Breakpoints

Using Tailwind CSS default breakpoints:
- **Mobile:** < 640px (no prefix)
- **Small:** ≥ 640px (sm:)
- **Medium:** ≥ 768px (md:)
- **Large:** ≥ 1024px (lg:)
- **Extra Large:** ≥ 1280px (xl:)

---

## Color Scheme

**Primary Colors:**
- primary-50: #f0f9ff
- primary-100: #e0f2fe
- primary-500: #0ea5e9 (main action)
- primary-600: #0284c7 (hover)
- primary-700: #0369a1 (active)

**Neutral Colors:**
- gray-50 to gray-900 (Tailwind defaults)

---

## Accessibility Features

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus states on buttons
- Color contrast compliance
- Alt text for icons (via title)

---

## Performance Considerations

- Code splitting with React Router
- Lazy loading potential
- Memoization for expensive computations
- Efficient state management with Zustand
- Tailwind CSS purging in production
- Vite fast refresh for dev

---

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Scalability

To add new features:

1. **New Page:** Create in `src/pages/`
2. **New Component:** Create in appropriate `src/components/` folder
3. **New Hook:** Create in `src/hooks/`
4. **New API Method:** Add to `src/services/api.js`
5. **New State:** Add to appropriate Zustand store in `src/context/`

---

**Last Updated:** 2024-01-15
