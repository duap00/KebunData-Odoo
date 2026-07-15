# KebunData ERP & AI Marketing Agent

A comprehensive **Odoo 18.0 + n8n + Hermes AI** system deployed on **Oracle Cloud Infrastructure (OCI)** to automate lead generation, CRM management, and AI-driven marketing workflows.

---

## 📋 Quick Links

- **Architecture & Design:** See [project_blueprint.md](project_blueprint.md)
- **Implementation Roadmap:** See [marketing_agent_plan.md](marketing_agent_plan.md)

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed
- `.env` file configured with your OCI credentials (see `.env.example`)

### Setup
1. Copy `.env.example` to `.env` and fill in your credentials
2. Start the stack:
   ```bash
   docker-compose up -d
   ```
3. Access your services via your domain (configured through Nginx Proxy Manager):
   - **Odoo ERP:** `https://erp.kebundata.my` (or local port `http://localhost:8069`)
   - **n8n Automation:** `https://n8n.kebundata.my` (or local port `http://localhost:5678`)

---

## 📦 Project Structure

```
.
├── docker-compose.yml       # Odoo 18.0 + PostgreSQL 15 stack
├── config/                  # Odoo configuration files
├── addons/                  # Custom Odoo modules (e.g., kebundata_gantt_view)
├── .env.example             # Environment variables template
├── project_blueprint.md     # System architecture & component breakdown
└── marketing_agent_plan.md  # 4-week AI Marketing Agent roadmap
```

---

## 🎯 Current Status

**Phase 1: Infrastructure Setup** (In Progress)
- Odoo Docker environment
- PostgreSQL database
- n8n workflow engine configuration

Next milestones:
- Week 1: Meta-to-n8n connection
- Week 2: AI qualification engine
- Week 3: Odoo CRM sync
- Week 4: End-to-end testing & go-live

For detailed weekly tasks, see [marketing_agent_plan.md](marketing_agent_plan.md).

---

## 📞 Support

For questions about the architecture, refer to [project_blueprint.md](project_blueprint.md).
For step-by-step tasks and deadlines, refer to [marketing_agent_plan.md](marketing_agent_plan.md).
