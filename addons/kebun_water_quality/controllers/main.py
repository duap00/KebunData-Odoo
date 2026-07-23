from odoo import http


class KebunWaterQualityController(http.Controller):
    @http.route(['/solution', '/water-quality'], type='http', auth='public', website=True)
    def solution_pages(self, **kwargs):
        return http.request.render('kebun_iotold.solution_page', {})
