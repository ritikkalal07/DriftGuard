# 🧪 DriftGuard - Testing Guide

This guide will help you test the DriftGuard platform to ensure everything works properly.

---

## ✅ Pre-Testing Checklist

Before testing, ensure you have:
- [ ] Supabase project created
- [ ] SQL schema executed in Supabase
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Both frontend and backend running (`npm run dev`)

---

## 🔍 Manual Testing Steps

### 1. Authentication Testing

#### Test Signup
```
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click "Sign Up"
5. ✅ Should redirect to dashboard
6. ✅ Should see welcome message
```

#### Test Login
```
1. Logout if logged in
2. Click "Login"
3. Enter demo credentials:
   - Email: demo@driftguard.dev
   - Password: demo123
4. Click "Login"
5. ✅ Should redirect to dashboard
6. ✅ Should see user name in header
```

#### Test Logout
```
1. Click user menu in header
2. Click "Logout"
3. ✅ Should redirect to login page
4. ✅ Should clear authentication
```

### 2. Dashboard Testing

```
1. Login with demo credentials
2. View dashboard
3. ✅ Should see statistics cards
4. ✅ Should see recent activity
5. ✅ Should see charts (if data exists)
```

### 3. Project Management Testing

#### Create Project
```
1. Go to "Projects" page
2. Click "New Project"
3. Enter:
   - Name: Test Project
   - Description: Testing DriftGuard
   - Repository URL: https://github.com/test/repo
4. Click "Create"
5. ✅ Should see success message
6. ✅ Should see project in list
```

#### View Project
```
1. Click on a project
2. ✅ Should see project details
3. ✅ Should see project statistics
4. ✅ Should see recent scans
```

#### Edit Project
```
1. Click "Edit" on a project
2. Change name or description
3. Click "Save"
4. ✅ Should see updated information
```

#### Delete Project
```
1. Click "Delete" on a project
2. Confirm deletion
3. ✅ Should remove project from list
```

### 4. Scan Testing

#### Create Scan with Sample Diff
```
1. Go to "New Scan" page
2. Select a project
3. Paste this sample diff:

diff --git a/src/api/users.js b/src/api/users.js
index 1234567..abcdefg 100644
--- a/src/api/users.js
+++ b/src/api/users.js
@@ -10,8 +10,12 @@ export async function getUser(userId) {
   const response = await fetch(`/api/users/${userId}`);
   const data = await response.json();
   return {
-    id: data.id,
-    name: data.name,
-    email: data.email
+    id: data.id,
+    name: data.name,
+    email: data.email,
+    avatar: data.avatar_url,
+    role: data.user_role,
+    createdAt: data.created_at,
+    isActive: data.is_active
   };
 }

4. Click "Start Scan"
5. ✅ Should see success message
6. ✅ Should redirect to reports or show processing
```

#### View Scan Results
```
1. Go to "Reports" page
2. ✅ Should see scan results
3. ✅ Should see drift status
4. ✅ Should see severity scores
```

### 5. Report Testing

#### View Report Details
```
1. Click on a report
2. ✅ Should see changed file
3. ✅ Should see drift explanation
4. ✅ Should see suggested fixes
5. ✅ Should see confidence score
```

#### Accept Suggestion
```
1. Open a report with suggestions
2. Click "Accept" on a suggestion
3. ✅ Should mark as accepted
4. ✅ Should update status
```

#### Reject Suggestion
```
1. Open a report with suggestions
2. Click "Reject" on a suggestion
3. Enter rejection reason
4. ✅ Should mark as rejected
```

#### Copy Suggestion
```
1. Open a report with suggestions
2. Click "Copy" button
3. ✅ Should copy to clipboard
4. ✅ Should show success toast
```

### 6. Settings Testing

#### Update AI Provider
```
1. Go to "Settings" page
2. Change AI Provider
3. Click "Save"
4. ✅ Should save successfully
5. ✅ Should show success message
```

#### Update Drift Sensitivity
```
1. Change drift sensitivity (Low/Medium/High)
2. Click "Save"
3. ✅ Should save successfully
```

#### Reset Settings
```
1. Click "Reset to Defaults"
2. Confirm reset
3. ✅ Should restore default settings
```

