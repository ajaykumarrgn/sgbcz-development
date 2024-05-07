la_item_groups = ["DTTHZ2N", "RGB", "NEU"]
la_items = []
for l_item_group in la_item_groups:
    la_items_with_variant = frappe.get_all("Item", filters={"has_variants": 1, "item_group": l_item_group}, fields=["name"])
    la_items.extend(la_items_with_variant)
la_item_template = [item["name"] for item in la_items]
frappe.response['message'] = { "name": la_item_template }
