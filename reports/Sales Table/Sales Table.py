# Change References
# Performance Optimization:(Issue# : ISS-2024-00002)
# Link more Control Units:(Issue# : ISS-2024-00012)
# Silicon-free is not Visible: (Issue# : ISS-2024-00018)
# Some Columns not visible using Saved Column (Issue# : ISS-2024-00020)

# Change Request
# Transfer Note section from Sales order to Delivery Schedule (Task#: TASK-2024-00221)

def get_columns(filters):
    columns = []
    # >>ISS-2024-00020
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
            {"fieldname": "comments", "label" : _("Notes"), "fieldtype": "Small Text","width": 200},  #Use this Column for the (TASK-2024-00221)
            {"fieldname": "prepayment_invoice", "label" : _("Prepayment<br>Invoice"), "fieldtype": "Data","width": 100},
            {"fieldname": "prepayment_status", "label" : _("Prepayment<br>Status"), "fieldtype": "Select","width": 100},
            {"fieldname": "prepayment_invoice2", "label" : _("Prepayment<br>Invoice2"), "fieldtype": "Data","width": 100},
            {"fieldname": "prepayment2_status", "label" : _("Prepayment2<br>Status"), "fieldtype": "Select","width": 100},
            ]
        # << ISS-2024-00020
    
        columns.extend(accessories_columns)
    return columns

def set_session_defaults(filters):

    # Get the current logged in user
    user = frappe.session.user
    
    # Get the session default stored earlier for the logged in user
    user_session_default_if_exist = frappe.db.exists("User Session Defaults", user)

    # If the session data available for user
    if user_session_default_if_exist:
        # Set "from date" and "to date" for the existing logging-in user
        user_session_default = frappe.get_doc("User Session Defaults", user)
        
        # initialize session data update as false
        update_required = False
        
        # Check if there is change in the session params
        if user_session_default.from_date != filters.from_date:
            user_session_default.from_date = filters.from_date
            update_required = True
            
        if user_session_default.to_date != filters.to_date:
            user_session_default.to_date = filters.to_date
            update_required = True
        
        # If there is a change in the session variables then update the session      
        if update_required:
            user_session_default.save(ignore_permissions=True)
            frappe.db.commit()
            
    # If the session data not available, then create a new session data for the user        
    else:
        # Insert "from date" and "to date" for the new login user
        user_session_default = frappe.get_doc({
            'doctype': 'User Session Defaults',
            'user': user,
            'from_date': filters.from_date,
            'to_date': filters.to_date,
            
        })
        user_session_default.insert()
        frappe.db.commit()
        
    return user_session_default
    
# Re order the output columns based on the user preference
def reorder_columns_for_user_preference(columns, user_session_default):
    # initialize
    reordered_columns = []
    # convert the column preference stored as string to Json array
    user_columns=json.loads(user_session_default.report_columns)
    
    # Reorder the output column based on the user preference
    # iterate user preference columns
    for fieldname in user_columns:
        # Find the actual report column corresponding to the position of the user preference
        for item in columns:
            #  If found append
            if item['label'] == fieldname:
                reordered_columns.append(item)

        
    return reordered_columns


    
def get_filtered_records_for_date_type(data_table, filters):
   
    if not filters.date_type or len(filters.months) == 0:
        return data_table
    else:
        if filters.date_type == 'PO Date':
            date_field = 'po_date'
        elif filters.date_type == 'OA Confirmed Date':
            date_field = 'oa_confirmed_date'
        elif filters.date_type == 'Planned Production End Date':
            date_field = 'planned_production_end_date'
        elif filters.date_type == 'Delivery Date':
            date_field = 'delivery_date'
        elif filters.date_type == 'Invoice Date':
            date_field = 'invoice_date'    
            
        filtered_table = []
        for data in data_table:
            if (frappe.utils.formatdate(data[date_field], format_string="MMM") in filters.months):
                filtered_table.append(data)

        return filtered_table

