# Fusion Creative Blueprint
## Your Test Client Stack

This blueprint sets up a complete lead generation and content system for Fusion Creative (or any marketing agency).

---

## What's Included

### Modules
1. **Lead Agent** — Qualifies restaurant/hospitality prospects from Apollo
2. **Email Agent** — Runs 5-touch LinkedIn + email sequences
3. **Content Agent** — Tracks TikTok/Instagram posting schedule
4. **Analytics Agent** — Monitors engagement and pipeline

### Integrations
- **Apollo.io** — Prospect data (Newcastle restaurants)
- **GoHighLevel** — Your existing CRM sync
- **LinkedIn** — Connection requests + messages
- **Email** — Your fusioncreative.co.uk domain
- **Instagram/TikTok** — Content tracking

### Workflows (n8n)
1. `apollo-import.json` — Hourly import of Newcastle restaurants
2. `ai-qualification.json` — Auto-score leads 0-100
3. `5-touch-sequence.json` — Multi-channel outreach over 12 days

### Email Templates
- **Problem Recognition** — "What happens to your social when you're busy?"
- **Social Proof** — New Greek results (2.6M views, 39K likes)
- **Final Follow-up** — Soft close, leaves door open

---

## Setup Steps

### 1. Environment Variables

Create `.env` file:

```
STATION_ID=fusion-creative-01
MANAGER_OS_URL=https://manageros.co.uk

# Database
DB_PASSWORD=your_secure_password

# n8n
N8N_USER=admin
N8N_PASSWORD=your_n8n_pass

# Apollo.io
APOLLO_API_KEY=your_apollo_key

# GoHighLevel
GHL_API_KEY=your_ghl_key
GHL_LOCATION_ID=your_location_id

# Email (SendGrid or similar)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_key

# LinkedIn (use browser automation or API)
LINKEDIN_EMAIL=jay@fusioncreative.co.uk
LINKEDIN_PASS=your_pass
```

### 2. Database Setup

```bash
# Run in Postgres container
psql -U postgres -d agentdb < database-schema.sql
```

### 3. Import Workflows

```bash
# In n8n (localhost:5678)
1. Settings → Import/Export → Import from file
2. Select: apollo-import.json
3. Select: ai-qualification.json
4. Select: 5-touch-sequence.json
5. Activate all workflows
```

### 4. Configure Qualification Prompt

Edit the AI qualification prompt in `ai-qualification.json`:

Fusion Creative scoring criteria (25 pts each):
1. Restaurant/hospitality in Newcastle/Gateshead area
2. Owner/Director/Manager title (decision maker)
3. Active social media presence or hiring (growth signal)
4. Not a chain/franchise (prefer independents)

Total 100 = ⭐⭐⭐⭐ qualified for sequence

### 5. Test Run

Before going live:

```bash
# Import 10 test prospects
# Verify they appear in dashboard
# Check AI scores are reasonable
# Send test email to yourself
# Verify it arrives in GHL
```

---

## Daily Operation

### Morning (2 min check)
1. Open Station Command dashboard
2. Check yesterday's stats:
   - New prospects imported
   - Leads qualified
   - Emails sent/replied

### Weekly (10 min review)
1. Review AI qualification accuracy
2. Manually review 5-10 scored leads
3. Approve/reject to train the model
4. Check email reply rates

### Monthly (30 min optimisation)
1. Review full funnel metrics
2. A/B test email subject lines
3. Adjust Apollo filters
4. Update qualification criteria

---

## Metrics to Track

| Metric | Target | Where |
|--------|--------|-------|
| Apollo imports/day | 50-100 prospects | n8n logs |
| Qualification rate | 15-20% | Dashboard |
| Email open rate | 25%+ | SendGrid/n8n |
| Reply rate | 5%+ | Dashboard |
| Meeting booked rate | 2%+ | GHL pipeline |
| Cost per lead | <£2 | Calculation |

---

## Troubleshooting

**Apollo not importing?**
- Check API key hasn't expired
- Verify query isn't too restrictive
- Check rate limits (100/hour free tier)

**AI scores all over the place?**
- Review prompt in n8n
- Add more examples to training
- Lower temperature (0.3) for consistency

**Emails going to spam?**
- Warm up domain first (10/day → 50/day over 2 weeks)
- Check SPF/DKIM records
- Personalise subject lines more

**LinkedIn connections not sending?**
- You may hit LinkedIn limits (100/week)
- Use voice notes instead (higher limits)
- Check LinkedIn hasn't flagged automation

---

## Customising for Other Verticals

To adapt for dental practices or tradespeople:

1. **Edit Apollo query** in `apollo-import.json`:
   - Change keywords: "restaurant" → "dental" or "plumber"
   - Add titles: "Principal Dentist", "Owner" etc.

2. **Update email templates**:
   - Change New Greek example to relevant case study
   - Adjust pain points (patient recall vs weekend enquiries)

3. **Modify qualification prompt**:
   - Different scoring criteria
   - Different success indicators

4. **Test with 20 prospects** before scaling

---

## Files in This Blueprint

```
blueprints/fusion-creative/
├── blueprint.json              # Metadata
├── README.md                   # This file
├── email-templates.json        # 3 email sequences
├── database-schema.json        # PostgreSQL schema
└── n8n/
    ├── apollo-import.json      # Hourly import
    ├── ai-qualification.json   # Auto-scoring
    └── 5-touch-sequence.json   # Outreach flow
```

---

## Next Steps After Testing

1. **Document results** — screenshot your first qualified leads
2. **Video walkthrough** — record yourself explaining the system
3. **Case study** — once you book 3 meetings, write it up
4. **Productise** — this becomes "Lead Gen Agency" blueprint for sales

---

*Built for Fusion Creative test run. Prove it works, then sell it as Manager OS.*
