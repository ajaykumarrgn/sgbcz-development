#Change Request
#Set the first RDG number with default value from the Sales order Item to the Item RDG Number(# TASK-2024-00218)

# >> TASK-2024-00218
frappe.call("item_update_rdg_number", ia_sales_order_items = doc.items)
