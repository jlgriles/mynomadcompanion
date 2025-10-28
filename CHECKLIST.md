# Deployment Checklist

Use this as a quick reference while following SETUP.md

## ☐ Phase 1: Google Gemini Setup (5 minutes)
- [ ] Go to aistudio.google.com
- [ ] Sign in with Google account
- [ ] Click "Get API key"
- [ ] Create API key
- [ ] Copy API key to safe location
- [ ] No credit card needed!

## ☐ Phase 2: Cloudflare Worker (15 minutes)
- [ ] Create Cloudflare account
- [ ] Install wrangler CLI: `npm install -g wrangler`
- [ ] Login: `wrangler login`
- [ ] Create KV namespace: `wrangler kv namespace create "RATE_LIMIT"` (note: space, not colon)
- [ ] Copy KV namespace ID into wrangler.toml
- [ ] Add API key secret: `wrangler secret put GEMINI_API_KEY`
- [ ] Deploy worker: `wrangler deploy`
- [ ] Save worker URL (looks like: https://mynomad-worker.YOUR-NAME.workers.dev)
- [ ] Test with curl command from SETUP.md

## ☐ Phase 3: GitHub Pages (10 minutes)
- [ ] Create GitHub repository named "mynomadcompanion"
- [ ] Update app.js with your Worker URL
- [ ] Update index.html with your Venmo handle
- [ ] Update index.html with your GitHub repo link
- [ ] Push code: 
  ```
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR-USERNAME/mynomadcompanion.git
  git push -u origin main
  ```
- [ ] Enable GitHub Pages in repo Settings → Pages
- [ ] Wait 5 minutes for deployment
- [ ] Visit your site at: https://YOUR-USERNAME.github.io/mynomadcompanion/

## ☐ Phase 4: Testing (10 minutes)
- [ ] Generate a test playbook
- [ ] Test download functionality
- [ ] Test copy to clipboard
- [ ] Generate 5 playbooks to test rate limiting
- [ ] Verify 6th attempt is blocked
- [ ] Optional: Check Google AI Studio usage dashboard

## ☐ Phase 5: Launch (Optional)
- [ ] Update README.md with your live URL
- [ ] Share on social media
- [ ] Post in r/digitalnomad (follow community rules)
- [ ] No need to monitor costs - it's free!

---

## Troubleshooting Quick Reference

**Worker URL not working?**
- Redeploy: `wrangler deploy`
- Check worker logs: `wrangler tail`

**Gemini API errors?**
- Verify API key: `wrangler secret list`
- Check Google AI Studio for valid key
- Very unlikely to hit rate limits

**Rate limiting not working?**
- Verify KV namespace ID in wrangler.toml
- Check Cloudflare dashboard: Workers & Pages → KV

**GitHub Pages not loading?**
- Wait 10 minutes
- Check Settings → Pages shows green checkmark
- Clear browser cache

**"Service temporarily unavailable" message?**
- Daily free tier limit reached (very unlikely)
- Resets at midnight UTC
- Check if you have 300+ users per day

---

## Free Tier Benefits

✅ No cost monitoring needed
✅ No credit card required
✅ No surprise bills
✅ 1,500 requests/day capacity
✅ Can support 300+ users daily

Week 1: Just check it works!
- Expected: 5-50 test playbooks
- No costs to track

Week 2+: Occasional check
- Make sure service is running
- Check user feedback
- No cost monitoring needed

---

## Maintenance Notes

- **Monthly:** Quick test that site works
- **No cost tracking needed** - It's free!
- **Optional:** Check Cloudflare analytics for traffic
- **Optional:** Check Google AI Studio usage (just curiosity)
