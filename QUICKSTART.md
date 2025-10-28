# Quick Start Guide (For Beginners)

If you're new to web development, follow this simplified guide. For detailed instructions, see SETUP.md.

## What You'll Need

- A computer (Mac, Windows, or Linux)
- A Google account (for Gemini API)
- 1 hour of time
- Patience (it's easier than it looks!)

**No credit card needed!** This is completely free.

---

## Step 1: Get a Google Gemini API Key (5 minutes)

### What is Google Gemini?
It's Google's AI model, similar to ChatGPT. We use it to generate travel playbooks.

### Steps:
1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API key" in the left sidebar
4. Click "+ Create API key"
5. Select "Create API key in new project"
6. **Copy the key** (looks like: AIzaSyAbc123...)
7. **Save it in a safe place** (Notes app, password manager)

**No credit card required!** Free tier includes:
- 15 requests per minute
- 1,500 requests per day
- Completely free forever

---

## Step 2: Install Required Software (5 minutes)

### Install Node.js
**Why?** It lets you run the deployment tools.

**Mac:**
1. Go to https://nodejs.org
2. Download the "LTS" version (left button)
3. Open the downloaded file
4. Click through installer (use defaults)
5. Done!

**Windows:**
1. Go to https://nodejs.org
2. Download the "LTS" version (left button)
3. Run the installer
4. Click through (use defaults)
5. Done!

**Verify it worked:**
Open Terminal (Mac) or Command Prompt (Windows) and type:
```
node --version
```
You should see: v20.x.x or similar.

### Install Wrangler
Open Terminal/Command Prompt and type:
```
npm install -g wrangler
```
Wait 30 seconds. Done!

---

## Step 3: Setup Cloudflare (15 minutes)

### What is Cloudflare?
A free service that runs your AI code online.

### Steps:

**3.1 Create Account:**
1. Go to https://cloudflare.com
2. Click "Sign Up"
3. Use your email
4. Skip the "Add a site" wizard (not needed)

**3.2 Login from Terminal:**
Open Terminal/Command Prompt:
```
wrangler login
```
Your browser opens - Click "Allow"

**3.3 Create Storage:**
In Terminal/Command Prompt:
```
wrangler kv:namespace create "RATE_LIMIT"
```

**Copy the ID** (looks like: 1234567890abcdef)
Save it somewhere!

**3.4 Edit Configuration:**
1. Find the file `wrangler.toml` in your project folder
2. Open it with TextEdit (Mac) or Notepad (Windows)
3. Find this line:
   ```
   { binding = "RATE_LIMIT", id = "YOUR_KV_NAMESPACE_ID" }
   ```
4. Replace YOUR_KV_NAMESPACE_ID with the ID you copied
5. Save and close

**3.5 Add Gemini Key:**
In Terminal/Command Prompt:
```
wrangler secret put GEMINI_API_KEY
```
When asked, paste your Gemini API key (from Step 1)

**3.6 Deploy:**
Navigate to your project folder:
```
cd path/to/mynomadcompanion
```
Then:
```
wrangler deploy
```

**Copy your URL** (looks like: https://mynomad-worker.abc123.workers.dev)

---

## Step 4: Setup GitHub (15 minutes)

### What is GitHub?
A free website hosting service.

### Steps:

**4.1 Create Account:**
1. Go to https://github.com
2. Click "Sign up"
3. Choose a username
4. Verify email

**4.2 Create Repository:**
1. Click the "+" icon (top right)
2. Click "New repository"
3. Name it: `mynomadcompanion`
4. Make it **Public**
5. Don't check any boxes
6. Click "Create repository"

**4.3 Update Your Files:**

Open these files and make changes:

**File: app.js**
- Find line 2: `WORKER_URL: 'https://YOUR-WORKER...`
- Replace with your Cloudflare URL from Step 3.6

**File: index.html**
- Find line 13: `venmo.com/YOUR-VENMO-HANDLE`
- Replace with your Venmo username
- Find line 143: `github.com/YOUR-GITHUB/mynomadcompanion`
- Replace YOUR-GITHUB with your GitHub username

Save all files!

**4.4 Upload Files:**

**Mac:**
1. Open Terminal
2. Navigate to project folder:
   ```
   cd path/to/mynomadcompanion
   ```
3. Run these commands one by one:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/mynomadcompanion.git
   git push -u origin main
   ```
   (Replace YOUR-USERNAME with your GitHub username)

**Windows:**
1. Open Command Prompt
2. Navigate to project folder:
   ```
   cd C:\path\to\mynomadcompanion
   ```
3. Run the same git commands as Mac (above)

**4.5 Enable GitHub Pages:**
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" (left sidebar)
4. Under "Branch": select "main"
5. Click "Save"
6. Wait 5 minutes
7. Refresh page
8. You'll see: "Your site is live at https://YOUR-USERNAME.github.io/mynomadcompanion/"

---

## Step 5: Test It! (10 minutes)

1. Visit your site: https://YOUR-USERNAME.github.io/mynomadcompanion/
2. Fill out the form
3. Click "Generate My Playbook"
4. Wait 30-60 seconds
5. See your playbook!
6. Try downloading it
7. Generate 4 more playbooks
8. On the 6th try, you should be blocked (rate limit working!)

---

## Check Your Free Tier Status (Optional)

1. Go to https://aistudio.google.com
2. Check your API usage dashboard
3. You should see 5 requests used
4. Free tier: 1,500 per day - you're nowhere close!

**No cost monitoring needed!** It's completely free.

---

## What If Something Goes Wrong?

### "Worker URL not working"
- Make sure you updated app.js with your real Cloudflare URL
- Try redeploying: `wrangler deploy`

### "Gemini API error"
- Check your API key in Cloudflare:
  ```
  wrangler secret list
  ```
  Should show: GEMINI_API_KEY
- Make sure you copied the key correctly from Google AI Studio

### "GitHub Pages not loading"
- Wait 10 minutes (it can be slow first time)
- Check Settings > Pages shows green checkmark
- Try incognito/private browsing

### "Service temporarily unavailable"
- This means the daily free tier limit was reached (1,500 requests)
- Very unlikely with your rate limiting
- Resets at midnight UTC

### "Can't find Terminal/Command Prompt"
- **Mac:** Press Cmd+Space, type "Terminal"
- **Windows:** Press Windows key, type "cmd"

### Still stuck?
- Read SETUP.md for detailed instructions
- Check CHECKLIST.md for troubleshooting
- Google the specific error message

---

## You're Done! 🎉

Your site is live and generating AI-powered travel playbooks - completely free!

### What's Next?

1. Share your site with friends
2. Post in digital nomad Facebook groups
3. Tweet about it with #digitalnomad
4. No need to monitor costs - it's free!
5. Gather feedback and improve

### Remember:
- **Completely free** - no credit card ever needed
- Your rate limit (5/month per user) protects against abuse
- Daily limit: 1,500 playbooks (you probably won't hit this)
- Can support 300+ users per day
- Resets daily at midnight UTC

### Free Tier Advantages:
- No surprise bills
- No need to set spending limits
- No cost monitoring required
- Just works!

Good luck! 🌍✈️
