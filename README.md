# KebunData ERP, AI, and IoT Dashboard

![Odoo 18](https://img.shields.io/badge/Odoo-18.0_Community-714B67?style=flat-square&logo=odoo)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![OCI](https://img.shields.io/badge/OCI-Oracle_Cloud-F80000?style=flat-square&logo=oracle)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)

This repository serves as the core codebase for the **KebunData Odoo 18** platform—integrating ERP business logic, Agentic AI automation, and smart farming telemetry with a real-time water-quality monitoring dashboard.

---

## 📌 Current Scope

- **Odoo 18 Community:** Containerized deployment using Docker Compose.
- **OCI Infrastructure:** Cloud deployment and continuous repository sync via GitHub.
- **IoT & Telemetry:** Custom Odoo addons for sensor data ingestion and live monitoring.
- **OWL & Chart.js Dashboard:** Live frontend dashboard built using Odoo Web Library (OWL).
- **Public Solution Page:** Web-facing dashboard interface for real-time farm metrics.

---

## 🚀 Main Work in Progress

### Active Odoo Module
- `addons/kebun_iot/`
  - Core module housing the IoT dashboard and sensor simulation service.
  - Assets include live UI widgets, data streaming services, and web controller templates.
  - Wired with Odoo backend actions and navigation menus.

### Legacy / Reference Addons
- `addons/water_quality_monitor/` and `addons/kebun_water_quality/`
  - Frontend dashboard prototypes kept as architectural references during the migration to `kebun_iot`.

### Live Metrics Tracked
Simulated sensor telemetry with realistic drift snapshotting for:
- **pH** & **EC** (Electrical Conductivity)
- **TDS** (Total Dissolved Solids)
- **Salinity**, **Specific Gravity**, & **Temperature**

---

## 📁 Project Structure

```text
.
├── docker-compose.yml          # Container stack configuration
├── config/                     # Odoo configuration files
├── addons/
│   ├── kebun_iot/              # Main active IoT & dashboard module
│   ├── water_quality_monitor/  # Prototype reference
│   └── kebun_water_quality/    # Legacy module (in migration)
├── project_blueprint.md        # Architecture & deployment docs
└── marketing_agent_plan.md     # Agentic AI integration roadmap
```

## ⚡ Quick Start
To spin up the Odoo 18 environment locally:

```bash
# Clone the repository
git clone https://github.com/duap00/KebunData-Odoo.git
cd KebunData-Odoo

# Launch Odoo and PostgreSQL containers
docker compose up -d
```

Access Odoo at `http://localhost:8069` and update your App List to install `kebun_iot`.

## ✅ Current Status & Roadmap

- [x] Initial OCI & GitHub pipeline setup.
- [x] Fixed `kebun_iotold` manifest asset references to `kebun_water_quality`.
- [x] Inline OWL template (`xml` tag) and Chart.js telemetry rendering integrated into `kebun_water_quality`.
- [x] Public `/solution` route dashboard rendering fixed with full-width layout via `publicWidget`.
- [x] All asset declarations, ES modules (`/** @odoo-module **/`), and views committed and pushed to GitHub main branch.
- [ ] **Next:** OCI deployment verification & live server sync (`git pull`).
- [ ] **Next:** Agentic AI integration via n8n and OCI background tasks.

## 🔗 Related Documentation

- 📄 [Architecture Blueprint](project_blueprint.md)
- 📄 [Marketing & Agentic AI Plan](marketing_agent_plan.md)

