# Railway Deployment Guide

## Quick Start

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Deploy to Railway"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Deploy on Railway**
- Go to https://railway.app
- "Start a New Project" → "Deploy from GitHub"
- Select `gamedev-portfolio`
- Railway auto-deploys!

3. **Connect Hostinger Domain**

In Railway:
- Settings → Networking → Custom Domains
- Add: `yameen-portfolio.com`

In Hostinger:
- DNS Settings → Add CNAME:
  - Name: @ → Target: your-app.up.railway.app
  - Name: www → Target: your-app.up.railway.app

Done! Visit https://yameen-portfolio.com
