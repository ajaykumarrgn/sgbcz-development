def get_columns(filters):
    columns = []
    # >>ISS-2024-00020
    # >>TASK-2024-00221
    columns = [
            {"fieldname": "sales_order", "label" : _("Sales<br>Order"), "fieldtype": "Link", "options": "Sales Order", "width": 140},
            {"fieldname": "delivery_note", "label" : _("Delivery<br>Note"), "fieldtype": "Link", "options": "Delivery Note", "width": 140},
            {"fieldname": "customer", "label" : _("Customer"), "fieldtype": "Link", "options": "Customer", "width": 180},
            {"fieldname": "customer_group", "label" : _("Customer<br>Group"), "fieldtype": "Link", "options": "Customer Group", "width": 120},
            {"fieldname": "incoterms", "label" : _("Incoterms"), "fieldtype": "Select", "width": 140},
            {"fieldname": "territory", "label" : _("Territory"), "fieldtype": "Link", "options": "Territory", "width": 100},
            {"fieldname": "documentation_language", "label" : _("Documentation Language"), "fieldtype": "Data", "width": 160},
            {"fieldname": "second_language", "label" : _("Second Language"), "fieldtype": "Data", "width": 160, "display": "hidden", "hidden": 1},
            {"fieldname": "is_reservation", "label" : _("Reserved Order"), "fieldtype": "Data", "width": 80},
            {"fieldname": "item_code", "label" : _("Item Code"), "fieldtype": "Link", "options": "Item", "width": 180},
            {"fieldname": "id_number", "label" : _("Id Number"), "fieldtype": "Data", "width": 160},
            
            {"fieldname": "rdg_number", "label" : _("RDG Num."), "fieldtype": "Data", "width": 120},
            {"fieldname": "item_group", "label" : _("Trafo Type"), "fieldtype": "Data", "width": 100},
            {"fieldname": "power", "label" : _("Rating"), "fieldtype": "Data", "width": 80},
            {"fieldname": "hv", "label" : _("HV Volt"), "fieldtype": "Data", "width": 70},
            {"fieldname": "lv", "label" : _("LV Volt"), "fieldtype": "Data", "width": 70},
            {"fieldname": "vector_group", "label" : _("Vector Group"), "fieldtype": "Data", "width": 70},
            {"fieldname": "uk", "label" : _("UK %"), "fieldtype": "Data", "width": 50},
            {"fieldname": "tappings", "label" : _("Tappings"), "fieldtype": "Data", "width": 70},
            {"fieldname": "p0", "label" : _("P(0) (W)"), "fieldtype": "Data", "width": 70},
            {"fieldname": "pk", "label" : _("P(k)120°C (W)"), "fieldtype": "Data", "width": 70},
            {"fieldname": "li", "label" : _("LI"), "fieldtype": "Data", "width": 70},
            {"fieldname": "thdi", "label" : _("THDi (%)"), "fieldtype": "Data", "width": 70},
            {"fieldname": "ip_protection", "label" : _("IP Protection"), "fieldtype": "Data", "width": 70},
            {"fieldname": "electrostatic_screen", "label" : _("Electrostatic<br>Screen"), "fieldtype": "Data", "width": 70},
            {"fieldname": "hv1", "label" : _("HV1 Volt"), "fieldtype": "Data", "width": 70},
            {"fieldname": "hv2", "label" : _("HV2 Volt"), "fieldtype": "Data", "width": 70},

            {"fieldname": "po_no", "label" : _("PO"), "fieldtype": "Data", "width": 100},
            {"fieldname": "po_date", "label" : _("PO Date"), "fieldtype": "Date", "width": 100},
            {"fieldname": "serial_number", "label" : _("Serial<br>Number"), "fieldtype": "Data", "width": 80},
            {"fieldname": "oa_confirmed_date", "label" : _("OA<br>Confirmed Date"), "fieldtype": "Date", "width": 100},
            {"fieldname": "planned_production_end_date", "label" : _("Planned<br>Prod End Date"), "fieldtype": "Date", "width": 100},
            {"fieldname": "planned_week", "label" : _("Planned Weeks"), "fieldtype": "Data", "width": 100},
            {"fieldname": "delivery_date", "label" : _("Delivery<br>Date"), "fieldtype": "Date", "width": 100},
            {"fieldname": "on_time_delivery", "label" : _("On Time Delivery"), "fieldtype": "Select", "width": 50},
            {"fieldname": "storage_fee", "label" : _("Storage Fee"), "fieldtype": "Select", "width": 70},
            {"fieldname": "transformer_status", "label" : _("Transformer<br>Status"), "fieldtype": "Data", "width": 100},
            {"fieldname": "sap_reference", "label" : _("SAP Reference"), "fieldtype": "Data", "width": 100},
            {"fieldname": "order_value", "label" : _("Order Value"), "fieldtype": "Currency", "width": 100},
            {"fieldname": "price_gts", "label" : _("Price GTS"), "fieldtype": "Currency", "width": 100},
            {"fieldname": "invoice_number", "label" : _("Invoice Number"), "fieldtype": "Data", "width": 100},
            {"fieldname": "invoice_date", "label" : _("Invoice Date"), "fieldtype": "Date", "width": 100},
            {"fieldname": "payment_condition", "label" : _("Payment<br>Condition"), "fieldtype": "Data", "width": 100},
            {"fieldname": "production_end_date", "label" : _("Prod End Date"), "fieldtype": "Date", "width": 100},
            {"fieldname": "gta_serial_number", "label" : _("GTASerial<br>Number"), "fieldtype": "Data", "width": 100},
            {"fieldname": "company_guarantee", "label" : _("Company<br>Gurantee"), "fieldtype" : "Date", "width": 100},
           
        ]
    if filters.include_all_fields:
        accessories_columns = [
            {"fieldname": "antivibration_pads", "label" : _("Anti Vibration<br>Pads"), "fieldtype": "Data", "width": 70},
            {"fieldname": "enclosure", "label" : _("Enclosure"), "fieldtype": "Data", "Data": 70},
            {"fieldname": "ballpoint", "label" : _("Ball Point"), "fieldtype": "Data", "width": 70},
            {"fieldname": "cupal", "label" : _("Cupal"), "fieldtype": "Data", "width": 70},
            {"fieldname": "busbars", "label" : _("Busbars"), "fieldtype": "Data", "width": 70},
            {"fieldname": "fans", "label" : _("Fans"), "fieldtype": "Data", "width": 70},
            {"fieldname": "control_unit", "label" : _("Control unit"), "fieldtype": "Data", "width": 70},
            {"fieldname": "sensors", "label" : _("Sensors"), "fieldtype": "Data", "width": 70},
            {"fieldname": "forklift", "label" : _("Forklift"), "fieldtype": "Data", "width": 70},
            {"fieldname": "silicon_free", "label" : _("Silicon free"), "fieldtype": "Select", "width": 70},
            {"fieldname": "test_lab", "label" : _("Test lab"), "fieldtype": "Data", "width": 70},
            {"fieldname": "others2", "label" : _("Others Accessories"), "fieldtype": "Data", "width": 70},
            {"fieldname": "engineering_required", "label" : _("Engineering<br>Required"), "fieldtype": "Select", "width": 70},
            {"fieldname": "earthing_switch", "label" : _("Earthing<br>switch"), "fieldtype": "Data", "width": 70},
            {"fieldname": "surge_arrester", "label" : _("Surge Arrester"), "fieldtype": "Data", "width": 70},
            {"fieldname": "agent", "label" : _("SGB Account"), "fieldtype": "Link",  "options": "Sales Person","width": 100}, 
            {"fieldname": "sales_team", "label" : _("Agent"), "fieldtype": "Data","width": 100}, 
            #{"fieldname": "comments", "label" : _("Notes"), "fieldtype": "Small Text","width": 200},
            {"fieldname": "notes", "label" : _("Notes"), "fieldtype": "Small Text","width": 200},
            {"fieldname": "prepayment_invoice", "label" : _("Prepayment<br>Invoice"), "fieldtype": "Data","width": 100},
            {"fieldname": "prepayment_status", "label" : _("Prepayment<br>Status"), "fieldtype": "Select","width": 100},
            {"fieldname": "prepayment_invoice2", "label" : _("Prepayment<br>Invoice2"), "fieldtype": "Data","width": 100},
            {"fieldname": "prepayment2_status", "label" : _("Prepayment2<br>Status"), "fieldtype": "Select","width": 100},
            ]
        # << ISS-2024-00020
        # << TASK-2024-00221
        columns.extend(accessories_columns)
    return columns
    
