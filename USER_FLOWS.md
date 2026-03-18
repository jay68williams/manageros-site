# Station Command — User Flows
## Step-by-Step Interaction Patterns for Antigravity

---

## Flow 1: Deploy New Station

**Goal:** Set up a new client station from scratch

### Step-by-Step

```
1. USER clicks [+ Deploy Station] in header
   → Modal opens: "Deploy New Station"

2. USER selects deployment method
   ├─ [ ] New Client (fresh Mac Mini)
   └─ [ ] Clone from Blueprint (fastest)

3. IF "Clone from Blueprint":
   ├─ USER selects blueprint
   └─ System pre-fills configuration

4. USER enters basic info:
   ├─ Client Name: "Kingsbrook M&A"
   ├─ Station ID: kingsbrook-01 (auto)
   ├─ Domain: kingsbrook.manageros.uk
   └─ Hardware Tier: Starter | Growth | Scale

5. SYSTEM validates domain
   → Green checkmark or error

6. USER clicks [Create Station]
   → Station appears in sidebar as "Deploying..."

7. SYSTEM shows progress:
   [=====>    ] Provisioning Mac Mini
   [=========>] Installing Docker
   [==========] Starting Services
   [DONE] Station ready

8. SYSTEM sends Tailscale auth key via email
   → USER copies key, runs on Mac Mini

9. Mac Mini connects
   → Status: 🟢 Healthy
   → USER clicks to see dashboard
```

**Time:** 10-15 min setup + 30 min provisioning

---

## Flow 2: Monitor Station Health

**Goal:** Check status, identify and fix issues

```
1. USER lands on Stations List
   → Grid of station cards with status

2. USER scans indicators:
   → 🟢 Green = good
   → 🟡 Yellow = warning
   → 🔴 Red = critical

3. USER clicks 🟡 Warning station
   → Detail page shows issue
   → Example: Disk 85% full

4. USER clicks [Run Cleanup]
   → Confirmation modal
   → Cleanup runs automatically
   → Status returns to 🟢
```

**Auto-fixes:**
| Issue | Fix |
|-------|-----|
| Disk full | Purge old logs |
| Memory high | Restart services |
| n8n stopped | Auto-restart |

---

## Flow 3: Manage Lead Qualification

**Goal:** Review AI decisions, override when needed

```
1. USER goes to Station → Lead Agent
   → Lead queue shows

2. Lead card appears:
   ◉ Jane Smith, ABC Corp
   AI Score: 87/100 ⭐⭐⭐⭐
   Reason: Company size 50+, hiring

3. AI shows criteria matched:
   ✓ Size 50-200 employees
   ✓ Title: Director
   ✓ Recent job posting
   ✗ Competitor domain

4. USER actions:
   [✓ Qualified] → Send to GHL
   [✗ Reject] → Archive
   [Edit] → Manual override

5. Feedback loop:
   "Save correction to improve AI?"
   [Yes] → Add to training
```

**Target:** <10% override rate

---

## Flow 4: Launch Email Sequence

**Goal:** Start automated outreach

```
1. USER goes to Email Agent
   → Sequence builder opens

2. USER selects template:
   [x] 5-Touch Outreach
   [ ] Follow-up Nurture
   [ ] Custom

3. Visual timeline:
   Day 1 ──●── LinkedIn Connect
   Day 3 ─────●── Voice Note
   Day 5 ───────●── Email 1
   Day 8 ──────────●── Email 2
   Day 12 ───────────●── Follow-up

4. USER customises:
   → Edit subject/body
   → Preview merge tags
   → Test send

5. USER sets trigger:
   [x] Auto-enroll qualified leads
   [ ] Manual approval

6. USER clicks [Activate]
   → "47 leads, 235 emails over 14 days"
   → Real-time stats show

7. USER can pause anytime:
   [Pause] → All holds
   [Resume] → Continues
```

**Limit:** 50 emails/day/station

---

## Flow 5: Review System Logs

**Goal:** Debug and audit

```
1. USER clicks [Logs] on station card
   → Log viewer loads

2. USER filters:
   Source: All | Agent | n8n | Ollama
   Level: All | Info | Warning | Error
   Time: Last hour | 24h | 7d
   Search: text

3. Log format:
   2026-03-17 14:32:15 [INFO] Lead qualified: jane@abc.com (87)
   2026-03-17 14:32:12 [WARN] Rate limit hit
   2026-03-17 14:31:08 [ERROR] Ollama timeout

4. USER clicks error
   → Expands with context
   → [Copy] for support

5. USER exports:
   [Download] → JSON | CSV | Text
```

**Retention:** 30 days live, 90 days archived

---

## Flow 6: Update Blueprint

**Goal:** Push config changes to multiple stations

```
1. USER goes to Blueprints
   → Grid of blueprints

2. USER clicks "Lead Gen"
   → Version: v1.2.0
   → 8 stations using

3. USER clicks [Edit]
   → JSON/YAML editor

4. USER edits config
   → n8n workflows
   → Agent prompts

5. SYSTEM validates
   → Syntax: ✓
   → Schema: ✓
   → Affects: 8 stations

6. USER creates v1.3.0
   → [Deploy to All]
   → [Test first]
   → [Schedule]

7. Deployment shows progress:
   kingsbrook-01: ✅ Updated
   fusion-01: ✅ Updated
   ...
```

**Rollback:** Keep last 5 versions, 1-click restore

---

END OF USER FLOWS