# PenaltyBox UI - Frontend Application

A modern React.js frontend for the PenaltyBox web application - a penalty management system for groups and their members.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API service functions
│   ├── api.js      # Axios instance with interceptors
│   └── index.js    # All API service methods
├── context/        # React context providers
├── utils/          # Helper functions
├── hooks/          # Custom React hooks
└── assets/         # Images, fonts, etc.
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Backend API running on `http://localhost:8000`

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd /Users/souravsingh/Documents/coding/penaltybox_ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - The `.env` file is already created with the default backend URL
   - Modify if your backend runs on a different port:
     ```
     VITE_API_BASE_URL=http://localhost:8000
     ```

### Running the Application

**Start the development server:**
```bash
npm run dev
```

The application will start on `http://localhost:5173/`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 🌐 Available Routes

- `/` - Home page
- `/login` - Login page (will be implemented in Task 2)
- `/register` - Register page (will be implemented in Task 2)

## 🔌 API Integration

The application is configured to connect to the backend API at `http://localhost:8000`.

### API Service Features

- **Automatic token management** - JWT tokens are automatically attached to requests
- **Error handling** - Centralized error handling with automatic 401 redirects
- **Interceptors** - Request/response interceptors for auth and error handling

### Available Services

All API services are available in `src/services/index.js`:

- `authService` - Authentication (login, register, logout)
- `groupsService` - Groups management (CRUD operations)
- `penaltiesService` - Penalties management
- `proofsService` - Proof upload and review
- `leaderboardService` - Leaderboard data
- `paymentsService` - Payment tracking

## 🎨 Styling

The project uses **TailwindCSS** for styling with custom utility classes defined in `src/index.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Standard input field style
- `.card` - Card container style

## 📋 Development Tasks

See `tasks.md` for the complete list of development tasks and progress tracking.

### Current Status

✅ **Task 1: Project Setup & Configuration** - COMPLETED
- React + Vite initialized
- All dependencies installed
- Folder structure created
- API service configured
- Basic routing set up
- TailwindCSS configured

🔜 **Next: Task 2 - Authentication System**

## 🧪 Testing the Setup

1. Start the backend API (if not already running):
   ```bash
   cd /Users/souravsingh/Documents/coding/penaltybox
   source myenv/bin/activate
   uvicorn app.main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd /Users/souravsingh/Documents/coding/penaltybox_ui
   npm run dev
   ```

3. Open `http://localhost:5173/` in your browser

4. You should see:
   - Beautiful home page with PenaltyBox branding
   - Login and Register buttons
   - Three feature cards
   - Responsive design

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Vite will automatically try the next available port
# Or you can specify a custom port:
npm run dev -- --port 3000
```

**API connection issues:**
- Ensure backend is running on `http://localhost:8000`
- Check `.env` file for correct API URL
- Check browser console for CORS errors

**TailwindCSS not working:**
- Ensure `tailwind.config.js` exists
- Restart dev server after TailwindCSS configuration changes

## 📚 Next Steps

After completing Task 1, the next task is to implement the **Authentication System**:
- Create functional Login and Register pages
- Implement JWT token management
- Create protected routes
- Add logout functionality

## 🤝 Contributing

This is a learning project. Each task is completed incrementally to understand React.js development better.

## 📄 License

MIT

---

**Project Status:** Task 1 Complete ✅  
**Last Updated:** January 3, 2026
