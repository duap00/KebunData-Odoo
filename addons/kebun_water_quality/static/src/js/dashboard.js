import { Component, onMounted, onWillStart, onWillUnmount, useRef, useState } from "@odoo/owl";
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
    static template = "kebun_iotold.Dashboard";

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

registry.category("actions").add("kebun_iotold.dashboard", KebunWaterQualityDashboard);
