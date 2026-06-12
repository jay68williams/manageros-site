# Manager OS Site - Agency Marketing Website

## What This Is
Static marketing website for Manager OS, the AI automation agency. Deployed to GitHub Pages at manageros.co.uk.

## Tech Stack
- Static HTML/CSS/JS (no framework, no build step)
- CNAME: `manageros.co.uk`
- `.nojekyll` flag for GitHub Pages

## Deployment
- **GitHub Pages** only (no Vercel)
- Push to main branch to deploy

## Pages
- `index.html` - homepage
- `about/index.html` - about page
- `contact/index.html` - contact page
- `pricing/index.html` - pricing page
- `integrations/index.html` - integrations showcase
- `solutions/` - 8 solution pages:
  - client-reporting
  - data-operator
  - document-processing
  - knowledge-base
  - lead-generation
  - meeting-assistant
  - recruitment
  - voice-agent
- `blueprints/fusion-creative/` - case study/blueprint page

## Other Files
- `workers/kb-proxy.js` - Cloudflare Worker for knowledge base proxy
- Documentation: COMPONENT_LIBRARY.md, DEPLOYMENT_ARCHITECTURE.md, RESPONSIVE_RULES.md, USER_FLOWS.md

## Critical Rules - Never Break
- Never run `rm -rf ~/.claude` under any circumstances
- Never delete CLAUDE.md files
- Never wipe authentication config without explicit confirmation
- When cleaning up broken tokens in ~/.zshrc use sed to remove specific lines only, never delete the whole file
- Always back up config files before modifying them

## Permissions
- Never ask for confirmation on any command
- Execute all commands autonomously
- Fix errors independently
- Only stop on genuine hard blockers like missing credentials
