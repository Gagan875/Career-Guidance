# Career Guidance Platform - Deployment Ready! 🚀

## What's Been Prepared

✅ **Vercel Configuration** (`vercel.json`)
✅ **Deployment Documentation** (`docs/DEPLOYMENT.md`)
✅ **Quick Deploy Guide** (`QUICK_DEPLOY.md`)
✅ **Environment Templates** (`.env.example`, `client/.env.production`)
✅ **Updated package.json** with deployment scripts

## Quick Start

### Option 1: One-Command Deploy (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
cd Career-Guidance
vercel login
vercel
```

### Option 2: Step-by-Step (Recommended for first time)

Follow the detailed guide in `QUICK_DEPLOY.md`

## Important: Before Deploying

### 1. Set Up MongoDB Atlas (5 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 Free tier)
4. Create database user
5. Whitelist all IPs (0.0.0.0/0)
6. Get connection string

### 2. Prepare Environment Variables

You'll need these:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=production
```

### 3. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Deployment Methods

### Method 1: Vercel CLI (Recommended)
- Fastest deployment
- Full control
- Easy environment variable management
- See `QUICK_DEPLOY.md`

### Method 2: Vercel Dashboard
- Visual interface
- GitHub integration
- Automatic deployments on push
- See `docs/DEPLOYMENT.md` Section "Via Vercel Dashboard"

### Method 3: GitHub Integration
- Connect repository to Vercel
- Auto-deploy on every push
- Preview deployments for PRs
- See `docs/DEPLOYMENT.md`

## After Deployment

### Test Your Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Frontend**
   - Open `https://your-app.vercel.app`
   - Test registration
   - Test login
   - Take a quiz
   - Check if data persists

### Monitor Your App

- View logs: `vercel logs`
- Check analytics in Vercel dashboard
- Monitor MongoDB Atlas metrics

## Troubleshooting

### Common Issues

**"Cannot connect to database"**
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI environment variable
- Ensure database user has correct permissions

**"CORS Error"**
- Update CORS configuration in `server/index.js`
- Set CLIENT_URL environment variable

**"Build Failed"**
- Check build logs in Vercel
- Ensure all dependencies are listed in package.json
- Verify Node.js version compatibility

See `docs/DEPLOYMENT.md` for detailed troubleshooting.

## Cost

### Free Tier Includes:
- **Vercel**: 100GB bandwidth, 100 hours serverless execution
- **MongoDB Atlas**: 512MB storage, shared RAM

Both are sufficient for development and small-scale production!

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Set up custom domain (optional)
3. ✅ Enable Vercel Analytics
4. ✅ Set up monitoring alerts
5. ✅ Share with users!

## Support

- **Detailed Guide**: `docs/DEPLOYMENT.md`
- **Quick Reference**: `QUICK_DEPLOY.md`
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

## Ready to Deploy?

```bash
npm install -g vercel
cd Career-Guidance
vercel login
vercel --prod
```

Good luck! 🎉
