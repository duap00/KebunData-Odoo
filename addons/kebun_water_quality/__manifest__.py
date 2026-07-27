{
    'name': 'Kebun Water Quality',
    'version': '18.0.1.0.0',
    'category': 'IoT',
    'summary': 'Modern water quality monitoring dashboard for Odoo',
    'depends': ['web', 'website'],
    'data': [
        'security/ir.model.access.csv',
        'views/dashboard_action.xml',
        'views/website_templates.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'kebun_water_quality/static/src/js/dashboard.js',
            'kebun_water_quality/static/src/js/sensor_data_service.js',
            'kebun_water_quality/static/src/css/dashboard.css',
            'kebun_water_quality/static/src/xml/dashboard_templates.xml',
        ],
        'web.assets_frontend': [
            'kebun_water_quality/static/src/css/dashboard.css',
        ],
    },
    'application': True,
    'installable': True,
    'license': 'LGPL-3',
}
