{
    'name': 'KebunData IoT - Water Quality Monitor',
    'version': '18.0.1.0.0',
    'category': 'Industries',
    'summary': 'Integration for 6-in-1 Water Quality Monitor (pH, TDS, EC, SG, Salinity, Temp) via Tuya',
    'author': 'KebunData',
    'depends': ['base', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/sensor_views.xml',
    ],
    'installable': True,
    'application': True,
}
