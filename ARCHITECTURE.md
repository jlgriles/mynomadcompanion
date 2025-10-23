# MyNomadCompanion - Architecture Diagram

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     (GitHub Pages - FREE)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  index.html  │  │  styles.css  │  │   app.js     │         │
│  │   (Form UI)  │  │ (Dark Mode)  │  │ (Logic/API)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  │ HTTPS POST Request
                                  │ (destination, duration, budget, etc.)
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE WORKER                            │
│                   (Serverless - FREE tier)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │              worker.js                            │          │
│  │                                                   │          │
│  │  1. Receive user request                         │          │
│  │  2. Extract IP address (CF-Connecting-IP)        │          │
│  │  3. Check rate limit (KV Storage)                │          │
│  │     ├─ If over limit → Return 429 error          │          │
│  │     └─ If under limit → Continue                 │          │
│  │  4. Build OpenAI prompt with user data           │          │
│  │  5. Call OpenAI API                              │          │
│  │  6. Increment rate limit counter                 │          │
│  │  7. Return playbook markdown                     │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌──────────────┐              ┌──────────────┐               │
│  │ KV Storage   │              │  Secrets     │               │
│  │ (Rate Limit) │              │ (API Key)    │               │
│  └──────────────┘              └──────────────┘               │
└─────────────────┬───────────────────────┬─────────────────────┘
                  │                       │
                  │                       │ Secure API Call
                  │                       ▼
                  │            ┌─────────────────────────┐
                  │            │     OPENAI API          │
                  │            │   (GPT-4o-mini)         │
                  │            │   ~$0.30 per playbook   │
                  │            └─────────────────────────┘
                  │                       │
                  │                       │ Returns generated playbook
                  │                       ▼
                  │            ┌─────────────────────────┐
                  └───────────▶│   Markdown Content      │
                               │   (14 sections)         │
                               └─────────────────────────┘
                                          │
                                          │ JSON Response
                                          ▼
                               ┌─────────────────────────┐
                               │   USER BROWSER          │
                               │   - Display playbook    │
                               │   - Download .md file   │
                               │   - Copy to clipboard   │
                               └─────────────────────────┘
```

## Rate Limiting Logic

```
┌─────────────────────────────────────────────────────────────┐
│                      IP Address                             │
│                    (e.g., 123.45.67.89)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  KV Storage Lookup  │
              │  Key: "rate_limit:  │
              │        123.45.67.89"│
              └─────────┬───────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
  ┌───────────────┐          ┌───────────────┐
  │ No record     │          │ Record exists │
  │ found         │          │ count = X     │
  └───────┬───────┘          └───────┬───────┘
          │                           │
          ▼                           ▼
  ┌───────────────┐          ┌───────────────┐
  │ Create new    │          │ Check if      │
  │ record with   │          │ X >= 5?       │
  │ count = 1     │          │               │
  │ TTL = 30 days │          └───────┬───────┘
  └───────┬───────┘                  │
          │                  ┌───────┴────────┐
          │                  │                │
          │                  ▼                ▼
          │          ┌───────────┐    ┌──────────────┐
          │          │ Yes       │    │ No           │
          │          │ Block!    │    │ Increment +1 │
          │          └───────────┘    │ Allow!       │
          │                           └──────────────┘
          │                                   │
          └───────────────┬───────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Proceed to    │
                  │ OpenAI API    │
                  └───────────────┘
```

## File Relationships

```
GitHub Repository (Public)
│
├── index.html ──────────▶ loads styles.css
│                    │
│                    └───▶ loads app.js
│
├── app.js ──────────────▶ calls WORKER_URL (Cloudflare)
│
├── styles.css (styling only, no dependencies)
│
├── worker.js ───────────▶ deployed to Cloudflare
│        │                 (separate from GitHub)
│        │
│        ├──────────────▶ reads OPENAI_API_KEY (secret)
│        │
│        └──────────────▶ uses RATE_LIMIT (KV namespace)
│
├── wrangler.toml ───────▶ configures worker.js deployment
│
└── Documentation
    ├── SETUP.md (step-by-step deployment)
    ├── CHECKLIST.md (quick reference)
    ├── README.md (project overview)
    └── PROJECT-SUMMARY.md (this overview)
