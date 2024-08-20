'''
# Find the the array with
# Returns the first record matching the condition
# similar to array.find of javascript or READ TABLE of ABAP
'''
def find_dict_with_keys(doc, dict_array):
    predicate = lambda x: int(x.get('rating')) >= int(doc.get('rating')) and int(x.get('hv', 0)) >= int(doc.get('hv_rated_voltage'))
    for d in dict_array:
        if predicate(d):
            return d
    return None


if not doc.labour and doc.direct_material_cost:
    # Get the Gitra Settings
    gitra_settings = frappe.get_doc("Gitra Settings", "Gitra Settings")

    # Read the production hours record from Gitra Setting labour hours child TABLE
    # identify the record higher then than the Design rating and Design hv_rated_voltage
    # for ex if Design rating is 900KVA and HV is 10000v
    # then the record identified will be Rating(1000) and HV Up to(24000)
    design_production_hours = find_dict_with_keys(doc, gitra_settings.labour_hours)

    # Compute the labour cost as design production hours * labour rate set in Gitra setting
    doc.labour =  design_production_hours.hours * gitra_settings.labour_rate
    doc.production_overhead =  design_production_hours.hours * gitra_settings.production_rate
    doc.cost_of_goods = doc.direct_material_cost + doc.labour + doc.production_overhead

    # Compute sales overhead and administrative overhead.
    # These will be computed as percent(from Gitra Settings) of cost of goods obtained above
    doc.sales_overhead = doc.cost_of_goods * gitra_settings.sales_overhead/100
    doc.administrative_overhead = doc.cost_of_goods * gitra_settings.administrative_overhead/100

    # Compute total cost
    # = cost of goods + sales overhead and administrative overhead
    #doc.total_cost = round((doc.cost_of_goods + \
        #doc.sales_overhead + doc.administrative_overhead)/10)*10
    doc.total_cost = doc.cost_of_goods + doc.sales_overhead + doc.administrative_overhead
