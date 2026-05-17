# 🛡️ DriftGuard - AI Documentation Drift Detector

**Detect outdated docs before they confuse your team.**

DriftGuard is a full-stack AI-powered platform that automatically detects when code changes make documentation outdated, missing, or misleading. It scans git diffs, analyzes code-to-documentation relationships, assigns drift scores, and generates AI-powered documentation updates.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/driftguard)

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Database](https://img.shields.io/badge/database-Supabase-green)

---

## 🚀 Quick Start

**Get started in 10 minutes:**

### 1. Set Up Supabase (5 minutes)
```bash
1. Go to supabase.com and create a free account
2. Create new project: "driftguard"
3. Go to SQL Editor
4. Copy and run: backend/database/schema.sql
5. Get your Project URL and API keys from Settings > API
```

### 2. Clone and Configure (3 minutes)
```bash
# Clone repository
git clone <your-repo-url>
cd DriftGuard

# Install dependencies
npm run install:all

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Run Locally (2 minutes)
```bash
# Start both frontend and backend
npm run dev

# Open browser
http://localhost:5173
```

### 4. Login
```
Email: demo@driftguard.dev
Password: demo123
```

📖 **[Detailed Setup Guide →](./SUPABASE_SETUP.md)**  
☁️ **[Deploy to Vercel →](./DEPLOYMENT.md)**  
⚡ **[Quick Start Guide →](./QUICKSTART.md)**

---

## 🌟 Features

### Core Capabilities
- ✅ **Automated Drift Detection** - Scans git diffs and identifies outdated documentation
- 🤖 **AI-Powered Analysis** - Uses intelligent heuristics and AI to detect drift patterns
- 📊 **Drift Scoring** - Assigns severity and confidence scores to each drift report
- 💡 **Smart Suggestions** - Generates updated documentation patches automatically
- 📝 **Multiple Doc Types** - Supports README, API docs, inline comments, and guides
- 🔍 **PR Review Assistant** - Generates reviewer comments for pull requests
- 📈 **Analytics Dashboard** - Track documentation health over time
- 🎨 **Modern UI** - Clean, responsive interface with dark mode support
- ☁️ **Vercel Ready** - Deploy to production in 15 minutes
- 🗄️ **Supabase PostgreSQL** - Powerful, scalable database with free tier

### Drift Detection Types
- **README Drift** - Detects when README content doesn't match code changes
- **API Documentation Drift** - Identifies outdated API endpoint documentation
- **Inline Comment Drift** - Finds functions/classes with missing or outdated comments
- **Setup Guide Drift** - Catches installation/configuration changes
- **Missing Documentation** - Flags new code without any documentation

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- React Hot Toast for notifications

**Backend:**
- Node.js + Express
- Supabase PostgreSQL
- JWT authentication
- RESTful API architecture
- ES6 modules

**Database:**
- Supabase PostgreSQL
- Row Level Security (RLS)
- JSONB for flexible data
- Automatic timestamps
- Cascade deletes

**AI Layer:**
- Modular AI service architecture
- Mock AI Provider (default, no API key needed)
- Pluggable for IBM watsonx, OpenAI, or custom providers

### Project Structure

```
DriftGuard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (8 pages)
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express API server
│   ├── src/
│   │   ├── config/          # Supabase configuration
│   │   ├── controllers/     # Request handlers (7 controllers)
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes (7 route files)
│   │   ├── services/        # Business logic
│   │   │   ├── ai/         # AI providers (Mock, pluggable)
│   │   │   ├── drift/      # Drift detection engine
│   │   │   ├── parser/     # Git diff parser
│   │   │   └── matcher/    # Documentation matcher
│   │   └── utils/           # Helper utilities
│   ├── database/
│   │   └── schema.sql       # Supabase PostgreSQL schema
│   └── package.json
│
├── api/
│   └── index.js             # Vercel serverless entry point
│
├── vercel.json              # Vercel deployment config
├── package.json             # Root package with unified scripts
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── .vercelignore            # Vercel deployment optimization
│
├── README.md                # This file
├── SUPABASE_SETUP.md        # Database setup guide (5 min)
├── DEPLOYMENT.md            # Vercel deployment guide (15 min)
└── QUICKSTART.md            # Quick start guide (5 min)
```

---

## 📊 Database Schema

### Tables (6 total)

| Table | Description | Key Features |
|-------|-------------|--------------|
| `users` | User accounts | Auth, profiles |
| `projects` | Git repositories | Project metadata |
| `scans` | Drift detection scans | Scan results, stats |
| `drift_reports` | Individual drift reports | File-level analysis |
| `suggestions` | AI-generated fixes | Doc updates |
| `settings` | User preferences | AI config, themes |

### Security Features
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ User-scoped data access
- ✅ Secure password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Automatic timestamps
- ✅ Cascade deletes for data integrity

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/scans` - Get project scans

### Scans
- `GET /api/scans` - List all scans
- `GET /api/scans/:id` - Get scan details
- `POST /api/scans` - Create and run new scan
- `DELETE /api/scans/:id` - Delete scan
- `GET /api/scans/:id/reports` - Get scan reports

### Reports
- `GET /api/reports` - List all drift reports
- `GET /api/reports/:id` - Get report details
- `PATCH /api/reports/:id` - Update report status
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/:id/suggestions` - Get report suggestions
- `GET /api/reports/project/:projectId` - Get reports by project

### Suggestions
- `GET /api/suggestions` - List all suggestions
- `GET /api/suggestions/:id` - Get suggestion details
- `POST /api/suggestions/:id/accept` - Accept suggestion
- `POST /api/suggestions/:id/reject` - Reject suggestion
- `DELETE /api/suggestions/:id` - Delete suggestion
- `GET /api/suggestions/report/:reportId` - Get suggestions by report

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity
- `GET /api/dashboard/charts` - Get chart data

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `POST /api/settings/reset` - Reset to defaults

---

## 🎨 Pages

1. **Login/Signup** - User authentication
2. **Dashboard** - Analytics, stats, recent activity
3. **Projects** - Project management (CRUD)
4. **Project Detail** - Individual project view with stats
5. **New Scan** - Submit git diffs for analysis
6. **Reports** - List all drift reports with filters
7. **Report Detail** - Detailed drift analysis with suggestions
8. **Settings** - User preferences and AI configuration

---

## 🚀 Deployment

### Local Development

```bash
# Install all dependencies
npm run install:all

# Start development servers (frontend + backend)
npm run dev

# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run dev
```

### Vercel Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/driftguard.git
git push -u origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Import your repository
- Configure:
  - Framework: Vite
  - Build Command: `cd frontend && npm install && npm run build`
  - Output Directory: `frontend/dist`

3. **Add Environment Variables**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
NODE_ENV=production
AI_PROVIDER=mock
```

4. **Deploy!**

📖 **[Full Deployment Guide →](./DEPLOYMENT.md)**

---

## 💡 Usage Example

### 1. Create a Project
```
Dashboard → Projects → New Project
Name: "My API Project"
Repository: https://github.com/user/my-api
```

### 2. Run a Scan
```
Dashboard → New Scan
Select Project: "My API Project"
Paste git diff or upload file
Click "Start Scan"
```

### 3. Review Results
```
Reports → View drift reports
See severity scores
Read AI explanations
Review suggested fixes
```

### 4. Accept Suggestions
```
Report Detail → View suggestions
Click "Accept" on good suggestions
Copy updated documentation
Apply to your repository
```

---

## 🔒 Security

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Row Level Security (RLS) in Supabase
- ✅ Environment variable protection
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (Supabase handles this)
- ✅ XSS protection

---

## 💰 Cost

### Free Tier (Perfect for Hackathons & Small Teams)
- **Supabase**: $0/month
  - 500MB database
  - 2GB file storage
  - 50,000 monthly active users
  - Unlimited API requests
- **Vercel**: $0/month
  - 100GB bandwidth
  - Unlimited deployments
  - Automatic HTTPS
  - Custom domains

**Total: $0/month**

### When to Upgrade
- **Supabase Pro**: $25/month (8GB database, 50GB bandwidth)
- **Vercel Pro**: $20/month (1TB bandwidth, advanced analytics)

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free)
- Git

