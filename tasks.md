# PenaltyBox UI - Development Task List

> **Project Overview:** Building a React.js frontend for the PenaltyBox web application - a penalty management system for groups and their members.

---

## 📋 Task Breakdown

### **Phase 1: Foundation**

#### ✅ Task 1: Project Setup & Configuration
**Status:** ✅ COMPLETED (January 3, 2026)

**Objectives:**
- Initialize React app using Vite (faster development and build)
- Install core dependencies:
  - React Router DOM (for navigation)
  - Axios (for API calls)
  - TailwindCSS (for styling)
  - React Hook Form (for form management)
  - React Icons (for UI icons)
- Configure environment variables for API base URL
- Set up project folder structure:
  ```
  src/
    ├── components/     # Reusable UI components
    ├── pages/          # Page components
    ├── services/       # API service functions
    ├── context/        # React context providers
    ├── utils/          # Helper functions
    ├── hooks/          # Custom React hooks
    └── assets/         # Images, fonts, etc.
  ```

**Deliverables:**
- Running React app on localhost
- Basic routing setup
- API service configuration
- Responsive base layout

**Testing:**
- Verify app runs on `npm run dev`
- Check hot-reload functionality
- Confirm API base URL is configurable

---

#### ✅ Task 2: Authentication System
**Status:** ✅ COMPLETED (January 3, 2026)

**Objectives:**
- Create Login page (`/login`)
  - Email and password fields
  - Form validation
  - Error handling
- Create Register page (`/register`)
  - Name, email, password fields
  - Password confirmation
  - Form validation
- Implement JWT token management:
  - Store token in localStorage
  - Create auth context/provider
  - Auto-login if token exists
- Create Protected Route wrapper
  - Redirect to login if not authenticated
  - Verify token validity
- Add logout functionality
- Implement Axios interceptor:
  - Automatically add Bearer token to requests
  - Handle 401 responses (redirect to login)

**API Endpoints:**
- `POST /auth/register`
- `POST /auth/login`

**Deliverables:**
- Functional login/register flow
- Token persistence across page refreshes
- Protected routes working
- Logout functionality

**Testing:**
- Register a new user
- Login with credentials
- Verify token is attached to API requests
- Test logout
- Try accessing protected pages without login

---

#### ✅ Task 3: Layout & Navigation
**Status:** ✅ COMPLETED (January 4, 2026)

**Objectives:**
- Create main Layout component
  - Header with logo and user menu
  - Navigation bar/sidebar
  - Main content area
  - Footer
- Implement navigation menu with links:
  - Home/Dashboard
  - Groups
  - Leaderboard
  - My Penalties
  - Profile
- Add responsive design:
  - Desktop: sidebar navigation
  - Mobile: hamburger menu
- Create Breadcrumbs component for better navigation
- Add user dropdown menu (Profile, Logout)

**Deliverables:**
- Consistent layout across all pages
- Working navigation
- Responsive menu for mobile
- User-friendly navigation experience

**Testing:**
- Navigate between all pages
- Test responsive behavior on mobile
- Verify active link highlighting
- Test user dropdown menu

---

### **Phase 2: Core Features**

#### ✅ Task 4: Groups Management - List & Create
**Status:** ✅ COMPLETED (January 5, 2026)

**Objectives:**
- Create Groups listing page (`/groups`)
  - Display all groups in card/list format
  - Show group name and member count
  - Add search/filter functionality
- Create "Create Group" button and modal
  - Form with group name field
  - Validation
  - Success/error feedback
- Implement API integration:
  - GET /groups (fetch all groups)
  - POST /groups (create new group)
- Add loading states (skeleton/spinner)
- Add error handling and empty states

**Additional Features Implemented:**
- Group Details page with full member management
- Add/Remove member functionality (admin only)
- Role-based permissions (admin vs member)
- Many-to-many user-group relationships
- User search and selection
- Crown/star icons for admins