def get_result(filters):
#   Get All Sales Orders
    def get_all_sales_orders(filters):
        # BETWEEN dates is not working as expected usind frappe.get_all
        # Hence switching to frappe.db.sql
        # Also added condition to exclude cancelled documents
        sos = frappe.db.sql("""select name
                            from `tabSales Order`
                            WHERE po_date BETWEEN %(from_date)s AND %(to_date)s
                            AND docstatus != 2
                            """,
                            {"to_date": filters['to_date'], "from_date": filters['from_date']},
                            as_dict=1)                
        # >> ISS-2024-00002
        # Get the Unique Sales order for the obtained Sales Order List
        so_unique = get_unique(sos, 'name')
   
        # Return 
        return get_sos_details(so_unique), so_unique
        # << ISS-2024-00002
        
#   Get the details of Sales orders along with all the child table values        
    def get_sos_details(it_so_unique):
        filters={
                'name': ('IN',it_so_unique),
                'docstatus': ("!=", 2),
    
            }
        et_sos_details = frappe.get_all(
                'Sales Order', 
                fields=(
                "name",
                "customer",
                "territory",
                "documentation_language",
                "second_language",
                "agent",
                "owner",
                #"comments",
                "incoterms",
                "prepayment_invoice",
                "prepayment_status",
                "prepayment_invoice2",
                "prepayment2_status",
                "po_no",
                "po_date",
                "company_guarantee",
                "is_reservation",
                "`tabSales Order Item`.item_code",
                "`tabSales Order Item`.qty",
                "`tabSales Order Item`.pos",
                "`tabSales Order Item`.id_number",
                "`tabSales Order Item`.rdg_number",
                "`tabSales Order Item`.item_group",
                "`tabSales Order Item`.sap_reference",
                "`tabSales Order Item`.rate",
                "`tabSales Order Item`.sensor_name",
                "`tabSales Order Item`.engineering_required",
                #>> ISS-2024-00018
                "`tabSales Order Item`.silicon_free",
                #<< ISS-2024-00018
                "`tabPayment Schedule`.invoice_portion",
                "`tabSales Team`.sales_person",
            ),
                filters=filters,
     
            )
            # Sort the 'et_delivery_items' list based on 'parent' and 'pos' fields in ascending order
            #et_sos_details = sorted(et_delivery_items, key=lambda x: (x['parent'], x['pos']) )
            # Return the sorted 'et_delivery_items' list
        return et_sos_details

