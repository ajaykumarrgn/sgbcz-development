# fill the item description from the the template DTTHZ2N    
def fill_item_description(item):
    template_item = frappe.get_doc('Item', item.variant_of)
    item.description = template_item.description
    return item
if doc.variant_of and doc.variant_of.startswith('DTTHZ2N'):
    doc = fill_item_description(doc)