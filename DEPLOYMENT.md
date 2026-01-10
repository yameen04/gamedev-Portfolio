# Deployment Guide: Yameen-portfolio.com

## Quick Start Steps

### 1. Push to GitHub
```powershell
cd e:\gamedev-portfolio
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your `gamedev-portfolio` repository
5. Configure:
   - **Name**: yameen-portfolio
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
6. Click "Create Web Service"

### 3. Connect Custom Domain (Yameen-portfolio.com)

#### In Render Dashboard:
1. Go to Settings → Custom Domains
2. Click "Add Custom Domain"
3. Enter: `yameen-portfolio.com`
4. Also add: `www.yameen-portfolio.com`
5. Render will show you DNS records to add

#### In Hostinger:
1. Go to Hostinger Dashboard → Domains → DNS/Nameservers
2. Add **CNAME Record**:
   - Type: CNAME
   - Name: www
   - Target: your-app.onrender.com
   - TTL: 14400
   
3. Add **A Record**:
   - Type: A
   - Name: @
   - Target: (IP provided by Render)
   - TTL: 14400

4. Wait 5-60 minutes for DNS propagation

### 4. Test Your Site
Visit: https://yameen-portfolio.com

## Important Notes
- Your MongoDB and Cloudinary credentials are already in the code
- Uploads will go to Cloudinary (persistent storage)
- Site may sleep after 15 min inactivity (30s wake time)
- Free tier includes SSL certificate automatically

## Troubleshooting
- If site doesn't load: Check Render logs
- If domain doesn't work: Wait longer for DNS (up to 24h)
- If images don't upload: Check Cloudinary quota
