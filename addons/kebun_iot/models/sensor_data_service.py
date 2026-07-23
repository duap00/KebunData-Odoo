from odoo import api, fields, models
import random


class SensorDataService(models.AbstractModel):
    _name = "kebun_iot.sensor_data_service"
    _description = "Sensor Data Service"

    SENSOR_CONFIG = {
        "ph": {"min": 6.8, "max": 8.5, "step": 0.01, "precision": 2},
        "ec": {"min": 300, "max": 900, "step": 2, "precision": 0},
        "tds": {"min": 150, "max": 600, "step": 1, "precision": 0},
        "salinity": {"min": 0.1, "max": 3.5, "step": 0.005, "precision": 2},
        "sg": {"min": 0.995, "max": 1.03, "step": 0.0002, "precision": 4},
        "temperature": {"min": 22, "max": 32, "step": 0.02, "precision": 2},
    }

    @api.model
    def _random_step(self, step):
        return (random.random() * 2 - 1) * step

    @api.model
    def _clamp(self, value, minimum, maximum):
        return max(min(value, maximum), minimum)

    @api.model
    def get_initial_values(self):
        return {
            key: config["min"] + (config["max"] - config["min"]) / 2
            for key, config in self.SENSOR_CONFIG.items()
        }

    @api.model
    def simulate_values(self, previous_values):
        values = {}
        for key, config in self.SENSOR_CONFIG.items():
            previous = previous_values.get(key, config["min"] + (config["max"] - config["min"]) / 2)
            next_value = previous + self._random_step(config["step"])
            values[key] = self._clamp(next_value, config["min"], config["max"])
        return values

    @api.model
    def get_sensor_snapshot(self, previous_values):
        values = self.simulate_values(previous_values)
        statuses = {
            key: self._get_status(key, val)
            for key, val in values.items()
        }
        trends = {
            key: self._get_trend(previous_values.get(key), values[key])
            for key in values
        }
        return {
            "values": values,
            "statuses": statuses,
            "trends": trends,
        }

    @api.model
    def _get_status(self, key, value):
        if key == "ph":
            return "normal" if 6.8 <= value <= 8.0 else "warning" if 6.5 <= value <= 8.3 else "critical"
        if key == "ec":
            return "normal" if 300 <= value <= 900 else "warning" if 250 <= value <= 950 else "critical"
        if key == "tds":
            return "normal" if 150 <= value <= 600 else "warning" if 130 <= value <= 650 else "critical"
        if key == "salinity":
            return "normal" if 0.1 <= value <= 3.5 else "warning" if 0.05 <= value <= 3.7 else "critical"
        if key == "sg":
            return "normal" if 0.995 <= value <= 1.03 else "warning" if 0.993 <= value <= 1.032 else "critical"
        if key == "temperature":
            return "normal" if 22 <= value <= 32 else "warning" if 20 <= value <= 33 else "critical"
        return "normal"

    @api.model
    def _get_trend(self, previous, current):
        if previous is None or abs(current - previous) < 0.01:
            return "→"
        return "↑" if current > previous else "↓"
