# 🚀 Deploying Tavern Tactics to Vercel

## Quick Setup (30 seconds)

Your Origin repository is ready to deploy! Follow these steps to get it live:

### Step 1: Connect Origin to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your team: **Ben's projects**
3. Go to **Settings** → **Git** (in the sidebar)
4. Under "Git Providers", click **Connect** next to **Cursor Origin**
5. Authorize the connection

### Step 2: Create the Vercel Project

Two options:

**Option A: Via Vercel Dashboard (Easiest)**
1. Click **Add New...** → **Project**
2. Select **Origin** as the Git provider
3. Find and import: `ben-6965d/tmp-9c6cbe7bacc7b735`
4. Project name: `tavern-tactics` (or whatever you prefer)
5. Framework Preset: **Vite**
6. Root Directory: `./` (default)
7. Click **Deploy**

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# In your project directory
vercel --prod
```

### Step 3: Your Game Will Be Live!

After deployment completes (about 1-2 minutes), you'll get a URL like:
- `https://tavern-tactics.vercel.app`
- Or `https://tavern-tactics-[random].vercel.app`

### Step 4: Open on Your Phone

1. Open the URL on your phone's browser
2. Tap the share/menu button
3. Select **Add to Home Screen**
4. Now you have Tavern Tactics as a PWA app icon!

---

## Automatic Deployments

Once connected, every `git push` to the `main` branch will automatically deploy to production. No manual steps needed!

## Custom Domain (Optional)

In Vercel Dashboard → Your Project → Settings → Domains, you can add a custom domain like `tavern-tactics.yourdomain.com`.

---

## What's Deployed

✅ Production-optimized React build  
✅ TFT-style hero leveling with star system  
✅ Full game with shop, combat, and dungeon map  
✅ PWA-ready with manifest and mobile optimization  
✅ Portrait mode layout for phones  
✅ localStorage for persistent unlocks  

---

## Troubleshooting

**If deployment fails:**
- Check that Origin is properly connected in Vercel Git settings
- Verify the repository URL: `https://origin.cursor.com/git/ben-6965d/tmp-9c6cbe7bacc7b735.git`
- The build command is: `npm run build`
- The output directory is: `dist`

**Need help?** The repo is already set up with all the right configs. Just connect Origin and hit deploy!
