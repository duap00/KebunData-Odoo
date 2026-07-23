import os
import traceback
from odoo.modules import module
paths = ['/mnt/extra-addons/kebun_iot','/var/lib/odoo/custom_addons/kebun_iot']
for p in paths:
    print('PATH:', p, 'exists=', os.path.exists(p))
    try:
        m = module.get_manifest('kebun_iot', p)
        print('MANIFEST from', p, ':', m)
    except Exception:
        print('ERROR reading manifest from', p)
        traceback.print_exc()