```

## Data Flow Example

### User generates playbook for Lisbon:

```
1. User fills form:
   - Destination: Lisbon
   - Duration: 2-3 months
   - Budget: Moderate
   - Work: Full-time remote
   - Interests: Culture, Food, Tech

2. User clicks "Generate My Playbook"
   ↓
3. app.js collects form data → JSON object
   ↓
4. Sends POST to Cloudflare Worker:
   POST https://mynomad-worker.abc123.workers.dev/generate
   Body: { destination: "lisbon", duration: "2-3-months", ... }
   ↓
5. Worker receives request
   ↓
6. Worker extracts IP: 123.45.67.89
   ↓
7. Worker checks KV: rate_limit:123.45.67.89
   - Result: count = 2 (under limit)
   ↓
8. Worker builds OpenAI prompt:
   "Create comprehensive trip playbook for Lisbon..."
   ↓
9. Worker calls OpenAI API
   - Model: gpt-4o-mini
   - Cost: ~$0.30
   - Time: 20-40 seconds
   ↓
10. OpenAI returns ~4000 tokens of markdown
    ↓
11. Worker increments counter: count = 3
    ↓
12. Worker returns JSON: { playbook: "# Lisbon...\n\n## Overview..." }
    ↓
13. app.js receives response
    ↓
14. Displays in browser
    ↓
15. User clicks "Download Markdown"
    ↓
16. Browser saves: lisbon-portugal-playbook.md
```

## Cost Per Request Breakdown

```
Single Playbook Generation:
├── GitHub Pages hosting: $0.00 (free)
├── Cloudflare Worker compute: $0.00 (free tier)
├── KV Storage read/write: $0.00 (free tier)
├── OpenAI API call: $0.25-0.35
└── TOTAL: ~$0.30

Monthly (50 playbooks):
├── Static hosting: $0
├── Serverless compute: $0
├── Storage: $0
├── AI generation: $15
└── TOTAL: $15/month
```

## Security Features

```
┌──────────────────────────────────────┐
│           Security Layers            │
├──────────────────────────────────────┤
│ 1. GitHub Pages HTTPS (automatic)   │
│ 2. Cloudflare DDoS protection       │
│ 3. CORS headers (origin control)    │
│ 4. Rate limiting (5 per IP/month)   │
│ 5. API key as secret (not in code)  │
│ 6. No database (no data breaches)   │
│ 7. No user accounts (no auth issues)│
└──────────────────────────────────────┘
```

## Scaling Characteristics

```
Users/Month     Monthly Cost    Notes
─────────────────────────────────────────
10              $3              Testing phase
50              $15             Target launch
100             $30             Still manageable
500             $150            Consider optimizing
1000+           $300+           Need premium tier/sponsorships

Breaking point: ~200-300 users at current rate limits
Solution: Lower to 3 playbooks/month or add paid tier
```

## Technology Choices Explained

| Choice | Why This Over Alternatives? |
|--------|----------------------------|
| **GitHub Pages** | Free, reliable, simple deployment vs Netlify/Vercel |
| **Cloudflare Workers** | Free tier generous, KV storage included vs AWS Lambda |
| **Vanilla JS** | No build step, fast loading vs React/Vue complexity |
| **GPT-4o-mini** | 80% cheaper than GPT-4, good enough quality |
| **Markdown export** | Universal, Notion-compatible vs PDF complexity |
| **IP rate limiting** | No authentication needed vs user accounts/sessions |
| **Dark mode** | Modern aesthetic, popular with nomads vs light mode |

---

This architecture is designed to be:
✅ **Simple** - No complex frameworks or dependencies
✅ **Cheap** - ~$15/month for 50 users
✅ **Scalable** - Can handle 100k requests/day on free tier
✅ **Maintainable** - Single developer can manage easily
✅ **Secure** - No database, no user data, minimal attack surface
