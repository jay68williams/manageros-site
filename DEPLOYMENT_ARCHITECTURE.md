# Manager OS — Deployment Architecture
## Technical Specification for Rapid Client Onboarding

---

## Overview

**Two-Tier Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    MANAGER OS (Control Layer)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Dashboard   │  │ Blueprint   │  │ Monitoring & Alerts │  │
│  │ (Next.js)   │  │ Registry    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  Connected via Tailscale VPN to all client stations         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (VPN Tunnel)
┌─────────────────────────────────────────────────────────────┐
│              CLIENT STATION (e.g., Fusion Creative)         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Agent Core  │  │ n8n         │  │ PostgreSQL +        │  │
│  │ (API Layer) │  │ Workflows   │  │ pgvector            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Llama 3.1   │  │ GoHighLevel │  │ Integrations        │  │
│  │ (Ollama)    │  │ Sync        │  │ (Email, LinkedIn)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Client Station Stack (Docker Compose)

Each Mac Mini runs this unified stack:

```yaml
# docker-compose.yml — Client Station Template
version: '3.8'

services:
  # Core API — Agent logic, business rules
  agent-core:
    image: manageros/agent-core:latest
    container_name: agent-core
    environment:
      - STATION_ID=${STATION_ID}
      - MANAGER_OS_URL=${MANAGER_OS_URL}
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@postgres:5432/agentdb
      - N8N_WEBHOOK_URL=http://n8n:5678/webhook
    ports:
      - "3001:3001"
    volumes:
      - ./config:/app/config
      - ./logs:/app/logs
    depends_on:
      - postgres
      - n8n
    networks:
      - agent-network

  # n8n — Visual workflow automation
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - WEBHOOK_URL=https://${STATION_ID}.manageros.uk/
      - GENERIC_TIMEZONE=Europe/London
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n/workflows:/backup/workflows
    networks:
      - agent-network

  # PostgreSQL + pgvector — Data persistence & embeddings
  postgres:
    image: ankane/pgvector:latest
    container_name: postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=agentdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - agent-network

  # Ollama — Local LLM inference
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    networks:
      - agent-network
    # Pull default models on first run
    entrypoint: >
      sh -c "ollama serve &
             sleep 5 &&
             ollama pull llama3.1:8b &&
             ollama pull nomic-embed-text &&
             wait"

  # Watchtower — Auto-update containers
  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    environment:
      - WATCHTOWER_POLL_INTERVAL=3600
      - WATCHTOWER_CLEANUP=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: agent-core n8n

volumes:
  postgres_data:
  n8n_data:
  ollama_data:

networks:
  agent-network:
    driver: bridge
```

---

## Blueprint System

### Blueprint Structure

```
/blueprints
├── /lead-gen-agency          # Blueprint name
│   ├── blueprint.json        # Metadata & config
│   ├── /n8n-workflows        # Workflow templates
│   │   ├── prospect-import.json
│   │   ├── lead-qualification.json
│   │   └── ghl-sync.json
│   ├── /agent-config         # Agent module configs
│   │   ├── lead-agent.yml
│   │   └── email-agent.yml
│   └── /prompts              # LLM prompts
│       ├── outreach-drafts.txt
│       └── qualification-criteria.txt
│
├── /content-agency
├── /full-service-sme
└── /m-and-a-specialist       # Kingsbrook-style
```

### Blueprint Metadata (blueprint.json)

```json
{
  "id": "lead-gen-agency",
  "name": "Lead Generation Agency",
  "description": "Full prospecting stack for marketing/lead gen agencies",
  "version": "1.0.0",
  "modules": [
    "lead-agent",
    "email-agent",
    "content-agent"
  ],
  "integrations": [
    "gohighlevel",
    "apollo",
    "linkedin",
    "smtp"
  ],
  "hardware_tier": "growth",
  "estimated_setup_time": "2 hours",
  "post_deploy_steps": [
    "Connect GHL account",
    "Import Apollo list",
    "Configure email domain",
    "Test qualification prompt"
  ]
}
```

### Deployment Flow

