# Get the item price document based on the price list for an item
def get_item_price(item_code, price_list):
    item_price = frappe.get_all(
        "Item Price",
        filters={
            "item_code": item_code,  # Pass the item code
            "price_list": price_list # and the price list name eg 'Germany Selling'
        },
        fields=["name"],
        # Get the most recent record
        order_by="valid_from desc",
        # Get only one record
        limit=1
    )
    # If an entry is found
    if item_price:
        return item_price[0]
    else:
        return None

# This script is to create/update prices of an item for other price lists.
# Typically when an design is created with an item, the item price is added based on the
# Gitra values calculated for the design. However EBITDA, Provisions should be added for 
# different regions using price lists. eg Price List "Germany Selling" must be added with
# 12% EBITDA and 4% Provision on top of the Standard Selling.

if doc.price_list == 'Standard Selling':
    item = frappe.get_doc('Item', doc.item_code)
    if item.item_group == 'DTTHZ2N' and item.design:
        # Get all price lists
        price_lists = frappe.get_all(
            'Price List', 
            fields=['name', 'ebitda', 'provision', 'selling', 'transport'], 
            filters={'name': ['!=', 'Standard Selling']})
    
        # Iterate all price lists to create a or update the corresponding price list item price
        for price_list in price_lists:
            # only include selling price list and price lists having EBITDA or Provision defined
            if price_list.selling == 1 and (price_list.ebitda > 0 or price_list.provision > 0 or price_list.transport > 0):
                # Get the existing item price for the price list
                item_price_doc = get_item_price(doc.item_code, price_list.name)
                #If an Item price already found for the price list
                #if item_price_doc:
                    # get the item price document
                    # price_list_item_price = frappe.get_doc('Item Price', item_price_doc.name)
                    # Modify the price with margins from the standard selling price
                    # price_list_item_price.price_list_rate = doc.price_list_rate  + doc.price_list_rate * price_list.ebitda/100
                    # add privsion
                    # price_list_item_price.price_list_rate = price_list_item_price.price_list_rate + price_list_item_price.price_list_rate * price_list.provision/100
                    # add transport
                    # price_list_item_price.price_list_rate = price_list_item_price.price_list_rate + price_list.transport
                    # round to nearest 10
                    # price_list_item_price.price_list_rate = round(price_list_item_price.price_list_rate/10)*10
                    # Save the document
                    # price_list_item_price.save()
                # Otherwise
                if not item_price_doc:
                    # copy the standard selling item price
                    target_item_price = frappe.copy_doc(doc)
                    # update the price list name eg from Standard Selling to Germany Selling
                    target_item_price.price_list = price_list.name
                    # # Modify the price with margins from the standard selling price
                    # ebitda_value is calculated as material_cost*ebitda/(100-ebitda) eg 21140*25/(100-25) = 7046.7
                    # and price with ebitda is calculated as ebitda_value + doc.total_cost
                    target_item_price.price_list_rate = doc.price_list_rate  + (price_list.ebitda * doc.price_list_rate/(100-price_list.ebitda))
                    # add transport
                    if price_list.transport:
                        target_item_price.price_list_rate = target_item_price.price_list_rate  + price_list.transport
                    add_nine = 9
                    # Round up to next 10
                    # Round Up logic is rounded_number = ((number + 9) // 10) * 10  this is equivalent to ceil 
                    target_item_price.price_list_rate = ((target_item_price.price_list_rate + add_nine) // 10) * 10
                    
                    # add provsion
                    if price_list.provision:
                        target_item_price.price_list_rate = target_item_price.price_list_rate  + ((target_item_price.price_list_rate * price_list.provision)/(100-price_list.provision))
                   
                    # round to nearest 10
                    target_item_price.price_list_rate = ((target_item_price.price_list_rate + add_nine) // 10) * 10
                    # Insert new reocord
                    target_item_price.insert()
  
