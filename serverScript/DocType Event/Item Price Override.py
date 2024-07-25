'''
# Get the item price document based on the price list for an item
'''
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

def compute_final_price(doc, price_list, item_price_doc):
    '''
    # # Modify the price with margins from the standard selling price
    # ebitda_value is calculated as material_cost*ebitda/(100-ebitda) eg 21140*25/(100-25) = 7046.7
    # and price with ebitda is calculated as ebitda_value + doc.total_cost
    # Edited by Eswari on 09-11-2023
    '''
    item_price_doc.price_list_rate = doc.total_cost  + \
        (price_list.ebitda * doc.total_cost/(100-price_list.ebitda))
    if price_list.transport:
        # add transport
        item_price_doc.price_list_rate = item_price_doc.price_list_rate  + price_list.transport
    # Round Up logic is rounded_number = ((number + 9) // 10) * 10  this is equivalent to ceil
    add_nine = 9
    frappe.log(item_price_doc.price_list_rate)
    item_price_doc.price_list_rate = ((item_price_doc.price_list_rate + add_nine)//10)*10
    if price_list.provision:
        # add provsion
        item_price_doc.price_list_rate = item_price_doc.price_list_rate  + \
            (price_list.provision * item_price_doc.price_list_rate/(100-price_list.provision))
        # round to nearest 10
    item_price_doc.price_list_rate = ((item_price_doc.price_list_rate + add_nine)//10)*10
    return item_price_doc

#  Override price only if Override checkbox is enabled and the item is not a catalog item
if doc.override_price and not doc.is_catalog_item and not doc.has_variants:
    # Process only if material cost is entered
    if doc.material_cost:
        # Iterate all the customer price overrides
        for price_list in doc.item_price_override:
            # Check or get the existing item price for the price list
            item_price_doc = get_item_price(doc.name, price_list.price_list)
            # If there is no Item price create one
            if not item_price_doc:
                # Create a new instance of Item Price
                item_price_doc = frappe.get_doc({'doctype': 'Item Price', 'item_code': doc.name})

                # update the price list name
                item_price_doc.price_list = price_list.price_list

                item_price_doc = compute_final_price(doc, price_list, item_price_doc)

                item_price_doc.insert()
            else:
                # Fetch the existing document
                item_price_doc = frappe.get_doc('Item Price', item_price_doc.name)
                item_price_doc = compute_final_price(doc, price_list, item_price_doc)

                item_price_doc.save()