### 7. UI/UX Testing

#### Dark Mode
```
1. Click theme toggle in header
2. ✅ Should switch to dark mode
3. ✅ Should persist on page reload
```

#### Responsive Design
```
1. Resize browser window
2. ✅ Should adapt to mobile view
3. ✅ Should show mobile menu
4. ✅ Should be usable on small screens
```

#### Navigation
```
1. Test all navigation links
2. ✅ All pages should load
3. ✅ Back button should work
4. ✅ Breadcrumbs should work
```

---

## 🔧 API Testing

### Using cURL

#### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "DriftGuard API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "database": "Supabase PostgreSQL"
}
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@driftguard.dev","password":"demo123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Projects (with auth)
```bash
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Check Supabase URL and keys in .env
- Verify Supabase project is active
- Check network connection

### Issue: "Invalid token"
**Solution:**
- Clear localStorage
- Login again
- Check JWT_SECRET matches

### Issue: "CORS error"
**Solution:**
- Check FRONTEND_URL in backend .env
- Verify backend is running on port 5000
- Check CORS configuration in server.js

### Issue: "Module not found"
**Solution:**
- Run `npm run install:all`
- Delete node_modules and reinstall
- Check import paths

### Issue: "Port already in use"
**Solution:**
- Kill process on port 5000 or 5173
- Change PORT in .env
- Restart servers

---

## ✅ Testing Checklist

### Authentication
- [ ] Signup works
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes work
- [ ] Token refresh works

### Projects
- [ ] Create project
- [ ] View projects list
- [ ] View project details
- [ ] Edit project
- [ ] Delete project

### Scans
- [ ] Create scan
- [ ] View scans list
- [ ] View scan details
- [ ] Delete scan
- [ ] Scan processes correctly

### Reports
- [ ] View reports list
- [ ] View report details
- [ ] Filter reports
- [ ] Update report status
- [ ] Delete report

### Suggestions
- [ ] View suggestions
- [ ] Accept suggestion
- [ ] Reject suggestion
- [ ] Copy suggestion
- [ ] Delete suggestion

### Dashboard
- [ ] View statistics
- [ ] View recent activity
- [ ] View charts
- [ ] All data loads correctly

### Settings
- [ ] View settings
- [ ] Update settings
- [ ] Reset settings
- [ ] Settings persist

### UI/UX
- [ ] Dark mode works
- [ ] Responsive design works
- [ ] Navigation works
- [ ] Forms validate
- [ ] Error messages show
- [ ] Success messages show
- [ ] Loading states show

---

## 📊 Performance Testing

### Load Time
```
1. Open browser DevTools
2. Go to Network tab
3. Load dashboard
4. ✅ Should load in < 2 seconds
5. ✅ API calls should complete in < 500ms
```

### Memory Usage
```
1. Open browser DevTools
2. Go to Performance tab
3. Record session
4. Navigate through pages
5. ✅ No memory leaks
6. ✅ Smooth animations
```

---

## 🔒 Security Testing

### Authentication
- [ ] Cannot access protected routes without login
- [ ] Token expires correctly
- [ ] Password is hashed
- [ ] SQL injection prevented

### Authorization
- [ ] Users can only see their own data
- [ ] Cannot access other users' projects
- [ ] Cannot modify other users' data

### Input Validation
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] XSS prevention works
- [ ] Form validation works

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Environment: Local / Staging / Production

Authentication: ✅ / ❌
Projects: ✅ / ❌
Scans: ✅ / ❌
Reports: ✅ / ❌
Suggestions: ✅ / ❌
Dashboard: ✅ / ❌
Settings: ✅ / ❌
UI/UX: ✅ / ❌

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
```

---

## 🎯 Success Criteria

The platform is ready for deployment when:
- ✅ All authentication flows work
- ✅ All CRUD operations work
- ✅ Drift detection processes correctly
- ✅ AI suggestions generate properly
- ✅ No console errors
- ✅ No broken links
- ✅ Responsive design works
- ✅ Dark mode works
- ✅ All API endpoints respond correctly
- ✅ Database operations complete successfully

---

**Happy Testing! 🧪**