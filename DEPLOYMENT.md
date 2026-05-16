# 🚀 DriftGuard - Vercel Deployment Guide

This guide will help you deploy DriftGuard to Vercel in minutes.

---

## 📋 Prerequisites

1. **GitHub Account** - To host your repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - Free tier at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Free)

### 1.1 Create MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **"FREE"** tier (M0 Sandbox)
5. Select a cloud provider and region (closest to you)
6. Click **"Create Cluster"**

### 1.2 Configure Database Access
1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `driftguard`
5. Password: Generate a secure password (save it!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 1.3 Configure Network Access
1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String
1. Go to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `driftguard`

Example:
```
mongodb+srv://driftguard:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/driftguard?retryWrites=true&w=majority
```

---

## 📦 Step 2: Push to GitHub

### 2.1 Initialize Git Repository
```bash
cd DriftGuard
git init
git add .
git commit -m "Initial commit - DriftGuard platform"
```

### 2.2 Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `driftguard`
3. Make it **Public** or **Private**
4. Don't initialize with README (we already have one)
5. Click **"Create repository"**

### 2.3 Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/driftguard.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **driftguard** repository
4. Click **"Import"**

### 3.2 Configure Project
1. **Framework Preset:** Vite
2. **Root Directory:** `./` (leave as is)
3. **Build Command:** `cd frontend && npm install && npm run build`
4. **Output Directory:** `frontend/dist`
5. **Install Command:** `npm install`

### 3.3 Add Environment Variables
Click **"Environment Variables"** and add:

```env
# Required
MONGODB_URI=mongodb+srv://driftguard:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/driftguard?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
NODE_ENV=production

# Optional
AI_PROVIDER=mock
FRONTEND_URL=https://your-app.vercel.app
```

**Important:** 
- Replace `YOUR_PASSWORD` with your MongoDB password
- Generate a random JWT_SECRET (use a password generator)
- `FRONTEND_URL` will be provided after first deployment

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://driftguard-xxxxx.vercel.app`

---

## 🔧 Step 4: Update Frontend URL

### 4.1 Update Environment Variable
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Update `FRONTEND_URL` with your actual Vercel URL
4. Click **"Save"**

### 4.2 Redeploy
1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

---

## 🌱 Step 5: Seed Demo Data (Optional)

### 5.1 Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Run seed script
vercel env pull .env.local
cd backend
node scripts/seed.js
```

### 5.2 Or Manually Create Demo User
1. Go to your deployed app
2. Click **"Sign Up"**
3. Create an account
4. Start using the platform!

---

## ✅ Step 6: Verify Deployment

### 6.1 Test the Application
1. Visit your Vercel URL
2. Click **"Demo Login"** or sign up
3. Create a project
4. Run a scan with sample diff
5. View drift reports

### 6.2 Check API Health
Visit: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "success": true,
  "message": "DriftGuard API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔒 Security Best Practices

### Environment Variables
✅ Never commit `.env` files  
✅ Use strong JWT_SECRET (32+ characters)  
✅ Rotate secrets regularly  
✅ Use MongoDB Atlas IP whitelist in production  

### MongoDB
✅ Use strong database passwords  
✅ Enable MongoDB Atlas backup  
✅ Monitor database usage  
✅ Set up alerts for unusual activity  

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
- Check MongoDB connection string
- Verify IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

### Issue: "API routes not working"
**Solution:**
- Check `vercel.json` configuration
- Verify environment variables are set
- Check Vercel function logs

### Issue: "Frontend shows blank page"
**Solution:**
- Check browser console for errors
- Verify `VITE_API_URL` points to correct API
- Clear browser cache and reload

### Issue: "JWT token errors"
**Solution:**
- Ensure `JWT_SECRET` is set in Vercel
- Check token expiration settings
- Clear localStorage and login again

---

## 📊 Monitoring & Logs

### View Logs
1. Go to Vercel dashboard
2. Click **"Deployments"**
3. Click on a deployment
4. Click **"Functions"** tab
5. View real-time logs

### Monitor Performance
1. Go to **"Analytics"** tab
2. View page views, response times
3. Check error rates

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys!
```

---

## 💰 Cost Estimation

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Automatic HTTPS
- ✅ Custom domains

### MongoDB Atlas Free Tier:
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Perfect for demos and small projects

**Total Cost: $0/month** for hobby projects!

---

## 🚀 Production Checklist

Before going to production:

- [ ] Set up custom domain
- [ ] Enable MongoDB backups
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Add analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Create backup strategy
- [ ] Document API endpoints
- [ ] Set up CI/CD tests
- [ ] Configure CORS properly

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

## 🆘 Need Help?

- Check [GitHub Issues](https://github.com/yourusername/driftguard/issues)
- Join [Vercel Discord](https://vercel.com/discord)
- MongoDB [Community Forums](https://www.mongodb.com/community/forums/)

---

## 🎉 Success!

Your DriftGuard platform is now live and accessible worldwide!

**Share your deployment:**
- Tweet about it
- Add to your portfolio
- Share with your team

**Next Steps:**
- Customize branding
- Add more features
- Integrate with GitHub
- Set up webhooks

---

**Deployment Time:** ~15 minutes  
**Cost:** $0 (Free tier)  
**Scalability:** Automatic  
**HTTPS:** Included  
**Global CDN:** Included  

🎯 **Your documentation drift detector is now live!**