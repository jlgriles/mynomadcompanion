# MyNomadCompanion

AI-powered trip playbooks for digital nomads. Generate comprehensive, personalized guides for 25+ destinations worldwide.

🌍 **Live Site:** [Add your GitHub Pages URL here]

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
- **AI:** OpenAI GPT-4o-mini
- **Hosting:** GitHub Pages
- **Rate Limiting:** Cloudflare KV Storage

## Cost Structure

- **Hosting:** $0 (GitHub Pages + Cloudflare Workers free tier)
- **AI Generation:** ~$15/month for 50 playbooks
- **Total:** ~$15/month

## Quick Start

See [SETUP.md](SETUP.md) for detailed deployment instructions.

1. Clone this repository
2. Set up OpenAI API key
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

Open `index.html` in your browser. Note: OpenAI integration requires deployed Worker.

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
- Prevents abuse while keeping costs manageable

## Contributing

This is a solo project, but suggestions are welcome! Open an issue or reach out.

## Values

- **Simplicity** - Clean, focused, easy to use
- **Precision** - Accurate, actionable information
- **Sustainability** - Cost-controlled, community-supported
- **Cultural Awareness** - Respectful, informed travel guidance

## Support

If you find this tool valuable, consider supporting development:

💙 [Venmo: @YOUR-HANDLE]

## License

MIT License - Feel free to fork and adapt for your own use.

## Disclaimer

MyNomadCompanion is not a visa or immigration agency. All information is for guidance only. Always verify requirements with official sources and consult professionals for legal/immigration advice.
