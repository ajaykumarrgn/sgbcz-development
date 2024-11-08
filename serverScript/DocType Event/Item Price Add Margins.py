# Change Request: Updating prices in the Pricelist based on the Recalculating design item [US-2024-0167]
# Get the item price document based on the price list for an item
def fn_get_item_price(i_item_code, i_price_list):
    la_item_price = frappe.get_all(
        "Item Price",
        filters={
            "item_code": i_item_code,  # Pass the item code
            "price_list": i_price_list # and the price list name eg 'Germany Selling'
        },
        fields=["name"],
        # Get the most recent record
        order_by="valid_from desc",
        # Get only one record
        limit=1
    )
    # If an entry is found
    if la_item_price:
        return la_item_price[0]
    else:
        return None

# This script is to create/update prices of an item for other price lists.
# Typically when an design is created with an item, the item price is added based on the
# Gitra values calculated for the design. However EBITDA, Provisions should be added for 
# different regions using price lists. eg Price List "Germany Selling" must be added with
# 12% EBITDA and 4% Provision on top of the Standard Selling.

if doc.price_list == 'Standard Selling':
    l_item = frappe.get_doc('Item', doc.item_code)
    if l_item.item_group == 'DTTHZ2N' and l_item.design:
        # Get all price lists
        ld_price_lists = frappe.get_all(
            'Price List', 
            fields=['name', 'ebitda', 'provision', 'selling', 'transport'], 
            filters={'name': ['!=', 'Standard Selling']})
    
        # Iterate all price lists to create a or update the corresponding price list item price
        for ld_price_list in ld_price_lists:
            # only include selling price list and price lists having EBITDA or Provision defined
            if ld_price_list.selling == 1 and (ld_price_list.ebitda > 0 or ld_price_list.provision > 0 or ld_price_list.transport > 0):
                # Get the existing item price for the price list
                l_item_price_doc = fn_get_item_price(doc.item_code, ld_price_list.name)
                
                #>>US-2024-0167:Uncomment this block of code for updating price list through the Design item
                #If an Item price already found for the price list
                if l_item_price_doc:
                    # get the item price document
                    ld_price_list_item_price = frappe.get_doc('Item Price', l_item_price_doc.name)
                    # Modify the price with margins from the standard selling price
                    ld_price_list_item_price.price_list_rate = doc.price_list_rate  + doc.price_list_rate * ld_price_list.ebitda/100
                    # add privsion
                    ld_price_list_item_price.price_list_rate = ld_price_list_item_price.price_list_rate + ld_price_list_item_price.price_list_rate * ld_price_list.provision/100
                    # add transport
                    ld_price_list_item_price.price_list_rate = ld_price_list_item_price.price_list_rate + ld_price_list.transport
                    # round to nearest 10
                    ld_price_list_item_price.price_list_rate = round(ld_price_list_item_price.price_list_rate/10)*10
                    # Save the document
                    ld_price_list_item_price.save()
                   
                #<<US-2024-0167
                # Otherwise
                if not l_item_price_doc:
                    # copy the standard selling item price
                    ld_target_item_price = frappe.copy_doc(doc)
                    # update the price list name eg from Standard Selling to Germany Selling
                    ld_target_item_price.price_list = ld_price_list.name
                    # # Modify the price with margins from the standard selling price
                    # ebitda_value is calculated as material_cost*ebitda/(100-ebitda) eg 21140*25/(100-25) = 7046.7
                    # and price with ebitda is calculated as ebitda_value + doc.total_cost
                    ld_target_item_price.price_list_rate = doc.price_list_rate  + (ld_price_list.ebitda * doc.price_list_rate/(100-ld_price_list.ebitda))
                    # add transport
                    if ld_price_list.transport:
                        ld_target_item_price.price_list_rate = ld_target_item_price.price_list_rate  + ld_price_list.transport
                    add_nine = 9
                    # Round up to next 10
                    # Round Up logic is rounded_number = ((number + 9) // 10) * 10  this is equivalent to ceil 
                    ld_target_item_price.price_list_rate = ((ld_target_item_price.price_list_rate + add_nine) // 10) * 10
                    
                    # add provsion
                    if ld_price_list.provision:
                        ld_target_item_price.price_list_rate = ld_target_item_price.price_list_rate  + ((ld_target_item_price.price_list_rate * ld_price_list.provision)/(100-ld_price_list.provision))
                   
                    # round to nearest 10
                    ld_target_item_price.price_list_rate = ((ld_target_item_price.price_list_rate + add_nine) // 10) * 10
                    # Insert new reocord
                    ld_target_item_price.insert()
  