### Environment Variables

```env
# Backend (.env in root)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
AI_PROVIDER=mock
```

### Scripts

```bash
# Install all dependencies
npm run install:all

# Development (runs both frontend and backend)
npm run dev

# Build frontend for production
npm run build

# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with React, Express, and Supabase
- Inspired by the need for better documentation practices
- Designed for hackathons and real-world use

### 🤖 AI-Assisted Development

This project was developed with significant assistance from **IBM Bob**, an AI-powered software engineering assistant. IBM Bob contributed to:

- **System Architecture & Design** - Full-stack architecture planning and technology selection
- **Backend Development** - Complete Express API, database schema, authentication, and business logic
- **Frontend Development** - React application, UI components, routing, and state management
- **AI Service Layer** - Modular AI provider architecture with mock implementation
- **Drift Detection Engine** - Core algorithms for detecting documentation drift
- **Database Design** - PostgreSQL schema with Row Level Security and optimization
- **API Design** - RESTful endpoints following industry best practices
- **Deployment Configuration** - Vercel serverless setup and optimization
- **Comprehensive Documentation** - Setup guides, deployment instructions, and testing procedures

**📄 Detailed Contributions:** See [IBM_BOB_CONTRIBUTIONS.md](./IBM_BOB_CONTRIBUTIONS.md) for a complete breakdown of IBM Bob's contributions to this project.

**📊 Session Report:** See [IBM_BOB_REPORT.md](./IBM_BOB_REPORT.md) for exported session logs and task history.

The collaboration between human developer and AI assistant enabled rapid development of a production-ready, scalable application with industry-standard practices and comprehensive documentation.

---

## 📞 Support

- 📖 [Documentation](./SUPABASE_SETUP.md)
- 🐛 [Report Issues](https://github.com/yourusername/driftguard/issues)
- 💬 [Discussions](https://github.com/yourusername/driftguard/discussions)

---

## 🎯 Roadmap

- [ ] GitHub PR integration
- [ ] Real-time collaboration
- [ ] Team features
- [ ] CI/CD webhooks
- [ ] PDF export
- [ ] Email notifications
- [ ] IBM watsonx integration
- [ ] OpenAI integration
- [ ] Slack/Discord notifications
- [ ] Custom AI model training

---

**Made with ❤️ for developers who care about documentation**

🚀 **Start detecting drift today!**