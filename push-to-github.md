# 🚀 Quick Push to GitHub

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `ghostchat`
3. Make it **Public**
4. **DO NOT** check "Initialize with README"
5. Click **Create repository**

## Step 2: Copy Your GitHub Username

After creating the repository, you'll see your username in the URL:
`https://github.com/YOUR_USERNAME/ghostchat`

## Step 3: Run These Commands

Open your terminal in this folder and run these commands one by one:

**Replace `YOUR_USERNAME` with your actual GitHub username!**

```bash
git remote add origin https://github.com/YOUR_USERNAME/ghostchat.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

## Step 4: Enter Your Credentials

When prompted:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)

### How to Create a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** > **Generate new token (classic)**
3. Give it a name: "GhostChat Deploy"
4. Check the **repo** checkbox
5. Click **Generate token**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

## ✅ Done!

Your code is now on GitHub! 🎉

Visit: `https://github.com/YOUR_USERNAME/ghostchat`

---

## 🌐 Next: Deploy to GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under Source, select: Branch `main`, Folder `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes
6. Your site will be live at: `https://YOUR_USERNAME.github.io/ghostchat/login.html`

---

## ⚠️ Don't Forget!

Before your app works online, you need to:
1. Set up Supabase (see README.md)
2. Update `app.js` and `receiver.js` with your Supabase credentials
3. Commit and push the changes

See **DEPLOYMENT_GUIDE.md** for detailed instructions!