## Filter invoiced and expedited records from the list
## the condition is for the transformer that are invoiced and with status "Done - Expedited"
## are considered to be sold items. they are no more required in open list
def filter_invoiced_records(data_table, ifilters):

    # Initialize the array
    filtered_table = []
    
    # Iterate the output table
    for data in data_table:
        
        # if the record has invoice number then check if the status is
        # not Done - Expedited only then include in the final output
        if data['invoice_number']:
            if data['transformer_status'] != "Done - Expedited":
                filtered_table.append(data)
        else:
        # if there is no invoice number then include in the final output
            filtered_table.append(data)

    return filtered_table
    
def sort_output(data_table, sort_sequence):
    def sort_key(data_row):
        key = []
        for sort in sort_sequence:
            value = data_row[sort.field_name]
            if sort.field_type == 'Int':
                value = int(value)
            key.append((-value, value) if sort.sort_order == 'Descending' else (value, value))
        return key
        
    if not sort_sequence:
        # Sort the data_table based on both Rating and RDG Number on 18 Jul
        sorted_table = sorted(data_table, key=lambda x: (int(x['power']), x['rdg_number']))
        return sorted_table
    else:
        # Sort the data_table based on both Rating and RDG Number on 18 Jul
        return sorted(data_table, key=sort_key)
    
def get_result(filters):

# >> ISS-2024-00002    
#   Get Unique record based on key 
    def get_unique(table, key):
        unique = list(set([d[key] for d in table]))
        return unique
        
#   Get Unique Transformer items from the sales order items
#   The record with PO in multiples of 10 are Transformer Items
#   it_table[] sales order items
#   i_key key to look for
    def get_unique_transformer_items(it_table, i_key):
        unique = list(set([d[i_key] for d in it_table if d['pos'] % 10 == 0]))
        return unique
        
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
                #"comments", #<<commented this line in sales order for Note section (#TASK-2024-00221)
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
    
### End of function  get_customer_details 

#   The function gets the attributes of the given items in sales order items table
#   it_sales_order_list is an array of sales orde
    def get_item_attributes(it_sales_order_list):
    
        unique_transformer_items = get_unique_transformer_items(it_sales_order_list, 'item_code')
        filters =     filters={
                'parent': ('IN',unique_transformer_items),
        }
        item_attributes = frappe.get_all('Item Variant Attribute', fields=['attribute', 'attribute_value', 'parent'], filters=filters)
        return item_attributes

### End of function  get_item_attributes
# << ISS-2024-00002  
        
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


## finding a record from the dictionary array
## it_dict_array is a dictionary array
## i_key the key to searched for
## i_value the value to searched for
    def find_dict_with_keys(it_dict_array, i_key, i_value):

        # Iterate the array
        for doc in it_dict_array:
            # check the key for the value
            if doc[i_key] == i_value:
                return doc
            
### End of the function find_dict_with_keys            
        
#   Get Sales Order header
    def get_sales_order_header(sales_order): 
        sales_order_header = frappe.get_doc('Sales Order', sales_order)
        return sales_order_header.as_dict()

