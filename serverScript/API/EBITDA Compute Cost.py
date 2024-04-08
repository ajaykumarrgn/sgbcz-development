# Change Request : TASK-2024-00157
# Get the value for 'i_price_list' from the form data
l_price_list = frappe.form_dict.get('i_price_list')

# Get the value for 'i_total_cost' from the form data
l_total_cost = frappe.form_dict.get('i_total_cost')

# Get the value for 'i_final_price' from the form data
l_final_price = frappe.form_dict.get('i_final_price')

# Get the value for 'i_parent_itemgroup' from the form data
l_item_group = frappe.form_dict.get('i_parent_itemgroup')

# Check if total cost and final price passed are not None
if l_total_cost and l_final_price:
    # Check if the parent_item_group is "Accessories"
    if l_item_group['parent_item_group'] == "Accessories":
        
        # Calculate EBITDA based on the formula for Accessories item group
        l_ebitda = 100 * (l_final_price - l_total_cost - (l_price_list['provision'] * l_final_price)) / (l_final_price - (l_price_list['provision']* l_final_price))
    else:
        
        # Calculate EBITDA based on the formula for design and catalog prices
        l_ebitda = 100 * (l_final_price - l_price_list['transport'] - l_total_cost - (l_price_list['provision'] * l_final_price)) / (l_final_price - l_price_list['transport'] - (l_price_list['provision']* l_final_price))

    # Create a message dictionary with the calculated EBITDA
    ld_message = {"ebitda": l_ebitda}
    frappe.flags.message = ld_message
else:
    # If total cost is None, set EBITDA to 0
    ld_message = {"ebitda": 0}
    frappe.flags.message = ld_message

