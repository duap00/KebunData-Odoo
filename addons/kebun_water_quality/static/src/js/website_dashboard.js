/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { KebunWaterQualityDashboard } from "./dashboard";
import { mount } from "@odoo/owl";

publicWidget.registry.WqDashboard = publicWidget.Widget.extend({
    selector: '.wq-dashboard-container',
    start: async function () {
        this._super.apply(this, arguments);
        if (this.el) {
            try {
                await mount(KebunWaterQualityDashboard, this.el, {
                    env: this.env
                });
            } catch (e) {
                console.error("Failed to mount WqDashboard", e);
                this.el.innerHTML = "<div class='alert alert-danger'>Failed to load dashboard: " + e.message + "</div>";
            }
        }
    }
});