#   Map Item attributes        
    def map_item_attribute(item_attributes, po_item_row):
        for attribute in item_attributes:
            # Filter only the respective Item code        
            if attribute.parent == po_item_row['item_code']: # << ISS-2024-00002 <<
            
                if attribute.attribute == 'Power (kVA)':
                    po_item_row['power'] = attribute.attribute_value
                elif attribute.attribute == 'HV (kV)':
                    po_item_row['hv'] = attribute.attribute_value
                    #po_item_row['hv'] = attribute.attribute_value.replace('.', ',')
                elif attribute.attribute == 'LV (V)':
                    po_item_row['lv'] = attribute.attribute_value
                elif attribute.attribute == 'Vector Group':
                    po_item_row['vector_group'] = attribute.attribute_value
                elif attribute.attribute == 'Uk (%)':
                    po_item_row['uk'] = attribute.attribute_value
                elif attribute.attribute == 'HV LI (kV)':
                    po_item_row['li'] = attribute.attribute_value
                elif attribute.attribute == 'P0 (W)':
                    po_item_row['p0'] = attribute.attribute_value
                elif attribute.attribute == 'Pk (W)':
                    po_item_row['pk'] = attribute.attribute_value
                elif attribute.attribute == 'THDi (%)':
                    po_item_row['thdi'] = attribute.attribute_value
                elif attribute.attribute == 'Transformer IP':
                    po_item_row['ip_protection'] = attribute.attribute_value
                elif attribute.attribute == 'Electrostatic screen':
                    po_item_row['electrostatic_screen'] = attribute.attribute_value
                elif attribute.attribute == 'HV 1 (kV)':
                    po_item_row['hv1'] = attribute.attribute_value
                elif attribute.attribute == 'HV 2 (kV)':
                    po_item_row['hv2'] = attribute.attribute_value

                
        # Get HV1 and HV2 values for switchable transformer and return HV column values as HV1/HV2      
        #if po_item_row['item_group'] == 'Umschaltbar':
            #hv1 = ([attribute for attribute in item_attributes  if attribute.get('attribute') == 'HV 1 (kV)'])[0]['attribute_value']
            #hv2 = ([attribute for attribute in item_attributes  if attribute.get('attribute') == 'HV 2 (kV)'])[0]['attribute_value']
            #po_item_row['hv'] = str(hv1) +  '/' + str(hv2)
        
        # Return the Item row    
        return po_item_row
        
    # Split Item description of Item Antivibration pad and get the word before word Antivibration
    # eg in the below description get GT34
    # Accessories specification:
    # - Set (4 pcs) of GT34 Antivibration pads TK =3 - 4,8 t
    def find_word_before(string, word_to_find):
        words = string.split()
        if word_to_find in words:
            index = words.index(word_to_find)
            if index > 0:
                return words[index - 1]
        return None
        
#   Map Accessories
#   In general if an accessory is found then display the quantity in braces in the output of the report
#   Few accessories need prefix - refer to individual accessories section for the prefix logic

    def map_accessories(item, po_item_row):
        item_master = frappe.db.get_value('Item', item.item_code, ['item_group', 'accessories_specification'], as_dict=1)
        
        if item_master.accessories_specification:
            accessories_specification = item_master.accessories_specification
        else:
            accessories_specification = "Yes" 
            
        if item_master.item_group == 'Antivibration Pads':
            po_item_row['antivibration_pads'] = accessories_specification
        elif item_master.item_group == 'Enclosure':
            po_item_row['enclosure'] = accessories_specification
        elif item_master.item_group == 'Ball Points':
            po_item_row['ballpoint'] = accessories_specification
        elif item_master.item_group == 'CUPAL':
            po_item_row['cupal'] = accessories_specification
            
        # >>ISS-2024-00012
        # In general, it should display a single control unit for the specific sales order; however, it currently displays two control units. 
        # After the changes, it should correctly reflect the two control units for the specific sales order.
        elif item_master.item_group == 'Control Unit':
            #po_item_row['control_unit'] = accessories_specification
            #po_item_row['control_unit'] = (po_item_row['control_unit'] + ', ' if po_item_row['control_unit'] != ' ' else '')  + item.item_code
            if po_item_row['control_unit'] != ' ':
            # Append a comma before adding the new accessories_specification
                po_item_row['control_unit'] = po_item_row['control_unit'] + ', '
            # Append the current accessories_specification to 'control_unit'
            po_item_row['control_unit'] = po_item_row['control_unit'] + accessories_specification
            
            
        # >>ISS-2024-00012
        # In general, it should display a single control unit for the specific sales order; however, it currently displays two control units. 
        # After the changes, it should correctly reflect the two control units for the specific sales order.
        

        #<< ISS-2024-00012    
        # For service item like tests concatenate services into single line     
        elif item_master.item_group == 'Services':
            # test_lab is defaulted to ' '. So for first time concatenate '' with item code
            po_item_row['test_lab'] = (po_item_row['test_lab'] + ', ' if po_item_row['test_lab'] != ' ' else '')  + item.item_code
            
            # This step is required for Tests alone. Tests will generally have one quantity or less than the 
            # main transformer
            po_item_row['test_lab_qty'] = item.qty
            
        elif item_master.item_group == 'Others 2':
            # others2 is defaulted to ' '. So for first time concatenate '' with item code
            po_item_row['others2'] = (po_item_row['others2'] + ', ' if po_item_row['others2'] != ' ' else '')  + item.item_code
            
            # This step is required for Tests alone. Tests will generally have one quantity or less than the 
            # main transformer
            po_item_row['others2_qty'] = item.qty
            
        elif item_master.item_group == 'Others':
            if (item.item_code.startswith("Fan")):
                po_item_row['fans'] = "Yes" 
                        
            elif (item.item_code.startswith("Forklift")):
                po_item_row['forklift'] = "Yes"
            
            elif (item.item_code.startswith("Earthing switch")):
                po_item_row['earthing_switch'] = accessories_specification
                
            elif (item.item_code.startswith("Surge arrester")):
                po_item_row['surge_arrester'] = accessories_specification
            elif (item.item_code.startswith("Extended")):
                po_item_row['busbars'] = accessories_specification
            
        return po_item_row
        