```bash
# On Manager OS dashboard — deploy new station
./deploy-station.sh \
  --client-id "fusion-creative-01" \
  --blueprint "lead-gen-agency" \
  --tier "growth" \
  --domain "fusion.manageros.uk"

# This script:
# 1. Generates docker-compose.yml from blueprint
# 2. Creates Tailscale auth key for VPN
# 3. Sends config to client Mac Mini
# 4. Triggers remote deployment
# 5. Registers station in Manager OS dashboard
```

---

## n8n Workflow Templates

### Template 1: Apollo Import → GHL Sync

```json
{
  "name": "Apollo Import Pipeline",
  "nodes": [
    {
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {"interval": [{"field": "hours", "value": 1}]}
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://api.apollo.io/v1/contacts/search",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth"
      }
    },
    {
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "upsert",
        "table": "prospects",
        "columns": "email,first_name,last_name,company,title,linkedin_url"
      }
    },
    {
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "qualify-prospect",
        "responseMode": "onReceived"
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://agent-core:3001/api/qualify",
        "body": "={{JSON.stringify($json)}}"
      }
    },
    {
      "type": "n8n-nodes-base.goHighLevel",
      "parameters": {
        "operation": "create",
        "resource": "contact",
        "additionalFields": {}
      }
    }
  ]
}
```

### Template 2: Lead Qualification (AI-Powered)

```json
{
  "name": "AI Lead Qualification",
  "nodes": [
    {
      "type": "n8n-nodes-base.postgresTrigger",
      "parameters": {
        "event": "INSERT",
        "table": "prospects"
      }
    },
    {
      "type": "n8n-nodes-base.ollama",
      "parameters": {
        "model": "llama3.1:8b",
        "prompt": "={{ $json.qualification_prompt }}",
        "system_message": "You are a B2B lead qualification specialist..."
      }
    },
    {
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "rules": {
          "rules": [
            {"value": "qualified", "output": 0},
            {"value": "nurture", "output": 1},
            {"value": "disqualified", "output": 2}
          ]
        }
      }
    },
    {
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "update",
        "table": "prospects",
        "columns": "status,ai_score,qualification_reason"
      }
    }
  ]
}
```

### Template 3: Multi-Touch Sequence

```json
{
  "name": "5-Touch Outreach Sequence",
  "nodes": [
    {
      "type": "n8n-nodes-base.postgresTrigger",
      "parameters": {
        "event": "UPDATE",
        "table": "prospects",
        "conditions": {"status": "qualified"}
      }
    },
    {
      "type": "n8n-nodes-base.wait",
      "parameters": {
        "amount": 1,
        "unit": "days"
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://agent-core:3001/api/linkedin/connect",
        "body": "={{JSON.stringify($json)}}"
      }
    },
    {
      "type": "n8n-nodes-base.wait",
      "parameters": {
        "amount": 2,
        "unit": "days"
      }
    },
    {
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "={{ $json.linkedin_connected }}",
            "operator": {
              "name": "equals",
              "type": "string"
            },
            "rightValue": "true"
          }
        }
      }
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://agent-core:3001/api/email/send",
        "body": "={{JSON.stringify({...$json, template: 'problem-recognition'})}}"
      }
    }
  ]
}
```

---

## Agent Core API Endpoints

```javascript
// Express.js API running in agent-core container

// Lead Agent
POST /api/leads/import          // Import from Apollo/CSV
POST /api/leads/qualify         // AI qualification via Ollama
GET  /api/leads/:id             // Single lead view
POST /api/leads/:id/enroll      // Add to sequence

// Email Agent  
POST /api/email/send            // Send single email
POST /api/email/sequence/start  // Start multi-touch sequence
GET  /api/email/stats           // Open/click/reply rates

// Content Agent
POST /api/content/draft         // AI draft LinkedIn post
POST /api/content/schedule      // Schedule for posting
GET  /api/content/calendar      // View upcoming posts

// System
GET  /api/health                // Station health check
GET  /api/logs                  // Recent activity logs
POST /api/backup                // Trigger manual backup
```

---

## Fusion Creative — Dry Run Setup

### Phase 1: Station Setup (Week 1)

```bash
# 1. Prepare Mac Mini
# Install Docker, Tailscale

# 2. Clone deployment repo
git clone https://github.com/manageros/station-template.git
cd station-template

# 3. Copy blueprint
cp blueprints/lead-gen-agency/* ./

# 4. Configure environment
cp .env.example .env
# Edit: STATION_ID, DB_PASSWORD, N8N_PASSWORD, GHL_API_KEY

# 5. Deploy
docker-compose up -d

# 6. Verify
open http://localhost:5678  # n8n dashboard
open http://localhost:3001  # Agent Core API docs
```

