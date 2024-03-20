#l_material_cost = frappe.form_dict.get('i_material_cost')
l_price_list = frappe.form_dict.get('i_price_list')
l_total_cost = frappe.form_dict.get('i_total_cost')
l_final_price = frappe.form_dict.get('i_final_price')
l_item_group = frappe.form_dict.get('i_parent_itemgroup')
frappe.msgprint("from api" + str(l_price_list["name"]))

if l_total_cost is not None:
    if l_item_group['parent_item_group'] == "Accessories":
        l_price_list['transport'] = 0
        
    l_ebitda = 100 * (l_final_price - l_price_list['transport'] - l_total_cost - (l_price_list['provision'] * l_final_price)) / (l_final_price - l_price_list['transport'] - (l_price_list['provision']* l_final_price))
    
    ld_message = {"ebitda": l_ebitda}
    frappe.flags.message = ld_message
