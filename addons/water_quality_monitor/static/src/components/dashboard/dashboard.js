import { Component, onMounted, onWillStart, onWillUnmount, useRef, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { loadJS } from "@web/core/assets";
import { MockSensorService } from "../../services/mock_sensor";

const METRICS = [
    {
        key: "ph",
        title: "pH Trend",
        label: "pH",
        unit: "",
        icon: "fa-flask",
        precision: 2,
        min: 6.8,
        max: 8.5,
        axisMin: 6.5,
        axisMax: 9.0,
    },
    {
        key: "ec",
        title: "EC Trend",
        label: "EC",
        unit: "µS/cm",
        icon: "fa-bolt",
        precision: 0,
        min: 300,
        max: 900,
        axisMin: 250,
        axisMax: 950,
    },
    {
        key: "tds",
        title: "TDS Trend",
        label: "TDS",
        unit: "ppm",
        icon: "fa-tint",
        precision: 0,
        min: 150,
        max: 600,
        axisMin: 100,
        axisMax: 650,
    },
    {
        key: "salinity",
        title: "Salinity Trend",
        label: "Salinity",
        unit: "ppt",
        icon: "fa-adjust",
        precision: 2,
        min: 0.1,
        max: 3.5,
        axisMin: 0,
        axisMax: 4,
    },
    {
        key: "sg",
        title: "Specific Gravity Trend",
        label: "Specific Gravity",
        unit: "",
        icon: "fa-balance-scale",
        precision: 4,
        min: 0.995,
        max: 1.03,
        axisMin: 0.99,
        axisMax: 1.035,
    },
    {
        key: "temperature",
        title: "Temperature Trend",
        label: "Temperature",
        unit: "°C",
        icon: "fa-thermometer-half",
        precision: 2,
        min: 22,
        max: 32,
        axisMin: 20,
        axisMax: 35,
    },
];

const CHART_COLOR = "#18a56b";
const CHART_FILL = "rgba(24, 165, 107, 0.12)";

export class WaterQualityDashboard extends Component {
    static template = "water_quality_monitor.Dashboard";

    setup() {
        this.sensorService = new MockSensorService();
        this.chartRootRef = useRef("chartRoot");
        this.charts = {};
        this.state = useState({
            metrics: METRICS.map((metric) => ({
                ...metric,
                value: "--",
                status: "normal",
                trend: "→",
            })),
            history: {},
            labels: [],
            updatedAt: "--:--:--",
            currentTime: "--:--:--",
            connection: "connected",
        });

        onWillStart(async () => {
            await loadJS("/web/static/lib/Chart/Chart.js");
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
        if (!window.Chart || !this.chartRootRef.el) return;
        METRICS.forEach((metric) => {
            const card = this.chartRootRef.el.querySelector(`[data-sensor="${metric.key}"]`);
            if (!card) return;
            const canvas = card.querySelector("canvas");
            if (!canvas) return;

            this.charts[metric.key] = new window.Chart(canvas, {
                type: "line",
                data: {
                    labels: this.state.labels,
                    datasets: [
                        {
                            label: metric.label,
                            data: this.state.history[metric.key] || [],
                            borderColor: CHART_COLOR,
                            backgroundColor: CHART_FILL,
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 4,
                            fill: true,
                            tension: 0.35,
                            cubicInterpolationMode: "monotone",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 450, easing: "easeOutQuart" },
                    interaction: { mode: "index", intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => `${metric.label}: ${context.parsed.y}${metric.unit ? ` ${metric.unit}` : ""}`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "Time" },
                            grid: { color: "#edf1f5" },
                        },
                        y: {
                            min: metric.axisMin,
                            max: metric.axisMax,
                            title: { display: true, text: metric.unit || metric.label },
                            grid: { color: "#edf1f5" },
                        },
                    },
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
        this.state.history = snapshot.history;
        this.state.labels = snapshot.labels;
        this.state.updatedAt = snapshot.updated_at;
        this.state.connection = snapshot.status;
        this._updateChartData();
        this._updateClock();
    }

    _updateChartData() {
        Object.entries(this.charts).forEach(([key, chart]) => {
            const history = this.state.history[key] || [];
            chart.data.labels = this.state.labels;
            chart.data.datasets[0].data = history;
            chart.update("active");
        });
    }
}

registry.category("actions").add("water_quality_monitor.dashboard", WaterQualityDashboard);
