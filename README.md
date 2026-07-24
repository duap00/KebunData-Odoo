# KebunData ERP, AI, and IoT Dashboard

This repository is the working codebase for the KebunData Odoo 18 stack, combining ERP, AI automation, and smart farming telemetry with a live water-quality monitoring dashboard.

---

## 📌 Current Scope

- Odoo 18 Community environment with Docker Compose
- OCI + GitHub integration for repo deployment and version control
- Custom Odoo addon development for smart farming and sensor telemetry
- Live water quality dashboard using Odoo OWL + Chart.js
- Website-facing solution page for the monitoring experience

---

## 🚀 Main Work in Progress

### Active Odoo Module
- `addons/kebun_iot/`
  - Custom module for the IoT dashboard and simulation service
  - Assets include a live dashboard, sensor data service, and website templates
  - Backend action/menu wiring exists for the monitoring UI

### Related Addons
- `addons/water_quality_monitor/`
  - Existing frontend dashboard prototype for water-quality monitoring
- `addons/kebun_water_quality/`
  - Copy of the previous dashboard module structure, kept as a reference during migration

### Current Dashboard Behavior
- Six independent live metric charts
- Simulated sensor telemetry with gradual drift and realistic snapshot behavior
- Live value, trend, and status badges for:
  - pH
  - EC
  - TDS
  - Salinity
  - Specific Gravity
  - Temperature

---

## 🧩 Repository Notes

### Container / Odoo Configuration
- The stack is expected to run from the Docker Compose setup at the repo root.
- The Odoo addon directory is being mounted and loaded through the Odoo configuration.
- The repository is now linked to GitHub and pushed to the `main` branch.

### Deployment Path
- GitHub is used as the source of truth.
- OCI can be connected to this repository for deployment or code sync.

---

## 📁 Project Structure

```text
.
├── docker-compose.yml
├── config/
├── addons/
│   ├── kebun_iot/
│   ├── water_quality_monitor/
│   └── kebun_water_quality/
├── project_blueprint.md
└── marketing_agent_plan.md
```

---

## ✅ Current Status

### Completed
- GitHub repository push completed for the current working changes
- Dashboard UI and JS assets prepared under `kebun_iot`
- Sensor service simulation logic implemented
- Website and backend action wiring prepared for the module

### In Progress
- Final module cleanup and naming consistency
- Confirmation of manifest and asset registration in Odoo
- Migration from legacy `kebun_water_quality` naming to the active `kebun_iot` module path

---

## 🔗 Related Docs

- Architecture blueprint: [project_blueprint.md](project_blueprint.md)
- Marketing automation roadmap: [marketing_agent_plan.md](marketing_agent_plan.md)

---

## ▶️ Suggested Next Step

1. Verify the Odoo addon loads correctly from the OCI / Docker runtime.
2. Install the `kebun_iot` module in Odoo Apps.
3. Open the dashboard action and confirm the six live charts render correctly.
4. Continue migration cleanup until the legacy addon naming is fully removed.