#   Add delivery schedules      
    def add_delivery_schedule(sales_order, pos, item_row, ifilters):
        schedule_table = []

        # Pick only submitted documents
        delivery_documents = frappe.get_all(
            'Delivery Note Item', 
            fields=('pos', 'item_code', 'parent'), 
            filters= {"against_sales_order": sales_order, 'pos': pos, 'docstatus': 1,} 
            )
        filters = {}

        for delivery_item in delivery_documents:
            filters={"parent": delivery_item.parent, 'pos': delivery_item.pos}
        
            schedule_lines = frappe.get_all(
                'Delivery Schedule', 
                fields=('pos', 'serial_number', 'delivery_date', 'status', 'oa_confirmed_date', 'production_end_date',
                'planned_production_end_date',
                'invoice_number', 'invoice_date', 'storage_fee', 'gta_serial_number', 'on_time_delivery', 
                'comments'), # <<TASK-2024-00221
                filters=filters
                
            )
            
            for index,  schedule_line in enumerate(schedule_lines):
                schedule_line_row = {}
                # Initialize the work area
                schedule_line_row = dict(item_row)
                # Fill order value
                try:
                    schedule_line_row['order_value'] = item_row['order_values'][index]
                except IndexError:
                    schedule_line_row['order_value'] = 0
                #log(schedule_line)
                schedule_line_row['delivery_note'] = delivery_item.parent
                schedule_line_row['serial_number'] = schedule_line.serial_number
                schedule_line_row['delivery_date'] = schedule_line.delivery_date
                schedule_line_row['transformer_status'] = schedule_line.status
                schedule_line_row['oa_confirmed_date'] = schedule_line.oa_confirmed_date
                schedule_line_row['planned_production_end_date'] = schedule_line.planned_production_end_date
                schedule_line_row['production_end_date'] = schedule_line.production_end_date
                schedule_line_row['invoice_number'] = schedule_line.invoice_number
                schedule_line_row['invoice_date'] = schedule_line.invoice_date
                schedule_line_row['comments'] = schedule_line.comments  #<< TASK-2024-00221
                #schedule_line_row['storage_fee'] = schedule_line.storage_fee
                schedule_line_row['storage_fee'] = '' if schedule_line.storage_fee == "NO" else (schedule_line.storage_fee)
                # Check if planned_production_end_date is not None before accessing its attributes
                if schedule_line.planned_production_end_date:
                    planned_week = schedule_line.planned_production_end_date.isocalendar()[1]
                    schedule_line_row['planned_week'] = planned_week
                else:
                    # Handle the case when planned_production_end_date is None
                    schedule_line_row['planned_week'] = None

                schedule_line_row['gta_serial_number'] = schedule_line.gta_serial_number
                schedule_line_row['on_time_delivery'] = schedule_line.on_time_delivery
                
                # Tests are generally performed for 1 transformer. The quantity is always lesser than parent
                # The qty of tests are captured in the map_accessories function
                # If the parent qty(schedule line count) is more than tests qty then do not include in the respective line
                if schedule_line_row['test_lab'] != ' ' and int(schedule_line_row['test_lab_qty']) < (index + 1): 
                    schedule_line_row['test_lab'] = ' ' 

                schedule_table.append(schedule_line_row)
       
        return schedule_table
    
    def clear_item_row_values(item_row):
        # Initialize Item fields
        item_row['pos'] = 0
        item_row['item_code'] = item_row['id_number'] = item_row['rdg_number'] = item_row['item_group'] = ''
        item_row['power'] = item_row['hv'] = item_row['lv'] = item_row['vector_group'] = item_row['uk'] = ''
        item_row['thdi'] = item_row['ip_protection'] = item_row['electrostatic_screen'] = item_row['hv1'] = item_row['hv2'] = ''
        item_row['tappings']= '+ - 2 * 2,5%'
        item_row['no_load_loss']= item_row['load_loss'] = item_row['li'] = ''
        #item_row['po_no']: sales_order_header.po_no, 'po_date': sales_order_header.po_date,
        item_row['serial_number'] = item_row['delivery_date'] = item_row['transformer_status'] = ''
        #item_row['company_guarantee': sales_order_header.company_guarantee,
        item_row['oa_confirmed_date'] = item_row['planned_production_end_date'] = item_row['planned_week'] = item_row['order_value'] = item_row['price_gts'] = item_row['storage_row'] = item_row['gta_serial_number'] = ''
        # Order value table 
        #'order_values': [],
        # Initialize Accessories status
        item_row['antivibration_pads'] = item_row['enclosure'] = item_row['ballpoint'] = item_row['cupal'] = item_row['busbars'] = " "
        item_row['fans'] = item_row['control_unit'] = item_row['forklift'] = item_row['surge_arrester'] = item_row['earthing_switch'] = " "
        item_row['sensors'] = ''
        item_row['silicon_free'] = item_row['test_lab'] = item_row['engineering_required'] = " "
        item_row['test_lab_qty'] = 0
        item_row['others2'] = item_row['others2_qty'] = " "
        return item_row
        
    def get_sales_team_text(sales_team):
        # Combine the list of Sales Persons in Sales Team by using Commas. Done on 18 Jul
        sales_team_text = ", ".join(sales_person.sales_person for sales_person in sales_team if sales_person.sales_person is not None)
        return sales_team_text
                                
