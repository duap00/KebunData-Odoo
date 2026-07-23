export class SensorDataService {
    constructor() {
        this.previousValues = {
            ph: 7.3,
            ec: 520,
            tds: 260,
            salinity: 1.1,
            sg: 1.012,
            temperature: 24.5,
        };
        this.history = {
            ph: [],
            ec: [],
            tds: [],
            salinity: [],
            sg: [],
            temperature: [],
        };
        this.labels = [];
        this.config = {
            ph: { min: 6.8, max: 8.5, step: 0.01, precision: 2 },
            ec: { min: 300, max: 900, step: 2, precision: 0 },
            tds: { min: 150, max: 600, step: 1, precision: 0 },
            salinity: { min: 0.1, max: 3.5, step: 0.005, precision: 2 },
            sg: { min: 0.995, max: 1.03, step: 0.0002, precision: 4 },
            temperature: { min: 22, max: 32, step: 0.02, precision: 2 },
        };
    }

    _random(min, max) {
        return min + Math.random() * (max - min);
    }

    _clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    _simulateValue(key) {
        const config = this.config[key];
        const previous = this.previousValues[key];
        const next = previous + this._random(-config.step, config.step);
        const value = this._clamp(next, config.min, config.max);
        this.previousValues[key] = value;
        return Number(value.toFixed(config.precision));
    }

    _status(key, value) {
        if (key === "ph") {
            return value >= 6.8 && value <= 8.0 ? "normal" : value >= 6.5 && value <= 8.3 ? "warning" : "critical";
        }
        if (key === "ec") {
            return value >= 300 && value <= 900 ? "normal" : value >= 250 && value <= 950 ? "warning" : "critical";
        }
        if (key === "tds") {
            return value >= 150 && value <= 600 ? "normal" : value >= 130 && value <= 650 ? "warning" : "critical";
        }
        if (key === "salinity") {
            return value >= 0.1 && value <= 3.5 ? "normal" : value >= 0.05 && value <= 3.7 ? "warning" : "critical";
        }
        if (key === "sg") {
            return value >= 0.995 && value <= 1.03 ? "normal" : value >= 0.993 && value <= 1.032 ? "warning" : "critical";
        }
        if (key === "temperature") {
            return value >= 22 && value <= 32 ? "normal" : value >= 20 && value <= 33 ? "warning" : "critical";
        }
        return "normal";
    }

    _trend(key, previous, current) {
        if (previous === undefined || Math.abs(current - previous) < 0.01) {
            return "→";
        }
        return current > previous ? "↑" : "↓";
    }

    _captureHistory(values) {
        const now = new Date();
        const label = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        this.labels.push(label);
        if (this.labels.length > 30) {
            this.labels.shift();
        }
        Object.entries(values).forEach(([key, value]) => {
            this.history[key].push(value);
            if (this.history[key].length > 30) {
                this.history[key].shift();
            }
        });
    }

    getSnapshot() {
        const previousValues = { ...this.previousValues };
        const values = Object.fromEntries(
            Object.keys(this.config).map((key) => [key, this._simulateValue(key)])
        );
        this._captureHistory(values);
        return {
            ...values,
            statuses: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, this._status(key, value)])),
            trends: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, this._trend(key, previousValues[key], value)])),
            history: this.history,
            labels: this.labels,
            updated_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        };
    }
}
