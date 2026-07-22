from odoo import models, fields, api
from odoo.exceptions import UserError

class KebunIoTSensor(models.Model):
    _name = 'kebun.iot.sensor'
    _description = 'Water Quality 6-in-1 Sensor Reading'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'create_date desc'

    name = fields.Char(string='Device Name', required=True, default='Water Quality 6-in-1 Monitor')
    device_id = fields.Char(string='Tuya Device ID', required=True)
    
    # Water Quality Metrics
    ph = fields.Float(string='pH Level', tracking=True)
    tds = fields.Float(string='TDS (ppm)', tracking=True)
    ec = fields.Float(string='EC (µS/cm)', tracking=True)
    sg = fields.Float(string='Specific Gravity (S.G.)', tracking=True)
    salinity = fields.Float(string='Salinity / Salt (ppt)', tracking=True)
    temperature = fields.Float(string='Temperature (°C)', tracking=True)
    
    last_sync = fields.Datetime(string='Last Synchronized')

    def action_fetch_tuya_data(self):
        """Fetches latest water quality data from Tuya Cloud OpenAPI"""
        self.ensure_one()
        client_id = self.env['ir.config_parameter'].sudo().get_param('tuya.client_id')
        client_secret = self.env['ir.config_parameter'].sudo().get_param('tuya.client_secret')
        endpoint = self.env['ir.config_parameter'].sudo().get_param('tuya.endpoint', 'https://openapi.tuyaus.com')

        if not client_id or not client_secret:
            raise UserError("Tuya API credentials are not configured in system parameters.")

        try:
            # Mock update for interview stability; replace with actual Tuya OpenAPI GET call
            self.write({
                'ph': 7.2,
                'tds': 350.0,
                'ec': 700.0,
                'sg': 1.002,
                'salinity': 0.5,
                'temperature': 26.8,
                'last_sync': fields.Datetime.now()
            })
        except Exception as e:
            raise UserError(f"Failed to connect to Tuya Cloud: {str(e)}")
