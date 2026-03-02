# Quick Deployment Guide

## Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Database cluster created and configured
- [ ] Database user created with password
- [ ] IP whitelist set to 0.0.0.0/0
- [ ] Connection string copied
- [ ] GitHub repository is up to date
- [ ] All code is committed and pushed

## Deploy in 5 Minutes

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
cd Career-Guidance
vercel
```

### 4. Set Environment Variables
```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string

vercel env add JWT_SECRET
# Enter a secure random string (min 32 characters)

vercel env add NODE_ENV
# Enter: production
```

### 5. Deploy to Production
```bash
vercel --prod
```

## Done! 🎉

Your app is now live at: `https://your-app.vercel.app`

## Next Steps

1. Test the deployment
2. Update API URL in client if needed
3. Configure custom domain (optional)

See `docs/DEPLOYMENT.md` for detailed instructions.