**API Endpoints:**
- `GET /groups`
- `POST /groups`
- `GET /groups/:id`
- `POST /groups/:id/members`
- `DELETE /groups/:id/members`
- `GET /users`

**Deliverables:**
- Groups listing page with all groups
- Working create group functionality
- Group details page with member list
- Add/remove member modals
- Proper loading and error states
- Permission-based UI controls

**Testing:**
- ✅ View all groups
- ✅ Create a new group (admin only)
- ✅ View group details with members
- ✅ Add members to group (admin only)
- ✅ Remove members from group (admin only)
- ✅ Test with regular user (no create/modify access)
- ✅ Test error scenarios
- ✅ Tested on local and production

---

#### ✅ Task 5: Group Details Page - Rules & Penalties Integration
**Status:** ✅ COMPLETED (January 5, 2026)

**Note:** Group details page with members management was completed in Task 4. This task focused on adding Rules and Penalties integration via tabbed interface.

**Completed in Task 4:**
- ✅ Group Detail page (`/groups/:id`)
- ✅ Display group information (name, description, dates)
- ✅ Members tab with full member list
- ✅ Add/Remove member functionality
- ✅ Role-based access controls

**Completed in Task 5:**
- ✅ Tabbed interface for better organization:
  - **Members Tab:** Full member management with stats
  - **Rules Tab:** Display group-specific rules with formatting
  - **Penalties Tab:** Show penalties for this group with status badges
  - **Leaderboard Tab:** Group-specific leaderboard with rankings
- ✅ Integrated Rules display with formatCurrency helper
- ✅ Integrated Penalties display with status badges (PAID/UNPAID)
- ✅ Integrated Leaderboard with medals (🥇🥈🥉) for top 3
- ✅ Added loading states for each tab
- ✅ Added empty states with helpful messages
- ✅ Tab navigation with count badges
- ✅ Responsive design for all tabs

**API Endpoints:**
- ✅ `GET /groups/{id}/rules` - Get rules for a group
- ✅ `GET /penalties?group_id={id}` - Get penalties for a group  
- ✅ `GET /groups/{id}/leaderboard` - Get group leaderboard

**Deliverables:**
- ✅ Tabbed interface in group details
- ✅ Rules list displayed in Rules tab
- ✅ Recent penalties in Penalties tab with status
- ✅ Group leaderboard in Leaderboard tab with rankings
- ✅ Proper loading and empty states for all tabs
- ✅ Count badges on tabs
- ✅ Currency formatting for amounts
- ✅ Date formatting for timestamps

**Testing:**
- ✅ Navigate to group details
- ✅ Switch between tabs
- ✅ View members (already working from Task 4)
- ✅ View rules for the group (empty state working)
- ✅ View penalties for the group (empty state working)
- ✅ View group-specific leaderboard (empty state working)
- 🔄 Test with actual data (to be done when rules/penalties are created)

**Future Enhancements (for later tasks):**
- Add "Create Rule" button in Rules tab (admin only)
- Add "Issue Penalty" button in Penalties tab (admin only)

---

#### ✅ Task 6: Rules Management
**Status:** ✅ COMPLETED (January 5, 2026)

**Objectives:**
- ✅ Create Rules section in Group Details
- ✅ Build "Add Rule" form/modal:
  - ✅ Rule title field
  - ✅ Penalty amount field
  - ✅ Validation (amount must be positive)
- ✅ Display rules list with:
  - ✅ Rule title
  - ✅ Penalty amount
  - ✅ Edit/Delete options
- ✅ Implement API integration for CRUD operations

**Implementation Details:**

**Backend Updates:**
- ✅ Added `RuleUpdate` schema in schemas.py
- ✅ Created PUT `/groups/{group_id}/rules/{rule_id}` endpoint for updating rules
- ✅ All endpoints restricted to global admins (is_admin=true)
- ✅ Proper validation and error handling

**Frontend Components Created:**
- ✅ `CreateRuleModal.jsx` - Create new rules with validation
- ✅ `EditRuleModal.jsx` - Edit existing rules
- ✅ `DeleteRuleModal.jsx` - Delete confirmation with warnings

