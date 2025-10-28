# GitHub Repository Setup & Auto-Deploy Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `premium-shortlet`
   - **Description**: "Premium shortlet apartment booking platform - Victoria Island, Lagos"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these locally)
3. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these in your terminal:

```powershell
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/premium-shortlet.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

---

## Step 3: Set Up Firebase Automatic Deployment via GitHub Actions

### 3.1 Generate Firebase CI Token

Run this command in your terminal:

```powershell
firebase login:ci
```

This will:
1. Open your browser for authentication
2. Generate a CI token
3. Display the token in the terminal

**IMPORTANT**: Copy this token - you'll need it for GitHub Secrets!

### 3.2 Add Token to GitHub Secrets

1. Go to your repository: `https://github.com/YOUR_USERNAME/premium-shortlet`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `FIREBASE_TOKEN`
   - **Value**: Paste the token from step 3.1
5. Click **Add secret**

### 3.3 Create GitHub Actions Workflow

The workflow file has already been created at:
`.github/workflows/firebase-hosting-deploy.yml`

This workflow will:
- ✅ Trigger on every push to `main` branch
- ✅ Build your Angular application
- ✅ Deploy to Firebase Hosting automatically
- ✅ Show deployment status in GitHub

---

## Step 4: Test the Setup

1. Make a small change to any file
2. Commit and push:
   ```powershell
   git add .
   git commit -m "test: trigger auto-deploy"
   git push
   ```
3. Go to your GitHub repository → **Actions** tab
4. Watch the deployment workflow run!

---

## Expected Workflow

```
Push to GitHub (main branch)
    ↓
GitHub Actions Triggered
    ↓
Install Dependencies (npm ci)
    ↓
Build Angular App (ng build --configuration production)
    ↓
Deploy to Firebase Hosting
    ↓
Live at: https://shortlet-connect.web.app
```

---

## Troubleshooting

### If push fails:
```powershell
# Pull first if repository has any changes
git pull origin main --rebase

# Then push
git push -u origin main
```

### If GitHub Actions fails:
1. Check the **Actions** tab for error logs
2. Verify `FIREBASE_TOKEN` secret is set correctly
3. Ensure Firebase project ID matches in `.firebaserc`

### To update the Firebase token:
```powershell
# Generate new token
firebase login:ci

# Update in GitHub Settings → Secrets → FIREBASE_TOKEN
```

---

## Current Status

✅ Local repository initialized
✅ All code committed locally
⏳ Waiting for GitHub repository creation
⏳ Waiting for remote connection
⏳ Waiting for GitHub Actions setup

---

## Quick Command Reference

```powershell
# Check current remote
git remote -v

# Add remote (after creating repo on GitHub)
git remote add origin https://github.com/YOUR_USERNAME/premium-shortlet.git

# Push to GitHub
git push -u origin main

# Check status
git status

# View commit history
git log --oneline -10

# Generate Firebase CI token
firebase login:ci
```

---

## Security Notes

⚠️ **NEVER** commit the Firebase token to your repository!
⚠️ Always use GitHub Secrets for sensitive data
⚠️ The `.github/workflows` file references the secret safely: `${{ secrets.FIREBASE_TOKEN }}`

---

**Next Steps**: Follow Step 1 to create the repository on GitHub!
