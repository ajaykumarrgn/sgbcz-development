# Change References
# two item variant available but only 1 variant is shown in report: (Issue# : ISS-2024-00068)

# Define the columns that will be shown in the report,
# including the Add button, variant name, and design fields.
def fn_get_columns(i_item):
    la_columns = [
        {
            "fieldname": "button",
            "fieldtype": "data",
            "label": "Add",
            "options": "Add",
            "action": "add_item",
        },
        {"fieldname": "variant_name", "label": _(
            "Variant"), "fieldtype": "Link", "options": "Item", "width": 200,},
        {"fieldname": "design", "label": _(
            "Design"), "fieldtype": "Link", "options": "Design", "width": 200,}
        ]

    # Fetch item attributes and dynamically add them as columns
    ld_item_doc = frappe.get_doc("Item", i_item)
    for l_entry in ld_item_doc.attributes:
        l_scrubbed_string = l_entry.attribute.lower()
        l_scrubbed_string = ''.join(c if c.isalnum() or c == '' else '' for c in l_scrubbed_string)
        l_column = {"fieldname": l_scrubbed_string, "label": l_entry.attribute,
                     "fieldtype": "Data", "width": 100,}
        la_columns.append(l_column)
    return la_columns

# Fetch data based on the provided filters
def fn_get_data(filters):
    # Inner function to map attribute values for item variants
    def fn_get_attribute_values_map(i_variant_list):
        la_attribute_list = frappe.db.get_all(
            "Item Variant Attribute",
            fields=["attribute", "attribute_value", "parent"],
            filters={"parent": ["in", i_variant_list]},
        )

        ld_attr_val_map = {}
        for l_row in la_attribute_list:
            l_name = l_row.get("parent")
            if not ld_attr_val_map.get(l_name):
                ld_attr_val_map[l_name] = {}
            # >>ISS-2024-00068
            # Comment the below line for the issue ISS-2024-00068
            #ld_attr_val_map[l_name][l_row.get("attribute")] = l_row.get("attribute_value")
            # use replace function to replace (.) in attribute values to (,)
            # hence all the attribute value are in same format
            ld_attr_val_map[l_name][l_row.get("attribute")] = l_row.get("attribute_value").replace('.', ',') if l_row.get("attribute_value") is not None else None
            # <<ISS-2024-00068
        return ld_attr_val_map

    # Function to clean strings by removing spaces and special characters
    def fn_scrub_string(i_input_string):
        # Convert the string to lowercase
        l_scrubbed_string = i_input_string.lower()

        # Replace spaces and special characters with underscores
        l_scrubbed_string = ''.join(c if c.isalnum() or c == '' else '' for c in l_scrubbed_string)

        return l_scrubbed_string

    # Begin of main function get data
    if not filters.item:
        return []
    la_item_dicts = []

    # Set up query filters
    ld_query_filters = {}
    if filters.catalog_designs:
        ld_query_filters = {"variant_of": ["=", filters.item], "disabled": 0,
                            "is_catalog_item": filters.catalog_designs}
    else:
        ld_query_filters = {"variant_of": ["=", filters.item], "disabled": 0}

    # Fetch variants based on the filters
    la_variant_results = frappe.db.get_all(
        "Item", fields=["name","design"], filters=ld_query_filters
    )
    if not la_variant_results:
        frappe.msgprint(_("There aren't any item variants for the selected item"))
        return []
    else:
        i_variant_list = [l_variant["name"] for l_variant in la_variant_results]

    # Map attribute values for the variants
    ld_attr_val_map = fn_get_attribute_values_map(i_variant_list)

    # Get unique attributes for the variants
    la_attributes = frappe.db.get_all(
        "Item Variant Attribute",
        fields=["attribute"],
        filters={"parent": ["in", i_variant_list]},
        group_by="attribute",
    )

    la_attribute_list = [l_row.get("attribute") for l_row in la_attributes]

    # Prepare the dictionary of variants with attribute values
    la_variant_dicts = [{"variant_name": d["name"],
                            "design": d["design"]} for d in la_variant_results]
    for l_item_dict in la_variant_dicts:
        l_name = l_item_dict.get("variant_name")

        # Populate each attribute value for the item variant
        for l_attribute in la_attribute_list:
            ld_attr_dict = ld_attr_val_map.get(l_name)
            if ld_attr_dict and ld_attr_dict.get(l_attribute):
                l_item_dict[fn_scrub_string(l_attribute)] = ld_attr_val_map.get(l_name).get(l_attribute)

        la_item_dicts.append(l_item_dict)

    # Add button element and register button Event
    for l_row in la_item_dicts:
        l_row["button"] = f'<button class="btn btn-sm" onclick="frappe.open_dialog(\'{l_row["variant_name"]}\')">Add</button>'
    return la_item_dicts

    #return data

# Begin of execute
data = []
la_columns = fn_get_columns(filters.item)
la_output_data = fn_get_data(filters)
data = la_columns, la_output_data
