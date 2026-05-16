# 🚀 DriftGuard - Quick Start Guide

Get DriftGuard running in **5 minutes** locally or **15 minutes** on Vercel.

---

## 🏃 Local Development (5 minutes)

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally OR MongoDB Atlas account

### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd DriftGuard
npm run install:all
```

### Step 2: Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
# Minimum required:
MONGODB_URI=mongodb://localhost:27017/driftguard
JWT_SECRET=your-secret-key-here
```

### Step 3: Seed Demo Data
```bash
npm run seed
```

### Step 4: Start Development Servers
```bash
npm run dev
```

**That's it!** Open http://localhost:5173

**Demo Login:**
- Email: `demo@driftguard.dev`
- Password: `demo123`

---

## ☁️ Vercel Deployment (15 minutes)

### Step 1: MongoDB Atlas Setup (5 min)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user: `driftguard` / `<password>`
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string:
   ```
   mongodb+srv://driftguard:<password>@cluster0.xxxxx.mongodb.net/driftguard
   ```

### Step 2: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/driftguard.git
git push -u origin main
```

### Step 3: Deploy to Vercel (5 min)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework:** Vite
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`

4. Add Environment Variables:
   ```env
   MONGODB_URI=mongodb+srv://driftguard:<password>@cluster0.xxxxx.mongodb.net/driftguard
   JWT_SECRET=generate-random-32-char-string
   NODE_ENV=production
   AI_PROVIDER=mock
   ```

5. Click **Deploy**

### Step 4: Update Frontend URL (2 min)
1. After deployment, copy your Vercel URL
2. Go to **Settings** → **Environment Variables**
3. Add: `FRONTEND_URL=https://your-app.vercel.app`
4. Redeploy

### Step 5: Seed Production Data (1 min)
```bash
# Install Vercel CLI
npm install -g vercel

# Login and link
vercel login
vercel link

# Pull env vars and seed
vercel env pull .env.local
cd backend
node scripts/seed.js
```

**Done!** Visit your Vercel URL and login with demo credentials.

---

## 📱 Using DriftGuard

### 1. Create a Project
- Click **"New Project"**
- Enter project name and description
- Save

### 2. Run a Scan
- Click **"New Scan"**
- Select your project
- Paste a git diff or upload a file
- Click **"Start Scan"**

### 3. Review Drift Reports
- View detected drift in **Reports** page
- See severity scores and explanations
- Review AI-generated documentation fixes

### 4. Accept Suggestions
- Open a report
- Review suggested documentation updates
- Click **"Accept"** to approve
- Copy or download the patch

---

## 🎯 Sample Git Diff for Testing

Use this sample diff to test the platform:

```diff
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
```

This will detect that your API documentation needs updating to reflect the new response fields.

---

## 🔧 Configuration Options

### AI Provider Settings
Go to **Settings** → **AI Provider**:
- **Mock Provider**: Works out of the box, no API key needed
- **Custom Provider**: Add your own AI endpoint
- **IBM watsonx**: Configure watsonx Code Assistant

### Drift Sensitivity
Adjust how strict drift detection is:
- **Low**: Only flag obvious mismatches
- **Medium**: Balanced detection (default)
- **High**: Flag any potential drift

### File Patterns
Ignore certain files from scanning:
```
node_modules/**
dist/**
*.test.js
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check MongoDB connection string
- Verify IP whitelist includes `0.0.0.0/0`
- Ensure database user has read/write permissions

### "API routes return 404"
- Verify `vercel.json` is in root directory
- Check environment variables are set
- Redeploy after configuration changes

### "Frontend shows blank page"
- Check browser console for errors
- Verify API URL in frontend config
- Clear browser cache and reload

### "JWT token errors"
- Ensure `JWT_SECRET` is set in environment
- Clear localStorage and login again
- Check token expiration settings

---

## 📊 What to Expect

After setup, you'll have:

✅ **Dashboard** with scan statistics  
✅ **Project Management** for organizing repos  
✅ **Drift Detection** with AI analysis  
✅ **Report Viewer** with detailed explanations  
✅ **Suggestion Engine** for doc updates  
✅ **Export Features** for patches and PDFs  

---

## 🎓 Next Steps

1. **Customize Branding**: Update colors in `tailwind.config.js`
2. **Add Real AI**: Configure IBM watsonx or OpenAI
3. **GitHub Integration**: Connect to real repositories
4. **Team Features**: Add collaboration and comments
5. **CI/CD**: Set up automated scanning on PR

---

## 💡 Pro Tips

- Use the **demo account** to explore features
- Test with **real git diffs** from your projects
- Adjust **drift sensitivity** based on your needs
- Export reports as **markdown** for documentation
- Use **dark mode** for late-night coding sessions

---

## 📚 Resources

- [Full Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Reference](./API.md)
- [Architecture Overview](./ARCHITECTURE.md)

---

## 🆘 Need Help?

- Check the [Troubleshooting](#-troubleshooting) section
- Review [GitHub Issues](https://github.com/yourusername/driftguard/issues)
- Join [Vercel Discord](https://vercel.com/discord)

---

**Total Setup Time:**
- Local: ~5 minutes
- Vercel: ~15 minutes
- Cost: $0 (Free tier)

🎉 **Happy drift detecting!**