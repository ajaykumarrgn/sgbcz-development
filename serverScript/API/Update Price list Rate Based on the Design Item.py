l_item_code = frappe.form_dict.get('i_item_code')
l_design_id = frappe.form_dict.get('i_design_id')

ld_design_record = frappe.get_doc("Design", l_design_id)
l_total_cost = ld_design_record.total_cost

if not l_item_code or not l_total_cost:
    frappe.throw(_("Item code and Total cost are required."))

la_item_price_rate = frappe.get_list("Item Price", filters={
    "item_code": l_item_code,
    "price_list": "Standard Selling"
})

if la_item_price_rate:
    for price in la_item_price_rate:
        frappe.db.set_value('Item Price', price.name, 'price_list_rate', l_total_cost)

frappe.flags = la_item_price_rate

frappe.response['message'] = la_item_price_rate