**Frontend Features:**
- ✅ "Create Rule" button in Rules tab (admin only)
- ✅ Empty state with "Create First Rule" button
- ✅ Edit/Delete buttons on each rule card (admin only)
- ✅ Form validation:
  - Title must be at least 3 characters
  - Amount must be positive number
- ✅ Currency formatting for display
- ✅ Date formatting for created_at
- ✅ Success/error toast notifications
- ✅ Loading states during API calls
- ✅ Proper error handling

**API Endpoints:**
- ✅ `POST /groups/{id}/rules` (create rule)
- ✅ `PUT /groups/{id}/rules/{rule_id}` (update rule)
- ✅ `DELETE /groups/{id}/rules/{rule_id}` (delete rule)
- ✅ `GET /groups/{id}/rules` (list rules)

**Permission Controls:**
- ✅ Only global admins (is_admin=true) can create rules
- ✅ Only global admins can edit rules
- ✅ Only global admins can delete rules
- ✅ All authenticated users can view rules
- ✅ UI buttons conditionally rendered based on user.is_admin

**Deliverables:**
- ✅ Add rule functionality working
- ✅ Rules list with edit/delete working
- ✅ Form validation working
- ✅ Success/error notifications working
- ✅ Responsive design
- ✅ Proper loading and error states

**Testing:**
- ✅ Create new rules
- ✅ Edit existing rules
- ✅ Delete rules
- ✅ Validate amount field (only positive numbers)
- ✅ Validate title field (minimum 3 characters)
- ✅ Test as admin user (all features available)
- ✅ Test as regular user (read-only, no buttons)
- ✅ Test empty state
- ✅ Test error scenarios
- ✅ Verify currency formatting
- ✅ Verify date formatting

**Files Modified:**
- Backend:
  - `app/schemas/schemas.py` - Added RuleUpdate schema
  - `app/api/v1/rules.py` - Added PUT endpoint
- Frontend:
  - `src/components/CreateRuleModal.jsx` - New file
  - `src/components/EditRuleModal.jsx` - New file
  - `src/components/DeleteRuleModal.jsx` - New file
  - `src/pages/Rules.jsx` - Complete rules management page
  - `src/pages/groups/GroupDetails.jsx` - Integrated rule management in Rules tab

**Pages Implemented:**

**1. Rules Page (`/rules`):**
- ✅ Overview dashboard with stats (total rules, total groups)
- ✅ Filter by group dropdown
- ✅ Search by rule title or group name
- ✅ Rules grouped by group name
- ✅ Quick actions:
  - Create rule for any group (admin only)
  - Edit any rule (admin only)
  - Delete any rule (admin only)
  - Navigate to group details
- ✅ Empty states for no rules or no search results
- ✅ Responsive design
- ✅ Permission-based UI (admin vs regular user)

**2. Group Details - Rules Tab (`/groups/:id`):**
- ✅ Create Rule button (top of tab, admin only)
- ✅ Create First Rule button (empty state, admin only)
- ✅ Edit/Delete buttons on each rule card (admin only)
- ✅ Enhanced rule cards with formatted display
- ✅ Tab count badge updates automatically

---

#### ✅ Task 7: Penalty Issuance (Admin)
**Status:** Not Started

**Objectives:**
- Create "Issue Penalty" modal/form
- Implement form fields:
  - User dropdown (select from group members)
  - Rule dropdown (select from group rules)
  - Custom amount (optional override)
  - Note/Reason field
- Add validation
- Integrate API call
- Show success notification
- Refresh penalties list after issuance

**API Endpoints:**
- `POST /groups/{id}/penalties`

**Deliverables:**
- Working penalty issuance flow
- User and rule selection
- Custom amount override
- Success notifications
- Auto-refresh penalty list

**Testing:**
- Issue penalty to a user
- Use rule amount vs custom amount
- Verify penalty appears in list
- Test validation errors
- Check notifications

