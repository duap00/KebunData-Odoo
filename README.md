 # KebunData Odoo

 KebunData Odoo is the ERP (Enterprise Resource Planning) system for the KebunData smart farming platform. It runs Odoo Community Edition on a Raspberry Pi Compute Module 4 (CM4) to manage inventory, manufacturing, and farming operations.

 ## Architecture

 The ERP system runs locally on the edge device to ensure operations continue even without internet access.

 ```text
 Raspberry Pi CM4
 ├── Docker Container: Odoo 16/17 (Community)
 ├── Docker Container: PostgreSQL 14
 └── Volume: Custom Add-ons (KebunData Modules)
 ```

 ## Prerequisites

 * **Hardware:** Raspberry Pi CM4 (4GB+ RAM recommended).
 * **OS:** Raspberry Pi OS (64-bit) / Ubuntu Server.
 * **Software:** Docker & Docker Compose.

 ## Installation

 We use Docker to deploy Odoo Community on the CM4.

 ```bash
 # 1. Clone the repository
 git clone [https://github.com/duap00/KebunData-Odoo.git](https://github.com/duap00/KebunData-Odoo.git)
 cd KebunData-Odoo

 # 2. Start Odoo and PostgreSQL
 docker-compose up -d
 ```

 ## Configuration

 ### 1. Default Access
 Once the container is running, access the web interface:
 * **URL:** `http://<CM4_IP>:8069`
 * **Master Password:** (Check `docker-compose.yml` or logs)
 * **Default User:** `admin` / `admin`

 ### 2. Custom Modules
 Custom smart farming modules are located in the `custom_addons/` folder.
 * **Inventory:** Managing seeds, nutrients, and spare parts.
 * **Manufacturing:** Tracking germination cycles and harvest logs.

 ## Usage

 To stop or restart the services:

 ```bash
 # Stop services
 docker-compose down

 # Restart services
 docker-compose restart
 ```

 ## Roadmap

 * [ ] Create basic inventory structure for Vertical Farming.
 * [ ] Develop `kebundata_manufacturing` module for crop cycles.
 * [ ] Integrate IoT sensor data (Temperature/Humidity) into Odoo views.

 ## Contributing

 Pull requests are welcome. This repository is specifically for Odoo modules and configuration.

 ## License
#
# [LGPL-3.0](https://www.odoo.com/documentation/17.0/legal/licenses.html) (Odoo Community License)
