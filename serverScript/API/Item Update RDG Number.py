# >> TASK-2024-00218: To Set the first RDG Number as default in Item RDG Number Table in the Item and aslo check the duplicate RDG Number
# Get the sales order items from the form data
la_sales_order_items = frappe.form_dict["ia_sales_order_items"]
l_is_save = 0

# Iterating through each item in la_sales_order_items
for ld_so_item in la_sales_order_items:
    if ld_so_item.rdg_number:  # Ensure rdg_number exists
        # Check if the rdg_number already exists in item_rdg_number
        ld_item = frappe.get_doc("Item", ld_so_item.item_code)
        ld_rdg_number = {}
        # Check if item_rdg_number is not in the item child table "Item RDG Number".Set the first new RDG number with default value in that table
        if not ld_item.item_rdg_number:
            #Save the Item form only when changes have been made.
            l_is_save = 1
            ld_rdg_number = {
                'rdg_number': ld_so_item.rdg_number,
                'is_default': 1
            }
            ld_item.append("item_rdg_number", ld_rdg_number)
        #Check if the new RDG number already exists in the Item table; if it does, leave it unchanged, 
        #And then set the RDG number from the sales order item to the Item RDG number without default value.
        else:
            if not any(ld_rdg.rdg_number == ld_so_item.rdg_number for ld_rdg in ld_item.item_rdg_number):
                #Save the Item form only when changes have been made.
                l_is_save = 1
                ld_rdg_number = {
                    'rdg_number': ld_so_item.rdg_number,
                    'is_default': 0
                    
                }
                ld_item.append("item_rdg_number", ld_rdg_number)
                
#Check if the item form triggers the save action.               
if l_is_save:
    ld_item.save()
