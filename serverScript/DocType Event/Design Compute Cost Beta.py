'''
# Find the the array with
# Returns the first record matching the condition
# similar to array.find of javascript or READ TABLE of ABAP
# In earlier, HV Rated VOltage only used for Gitra Calculation
# But use either HV rated Voltage or HV1
'''
def fn_find_dict_with_keys(doc, i_dict_array):
    # Include this line for Gitra calculation using hv_rated_voltage or hv1 if available
    # Handle the case where hv_rated_voltage might not be present
    l_hv_field='hv_rated_voltage'
    if not doc.hv_rated_voltage:
        l_hv_field = 'hv1'

    # lHv = doc.get('hv_rated_voltage') or doc.get('hv1')

    #predicate = lambda x: int(x.get('rating')) >= \
        #int(doc.get('rating')) and int(x.get('hv', 0)) >= \
        #int(doc.get('hv_rated_voltage'))
    l_predicate = lambda x: int(x.get('rating', 0)) >= int(doc.get('rating', 0)) and int(x.get('hv', 0)) >= int(doc.get(l_hv_field))
    for i_d in i_dict_array:
        if l_predicate(i_d):
            return i_d
    return None


if not doc.labour and doc.direct_material_cost:
    # Get the Gitra Settings
    ld_gitra_settings = frappe.get_doc("Gitra Settings", "Gitra Settings")

    # Read the production hours record from Gitra Setting labour hours child TABLE
    # identify the record higher then than the Design rating and Design hv_rated_voltage
    # for ex if Design rating is 900KVA and HV is 10000v
    # then the record identified will be Rating(1000) and HV Up to(24000)
    ld_design_production_hours = fn_find_dict_with_keys(doc, ld_gitra_settings.labour_hours)

    # Compute the labour cost as design production hours * labour rate set in Gitra setting
    doc.labour =  ld_design_production_hours.hours * ld_gitra_settings.labour_rate
    doc.production_overhead =  ld_design_production_hours.hours * ld_gitra_settings.production_rate
    doc.cost_of_goods = doc.direct_material_cost + doc.labour + doc.production_overhead

    # Compute sales overhead and administrative overhead.
    # These will be computed as percent(from Gitra Settings) of cost of goods obtained above
    doc.sales_overhead = doc.cost_of_goods * ld_gitra_settings.sales_overhead/100
    doc.administrative_overhead = doc.cost_of_goods * ld_gitra_settings.administrative_overhead/100

    # Compute total cost
    # = cost of goods + sales overhead and administrative overhead
    #doc.total_cost = round((doc.cost_of_goods + \
    #   doc.sales_overhead + doc.administrative_overhead)/10)*10
    doc.total_cost = doc.cost_of_goods + doc.sales_overhead + doc.administrative_overhead
