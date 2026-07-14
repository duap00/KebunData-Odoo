# 1-Month AI Marketing Agent Implementation Plan

This plan is optimized for **Ahmad Kamil** (working full-time at Nexperia) to build, test, and deploy an automated AI Marketing & Lead-Gen Agent on **Oracle Cloud Infrastructure (OCI)** in 30 days.

* **Target commitment:** ~5 hours per week (evenings/weekends).
* **Core tools:** `n8n` (workflow engine) + `Hermes Agent` (LLM brain) + `Odoo` (CRM backend) + `Meta Graph API` (Ads/Messenger source).

---

## ✅ Quick Action Checklist (Start Here!)

### 🌾 Optional Phase 5: Smart Farming IoT Data Integration
- [ ] Define the IoT data model: farm, field, sensor, reading, alert, irrigation event
- [ ] Choose the ingestion path: MQTT, HTTP API, or LoRaWAN gateway
- [ ] Create a Python ingestion service to receive and validate sensor data
- [ ] Store raw readings in PostgreSQL/TimescaleDB and images in object storage
- [ ] Build an Odoo custom module to show farms, sensors, alerts, and historical trends
- [ ] Connect alerts to n8n so irrigation, temperature, or humidity anomalies trigger actions
- [ ] Add dashboards for field health and predictive maintenance

### Phase 0: Local Setup (Do This First!)
- [ ] Copy `.env.example` → `.env` and set database password
- [ ] Run `docker-compose up -d` to start Odoo + PostgreSQL
- [ ] Verify Odoo loads at `http://localhost:8069`

### Phase 1: n8n & Meta Connection
- [ ] Expose n8n via Nginx Proxy Manager (subdomain: `n8n.kebundata.my`)
- [ ] Create Meta Developer App for Lead Ads
- [ ] Build n8n Webhook trigger for Meta leads
- [ ] Test with a sample lead submission

### Phase 2: AI Qualification
- [ ] Ensure Hermes Agent API is running and reachable
- [ ] Design the system prompt for lead classification
- [ ] Build n8n → Hermes HTTP request node

### Phase 3: Odoo CRM Integration
- [ ] Configure Odoo external API in n8n
- [ ] Create automated lead/opportunity entries in Odoo
- [ ] Set up messaging node (Gmail/WhatsApp)

### Phase 4: Testing & Launch
- [ ] Run end-to-end test with sample leads
- [ ] Set up admin alerts (Telegram/Email)
- [ ] Go live!

---

## Week-by-Week Roadmap

### 📅 Week 1: Meta-to-n8n connection (The "Senses")
* **Time Target:** 5 hours (Evenings)
* **Objectives:** Make sure a lead submission on Facebook/Instagram immediately reaches your OCI server.
* **Tasks:**
  1. **[DONE] Expose n8n with SSL:** In your OCI Nginx Proxy Manager, configure a domain/subdomain (e.g. `n8n.kebundata.my`) to route traffic securely to your running `n8n` container.
  2. **Set up Meta Developer App:** Create a Facebook Developer account, create an App, and configure **Webhooks** for Lead Ads.
  3. **Build trigger workflow:** In n8n, add a Webhook trigger node. Verify that submitting a test lead on Facebook triggers your n8n workflow.

---

### 📅 Week 2: AI Qualification Engine (The "Brain")
* **Time Target:** 5 hours (Evenings)
* **Objectives:** Use your running `hermes-agent` to analyze the lead and draft an response.
* **Tasks:**
  1. **Configure Hermes API:** Ensure your OCI `hermes-agent` is reachable internally by n8n.
  2. **Draft the AI Prompt:** Design the system prompt for the agent. It must:
     * Identify the customer's intent (e.g., price check, consultation, bulk order).
     * Draft a personalized auto-response (email or chat message).
  3. **Build the n8n AI step:** Add an HTTP Request or AI node in n8n to pass the lead's data to Hermes and capture the drafted response.

---

### 📅 Week 3: Odoo ERP CRM Sync & Messaging (The "Action")
* **Time Target:** 6 hours (Weekend + Evenings)
* **Objectives:** Automatically save leads to Odoo CRM and send the auto-response.
* **Tasks:**
  1. **Link Odoo Node:** Configure the Odoo integration in n8n using Odoo's external API.
  2. **Automate CRM Entry:** Set up n8n to create a new **Lead/Opportunity** card in your Odoo CRM pipeline. Include the AI-generated analysis in the notes.
  3. **Activate Messaging:** Set up an outbound node (e.g., Gmail node or a WhatsApp API) to send the Hermes-drafted welcome message to the customer automatically.

---

### 📅 Week 4: Testing & Automation Go-Live (The "Launch")
* **Time Target:** 4 hours (Weekend)
* **Objectives:** Verify the system runs 100% autonomously while you are at work.
* **Tasks:**
  1. **End-to-End Test:** Use the Facebook Lead Ads Testing Tool to submit mock leads and verify:
     * Lead reaches n8n.
     * Hermes qualifies it and drafts the response.
     * Lead card is created in Odoo CRM.
     * Welcome email is sent to the mock customer.
  2. **Admin Alerts:** Set up a final node in n8n to send a notification (e.g., via Telegram or Email) to your phone whenever a high-value lead is captured so you can check in!
