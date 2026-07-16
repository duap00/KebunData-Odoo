# 1-Month AI Marketing Agent Implementation Plan

This plan is optimized for **Ahmad Kamil** to build, test, and deploy an automated AI Marketing & Lead-Gen Agent on a local Ubuntu server named **robotpeople**, accessed from a local Windows machine, in 30 days.

* **Target commitment:** ~5 hours per week (evenings/weekends).
* **Core tools:** `n8n` (workflow engine) + `Hermes Agent` (LLM brain) + `Odoo 18 Community` (CRM & MRP backend with custom `kebundata_gantt_view`) + `Meta Graph API` (Ads/Messenger source).

---

## Architecture Overview

- **Odoo 18 Community** serves as the CRM and MRP backend.
- The custom **`kebundata_gantt_view`** module provides the Crop Scheduler experience using **OWL** and **Frappe Gantt**.
- Marketing leads should flow into Odoo and directly trigger manufacturing scheduling for real crop cycles such as **Pak Choy**, **Kale**, and **Bengkel Seri Sembilan** maintenance work.

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

### Phase 0: Validation & Existing Stack Check
### Phase 0: Validation & Existing Stack Check
- [x] **[DONE]** Confirm the existing Odoo 18 multi-container Docker stack is already running on robotpeople (Verified: `odoo18-odoo-1` and `odoo18-db-1` have been active for 7 weeks).
- [x] **[DONE]** Verify the custom volume mapping `./addons:/mnt/extra-addons` is active inside the odoo18-odoo-1 container (Verified host path: `/home/ubuntu/odoo18/addons -> /mnt/extra-addons`).
- [x] **[DONE]** Confirm the Docker bridge network between the n8n container and Odoo allows internal RPC/API communication on robotpeople (Verified: both share the `odoo18_default` network segment).
- [x] **[DONE]** Validate Odoo RPC credentials and internal container endpoint accessibility from the n8n context (Internal routing path established at: `http://odoo18-odoo-1:8069`).

### Phase 1: n8n & Meta Connection
- [x] Deploy `n8n` on **robotpeople** and expose it through an internal route or local reverse proxy (Confirmed: `n8n_automation` is Up for 7 weeks on port `5678` & `nginx-proxy-manager` is Up!)
- [ ] Create Meta Developer App for Lead Ads
- [ ] Build n8n Webhook trigger for Meta leads
- [ ] Test with a sample lead submission from the local Windows environment

### Phase 2: AI Qualification
- [x] Ensure Hermes Agent API is reachable from `n8n` over the **robotpeople** Docker network (Confirmed: `hermes-agent` container is Up for 4 weeks!)
- [ ] Design the system prompt for lead classification
- [ ] Build n8n → Hermes HTTP request node

### Phase 3: Odoo CRM Integration
- [ ] Configure the Odoo external API in `n8n` using the internal **robotpeople** endpoint
- [ ] Create automated lead/opportunity entries in Odoo and trigger a Manufacturing Order (MO) that maps directly into the Crop Scheduler built with `kebundata_gantt_view`
- [ ] Ensure the workflow links marketing leads to actual crop-cycle scheduling for **Pak Choy**, **Kale**, and **Bengkel Seri Sembilan** maintenance
- [ ] Set up messaging node (Gmail/WhatsApp)

### Phase 4: Testing & Launch
- [ ] Run end-to-end test with sample leads from the local Windows machine and verify the lead reaches `n8n`, Hermes qualifies it, Odoo creates the lead/MO, and the message is sent
- [ ] Set up admin alerts (Telegram/Email)
- [ ] Go live!

---

## Week-by-Week Roadmap

### 📅 Week 1: Meta-to-n8n connection (The "Senses")
* **Time Target:** 5 hours (Evenings)
* **Objectives:** Make sure a lead submission on Facebook/Instagram immediately reaches your local **robotpeople** stack.
* **Tasks:**
  1. **[DONE] Configure local n8n routing:** On **robotpeople**, deploy `n8n` so it is reachable through an internal route or local reverse proxy, and confirm it can reach Odoo over the Docker bridge network.
  2. **Set up Meta Developer App:** Create a Facebook Developer account, create an App, and configure **Webhooks** for Lead Ads.
  3. **Build trigger workflow:** In `n8n`, add a Webhook trigger node. Verify that submitting a test lead on Facebook triggers your local workflow from the Windows environment.

---

### 📅 Week 2: AI Qualification Engine (The "Brain")
* **Time Target:** 5 hours (Evenings)
* **Objectives:** Use your running `hermes-agent` on **robotpeople** to analyze the lead and draft a response.
* **Tasks:**
  1. **Configure Hermes API:** Ensure your local `hermes-agent` is reachable internally by `n8n` over the **robotpeople** Docker network.
  2. **Draft the AI Prompt:** Design the system prompt for the agent. It must:
     * Identify the customer's intent (e.g., price check, consultation, bulk order).
     * Draft a personalized auto-response (email or chat message).
  3. **Build the n8n AI step:** Add an HTTP Request or AI node in `n8n` to pass the lead's data to Hermes and capture the drafted response.

---

### 📅 Week 3: Odoo ERP CRM Sync & Messaging (The "Action")
* **Time Target:** 6 hours (Weekend + Evenings)
* **Objectives:** Automatically save leads to Odoo CRM and schedule actual operations in the Crop Scheduler.
* **Tasks:**
  1. **Link Odoo Node:** Configure the Odoo integration in `n8n` using the internal Odoo RPC/external API endpoint on **robotpeople**.
  2. **Automate CRM Entry + Manufacturing Order:** Set up `n8n` to create a new **Lead/Opportunity** in Odoo and trigger a **Manufacturing Order (MO)** that appears in the `kebundata_gantt_view` Crop Scheduler for **Pak Choy**, **Kale**, or **Bengkel Seri Sembilan** maintenance.
  3. **Activate Messaging:** Set up an outbound node (e.g., Gmail node or a WhatsApp API) to send the Hermes-drafted welcome message to the customer automatically.

---

### 📅 Week 4: Testing & Automation Go-Live (The "Launch")
* **Time Target:** 4 hours (Weekend)
* **Objectives:** Verify the system runs end-to-end from your local Windows machine while your team uses the **robotpeople** environment.
* **Tasks:**
  1. **End-to-End Test:** Use the Facebook Lead Ads Testing Tool to submit mock leads and verify:
     * Lead reaches `n8n` on **robotpeople**.
     * Hermes qualifies it and drafts the response.
     * Odoo creates the lead/opportunity and MO in the Crop Scheduler.
     * Welcome email is sent to the mock customer.
  2. **Admin Alerts:** Set up a final node in `n8n` to send a notification (e.g., via Telegram or Email) to your phone whenever a high-value lead is captured so you can check in!
