/** @odoo-module **/

import { Component, onMounted, onWillStart, onWillUnmount, useRef, useState, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { loadJS } from "@web/core/assets";
import { SensorDataService } from "./sensor_data_service";

const METRICS = [
    { key: "ph", title: "pH Trend", unit: "", precision: 2, axisMin: 6.5, axisMax: 9.0 },
    { key: "ec", title: "EC Trend", unit: "µS/cm", precision: 0, axisMin: 250, axisMax: 950 },
    { key: "tds", title: "TDS Trend", unit: "ppm", precision: 0, axisMin: 100, axisMax: 650 },
    { key: "salinity", title: "Salinity Trend", unit: "ppt", precision: 2, axisMin: 0, axisMax: 4 },
    { key: "sg", title: "Specific Gravity Trend", unit: "", precision: 4, axisMin: 0.99, axisMax: 1.035 },
    { key: "temperature", title: "Temperature Trend", unit: "°C", precision: 2, axisMin: 20, axisMax: 35 },
];

const CHART_COLOR = "#18a56b";
const CHART_FILL = "rgba(24, 165, 107, 0.12)";

export class KebunWaterQualityDashboard extends Component {
    static template = xml`
    <main class="kebun-wq-dashboard" t-ref="root">
      <section class="kebun-wq-header">
        <div>
          <p class="text-uppercase text-success fw-bold mb-2">KebunData Water Quality</p>
          <h1 class="kebun-wq-hero-title">Live Water Quality Monitoring</h1>
          <p class="kebun-wq-subtitle">A modern monitoring dashboard for pH, EC, TDS, Salinity, Specific Gravity and Temperature. Simulated sensor data now, real IoT integration later.</p>
        </div>
        <div class="kebun-wq-device-card kebun-wq-card">
          <div>
            <span class="kebun-wq-card-title">Device Name</span>
            <p class="kebun-wq-card-value">KebunData Water Sensor</p>
          </div>
          <div class="status-row">
            <div class="kebun-wq-device-status"><span class="kebun-wq-card-title">Status</span><p>Online</p></div>
            <div class="kebun-wq-device-status"><span class="kebun-wq-card-title">Battery</span><p>92%</p></div>
            <div class="kebun-wq-device-status"><span class="kebun-wq-card-title">Signal</span><p>Excellent</p></div>
            <div class="kebun-wq-device-status"><span class="kebun-wq-card-title">Last Sync</span><p>2 seconds ago</p></div>
          </div>
        </div>
      </section>

      <section class="kebun-wq-topcards">
        <article class="kebun-wq-card">
          <span class="kebun-wq-card-title">Average pH</span>
          <p class="kebun-wq-card-value">7.23<span class="kebun-wq-card-unit"></span></p>
        </article>
        <article class="kebun-wq-card">
          <span class="kebun-wq-card-title">Average Temperature</span>
          <p class="kebun-wq-card-value">25.8<span class="kebun-wq-card-unit">°C</span></p>
        </article>
        <article class="kebun-wq-card">
          <span class="kebun-wq-card-title">Average EC</span>
          <p class="kebun-wq-card-value">512<span class="kebun-wq-card-unit">µS/cm</span></p>
        </article>
        <article class="kebun-wq-card">
          <span class="kebun-wq-card-title">Average TDS</span>
          <p class="kebun-wq-card-value">268<span class="kebun-wq-card-unit">ppm</span></p>
        </article>
      </section>

      <section class="kebun-wq-status-grid">
        <article class="kebun-wq-card kebun-wq-alert-card">
          <h4>Alerts</h4>
          <ul>
            <li>Temperature High</li>
            <li>Low pH</li>
            <li>High EC</li>
          </ul>
        </article>
        <article class="kebun-wq-card kebun-wq-alert-card">
          <h4>Device Health</h4>
          <ul>
            <li>Sensor network stable</li>
            <li>Battery healthy</li>
            <li>Telemetry latency low</li>
          </ul>
        </article>
      </section>

      <section class="kebun-wq-chart-grid">
        <article t-foreach="state.metrics" t-as="metric" t-key="metric.key" t-att-data-sensor="metric.key" class="kebun-wq-chart-card kebun-wq-card">
          <div class="kebun-wq-chart-card-header">
            <div>
              <span class="kebun-wq-card-title"><t t-esc="metric.title"/></span>
              <h4 class="kebun-wq-chart-card-title"><t t-esc="metric.label"/></h4>
            </div>
            <span class="kebun-wq-chart-card-meta">Updated <t t-esc="state.updatedAt"/></span>
          </div>
          <div class="kebun-wq-card-value"><strong><t t-esc="metric.value"/></strong><span class="kebun-wq-card-unit"><t t-esc="metric.unit"/></span></div>
          <div class="kebun-wq-chart-canvas"><canvas/></div>
          <div class="kebun-wq-chart-footer"><span t-att-class="'wqm-status wqm-status--' + metric.status"><t t-esc="metric.status"/></span><span class="kebun-wq-trend"><t t-esc="metric.trend"/></span></div>
        </article>
      </section>
    </main>
    `;

    setup() {
        this.sensorService = new SensorDataService();
        this.rootRef = useRef("root");
        this.charts = {};
        this.state = useState({
            metrics: METRICS.map((metric) => ({
                ...metric,
                value: "--",
                status: "normal",
                trend: "→",
            })),
            averages: {
                ph: "--",
                temperature: "--",
                ec: "--",
                tds: "--",
            },
            history: METRICS.reduce((acc, metric) => ({ ...acc, [metric.key]: [] }), {}),
            labels: [],
            updatedAt: "--:--:--",
            currentTime: "--:--:--",
        });

        onWillStart(async () => {
            await loadJS("https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js");
        });

        onMounted(() => {
            this._refresh();
            this._initializeCharts();
            this.clockInterval = setInterval(() => this._updateClock(), 1000);
            this.sensorInterval = setInterval(() => this._refresh(), 1000);
        });

        onWillUnmount(() => {
            clearInterval(this.clockInterval);
            clearInterval(this.sensorInterval);
            Object.values(this.charts).forEach((chart) => chart?.destroy?.());
        });
    }

    _updateClock() {
        this.state.currentTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    _initializeCharts() {
        if (!window.Chart || !this.rootRef.el) return;
        METRICS.forEach((metric) => {
            const chartCard = this.rootRef.el.querySelector(`[data-sensor="${metric.key}"]`);
            if (!chartCard) return;
            const canvas = chartCard.querySelector("canvas");
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            this.charts[metric.key] = new window.Chart(ctx, {
                type: "line",
                data: { labels: this.state.labels, datasets: [{ label: metric.title, data: this.state.history[metric.key] || [], borderColor: CHART_COLOR, backgroundColor: CHART_FILL, borderWidth: 2, fill: true, tension: 0.35, pointRadius: 0 } ] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 350, easing: "easeOutQuart" },
                    scales: {
                        x: { title: { display: true, text: "Time" }, grid: { color: "#edf1f5" } },
                        y: { min: metric.axisMin, max: metric.axisMax, title: { display: true, text: metric.unit || metric.title }, grid: { color: "#edf1f5" } },
                    },
                    plugins: { legend: { display: false } },
                },
            });
        });
    }

    _refresh() {
        const snapshot = this.sensorService.getSnapshot();
        this.state.metrics = METRICS.map((metric) => ({
            ...metric,
            value: snapshot[metric.key].toFixed(metric.precision),
            status: snapshot.statuses[metric.key],
            trend: snapshot.trends[metric.key],
        }));
        this.state.averages = {
            ph: snapshot.history.ph.length ? this._average(snapshot.history.ph).toFixed(2) : "--",
            temperature: snapshot.history.temperature.length ? this._average(snapshot.history.temperature).toFixed(2) : "--",
            ec: snapshot.history.ec.length ? this._average(snapshot.history.ec).toFixed(0) : "--",
            tds: snapshot.history.tds.length ? this._average(snapshot.history.tds).toFixed(0) : "--",
        };
        this.state.history = snapshot.history;
        this.state.labels = snapshot.labels;
        this.state.updatedAt = snapshot.updated_at;
        this._updateChartData();
        this._updateClock();
    }

    _average(values) {
        return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
    }

    _updateChartData() {
        Object.entries(this.charts).forEach(([key, chart]) => {
            chart.data.labels = this.state.labels;
            chart.data.datasets[0].data = this.state.history[key] || [];
            chart.update();
        });
    }
}

registry.category("actions").add("kebun_iot.dashboard", KebunWaterQualityDashboard);
