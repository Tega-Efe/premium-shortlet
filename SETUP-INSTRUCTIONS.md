# 🚀 Complete Setup Instructions

## ✅ What We've Done So Far

1. ✅ Created GitHub Actions workflow file
2. ✅ Committed all code to local git repository
3. ✅ Generated Firebase CI token
4. ✅ Built production version successfully
5. ✅ Deployed to Firebase Hosting manually

---

## 📝 Step-by-Step: Create GitHub Repository & Enable Auto-Deploy

### Step 1: Create the GitHub Repository

1. Open your browser and go to: **https://github.com/new**

2. Fill in the repository details:
   - **Repository name**: `premium-shortlet`
   - **Description**: `Premium two-bedroom apartment booking platform - Victoria Island, Lagos`
   - **Visibility**: Choose **Private** (recommended) or **Public**
   - **❌ DO NOT** check "Initialize with README" (we already have one)
   - **❌ DO NOT** add .gitignore or license

3. Click **"Create repository"**

---

### Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you some commands. **IGNORE THOSE** and use these instead:

Open PowerShell in your project directory and run:

```powershell
# Add GitHub as remote origin (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/premium-shortlet.git

# Verify the remote was added
git remote -v

# Push all your code to GitHub
git push -u origin main
```

**Example (replace with your username):**
```powershell
git remote add origin https://github.com/johndoe/premium-shortlet.git
git push -u origin main
```

---

### Step 3: Add Firebase Token to GitHub Secrets

#### Get Your Firebase CI Token:

Run this command to generate your token:
```powershell
firebase login:ci
```

This will display your token. Copy it!

#### Add it to GitHub:

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/premium-shortlet`

2. Click **Settings** (top menu)

3. In the left sidebar, click **Secrets and variables** → **Actions**

4. Click the green **"New repository secret"** button

5. Fill in:
   - **Name**: `FIREBASE_TOKEN` (must be exactly this)
   - **Secret**: Paste the token above

6. Click **"Add secret"**

---

### Step 4: Test Automatic Deployment

Now every push to the `main` branch will automatically deploy! Let's test it:

```powershell
# Make a small change (add a comment to trigger deployment)
echo "# Auto-deploy test" >> TEST.md

# Commit and push
git add TEST.md
git commit -m "test: trigger auto-deploy workflow"
git push
```

#### Watch the Deployment:

1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. You'll see your workflow running!
4. It will:
   - ✅ Install dependencies
   - ✅ Build the Angular app
   - ✅ Deploy to Firebase Hosting
   - ✅ Show you the live URL

---

## 🎯 How Auto-Deploy Works

```
You make changes locally
    ↓
git commit -m "your changes"
    ↓
git push
    ↓
GitHub detects push to main
    ↓
GitHub Actions starts workflow
    ↓
Runs: npm ci (install deps)
    ↓
Runs: npm run build (production build)
    ↓
Runs: firebase deploy --only hosting
    ↓
✅ Live at https://shortlet-connect.web.app
```

---

## 📊 Current Project Status

✅ **Local Git Repository**: Initialized with 2 commits
✅ **Firebase Hosting**: Deployed and live
✅ **Firebase Firestore**: Rules and indexes deployed
✅ **GitHub Actions**: Workflow file created
✅ **Firebase CI Token**: Generated and ready
⏳ **GitHub Repository**: Waiting for you to create
⏳ **Auto-Deploy**: Will activate after Step 3

---

## 🔗 Important URLs

- **Firebase Console**: https://console.firebase.google.com/project/shortlet-connect
- **Live Site**: https://shortlet-connect.web.app
- **GitHub New Repo**: https://github.com/new
- **Firebase Storage Setup**: https://console.firebase.google.com/project/shortlet-connect/storage

---

## 🆘 Troubleshooting

### "Permission denied" when pushing to GitHub

You may need to authenticate with GitHub. Use a Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Copy the token
5. When pushing, use:
   ```powershell
   git push https://YOUR_TOKEN@github.com/YOUR_USERNAME/premium-shortlet.git main
   ```

### GitHub Actions workflow not running

- Check if `FIREBASE_TOKEN` secret is added correctly
- Ensure the secret name is exactly `FIREBASE_TOKEN`
- Try pushing a new commit to trigger workflow

### Firebase deployment fails

- Verify Firebase CLI is installed: `firebase --version`
- Check `.firebaserc` has correct project ID
- Ensure you're logged in: `firebase login`

---

## 🎉 What's Next?

After completing these steps, your workflow will be:

1. **Local Development**:
   ```powershell
   npm start  # Develop locally
   ```

2. **Make Changes**: Edit your code

3. **Commit & Push**:
   ```powershell
   git add .
   git commit -m "feat: your feature description"
   git push
   ```

4. **Automatic Magic**: GitHub Actions automatically builds and deploys!

5. **Check Progress**: Go to GitHub → Actions tab to watch

6. **Live in ~2 minutes**: Your changes are live!

---

## 📝 Quick Reference Commands

```powershell
# Daily workflow
git status                                    # Check what changed
git add .                                     # Stage all changes
git commit -m "feat: description"             # Commit with message
git push                                      # Push to GitHub (triggers deploy)

# View deployment history
git log --oneline                             # See commit history

# Check remote
git remote -v                                 # Verify GitHub connection

# Manual deploy (if needed)
npm run build:prod                            # Build production
firebase deploy --only hosting                # Deploy to Firebase
```

---

**Ready? Start with Step 1! 🚀**

**Your Firebase token is valid and ready to use. Just add it to GitHub Secrets in Step 3!**