#   Get Unique record based on key 
    def get_unique(table, key):
        unique = list(set([d[key] for d in table]))
        return unique
#   The function is to get all customers
#   it_sales_order_list is an array of sales orders
    def get_customer_details(it_sales_order_list):
    
        # Get the unique customers
        unique_customers = get_unique(it_sales_order_list, 'customer')
        
        # Set the filters for customers from the unique customer list
        filters =     filters={
                'name': ('IN',unique_customers),
            }
            
        # Get details of customer based on filters    
        customer = frappe.get_all('Customer', fields=['name','customer_group', 'territory'], filters=filters)
        return customer
    
#   The function gets the attributes of the given items in sales order items table
#   it_sales_order_list is an array of sales orde
    def get_item_attributes(it_sales_order_list):
    
        unique_transformer_items = get_unique_transformer_items(it_sales_order_list, 'item_code')
        filters =     filters={
                'parent': ('IN',unique_transformer_items),
        }
        item_attributes = frappe.get_all('Item Variant Attribute', fields=['attribute', 'attribute_value', 'parent'], filters=filters)
        item_attributes_sorted = sorted(item_attributes, key=lambda x: x['parent'])
        return item_attributes

### End of function  get_item_attributes
    
#   Get Unique Transformer items from the sales order items
#   The record with pos in multiples of 10 are Transformer Items
#   it_table[] sales order items
#   i_key key to look for
    def get_unique_transformer_items(it_table, i_key):
        unique = list(set([d[i_key] for d in it_table if d['pos'] % 10 == 0]))
        return unique
        
    table = []
#   Do not proceed if sales order filter is not set    
    if not filters.from_date:
        return
#   Get All Sales Order for the PO Date Range. The below call returns two params in array format
#   first one is the entire sales order details and second one is the unique sales order numbers
    sos = get_all_sales_orders(filters)
    
    # Sales Order details with Items
    sos_details = sos[0]
    
    # Unique Sales Orders
    sales_order_list = sos[1]

    # Get all customer details for the selected sales orders
    customer_list = get_customer_details(sos_details)
    
    # Get the attributes of all the items
    item_attributes_list = get_item_attributes(sos_details)
    
    # Get all delivery notes for the sales order list
    la_delivery_note_list = fn_get_delivery_notes_for_sales_orders(sales_order_list)
    
    # Get all Schedule lines for the Delivery Notes List
    la_schedule_line_list = fn_get_schedule_lines(sales_order_list)
    
    frappe.msgprint(str(len(sales_order_list)))
        
    table = [{'sales_order':'ABC'}]
    return table
    
data = []

data_table = get_result(filters)

columns = get_columns(filters)

    
data = columns, data_table