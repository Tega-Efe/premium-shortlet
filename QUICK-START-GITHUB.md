# 🎯 QUICK START: GitHub Repository & Auto-Deploy

## Your Firebase CI Token

⚠️ **The Firebase CI token has been generated and is stored locally.**

To get your token, run this command in your terminal:
```powershell
firebase login:ci
```

**⚠️ IMPORTANT**: Keep this token secure! You'll add it to GitHub Secrets.

---

## 3 Simple Steps

### 1️⃣ Create GitHub Repository

👉 Go to: **https://github.com/new**

- Repository name: `premium-shortlet`
- Description: `Premium two-bedroom apartment booking platform - Victoria Island, Lagos`
- **Private** or Public (your choice)
- **DO NOT** initialize with README ❌

Click "Create repository"

---

### 2️⃣ Push Your Code

```powershell
# Replace YOUR_USERNAME with your actual GitHub username!
git remote add origin https://github.com/YOUR_USERNAME/premium-shortlet.git
git push -u origin main
```

---

### 3️⃣ Add Firebase Token to GitHub Secrets

1. Go to: `https://github.com/YOUR_USERNAME/premium-shortlet/settings/secrets/actions`
2. Click **"New repository secret"**
3. Name: `FIREBASE_TOKEN`
4. Secret: Paste the token from above
5. Click **"Add secret"**

---

## ✅ Done!

Now every `git push` will automatically:
- Build your Angular app
- Deploy to Firebase Hosting
- Update https://shortlet-connect.web.app

Watch deployments at: `https://github.com/YOUR_USERNAME/premium-shortlet/actions`

---

## 📝 Daily Workflow

```powershell
# Make changes to your code
# Then:
git add .
git commit -m "feat: your changes"
git push

# Watch it deploy automatically in GitHub Actions!
```

---

**Need detailed instructions? See [SETUP-INSTRUCTIONS.md](./SETUP-INSTRUCTIONS.md)**
