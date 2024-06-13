im_factory = frappe.form_dict.get('factory')

# list the item variant for the mapped factory group
la_item_variants = frappe.get_list("Item", filters={"has_variants": 1, "item_group":im_factory})

# Extract item names from the variants
la_item_names = [item['name'] for item in la_item_variants]

frappe.flags = la_item_names

frappe.response['message'] = la_item_names
