# 1-Month AI Marketing Agent Implementation Plan

This plan is optimized for **Ahmad Kamil** (working full-time at Nexperia) to build, test, and deploy an automated AI Marketing & Lead-Gen Agent on **Oracle Cloud Infrastructure (OCI)** in 30 days.

* **Target commitment:** ~5 hours per week (evenings/weekends).
* **Core tools:** `n8n` (workflow engine) + `Hermes Agent` (LLM brain) + `Odoo` (CRM backend) + `Meta Graph API` (Ads/Messenger source).

---

## Week-by-Week Roadmap

### 📅 Week 1: Meta-to-n8n connection (The "Senses")
* **Time Target:** 5 hours (Evenings)
* **Objectives:** Make sure a lead submission on Facebook/Instagram immediately reaches your OCI server.
* **Tasks:**
  1. **Expose n8n with SSL:** In your OCI Nginx Proxy Manager, configure a domain/subdomain (e.g. `n8n.kebundata.my`) to route traffic securely to your running `n8n` container.
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
