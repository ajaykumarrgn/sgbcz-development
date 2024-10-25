# Get the item code and the total cost from the design doctype
l_item_code = frappe.form_dict.get('i_item_code')
l_design_id = frappe.form_dict.get('i_design_id')

ld_design_record = frappe.get_doc("Design", l_design_id)
# Fetch the total cost from the design and assigned to it.
l_total_cost = ld_design_record.total_cost

# Sometimes Item not generated from the design
# Then Item code or Total cost is not there 

if not l_item_code or not l_total_cost:
    frappe.throw(_("Item code and Total cost are required."))

# Get the Price list based on the item code 
la_item_price_rate = frappe.get_list("Item Price", filters={
    "item_code": l_item_code,
    "price_list": "Standard Selling"
})

# Update the new total cost to the "Standard Selling" price list rate
if la_item_price_rate:
    for l_price in la_item_price_rate:
        frappe.db.set_value('Item Price', l_price.name, 'price_list_rate', l_total_cost)

frappe.flags = la_item_price_rate

frappe.response['message'] = la_item_price_rate
