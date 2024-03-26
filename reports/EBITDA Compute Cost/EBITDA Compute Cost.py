# Change Request : TASK-2024-00157
# Calculate the EBITDA margin for Design items, Catalog items, and Accessories based on their Material cost, Total Cost, and Selling Price.
# Define the Columns for generating the EBITDA Calcultaion Report.
def get_columns(filters):
    columns = []
    columns = [
        {"fieldname": "sales_order", "label": _("Sales Order"), "fieldtype": "Link", "options": "Sales Order", "width": 140},
        {"fieldname": "customer", "label": _("Customer"), "fieldtype": "Link", "options": "Customer", "width": 180},
        {"fieldname": "customer_group", "label": _("Customer Group"), "fieldtype": "Link", "options": "Customer Group", "width": 140},
        {"fieldname": "territory", "label": _("Territory"), "fieldtype": "Data", "width": 140},
        {"fieldname": "po_date", "label": _("PO Date"), "fieldtype": "Date", "width": 100},
        {"fieldname": "pos", "label": _("SO POS"), "fieldtype": "Data", "width": 80},
        {"fieldname": "item_code", "label": _("Item Code"), "fieldtype": "Link", "options": "Item", "width": 180},
        {"fieldname": "qty", "label": _("Quantity"), "fieldtype": "Data", "width": 80},
        {"fieldname": "rate", "label": _("Rate"), "fieldtype": "Currency", "width": 100},
        {"fieldname": "amount", "label": _("Amount"), "fieldtype": "Currency", "width": 100},
        {"fieldname": "ebitda", "label": _("EBITDA (%)"), "fieldtype": "Currency", "width": 100},
        {"fieldname": "material_cost", "label": _("Material Cost"), "fieldtype": "Currency", "width": 100},
        {"fieldname": "total_cost", "label": _("Total Cost"), "fieldtype": "Currency", "width": 100},
    ]
    return columns