---

### **Phase 3: User Features**

#### ✅ Task 8: My Penalties Page (User View)
**Status:** Not Started

**Objectives:**
- Create "My Penalties" page (`/my-penalties`)
- Display user's penalties in table/card format:
  - Rule name
  - Amount
  - Status (PAID/UNPAID)
  - Issue date
  - Note/Reason
- Implement filters:
  - All penalties
  - Unpaid only
  - Paid only
- Show summary statistics:
  - Total paid amount
  - Total due amount
  - Number of penalties
- Add "Upload Proof" button for unpaid penalties
- Integrate API call

**API Endpoints:**
- `GET /users/{user_id}/penalties`

**Deliverables:**
- Penalties page with user's data
- Working filters
- Summary statistics
- Upload proof button

**Testing:**
- View all penalties
- Filter by status
- Verify correct totals
- Test with no penalties (empty state)

---

#### ✅ Task 9: Proof Upload & Management
**Status:** Not Started

**Objectives:**
- Create proof upload form/modal
- Implement file input:
  - Accept image files only (jpg, png)
  - Add image preview before upload
  - Implement drag-and-drop functionality
- Add note/reference field (e.g., UPI transaction ID)
- Integrate multipart/form-data API call
- Show uploaded proofs:
  - Image thumbnail
  - Upload date
  - Status (PENDING/APPROVED/DECLINED)
  - Admin note (if declined)
- Display proof list for each penalty

**API Endpoints:**
- `POST /proofs` (upload proof)
- `GET /proofs?penalty_id={id}` (get proofs for penalty)

**Deliverables:**
- Working file upload with preview
- Drag-and-drop functionality
- Proof list display
- Status indicators

**Testing:**
- Upload proof image
- Drag and drop file
- View uploaded proofs
- Check file type validation
- Test status display

---

#### ✅ Task 10: Proof Review (Admin)
**Status:** Not Started

**Objectives:**
- Create admin proof review page/section
- Display pending proofs:
  - User name
  - Penalty details
  - Uploaded image (with zoom)
  - Note from user
- Build review modal:
  - Large image preview
  - Approve/Decline buttons
  - Admin note field (optional)
- Integrate review API
- Update proof status after review
- Show review history (who reviewed, when, outcome)

**API Endpoints:**
- `GET /proofs?status=PENDING` (get all pending proofs)
- `POST /proofs/{proof_id}/review` (approve/decline)

**Deliverables:**
- Admin proof review interface
- Image zoom functionality
- Approve/decline working
- Review history display

**Testing:**
- View pending proofs
- Approve a proof
- Decline a proof with note
- Verify status updates
- Check penalty status changes

---

#### ✅ Task 11: Leaderboard Page
**Status:** Not Started

**Objectives:**
- Create Leaderboard page (`/leaderboard`)
- Display ranked list of users:
  - Rank number
  - User name
  - Total paid amount
  - User avatar/initial
- Implement podium view for top 3:
  - Special styling for 1st, 2nd, 3rd place
  - Medal/trophy icons
- Highlight current user's rank
- Add filter by group (optional)
- Make it visually appealing

**API Endpoints:**
- `GET /leaderboard`

**Deliverables:**
- Leaderboard page with rankings
- Podium view for top 3
- Current user highlighted
- Responsive design

**Testing:**
- View leaderboard
- Verify correct ranking
- Check current user highlight
- Test with different data sizes
- Verify responsive layout

---

#### ✅ Task 12: User Dashboard & Profile
**Status:** Not Started

**Objectives:**
- Create User Dashboard/Home page (`/`)
  - Summary cards:
    - Total penalties paid
    - Pending dues
    - Current rank
    - Groups joined
  - Recent activity feed
  - Quick action buttons
- Create Profile page (`/profile`)
  - User details (name, email)
  - Edit profile functionality
  - Change password option
  - Payment history section
- Integrate APIs for dashboard data

