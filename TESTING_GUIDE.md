# 🧪 Quick Testing Guide - Task 2: Authentication

## 🚀 Start the Servers

### Terminal 1 - Backend:
```bash
cd /Users/souravsingh/Documents/coding/penaltybox
source myenv/bin/activate
uvicorn app.main:app --reload
```
**Backend URL:** http://localhost:8000

### Terminal 2 - Frontend:
```bash
cd /Users/souravsingh/Documents/coding/penaltybox_ui
npm run dev
```
**Frontend URL:** http://localhost:5173

---

## ✅ Quick Test Flow (5 minutes)

### **1. Test Registration (2 min)**

1. Open: http://localhost:5173/
2. Click **Register**
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Click **Create Account**

**✅ Success if:**
- Green toast appears: "Registration successful! Welcome to PenaltyBox! 🎉"
- Redirected to `/dashboard`
- See welcome message with your name

### **2. Test Logout & Login (1 min)**

1. Click **Logout** button (top right)
2. Green toast: "Logged out successfully"
3. Click **Login**
4. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
5. Click **Login**

**✅ Success if:**
- Green toast: "Login successful! Welcome back! 🎉"
- Back to dashboard with your data

### **3. Test Protected Route (1 min)**

1. Click **Logout**
2. In browser address bar, type: `http://localhost:5173/dashboard`
3. Press Enter

**✅ Success if:**
- Redirected to `/login` page
- Cannot access dashboard without login

### **4. Test Persistent Session (1 min)**

1. Login to your account
2. Refresh page (`F5` or `Cmd+R`)

**✅ Success if:**
- Still logged in
- Dashboard still shows your data
- No need to login again

---

## 🎯 What You Should See

### **Home Page:**
- Blue gradient background
- PenaltyBox title
- Login & Register buttons
- Three feature cards

### **Register Page:**
- Clean form with 4 fields
- Validation hints
- Loading spinner when submitting

### **Login Page:**
- Email & password fields
- Forgot password link
- Links to register and home

### **Dashboard (After Login):**
- Welcome message with YOUR name
- Profile card showing:
  - Your name
  - Your email
  - User ID
- Three stat cards (currently showing 0)
- Logout button

---

## 🐛 Common Issues

**"Login failed"**
→ Make sure backend is running on port 8000

**CORS error**
→ Backend CORS is already configured, restart backend

**"Email already registered"**
→ Use a different email or delete user from database

---

## 🎊 Success Criteria

✅ Can register new account  
✅ Can login with credentials  
✅ Can logout  
✅ Protected routes work  
✅ Session persists on refresh  
✅ Toast notifications appear  
✅ Beautiful UI loads correctly  

---

**If all tests pass, Task 2 is complete! 🎉**

**Ready for Task 3?** Let me know!
