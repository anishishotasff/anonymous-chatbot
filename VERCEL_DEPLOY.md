# 🚀 Deploy GhostChat to Vercel

## Method 1: Using Vercel Website (Easiest)

### Step 1: Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click **Sign Up** (or **Login** if you have an account)
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. After logging in, click **Add New...** button (top right)
2. Select **Project**
3. You'll see a list of your GitHub repositories
4. Find **anonymous-chatbot** (or your repository name)
5. Click **Import** next to it

### Step 3: Configure Project

1. **Project Name**: Leave as is or change to `ghostchat`
2. **Framework Preset**: Select **Other** (or leave as detected)
3. **Root Directory**: Leave as `./` (default)
4. **Build Command**: Leave empty
5. **Output Directory**: Leave empty
6. **Install Command**: Leave empty

### Step 4: Deploy!

1. Click **Deploy** button
2. Wait 30-60 seconds for deployment
3. 🎉 Your site is live!

### Step 5: Get Your URL

After deployment completes:
- You'll see: **Congratulations! Your project has been deployed**
- Your URL will be something like: `https://ghostchat-xyz123.vercel.app`
- Click **Visit** to see your live site!

---

## Method 2: Using Vercel CLI (Advanced)

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- What's your project's name? **ghostchat**
- In which directory is your code located? **.**
- Want to override settings? **N**

### Deploy to Production

```bash
vercel --prod
```

---

## 🎯 After Deployment

### 1. Test Your Site

Visit your Vercel URL (e.g., `https://ghostchat-xyz123.vercel.app`)

You should see the login page!

### 2. Set Up Supabase

Before the app works fully, you need to:

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Sign up and create a new project
   - Wait for it to initialize

2. **Create Database Table:**
   - Go to SQL Editor
   - Run this SQL:

```sql
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can delete messages" ON messages
  FOR DELETE USING (true);

CREATE INDEX idx_messages_recipient ON messages(recipient);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

3. **Get Your Credentials:**
   - Go to Project Settings > API
   - Copy your **Project URL**
   - Copy your **anon/public key**

4. **Update Your Code:**
   - Edit `app.js` on GitHub
   - Replace `YOUR_SUPABASE_URL` with your actual URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your actual key
   - Do the same for `receiver.js`
   - Commit the changes

5. **Vercel Auto-Deploys:**
   - Vercel automatically detects your GitHub commits
   - It will redeploy with your new changes
   - Wait 30 seconds and your app will work!

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain

1. Go to your project on Vercel
2. Click **Settings** > **Domains**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### Free Vercel Domain

Your app automatically gets:
- `https://your-project.vercel.app`
- `https://your-project-git-main-username.vercel.app`

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you:
- Push to your `main` branch (production)
- Push to any branch (preview deployment)
- Create a pull request (preview deployment)

Every commit = automatic deployment! 🚀

---

## 📊 Monitor Your Deployment

### Vercel Dashboard

- **Analytics**: See visitor stats
- **Logs**: View deployment logs
- **Speed Insights**: Check performance
- **Deployments**: See all deployment history

---

## 🆘 Troubleshooting

### Site shows 404

- Check if `vercel.json` is in your repository
- Make sure all files are committed and pushed
- Redeploy from Vercel dashboard

### App not working

- Check browser console (F12) for errors
- Verify Supabase credentials are correct
- Make sure you updated both `app.js` and `receiver.js`

### Deployment failed

- Check deployment logs in Vercel dashboard
- Make sure your GitHub repository is accessible
- Try redeploying

---

## ✅ Checklist

- [ ] Signed up for Vercel
- [ ] Connected GitHub account
- [ ] Imported repository
- [ ] Deployed successfully
- [ ] Got deployment URL
- [ ] Created Supabase project
- [ ] Created database table
- [ ] Updated app.js with credentials
- [ ] Updated receiver.js with credentials
- [ ] Pushed changes to GitHub
- [ ] Vercel auto-redeployed
- [ ] Tested the live app

---

## 🎉 You're Done!

Your GhostChat app is now live on Vercel!

Share your URL with friends and start receiving anonymous messages! 👻

**Need help?** Check the Vercel documentation: https://vercel.com/docs
