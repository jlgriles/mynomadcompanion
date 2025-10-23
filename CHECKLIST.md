# Deployment Checklist

Use this as a quick reference while following SETUP.md

## ☐ Phase 1: OpenAI Setup (5 minutes)
- [ ] Create OpenAI account at platform.openai.com
- [ ] Generate API key
- [ ] Set hard limit to $20/month
- [ ] Set soft limit to $15/month
- [ ] Add payment method
- [ ] Copy API key to safe location

## ☐ Phase 2: Cloudflare Worker (15 minutes)
- [ ] Create Cloudflare account
- [ ] Install wrangler CLI: `npm install -g wrangler`
- [ ] Login: `wrangler login`
- [ ] Create KV namespace: `wrangler kv:namespace create "RATE_LIMIT"`
- [ ] Copy KV namespace ID into wrangler.toml
- [ ] Add API key secret: `wrangler secret put OPENAI_API_KEY`
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
- [ ] Check OpenAI usage dashboard

## ☐ Phase 5: Launch (Optional)
- [ ] Update README.md with your live URL
- [ ] Share on social media
- [ ] Post in r/digitalnomad (follow community rules)
- [ ] Monitor OpenAI costs daily for first week

---

## Troubleshooting Quick Reference

**Worker URL not working?**
- Redeploy: `wrangler deploy`
- Check worker logs: `wrangler tail`

**OpenAI errors?**
- Verify API key: `wrangler secret list`
- Check OpenAI usage limits

**Rate limiting not working?**
- Verify KV namespace ID in wrangler.toml
- Check Cloudflare dashboard: Workers & Pages → KV

**GitHub Pages not loading?**
- Wait 10 minutes
- Check Settings → Pages shows green checkmark
- Clear browser cache

---

## Cost Monitoring

Week 1: Check daily
- Expected: $0.50-1.00/day for testing
- Alert if over $2/day

Week 2+: Check weekly
- Expected: $10-15/month
- Alert if over $25/month

Set calendar reminders!
