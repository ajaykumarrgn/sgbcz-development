"""
API Method: get_transformer_ip_attribute_value

This method retrieves a sorted list of attribute values for a given attribute.

Parameters:
- `attribute` (string): The attribute name for which the values are to be fetched.

Returns:
- `Object`:
  - `la_options` (Array): A sorted array of attribute values corresponding to the specified attribute.
  
"""

im_attribute = frappe.form_dict.get('attribute')

# Fetch all attribute values where parent is im_attribute
la_attribute_values = frappe.get_all(
    'Item Attribute Value', 
    filters={'parent': im_attribute},
    fields=['attribute_value'],
    order_by='idx asc'
)

# Prepare a list of attribute values
la_attribute_values_list = [item['attribute_value'] for item in la_attribute_values]

# Set the options as a list of values
frappe.flags = {'la_options': la_attribute_values_list}
frappe.response['message'] = {'la_options': la_attribute_values_list}
