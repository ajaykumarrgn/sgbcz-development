# Retrieve the item groups from the form data.
im_item_groups = frappe.form_dict.get("i_item_groups")
la_items = []
# Check if the retrieved item groups are already in list format.
if isinstance(im_item_groups, list):
    la_item_groups = im_item_groups
else:
    # If not, assume the item groups are in JSON format and parse them.
    la_item_groups = json.loads(im_item_groups)
# Iterate over each item group to fetch items with variants.
for l_item_group in la_item_groups:
    la_items_with_variant = frappe.get_all("Item", filters={"has_variants": 1, "item_group": l_item_group}, fields=["name"])
    la_items.extend(la_items_with_variant)
# Extract the item names from the list of items.
la_item_template = [item["name"] for item in la_items]
# Set the response message with the list of item names.
frappe.response['message'] = { "name": la_item_template }
