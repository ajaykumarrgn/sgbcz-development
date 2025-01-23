# Get the item code and design ID from the design doctype
l_item_code = frappe.form_dict.get('i_item_code')
l_design_id = frappe.form_dict.get('i_design_id')

# Fetch the design document and get the total cost
ld_design_record = frappe.get_doc("Design", l_design_id)
l_total_cost = ld_design_record.total_cost

if not l_total_cost:
    frappe.throw(_("Total cost is required in the Design document."))

# Fetch and update the price list entries with the new total cost
la_item_price_rate = frappe.get_list("Item Price", filters={
    "item_code": l_item_code,
    "price_list": "Standard Selling"
}, fields=["name"])

if la_item_price_rate:
    for l_price in la_item_price_rate:
        frappe.db.set_value('Item Price', l_price['name'], 'price_list_rate', l_total_cost)

    # Fetch the Item Price documents and save them after updating
    for l_price in la_item_price_rate:
        l_item_price_doc = frappe.get_doc("Item Price", l_price['name'])
        l_item_price_doc.save()

frappe.response['message'] = la_item_price_rate
