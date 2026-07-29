{
    'name': 'Kebun IoT',
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
            'kebun_iot/static/src/js/dashboard.js',
            'kebun_iot/static/src/js/sensor_data_service.js',
            'kebun_iot/static/src/css/dashboard.css',
        ],
        'web.assets_frontend': [
            'kebun_iot/static/src/css/dashboard.css',
            'kebun_iot/static/src/js/sensor_data_service.js',
            'kebun_iot/static/src/js/dashboard.js',
            'kebun_iot/static/src/js/website_dashboard.js',
        ],
    },
    'application': True,
    'installable': True,
    'license': 'LGPL-3',
}
