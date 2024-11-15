# Change References
# Labour Cost value is not calculated in the Total cost (#ISS-2024-00057)
## finding a record from the dictionary array
## it_dict_array is a dictionary array
## i_key the key to searched for
## i_value the value to searched for
def find_row_by_key_value(it_dict_array, i_key, i_value):
    for it_row in it_dict_array:
        if it_row.get(i_key) == i_value:
            return it_row
    return None

# Find the the array with
# Returns the first record matching the condition
# similar to array.find of javascript or READ TABLE of ABAP
def find_dict_with_keys(dict_row, it_dict_array):
    ld_predicate = lambda x: int(x.get('rating')) >= int(dict_row.get('rating')) and int(x.get('hv',0)) >= int(dict_row.get('hv_rated_voltage'))
    for it_d in it_dict_array:
        if ld_predicate(it_d):
            return it_d
    return None

   
# Begin of Change EBITDA Report (>> #TASK-2024-00157)
if doc.material_cost: 
     
    # Get the Gitra Settings
    ld_gitra_settings = frappe.get_doc("Gitra Settings", "Gitra Settings")
    # Get the Parent Item Group to validate if it is Transformer or Accessory
    l_parent_item_group = frappe.db.get_value("Item Group", doc.item_group, ["parent_item_group"])
    
    labour = 0
    production_overhead = 0
    # This block is only of Transformer Items
    #>>commented this line for the issue #ISS-2024-00057 
    # Because it does not include labor costs in the total cost calculation in the Item Doctype 
    #if doc.variant_of and l_parent_item_group == "DTTHZ2N"
    
    if (doc.variant_of and l_parent_item_group == "DTTHZ2N") or (doc.variant_of and doc.item_group == "DTTHZ2N"):
    #<<ISS-2024-00057   
        rating_row = find_row_by_key_value(doc.attributes, 'attribute', 'Power (kVA)')
        hv_row = find_row_by_key_value(doc.attributes, 'attribute', 'HV (kV)')
        attributes = {
            #'rating': rating_row.attribute_value,
            #'hv_rated_voltage': hv_row.attribute_value,
            'rating': rating_row.attribute_value, 
            'hv_rated_voltage': int(float(hv_row.attribute_value.replace(',', '.')) * 1000),
        }
        
        # Read the production hours record from Gitra Setting labour hours child TABLE
        # identify the record higher then than the Design rating and Design hv_rated_voltage
        # for ex if Design rating is 900KVA and HV is 10000v 
        # then the record identified will be Rating(1000) and HV Up to(24000)
        design_production_hours = find_dict_with_keys(attributes, ld_gitra_settings.labour_hours)
        # design_production_hours = {}
        # design_production_hours['hours'] = 44
        
        # Compute the labour cost as design production hours * labour rate set in Gitra setting
        labour =  design_production_hours.hours * ld_gitra_settings.labour_rate
        production_overhead =  design_production_hours.hours * ld_gitra_settings.production_rate
        
    # Note: Labour and Production Overhead will be zero for Accessories 
    cost_of_goods = doc.material_cost + labour + production_overhead
    
    # Compute sales overhead and administrative overhead.
    # These will be computed as percent(from Gitra Settings) of cost of goods obtained above
    sales_overhead = cost_of_goods * ld_gitra_settings.sales_overhead/100
    administrative_overhead = cost_of_goods * ld_gitra_settings.administrative_overhead/100
    
    # Compute total cost
    # = cost of goods + sales overhead and administrative overhead
    # and round to nearest ten
    doc.total_cost = cost_of_goods + sales_overhead + administrative_overhead