/**
 * Temporary data source for the dashboard.
 * Keep this interface when replacing it with RPC, bus, MQTT, or Tuya later.
 */
export class MockSensorService {
    constructor() {
        this._previousValues = {
            ph: 7.3,
            ec: 520,
            tds: 260,
            salinity: 1.1,
            sg: 1.012,
            temperature: 24.5,
        };
        this._history = { ph: [], ec: [], tds: [], salinity: [], sg: [], temperature: [] };
        this._labels = [];
        this._driftCounter = 0;
        this._driftInterval = this._randomInt(30, 60);
    }

    _random(minimum, maximum) {
        return minimum + Math.random() * (maximum - minimum);
    }

    _randomInt(minimum, maximum) {
        return Math.floor(this._random(minimum, maximum + 1));
    }

    _clamp(value, minimum, maximum) {
        return Math.min(Math.max(value, minimum), maximum);
    }

    _between(minimum, maximum, precision = 0) {
        const value = this._random(minimum, maximum);
        return Number(value.toFixed(precision));
    }

    _nextValue(previous, minimum, maximum, step, noise = 0.002, driftScale = 1) {
        const delta = this._random(-step, step) * driftScale;
        const jitter = this._random(-noise, noise);
        return this._clamp(previous + delta + jitter, minimum, maximum);
    }

    _status(parameter, value) {
        const limits = {
            ph: { normal: [6.8, 8.0], warning: [6.5, 8.3] },
            ec: { normal: [300, 900], warning: [250, 950] },
            tds: { normal: [150, 600], warning: [130, 650] },
            salinity: { normal: [0.1, 3.5], warning: [0.05, 3.7] },
            sg: { normal: [0.995, 1.030], warning: [0.993, 1.032] },
            temperature: { normal: [22, 32], warning: [21, 33] },
        }[parameter];
        if (value >= limits.normal[0] && value <= limits.normal[1]) return "normal";
        if (value >= limits.warning[0] && value <= limits.warning[1]) return "warning";
        return "critical";
    }

    _trend(parameter, value) {
        const previous = this._previousValues[parameter];
        this._previousValues[parameter] = value;
        if (previous === undefined || Math.abs(previous - value) < 0.01) return "→";
        return value > previous ? "↑" : "↓";
    }

    getSnapshot() {
        this._driftCounter += 1;
        const driftEvent = this._driftCounter >= this._driftInterval;
        if (driftEvent) {
            this._driftCounter = 0;
            this._driftInterval = this._randomInt(30, 60);
        }

        const driftScale = driftEvent ? 2 : 1;
        const previous = this._previousValues;

        const ph = this._nextValue(previous.ph, 6.8, 8.5, 0.01, 0.002, driftScale);
        const temperature = this._nextValue(previous.temperature, 22, 32, 0.02, 0.002, driftScale);

        const ecStep = 2 * driftScale;
        const ec = this._nextValue(previous.ec, 300, 900, ecStep, 0.5, driftScale);

        const tdsCorrelation = (ec - previous.ec) * 0.5;
        const tds = this._clamp(
            previous.tds + tdsCorrelation + this._random(-1, 1) * driftScale,
            150,
            600,
        );

        const salinityCorrelation = (ec - previous.ec) * 0.002;
        const salinity = this._clamp(
            previous.salinity + salinityCorrelation + this._random(-0.002, 0.002) * driftScale,
            0.1,
            3.5,
        );

        const sgCorrelation = (salinity - previous.salinity) * 0.003;
        const sg = this._clamp(
            previous.sg + sgCorrelation + this._random(-0.0002, 0.0002) * driftScale,
            0.995,
            1.03,
        );

        const values = {
            ph: Number(ph.toFixed(2)),
            ec: Number(ec.toFixed(0)),
            tds: Number(tds.toFixed(0)),
            salinity: Number(salinity.toFixed(2)),
            sg: Number(sg.toFixed(4)),
            temperature: Number(temperature.toFixed(2)),
        };

        const now = new Date();
        const nowStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        this._labels.push(nowStr);
        if (this._labels.length > 30) this._labels.shift();

        for (const [key, val] of Object.entries(values)) {
            this._history[key].push(val);
            if (this._history[key].length > 30) this._history[key].shift();
        }

        return {
            ...values,
            status: "connected",
            updated_at: nowStr,
            statuses: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, this._status(key, value)])),
            trends: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, this._trend(key, value)])),
            history: this._history,
            labels: this._labels,
        };
    }
}
