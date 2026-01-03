# 🚀 Quick Start Guide - Running PenaltyBox UI

## Current Status
✅ **Task 1 Complete!** The React application is set up and ready to run.

---

## 📍 Running the Application

### **Option 1: Frontend Only (Current Setup)**

The development server is **already running**! 🎉

- **URL:** http://localhost:5173/
- **Status:** Running in background
- **What to do:** Just open your browser and visit the URL above

### **Option 2: Start Fresh (If You Stop the Server)**

If you need to restart the server:

```bash
cd /Users/souravsingh/Documents/coding/penaltybox_ui
npm run dev
```

Then open: **http://localhost:5173/**

---

## 🎯 What You'll See

### **Home Page (`/`):**
- Beautiful gradient blue background
- PenaltyBox title and description
- Login and Register buttons
- Three feature cards

### **Try These Routes:**
1. Click **Login** → Goes to `/login` (placeholder page)
2. Click **Register** → Goes to `/register` (placeholder page)
3. Type any random URL → Shows 404 page

---

## 🔧 Optional: Running the Backend

For full functionality (API integration), you'll need the backend running too.

**In a separate terminal window:**

```bash
# Navigate to backend directory
cd /Users/souravsingh/Documents/coding/penaltybox

# Activate virtual environment
source myenv/bin/activate

# Start the backend server
uvicorn app.main:app --reload
```

Backend will run on: **http://localhost:8000**

> **Note:** The backend is optional for now since we're just testing the frontend setup. You'll need it when we implement authentication in Task 2.

---

## 🛑 Stopping the Server

To stop the development server:

1. Go to the terminal where it's running
2. Press `Ctrl + C` (or `Cmd + C` on Mac)

---

## 🧪 Testing Checklist

Open your browser to `http://localhost:5173/` and verify:

- [ ] Home page loads with gradient background
- [ ] Login button works (navigates to /login)
- [ ] Register button works (navigates to /register)
- [ ] Page is responsive (resize browser window)
- [ ] No errors in browser console (press F12)

---

## 📱 Browser DevTools

**Recommended:** Open DevTools to see what's happening

1. Press `F12` (or right-click → Inspect)
2. Go to **Console** tab
3. Should see Vite connection message (no errors)

---

## 🎨 What's Built So Far

✅ React + Vite setup  
✅ TailwindCSS styling  
✅ React Router navigation  
✅ API service layer (ready for Task 2)  
✅ Beautiful home page  
✅ Responsive design  

---

## 🔜 Next Steps

**Task 2: Authentication System**
- Build functional login/register forms
- Connect to backend APIs
- Implement JWT authentication
- Create protected routes

**When you're ready:** Just let me know and we'll start Task 2! 🚀

---

## 💡 Quick Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies (if needed)
npm install
```

---

## 🆘 Need Help?

**App not loading?**
- Check if the server is running (look for "VITE ready" message)
- Try refreshing the browser
- Clear browser cache

**Port already in use?**
- Vite will automatically use the next available port
- Check the terminal output for the actual port

**Want to restart?**
- Press `Ctrl+C` to stop
- Run `npm run dev` again

---

**Have fun exploring! 🎉**