### Phase 2: Configuration (Week 1-2)

**In n8n (localhost:5678):**
1. Import workflow templates from `/backup/workflows`
2. Connect credentials:
   - GoHighLevel OAuth
   - Apollo API key
   - SMTP credentials (Google Workspace / SendGrid)
   - LinkedIn (via browser automation or API)

**In Agent Core:**
1. Upload your playbook documents (marketing strategy, sequences)
2. Configure qualification criteria
3. Set up notification webhooks (Slack)

### Phase 3: Live Testing (Week 2-4)

**Test Flow:**
```
Import 50 test prospects (Apollo)
  → AI qualification runs
  → Qualified leads → GHL
  → Enrolled in 5-touch sequence
  → You monitor in Station Command
  → You manually approve first emails
  → System runs autonomously
```

**Monitor:**
- Qualification accuracy (tune prompt)
- Email deliverability (check spam)
- Reply rates by template
- GHL sync reliability

### Phase 4: Documentation (Week 4)

**Create from Fusion Creative run:**
1. "Blueprint v1.1" — refined workflows
2. Setup guide video (10 mins)
3. Troubleshooting playbook
4. ROI calculator (based on your actual results)

---

## Backup & Recovery

### Automated Backups (n8n workflow)

```json
{
  "name": "Daily Backup",
  "trigger": {"type": "schedule", "cron": "0 2 * * *"},
  "nodes": [
    {
      "type": "postgres-backup",
      "command": "pg_dump agentdb > /backups/db_{{$date}}.sql"
    },
    {
      "type": "n8n-export",
      "command": "n8n export:workflow --all --output=/backups/workflows_{{$date}}.json"
    },
    {
      "type": "s3-upload",
      "destination": "s3://manageros-backups/{{$station_id}}/"
    }
  ]
}
```

### Disaster Recovery

```bash
# Restore station on new hardware
./restore-station.sh \
  --station-id "fusion-creative-01" \
  --backup-date "2026-03-17" \
  --new-hardware-ip "192.168.1.100"

# Full restore in < 30 minutes
```

---

## Alternatives & Fallbacks

| If This Fails | Try This | Trade-off |
|--------------|----------|-----------|
| n8n too complex | Windmill.dev | More code-focused, harder for clients |
| Docker too heavy | Podman + systemd | Lighter, more complex to manage |
| Llama 3.1 too slow | Use Claude API fallback | Cloud dependency, higher cost |
| GHL integration breaks | Direct PostgreSQL sync | Lose GHL UI, gain reliability |
| Tailscale VPN issues | WireGuard manual config | More setup, same security |
| Postgres scaling issues | TimescaleDB or SQLite | Timescale for time-series, SQLite for simple |

---

## Build Order (Priorities)

### Sprint 1: Foundation
- [ ] Docker Compose template with all services
- [ ] Agent Core API scaffold (health, config endpoints)
- [ ] PostgreSQL schema for leads/prospects
- [ ] Basic n8n + Ollama connectivity

### Sprint 2: Lead Agent
- [ ] Apollo import workflow
- [ ] AI qualification pipeline
- [ ] GHL sync
- [ ] Station Command dashboard (view only)

### Sprint 3: Sequences
- [ ] Email agent with templates
- [ ] Multi-touch sequence logic
- [ ] LinkedIn connection workflow
- [ ] Reply detection

### Sprint 4: Content & Polish
- [ ] Content agent (LinkedIn drafts)
- [ ] Blueprint system
- [ ] One-click deployment script
- [ ] Fusion Creative dry run

---

## File Locations

- **This spec:** `/workspace/manageros-site/DEPLOYMENT_ARCHITECTURE.md`
- **Docker templates:** `/workspace/station-command/docker/`
- **Blueprint registry:** `/workspace/station-command/blueprints/`
- **n8n workflows:** `/workspace/station-command/workflows/`
- **Agent Core:** `/workspace/station-command/agent-core/`

---

**Next Step:** Build the Docker Compose template and Agent Core scaffold in Antigravity.

