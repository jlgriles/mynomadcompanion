# MyNomadCompanion

AI-powered trip playbooks for digital nomads. Generate comprehensive, personalized guides for 25+ destinations worldwide using Google's free Gemini API.

🌍 **Live Site:** [Add your GitHub Pages URL here]

💚 **Completely Free** - No credit card required, powered by Google Gemini's free tier

## Features

- 25 curated digital nomad destinations across Europe, Asia, Americas, and more
- AI-generated personalized playbooks covering:
  - Logistics & pre-departure checklists
  - Visa requirements & legal info
  - Budget breakdowns by tier
  - Work setup (coworking, cafes, internet)
  - Language learning essentials
  - Cultural preparation
  - Local tips & insights
- Markdown export for easy integration with Notion, Obsidian, etc.
- Dark mode design optimized for digital nomads
- IP-based rate limiting (5 playbooks/month per user)
- Free and community-supported

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Backend:** Cloudflare Workers (serverless)
- **AI:** Google Gemini 1.5 Flash (free tier)
- **Hosting:** GitHub Pages
- **Rate Limiting:** Cloudflare KV Storage

## Cost Structure

- **Hosting:** $0 (GitHub Pages + Cloudflare Workers free tier)
- **AI Generation:** $0 (Google Gemini free tier)
- **Total:** **$0/month** (completely free!)

**Free Tier Capacity:**
- 1,500 playbooks per day
- Can support 300+ users daily
- No credit card required

## Quick Start

See [SETUP.md](SETUP.md) for detailed deployment instructions.

1. Clone this repository
2. Set up Google Gemini API key (free, no credit card)
3. Deploy Cloudflare Worker
4. Push to GitHub Pages
5. You're live!

## Project Structure

```
mynomadcompanion/
├── index.html          # Main page
├── styles.css          # Dark mode styling
├── app.js              # Frontend logic
├── worker.js           # Cloudflare Worker (API + rate limiting)
├── wrangler.toml       # Worker configuration
├── SETUP.md            # Deployment guide
└── README.md           # This file
```

## Development

### Local Development

Open `index.html` in your browser. Note: Gemini integration requires deployed Worker.

### Deploy Updates

```bash
git add .
git commit -m "Your update message"
git push
```

Changes appear on GitHub Pages in 1-2 minutes.

### Update Worker

```bash
wrangler deploy
```

## Rate Limiting

- 5 playbooks per IP address per 30 days
- Implemented via Cloudflare KV storage
- Protects free tier limits and prevents abuse

## Free Tier Management

**What happens if Gemini's daily limit is reached?**
- Service displays: "Service temporarily unavailable. Please try again tomorrow."
- Resets daily at midnight UTC
- Very unlikely with current rate limiting

## Contributing

This is a solo project, but suggestions are welcome! Open an issue or reach out.

## Values

- **Simplicity** - Clean, focused, easy to use
- **Precision** - Accurate, actionable information
- **Sustainability** - Zero-cost, community-supported
- **Cultural Awareness** - Respectful, informed travel guidance

## Support

If you find this tool valuable, consider supporting development:

💙 [Venmo: @YOUR-HANDLE]

## License

MIT License - Feel free to fork and adapt for your own use.

## Disclaimer

MyNomadCompanion is not a visa or immigration agency. All information is for guidance only. Always verify requirements with official sources and consult professionals for legal/immigration advice.

---

## Why Gemini?

We use Google's Gemini 1.5 Flash model because:
- ✅ **Completely free** - No credit card, no costs
- ✅ **Generous limits** - 1,500 requests/day
- ✅ **High quality** - Excellent playbook generation
- ✅ **Fast** - Quick response times
- ✅ **Reliable** - Google's infrastructure

This allows us to offer the service completely free to the digital nomad community!
