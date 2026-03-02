# Your Vercel Deployment Guide

## Your Environment Variables (Ready to Use!)

I've read your `.env` file. Here are the values you need to add to Vercel:

### ✅ Environment Variables for Vercel

Copy these exact values when deploying:

**1. MONGODB_URI**
```
mongodb+srv://12326gaganrawal:Gagan123@cluster0.gojsesn.mongodb.net/digital_guidance_platform?retryWrites=true&w=majority
```

**2. JWT_SECRET**
```
career_guidance_team_secret_2024_development
```

**3. NODE_ENV**
```
production
```

**4. PORT**
```
5000
```

**5. OPENROUTE_API_KEY** (Optional - for distance calculation)
```
eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNiNzFhYmUzOTllODQxNzRhMTg0MTA3MWIyZWJhNTQ2IiwiaCI6Im11cm11cjY0In0=
```

---

## Deploy to Vercel Now (5 Steps)

### Step 1: Go to Vercel
1. Open: https://vercel.com
2. Click "Sign Up" or "Log In"
3. Sign in with GitHub

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find "Career-Guidance" repository
3. Click "Import"

### Step 3: Configure Build Settings

**Framework Preset:** Other

**Root Directory:** `./` (leave as default)

**Build Command:**
```
npm run vercel-build
```

**Output Directory:**
```
client/build
```

**Install Command:**
```
npm run install-all
```

### Step 4: Add Environment Variables

Click "Environment Variables" and add each one:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://12326gaganrawal:Gagan123@cluster0.gojsesn.mongodb.net/digital_guidance_platform?retryWrites=true&w=majority` |
| `JWT_SECRET` | `career_guidance_team_secret_2024_development` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `OPENROUTE_API_KEY` | `eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNiNzFhYmUzOTllODQxNzRhMTg0MTA3MWIyZWJhNTQ2IiwiaCI6Im11cm11cjY0In0=` |

**Important:** For each variable, select all three environments:
- ✅ Production
- ✅ Preview  
- ✅ Development

### Step 5: Deploy!
1. Click "Deploy"
2. Wait 3-5 minutes
3. Your app will be live! 🎉

---

## After Deployment

### Your App URL
After deployment, you'll get a URL like:
```
https://career-guidance-xxxx.vercel.app
```

### Test Your Deployment

1. **Open your Vercel URL**
2. **Test Registration:**
   - Click "Sign Up"
   - Create a new account
   - Should work without errors

3. **Test Login:**
   - Login with your new account
   - Should redirect to dashboard

4. **Test Quiz:**
   - Click "Take Quiz"
   - Complete a quiz
   - Check if results are saved

5. **Check API:**
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

---

## MongoDB Atlas Check

Your MongoDB is already set up! But verify:

1. Go to: https://cloud.mongodb.com
2. Login with your account
3. Check "Network Access" → Should have `0.0.0.0/0` whitelisted
4. Check "Database Access" → User `12326gaganrawal` should exist

If you see connection errors, you may need to:
- Whitelist `0.0.0.0/0` in Network Access
- Verify user password is correct

---

## Update CLIENT_URL (After First Deploy)

After your first deployment:

1. Copy your Vercel URL (e.g., `https://career-guidance-xxxx.vercel.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Add new variable:
   - Name: `CLIENT_URL`
   - Value: Your Vercel URL
   - Select all environments
4. Go to Deployments → Click "..." on latest → "Redeploy"

---

## Troubleshooting

### "Cannot connect to database"
- Check MongoDB Atlas Network Access (should have 0.0.0.0/0)
- Verify MONGODB_URI is correct in Vercel
- Check MongoDB Atlas is not paused (free tier pauses after inactivity)

### "Build Failed"
- Check build logs in Vercel
- Look for specific error messages
- Common fix: Ensure all dependencies are in package.json

### "CORS Error"
- Add CLIENT_URL environment variable
- Redeploy after adding

---

## Quick Commands Reference

### View Logs (if using CLI)
```bash
vercel logs
```

### Redeploy
```bash
vercel --prod
```

### View Deployments
```bash
vercel ls
```

---

## Success Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Can register new user
- [ ] Can login
- [ ] Can take stream quiz
- [ ] Can take field quiz
- [ ] Can take psychometric test
- [ ] Results are saved
- [ ] Profile page works
- [ ] Colleges page loads
- [ ] Courses page loads

---

## Your Deployment is Ready! 🚀

Everything is configured. Just:
1. Go to vercel.com
2. Import your GitHub repo
3. Add the environment variables above
4. Click Deploy!

Your Career Guidance Platform will be live in 5 minutes!