**API Endpoints:**
- `GET /users/{user_id}` (user profile)
- `GET /users/{user_id}/penalties` (for summary)
- `GET /payments/{user_id}` (payment history)

**Deliverables:**
- Dashboard with summary stats
- Recent activity feed
- Profile page with edit functionality
- Payment history

**Testing:**
- View dashboard
- Verify all statistics
- Edit profile
- View payment history
- Test quick actions

---

### **Phase 4: Polish & Deploy**

#### ✅ Task 13: Notifications & Feedback
**Status:** Not Started

**Objectives:**
- Implement toast notification system:
  - Success messages (green)
  - Error messages (red)
  - Info messages (blue)
  - Auto-dismiss after 3-5 seconds
- Add loading states:
  - Spinners for actions
  - Skeleton screens for page loads
  - Progress bars for uploads
- Create empty state components:
  - No groups
  - No penalties
  - No proofs
- Add confirmation dialogs:
  - Delete confirmations
  - Decline proof confirmation
  - Issue penalty confirmation
- Implement form validation feedback:
  - Real-time validation
  - Error messages
  - Success indicators

**Deliverables:**
- Toast notification system
- Loading indicators
- Empty states
- Confirmation dialogs
- Form validation feedback

**Testing:**
- Trigger success/error notifications
- Test loading states
- View empty states
- Test confirmation dialogs
- Validate all forms

---

#### ✅ Task 14: Responsive Design & Polish
**Status:** Not Started

**Objectives:**
- Ensure mobile responsiveness:
  - Test on mobile devices (320px - 768px)
  - Test on tablets (768px - 1024px)
  - Test on desktop (1024px+)
- Optimize UI/UX:
  - Consistent spacing and typography
  - Proper color scheme
  - Accessible contrast ratios
  - Smooth transitions
- Add animations:
  - Page transitions
  - Modal animations
  - Hover effects
  - Loading animations
- Implement dark/light mode toggle (optional)
- Optimize assets:
  - Compress images
  - Lazy load images
  - Code splitting

**Deliverables:**
- Fully responsive design
- Polished UI with animations
- Optimized performance
- Dark mode (optional)

**Testing:**
- Test on multiple screen sizes
- Check all animations
- Verify performance
- Test dark mode toggle
- Validate accessibility

---

#### ✅ Task 15: Testing & Deployment Setup
**Status:** Not Started

**Objectives:**
- End-to-end testing:
  - Test all user flows
  - Test admin flows
  - Test edge cases
  - Fix bugs and issues
- Add error boundary components:
  - Catch React errors
  - Display fallback UI
  - Log errors
- Create production build:
  - Optimize build configuration
  - Set up environment variables
  - Configure API endpoints for production
- Deploy to Vercel/Netlify:
  - Connect GitHub repository
  - Configure build settings
  - Set environment variables
  - Configure custom domain (if needed)
- Write deployment documentation:
  - Setup instructions
  - Environment variables guide
  - Deployment process

**Deliverables:**
- Fully tested application
- Error boundaries implemented
- Production build configuration
- Deployed application
- Deployment documentation

**Testing:**
- Complete user journey testing
- Test production build locally
- Verify production deployment
- Test on deployed URL
- Check all features in production

---

## 🎯 Progress Tracking

- **Total Tasks:** 15
- **Completed:** 2
- **In Progress:** 0
- **Not Started:** 13

---

## 📝 Notes

- Each task should be completed and tested before moving to the next
- After each task, run the app on localhost to verify functionality
- Make commits after each task completion
- Document any issues or blockers
- Update this file as you progress

---

## 🔗 Related Files

- Backend API: `/Users/souravsingh/Documents/coding/penaltybox`
- API Documentation: `penaltybox/API_SPECIFICATIONS.md`
- Technical Specs: `penaltybox/TECHNICAL_DOCUMENT.md`
- README: `penaltybox_ui/README.md`

---

**Last Updated:** January 3, 2026