def get_data(i_filters):
    report_data = []
    #   Get Unique record based on key 
    def get_unique(table, key):
        unique = list(set([d[key] for d in table]))
        return unique
    
    #   Get the details of Sales orders along with all the child table values     
    def get_all_sales_order(i_filters):
        #filters = {
            #'name': ('IN', i_filters),
            #'docstatus': 1,
            #'po_date': ("between", [i_filters.from_date, i_filters.to_date])
        #}
        
        ld_filters = {"po_date":("between", [i_filters.from_date, i_filters.to_date])}
        # Get details of Sales Order based on filters    
        ld_sos_details = frappe.get_all(
                    'Sales Order', 
                    fields=(
                    "name",
                    "customer",
                    "territory",
                    "po_date",
                    "selling_price_list",
                    "`tabSales Order Item`.item_code",
                    "`tabSales Order Item`.qty",
                    "`tabSales Order Item`.pos",
                    "`tabSales Order Item`.rate",
                    "`tabSales Order Item`.amount",
                    ),
                    #filters = filters,
                    filters = ld_filters,
                )

        return ld_sos_details 
        
    #   The function is to get all customers
    #   ld_sos_details is an array of sales orders       
    def get_all_customer(ld_sos_details):
        # Get the unique customers
        unique_customers = get_unique(ld_sos_details, 'customer')
        
        # Set the filters for customers from the unique customer list
        filters= {"name": ("IN", unique_customers)}
            
        # Get details of customer based on filters    
        customer = frappe.get_all('Customer', fields=['name','customer_group'], filters=filters, order_by = "name")
        
        return customer
        
    #   The function is to get all items that was given in the Sales Order Item Table
    #   ld_sos_details is an array of sales orders       
    def get_all_item_details(ld_sos_details):
        # Get the unique Items 
        unique_items = get_unique(ld_sos_details, 'item_code')
        
        # Set the filters for Items from the unique item list
        ld_filters = {"item_code": ("IN", unique_items)}
        # Get the details of the Item based on the filter
        return(frappe.get_all(
                    'Item', 
                    fields=[
                    'item_code', 
                    'material_cost',
                    'total_cost', 
                    'item_group', 
                    'design',
                    'is_catalog_item'
                    ], filters = ld_filters, order_by = "item_code"))
        
    
    # Get the details of the Price List      
    def get_all_price_lists():
         return (frappe.get_all("Price List", fields = ['name', 'transport', 'provision']))
         
    # Function to find a dictionary based on a condition
    # it_arr is a dictionary array
    # i_key the key to searched for
    # i_value the value to searched for
    def find_dict(it_arr, i_key, i_value):
        for ld_record in it_arr:
            if ld_record.get(i_key) == i_value:
                return ld_record
        return None
        
    # Get the details of the Design
    def get_all_designs(ima_item_details):
        # Get the unique items
        unique_designs = get_unique(ima_item_details, 'design')
        
        # Set the filters for the design from the unique design list   
        ld_filters= {"name": ("IN", unique_designs)}
            
        # Get details of design based on filters    
        design = frappe.get_all('Design', fields=['item','name', 'direct_material_cost', 'total_cost'], filters=ld_filters, order_by = "name")
        
        return design
        
    # Get the details of the accessories based on the Item group    
    def get_all_item_groups():
        return(frappe.get_all("Item Group", fields=['name', 'parent_item_group']))
    
    # Define a binary search function to find leftmost occurrence
    # ld_sorted_list: List of dictionaries sorted by the 'key' parameter.
    # i_key: The key in each dictionary to compare with the 'search_key'.
    # i_search_key: The value to search for in the 'sorted_list' using binary search
  
    def binary_search_leftmost(ld_sorted_list, i_key, i_search_key):

        low = 0
        high = len(ld_sorted_list) - 1
        result = -1

        while low <= high:
            mid = (low + high) // 2
            mid_dict = ld_sorted_list[mid]
            
        
            if mid_dict[i_key] < i_search_key:
                low = mid + 1
            elif mid_dict[i_key] > i_search_key:
                high = mid - 1
            else:
                result = mid
                high = mid - 1  # Move towards left for leftmost occurrence
        
        return ld_sorted_list[result]
        
    #Get Sales order Details   
    ld_sos_details = get_all_sales_order(i_filters)
    
    #Get Customer Details
    la_customer_detail = get_all_customer(ld_sos_details)
    
    # Get Price lists
    la_price_lists = get_all_price_lists()
    
    
    # Get Item details like material cost and total cost
    la_item_details = get_all_item_details(ld_sos_details)
    
    # Get Design lists
    la_design_details = get_all_designs(la_item_details)
    
    #Get Item Group Details
    la_all_item_groups = get_all_item_groups() 
    
    for ld_so_detail in ld_sos_details:
        # Find corresponding customer detail
        ld_customer = binary_search_leftmost(la_customer_detail, 'name', ld_so_detail.customer)
        
        # Find corresponding item detail
        ld_item = binary_search_leftmost(la_item_details, 'item_code', ld_so_detail.item_code)
        
        # Initialize the total cost and material cost as 0   
        l_total_cost = 0
        l_material_cost = 0
       
        # Calculate the EBITDA cost based on the designs or items
        if ld_item["design"]:
            ld_design = binary_search_leftmost(la_design_details, 'name', ld_item["design"])
            l_total_cost = ld_design["total_cost"]
            l_material_cost = ld_design["direct_material_cost"]
        else:
            l_total_cost = ld_item["total_cost"]
            l_material_cost = ld_item["material_cost"]
        
        # Find corresponding price list and item group 
        ld_price_list = find_dict(la_price_lists, "name", ld_so_detail.selling_price_list)
        ld_item_group = find_dict(la_all_item_groups, "name", ld_item.item_group)
        
        #Call the API function "EBITDA Compute Cost" to calculate EBITDA based on price list, costs, and rate
       
        ld_response = frappe.call(
                "get_ebitda_for_pricelist",
                i_price_list=ld_price_list,
                i_total_cost=l_total_cost,
                i_parent_itemgroup=ld_item_group,
                i_final_price=ld_so_detail["rate"]
            )
            
        # Create a dictionary for the current sales order item     
        ld_item_row = {
            "sales_order": ld_so_detail.name,
            "customer": ld_so_detail.customer,
            "customer_group": ld_customer["customer_group"],
            "territory": ld_so_detail.territory,
            "po_date": ld_so_detail.po_date,
            "item_code": ld_item.item_code ,
            "pos": ld_so_detail.pos,
            "qty": ld_so_detail.qty,
            "rate": ld_so_detail.rate,
            "amount": ld_so_detail.amount,
            "ebitda": ld_response['message']['ebitda'] if ld_response['message']['ebitda'] is not None else None,
            "material_cost": l_material_cost,
            "total_cost": l_total_cost,
            
        }
        # Append the item row to the report data list
        report_data.append(ld_item_row)

    return report_data

# Begin of execute 
data = get_columns(filters), get_data(filters)