# ***** begin of get_result execution ******* 

    table = []
#   Do not proceed if sales order filter is not set    
    if not filters.from_date:
        return
        
#   Get All Sales Order for the PO Date Range. The below call returns two params in array format
#   first one is the entire sales order details and second one is the unique sales order numbers
    sos = get_all_sales_orders(filters)
    
    # >> ISS-2024-00002
    
    # Sales Order details with Items
    sos_details = sos[0]
    
    # Unique Sales Orders
    sales_order_list = sos[1]
    
    # Get all customer details for the selected sales orders
    customer_list = get_customer_details(sos_details)
    
    # Get the attributes of all the items
    item_attributes_list = get_item_attributes(sos_details)
    
    # << ISS-2024-00002
    
    for sales_order in sales_order_list:
        # Filter the records for the current Sales Order number
        sales_order_items = [item for item in sos_details if item['name'] == sales_order]
        
        #sales_order_header = get_sales_order_header(sales_order.name)
        
        sales_order_header = sales_order_items[0]
        
        # Get the customer details like customer group and territory for sales order customer
        
        # >> ISS-2024-00002
        #customer_data = frappe.get_doc('Customer', sales_order_header.customer).as_dict() 
        
        # Get the corresponding customer details for the customer in the Sales Order
        customer_data = find_dict_with_keys(customer_list, 'name', sales_order_header.customer) 
 
        
        
        #sales_order_items = sales_order_header['items']
        #sales_team = sales_order_header['sales_team']
        #payment_schedule = sales_order_header['payment_schedule']
        payment_schedule = [sales_order_header]
        
        # Get the Sales Persons from sales team in sales order on 18 Jul
        #sales_team = sales_order_header['sales_team']
        sales_team = [sales_order_header]
        
        # << ISS-2024-00002
        
        #       Fill sales order header details        
        po_item_row =dict({ # Fill Detail from Sales Order header
                                'sales_order': sales_order_header.name, 'customer': sales_order_header.customer, 'incoterms': sales_order_header.incoterms,
                            
                                'customer_group': customer_data.customer_group, 'territory': sales_order_header.territory, 
                                'is_reservation': "Yes" if sales_order_header.is_reservation == 1 else " ",
                                'documentation_language': ((sales_order_header.documentation_language) if sales_order_header.documentation_language else ""
                                    ) + (", " + sales_order_header.second_language if sales_order_header.second_language else ""),



                                #Fill the Sales Persons name on 18 Jul 
                                'sales_team': get_sales_team_text(sales_team),
                                'agent': (sales_order_header.agent if sales_order_header.agent else sales_order_header.owner),
                                #'comments': sales_order_header.comments,  #<< Commented this line for moving note section from here to delivery schedule(#TASK-2024-00221)
                                'prepayment_invoice': sales_order_header.prepayment_invoice, 'prepayment_status': sales_order_header.prepayment_status,
                                'prepayment_invoice2': sales_order_header.prepayment_invoice2, 'prepayment2_status': sales_order_header.prepayment2_status,
                                # If invoice portion is 100% then prepayment is Rejected
                                'payment_condition': (
                                    'Rejected'    
                                    if payment_schedule[0].invoice_portion == 100 
                                    else (str(int(payment_schedule[0].invoice_portion)) + "%")
                                    ),
                                
                                # Initialize Item fields
                                'item_code': '','pos': 0,'id_number': '', 'rdg_number': '', "item_group": '', 
                                'power': '', 'hv': '', 'lv': '', 'vector_group': '', 'uk': '', 
                                'tappings': '+ - 2 * 2,5%', 'no_load_loss': '', 'load_loss': '', 'li': '',
                                'po_no': sales_order_header.po_no, 'po_date': sales_order_header.po_date,
                                'serial_number': '', 'delivery_date': '', 'transformer_status': '',
                                'company_guarantee': sales_order_header.company_guarantee,
                                'oa_confirmed_date': '', 'planned_production_end_date': '', 'planned_week': '', 'storage_fee': '', 'order_value':'', 'price_gts': '', 'gta_serial_number': '',
                                # Order value table 
                                'order_values': [],
                                # Initialize Accessories status
                                'antivibration_pads': " ", 'enclosure': " ", 'ballpoint': " ", 'cupal': " ", 'busbars': " ",
                                'fans': " ", 'control_unit': " ", 'sensors': '', 'forklift': " ",
                                'silicon_free': " ", 'test_lab': " ", 'test_lab_qty': 0, 'others2': " ", 'others2_qty': 0, 'engineering_required': " ", 'earthing_switch': " ", 'surge_arrester': " ", 
                                })

  
    #   Fill the Final Output
    #   Important step. Sort in reverse pos order to fill the details of accessories
        items_rev_sorted = sorted(sales_order_items, key=lambda x: x['pos'], reverse=1)
        delivery_items = []
        order_value = 0
        order_values = []
        for item in items_rev_sorted:
        
            
            # Order value of a transformer is computed per set of transformer including its accessories and services
            order_value = order_value + item.rate
            
            # Little complex logic converted to simple one
            # Transformer set price is computed as transformer base price + 1 set of all accessories and services
            # eg DTTHZ2N 2000/20/6/95 2 PC, Enclosure 2000/IP31/CM 2 PC and Temperature rise test 1 PC
            # then price of 1 set of transformer will be (DTTHZ2N 2000/20/6/95 1 PC + Enclosure 2000/IP31/CM 1 PC +
            # Temperature rise test 1 PC) and  (DTTHZ2N 2000/20/6/95 1 PC + Enclosure 2000/IP31/CM 1 PC)
            # as tempearature rise test is not considered for second transformer
            
            # Create an order value array for the quanity times the item
            # eg Enclosure 2000/IP31/CM 2 PC order value array will two items with unit price of the item
            # frappe.msgprint(str(item.qty))

            # The flow goes like this.
            # Order values will get cleard for evey Transformer item(items with mod 10s)
            # First Accessories per transformer will be totaled 
            # for POS 10 DTTHZ2N 2000/20/6/95 2 PC $300, POS 10.1 Enclosure 2000/IP31/CM 2 PC $150 
            # and POS 10.2 Temperature rise test 1 PC $100
            # Loop for the quantity times the item eg Temperature rise test 1 here 1 times. 
            # Output order_values = [100]
            # Next Loop 2 times for Enclosure 2000/IP31/CM
            # Output order_values = [250,150]
            # Next Loop 2 times for DTTHZ2N 2000/20/6/95
            # Output order_values = [550,450]
            # the output array will be formed like
            # [(100 + 150 + 300),(150+300)]
            
            for setid in range (0, int(item.qty)):
                if setid < len(order_values):
                    order_values[setid] = order_values[setid] + item.rate
                else:
                    order_values.append(item.rate)
                    
    #       Only get the Main items. Ignore accessories and services    
            if (item.pos % 10 == 0):
                
                # Build the basic price for individual transformer
                po_item_row['order_values']  =  order_values
                
                # Clear order values
                order_values = []
                
                po_item_row['pos'] = item.pos
                po_item_row['item_code'] = item.item_code
                
                # Introduce empty value if rdg_number is not present. Used during the sort
                # Otherwise sort will throw error
                po_item_row['rdg_number'] = (item.rdg_number if item.rdg_number else '')
                
                po_item_row['sap_reference'] = item.sap_reference
                po_item_row['id_number'] = item.id_number
                po_item_row['item_group'] = item.item_group
                po_item_row['price_gts'] = item.rate
                po_item_row['engineering_required'] = '' if item.engineering_required == "No" else str(item.engineering_required)
                #po_item_row['silicon_free'] = (item.silicon_free if item.silicon_free else '')
                po_item_row['silicon_free'] = '' if item.silicon_free == "No" else str(item.silicon_free)



                # Sensor name from transformer items table
                if item.sensor_name:
                    po_item_row['sensors'] = item.sensor_name
                
        #       Order value is the sum of 1 set of transformers with accessoaries
        #       Clear the order value for each Main item after filling it
                #po_item_row['order_value'] = order_value
                order_value = 0
        
        # >> ISS-2024-00002
        #       Get Item Attributes for the item and fill them                    
        #        item_attributes = frappe.get_doc('Item',  item.item_code).as_dict()['attributes']
                
        #       Map item attributes per item variant        
        #       po_item_row = map_item_attribute(item_attributes, po_item_row)
                
        #       Filter Fill the Item Attributes from the List of Item and its attributes
                po_item_row = map_item_attribute(item_attributes_list, po_item_row)
        # << ISS-2024-00002        
                
        #       Add delivery schedule 
                delivery_items.extend(add_delivery_schedule(sales_order_header.name, item.pos, po_item_row, filters))
                
        #       Initialize the Item fields
                po_item_row = clear_item_row_values(po_item_row)
            else:
                po_item_row = map_accessories(item, po_item_row)
                
    #   Sort the table back with pos and append it to output table
        table.extend(sorted(delivery_items, key=lambda x: x['pos'])) 
    #
    return table

# Begin of execute    
data = []
user_session_default = set_session_defaults(filters)
data_table = get_result(filters)
data_table = get_filtered_records_for_date_type(data_table, filters)
if filters.open == 1:
    data_table = filter_invoiced_records(data_table, filters)
## Uncomment after testing
##data_table = sort_output(data_table, user_session_default.sort_sequence)
columns = get_columns(filters)

## Uncoment after testing
## if there is   column preference set by the user then use the default settings
if user_session_default.report_columns:
   reordered_columns = reorder_columns_for_user_preference(columns, user_session_default)
else:
    reordered_columns = columns
#reordered_columns = columns    
data = reordered_columns, data_table
