# MyNomadCompanion - Setup Instructions

## Overview
This guide will help you deploy MyNomadCompanion, a static site hosted on GitHub Pages with a Cloudflare Worker backend for AI-powered playbook generation.

**Cost Estimate:** ~$15/month (OpenAI API costs only)

---

## Prerequisites

1. GitHub account
2. Cloudflare account (free tier)
3. OpenAI API account
4. Basic command line knowledge

---

## Part 1: OpenAI API Setup

### 1.1 Create OpenAI Account & Get API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** section (left sidebar)
4. Click **"Create new secret key"**
5. Give it a name (e.g., "MyNomadCompanion")
6. **IMPORTANT:** Copy the key immediately - you won't see it again
7. Save it securely (you'll need it in Part 2)

### 1.2 Set Usage Limits (Cost Control)

1. Go to **Settings** → **Limits**
2. Set **Hard limit:** $20/month
3. Set **Soft limit:** $15/month (you'll get email notification)
4. Set up email alerts for usage

### 1.3 Add Payment Method

1. Go to **Settings** → **Billing**
2. Add a payment method (credit/debit card)
3. Start with $5-10 credit to test

**Expected Usage:**
- ~50 playbooks/month × $0.30 each = $15/month
- Each playbook costs ~$0.25-0.35 using GPT-4o-mini

---

## Part 2: Cloudflare Worker Setup

### 2.1 Create Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up for free account
3. Skip domain setup (not needed for Workers)

### 2.2 Install Wrangler CLI

Open terminal and run:

```bash
npm install -g wrangler
```

Or if you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org) first.

### 2.3 Login to Cloudflare

```bash
wrangler login
```

This will open a browser window - authorize the CLI.

### 2.4 Create KV Namespace (for rate limiting)

```bash
wrangler kv:namespace create "RATE_LIMIT"
```

Copy the ID shown in the output (looks like: `abcd1234efgh5678...`)

### 2.5 Create wrangler.toml Configuration

In your `mynomadcompanion` folder, create `wrangler.toml`:

```toml
name = "mynomad-worker"
main = "worker.js"
compatibility_date = "2024-01-01"

kv_namespaces = [
  { binding = "RATE_LIMIT", id = "YOUR_KV_NAMESPACE_ID_HERE" }
]

[vars]
# No variables here - we'll use secrets for API key
```

Replace `YOUR_KV_NAMESPACE_ID_HERE` with the ID from step 2.4.

### 2.6 Add OpenAI API Key as Secret

```bash
wrangler secret put OPENAI_API_KEY
```

When prompted, paste your OpenAI API key (from Part 1.1).

### 2.7 Deploy Worker

```bash
wrangler deploy
```

After deployment, you'll see a URL like:
```
https://mynomad-worker.YOUR-SUBDOMAIN.workers.dev
```

**SAVE THIS URL** - you'll need it in Part 3.

### 2.8 Test Worker

Test with curl:

```bash
curl -X POST https://mynomad-worker.YOUR-SUBDOMAIN.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "lisbon",
    "duration": "1-month",
    "budget": "moderate",
    "workSituation": "full-time-remote",
    "interests": ["culture", "food", "tech"]
  }'
```

You should get a JSON response with a playbook after 20-40 seconds.

---

## Part 3: GitHub Pages Setup

### 3.1 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Name it: `mynomadcompanion`
4. Make it **Public**
5. Don't initialize with README (we have files already)
6. Click **"Create repository"**

### 3.2 Update app.js with Worker URL

Open `app.js` and find this line:

```javascript
WORKER_URL: 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/generate',
```

Replace with your actual Worker URL from Part 2.7.

### 3.3 Update index.html with Your Info

Open `index.html` and update:

1. Line 13: Replace Venmo handle
   ```html
   <a href="https://venmo.com/YOUR-VENMO-HANDLE" target="_blank">
   ```

2. Line 143: Replace GitHub repo link
   ```html
   <a href="https://github.com/YOUR-GITHUB/mynomadcompanion" target="_blank">
   ```

### 3.4 Push Files to GitHub

In your `mynomadcompanion` folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mynomadcompanion.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### 3.5 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in left sidebar
4. Under **Source**, select **"Deploy from a branch"**
5. Under **Branch**, select **main** and **/ (root)**
6. Click **Save**

### 3.6 Wait for Deployment

GitHub will deploy your site. After 2-5 minutes, you'll see:

```
Your site is live at https://YOUR-USERNAME.github.io/mynomadcompanion/
```

Visit the URL to test your site!

---

## Part 4: Testing & Verification

### 4.1 Test the Full Flow

1. Open your GitHub Pages URL
2. Fill out the form completely
3. Click "Generate My Playbook"
4. Wait 30-60 seconds
5. Verify the playbook appears
6. Test download and copy buttons

### 4.2 Test Rate Limiting

1. Generate 5 playbooks from the same device
2. On the 6th attempt, you should see: "You've reached your monthly limit"

### 4.3 Monitor Costs

1. Check OpenAI usage: [platform.openai.com/usage](https://platform.openai.com/usage)
2. After 5 test generations, you should see ~$1.50-2.00 used

---

## Part 5: Custom Domain (Optional)

If you want a custom domain like `mynomadcompanion.com`:

### 5.1 Purchase Domain

Use any registrar (Namecheap, Google Domains, etc.)

### 5.2 Configure DNS

In your domain registrar:

1. Add CNAME record:
   - Name: `www`
   - Value: `YOUR-USERNAME.github.io`

2. Add A records for apex domain:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

### 5.3 Configure GitHub Pages

1. Go to repository Settings → Pages
2. Under "Custom domain", enter your domain
3. Click Save
4. Wait for DNS check (can take 24-48 hours)
5. Enable "Enforce HTTPS" once DNS is verified

---

## Troubleshooting

### "Worker not found" error
- Double-check the WORKER_URL in `app.js`
- Ensure worker is deployed: `wrangler deploy`

### "API key not found" error
- Re-add secret: `wrangler secret put OPENAI_API_KEY`
- Redeploy: `wrangler deploy`

### Rate limiting not working
- Verify KV namespace ID in `wrangler.toml`
- Check Cloudflare dashboard: Workers & Pages → KV

### OpenAI errors
- Check API key is valid in OpenAI dashboard
- Verify you have credits/payment method set up
- Check usage limits aren't exceeded

### GitHub Pages not loading
- Wait 5-10 minutes after enabling
- Check Settings → Pages shows "Your site is live"
- Try incognito/private browsing mode

---

## Maintenance

### Monthly Tasks
1. Check OpenAI costs (should be ~$15/month)
2. Monitor Cloudflare worker analytics
3. Update destination data if needed

### When Costs Spike
1. Check Cloudflare analytics for unusual traffic
2. Review OpenAI usage dashboard
3. Consider lowering MAX_REQUESTS_PER_IP in worker.js

### Updating Content
1. Edit files locally
2. Test changes
3. Push to GitHub: `git push`
4. Changes appear in 1-2 minutes

---

## Security Notes

- Never commit API keys to GitHub
- Use Wrangler secrets for sensitive data
- Rate limiting prevents abuse
- Cloudflare provides DDoS protection automatically

---

## Support

- Cloudflare Docs: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- OpenAI Docs: [platform.openai.com/docs](https://platform.openai.com/docs)
- GitHub Pages: [docs.github.com/pages](https://docs.github.com/pages)

---

## Summary

You now have:
- ✅ Static site on GitHub Pages (free)
- ✅ Cloudflare Worker with OpenAI integration (free hosting)
- ✅ IP-based rate limiting (5 playbooks/month per user)
- ✅ Cost control (~$15/month)
- ✅ Professional dark mode design
- ✅ Markdown export functionality

**Total monthly cost:** ~$15 (OpenAI only)
**Estimated users served:** 50-60 users/month
