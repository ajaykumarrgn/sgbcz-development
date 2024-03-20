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
        {"fieldname": "ebitda", "label": _("EBITDA"), "fieldtype": "Currency", "width": 100},
        {"fieldname": "material_cost", "label": _("Material Cost"), "fieldtype": "Currency", "width": 100},
        {"fieldname": "total_cost", "label": _("Total Cost"), "fieldtype": "Currency", "width": 100},
    ]
    return columns

def get_data(i_filters):
    report_data = []
    
    def get_unique(table, key):
        unique = list(set([d[key] for d in table]))
        return unique
    
    
    def get_all_sales_order(i_filters):
        ld_filters = {"po_date":("between", [i_filters.from_date, i_filters.to_date])}
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
                   
                    filters = ld_filters,
                )

        return ld_sos_details 
        
    def get_all_customer(ld_sos_details):
        unique_customers = get_unique(ld_sos_details, 'customer')
        
        filters= {"name": ("IN", unique_customers)}
            
        # Get details of customer based on filters    
        customer = frappe.get_all('Customer', fields=['name','customer_group'], filters=filters, order_by = "name")
        
        return customer
    
    def get_all_item_details(ld_sos_details):
        unique_items = get_unique(ld_sos_details, 'item_code')
        ld_filters = {"item_code": ("IN", unique_items)}
        
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
        
    
        
    def get_all_price_lists():
         return (frappe.get_all("Price List", fields = ['name', 'transport', 'provision']))
         
    # Function to find a dictionary based on a condition
    def find_dict(arr, key, value):
        for ld_record in arr:
            if ld_record.get(key) == value:
                return ld_record
        return None
        
    
    def get_all_designs(ima_item_details):
        unique_designs = get_unique(ima_item_details, 'design')
        
        ld_filters= {"name": ("IN", unique_designs)}
            
        # Get details of design based on filters    
        design = frappe.get_all('Design', fields=['item','name', 'direct_material_cost', 'total_cost'], filters=ld_filters, order_by = "name")
        
        return design
        
    def get_all_item_groups():
        return(frappe.get_all("Item Group", fields=['name', 'parent_item_group']))
    
    def binary_search_leftmost(sorted_list, key, search_key):

        low = 0
        high = len(sorted_list) - 1
        result = -1

        while low <= high:
            mid = (low + high) // 2
            mid_dict = sorted_list[mid]
            #frappe.msgprint(str(mid_dict['item_code']))
        
            if mid_dict[key] < search_key:
                low = mid + 1
            elif mid_dict[key] > search_key:
                high = mid - 1
            else:
                result = mid
                high = mid - 1  # Move towards left for leftmost occurrence
        
        return sorted_list[result]
        
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
    
        ld_customer = binary_search_leftmost(la_customer_detail, 'name', ld_so_detail.customer)
        ld_item = binary_search_leftmost(la_item_details, 'item_code', ld_so_detail.item_code)
        
        l_total_cost = 0
        l_material_cost = 0
        if ld_item["design"]:
            ld_design = binary_search_leftmost(la_design_details, 'name', ld_item["design"])
            l_total_cost = ld_design["total_cost"]
            l_material_cost = ld_design["direct_material_cost"]
        elif ld_item["is_catalog_item"]:
            l_total_cost = ld_item["total_cost"]
            l_material_cost = ld_item["material_cost"]
        
        
        ld_price_list = find_dict(la_price_lists, "name", ld_so_detail.selling_price_list)
        ld_item_group = find_dict(la_all_item_groups, "name", ld_item.item_group)
        
        if ld_price_list:
            ld_message = frappe.call(
                "get_ebitda_for_pricelist",
                i_price_list=ld_price_list,
                i_total_cost=l_total_cost,
                i_parent_itemgroup=ld_item_group,
                i_final_price=ld_so_detail["rate"]
            )
            
            ld_ebitda = ld_message.message['ebitda'] if ld_message.message['ebitda'] is not None else None
            
        else:
            ld_ebitda = None
        
        item_row = {
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
            "ebitda": ld_ebitda,
            "material_cost": l_material_cost,
            "total_cost": l_total_cost,
            
        }
        report_data.append(item_row)

    return report_data

data = get_columns(filters), get_data(filters)
