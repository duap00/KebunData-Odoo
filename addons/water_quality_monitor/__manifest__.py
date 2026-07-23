{
    'name': 'Water Quality Monitor',
    'version': '18.0.1.0.0',
    'category': 'Industries',
    'summary': 'Standalone OWL water-quality monitoring dashboard',
    'depends': ['web'],
    'data': [
        'views/dashboard_action.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'water_quality_monitor/static/src/services/mock_sensor.js',
            'water_quality_monitor/static/src/components/dashboard/dashboard.js',
            'water_quality_monitor/static/src/components/dashboard/dashboard.xml',
            'water_quality_monitor/static/src/components/dashboard/dashboard.scss',
        ],
    },
    'application': True,
    'installable': True,
    'license': 'LGPL-3',
}
