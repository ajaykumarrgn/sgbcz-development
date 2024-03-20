# design = frappe.form_dict.design
# design = frappe.get_request_arg("design", default={})
design_id = frappe.form_dict.get('design')
design = frappe.get_doc('Design', design_id)
#frappe.response['message'] =  design_doc

def get_attribute(attribute, attribute_value):
     child_doc = frappe.new_doc("Item Variant Attribute")
     child_doc.variant_of = 'DTTHZ2N'
     child_doc.attribute = attribute
     child_doc.attribute_value = attribute_value
     return child_doc
     
def fill_item_basic_details(item):
    item.item_group = 'DTTHZ2N'
    item.include_item_in_manufacturing = 0
    item.variant_of =  'DTTHZ2N'
    item.stock_uom = 'PC'
    return item
# fill the item description from the the template DTTHZ2N    
def fill_item_description(item):
    template_item = frappe.get_doc('Item', 'DTTHZ2N')
    item.description = template_item.description
    return item
def remove_trailing_zeros(number_str):
    # Use rstrip() to remove trailing zeros after the decimal point
    # The '0' parameter specifies the characters to remove (in this case, trailing zeros)
    return number_str.rstrip('0').rstrip('.') if '.' in number_str else number_str

# Get the Item code from the list of attributes separated by /
def get_item_code_from_attributes(item):
    #Iterate over each attribte and join the attribute value with /
    # eg DTTHZ2N/2500/15/0/0/17,5/38/95/400/1,1/3/0/Dyn5/6/2/2,5/2790/19000/100/40/IP00/C2/E2/70/0/5/YES/NO/NO
    item_code  = 'DTTHZ2N'
    for attribute in item.attributes:
        item_code  = item_code + '/' + remove_trailing_zeros(str(attribute.attribute_value))
    #item_code = '/'.join(str([d.attribute_value for d in item.attributes]))
    return item_code
item_new = frappe.get_doc(doctype='Item', name=design.title)
item_new = fill_item_basic_details(item_new)

item_new = fill_item_description(item_new)

item_new.standard_rate = design.total_cost

#item_new.item_code = design.title

item_new.design = design.name

# Add Item Variant attributes
# Each of the Item variant attribute are parameters in the design
# Also fill the item technical name
# Rating Details
item_new.append("attributes", get_attribute('Power (kVA)', int(design.rating)))
item_new.item_technical_name = design.rating + ' [kVA]'

#HV Details
# Convert HV from V to KV before we add it to item attribute
# replace . with ,
# item_new.append("attributes", get_attribute('HV (kV)', int(design.hv_rated_voltage)/1000))
# # Remove trailing zeros after the decimal point
# hv_in_kv_str = str(int(design.hv_rated_voltage)/1000)
# #hv_in_kv_str = hv_in_kv_str.replace(/(\.\d*?)0+$/, '$1');
# hv_in_kv_str = hv_in_kv_str.replace('.', ',')


# hv_in_kv_str = str(int(design.hv_rated_voltage) / 1000)
# hv_in_kv_str = hv_in_kv_str.replace('.', ',')

hv_in_kv_str = str(int(design.hv_rated_voltage) / 1000)
if float(hv_in_kv_str) % 1 == 0:
    item_new.append("attributes", get_attribute('HV (kV)', hv_in_kv_str))
else:
    hv_in_kv_str = hv_in_kv_str.replace('.', ',')
    item_new.append("attributes", get_attribute('HV (kV)', hv_in_kv_str))
# # Add the attribute to item_new
#item_new.append("attributes", get_attribute('HV (kV)', hv_in_kv_str))


item_new.item_technical_name = item_new.item_technical_name + ',' + ' HV ' + remove_trailing_zeros(hv_in_kv_str) + ' [kV]';

#Added by Eswari on 13-11-2023
item_new.append("attributes", get_attribute('HV 1 (kV)', 0))

item_new.append("attributes", get_attribute('HV 2 (kV)', 0))
item_new.append("attributes", get_attribute('HV Um (kV)', str(design.highest_operation_voltage_hv)))
item_new.append("attributes", get_attribute('HV AC (kV)', int(design.ac_phase_hv)))
item_new.append("attributes", get_attribute('HV LI (kV)', int(design.li_phase_hv)))

#LV Details
item_new.append("attributes", get_attribute('LV (V)', design.lv_rated_voltage))

item_new.item_technical_name = item_new.item_technical_name + ',' + ' LV ' + str(design.lv_rated_voltage) + ' [V]';

item_new.append("attributes", get_attribute('LV Um (kV)', str(design.highest_operation_voltage_lv).replace('.',',')))
item_new.append("attributes", get_attribute('LV AC (kV)', int(design.ac_phase_lv)))
item_new.append("attributes", get_attribute('LV LI (kV)', int(design.li_phase_lv)))

item_new.append("attributes", get_attribute('Vector Group', ('DYN'+ design.vector_group)))

item_new.append("attributes", get_attribute('Uk (%)', design.impedance))
item_new.item_technical_name = item_new.item_technical_name + ',' + ' Uk ' + remove_trailing_zeros(str(design.impedance)) + ' [%]';

#Tapping Details
item_new.append("attributes", get_attribute('Tappings - number of tappings (+/-)', design.tapping_plus))
item_new.append("attributes", get_attribute('Tappings - values (%)', str(design.tapping_plus_step).replace('.',',')))


item_new.append("attributes", get_attribute('P0 (W)', design.no_load_loss_guarantee))
item_new.item_technical_name = item_new.item_technical_name + ',' + ' P(0) ' + str(design.no_load_loss_guarantee) + ' [W]';

item_new.append("attributes", get_attribute('Pk (W)', design.load_loss_guarantee))
item_new.item_technical_name = item_new.item_technical_name + ',' + ' P(k) ' + str(design.load_loss_guarantee) + ' [W]';

item_new.append("attributes", get_attribute('Temperature rise (K)', str(int(design.temperature_rise))))

item_new.append("attributes", get_attribute('Ambient max. temperature (°C)', str(int(design.ambient_max_temperature))))

item_new.append("attributes", get_attribute('Transformer IP', design.ip_protection))
 
item_new.append("attributes", get_attribute('Climatic class', design.climatic_class))

item_new.append("attributes", get_attribute('Environmental class', design.environmental_class))


# Check if LWA is entered, then LPA is set to set and vice versa
if  design.lwa is not None:
    item_new.append("attributes", get_attribute('LWA (dB)', design.lwa))
    item_new.append("attributes", get_attribute('Lpa (dB)', 0))

else:
    item_new.append("attributes", get_attribute('Lpa (dB)', design.lpa))
    item_new.append("attributes", get_attribute('LWA (dB)', 0))
    
# Depending on the k4_factor, set the 'THDi (%)' attribute with either 20% or 5%.
if design.k4_factor == 'Yes':
    item_new.append("attributes", get_attribute('THDi (%)', 20))
else:
    item_new.append("attributes", get_attribute('THDi (%)', 5))

#Add paralle coil information
#Consider 2nd record of TGtWickelzettelSystem
#if TGtSpule is an array and if the count is 2 then it is a parallel design.
json_data = json.loads(design.gitra_json_downstream)
TGtSpule = json_data['sgb']['TGtWickelzettel']['TGtWickelzettelSystemeListe']['TGtWickelzettelSystem'][1]['TGtWicklungenListe']['TGtWicklung']['TGtSpulenListe']['TGtSpule']
if len(TGtSpule) == 2:
    #item_new.append("attributes", get_attribute('Parallel coil', 'P'))
    item_new.append("attributes", get_attribute('Parallel coil', 'YES'))
else:
    item_new.append("attributes", get_attribute('Parallel coil', 'NO'))

# Electrostatic Screen is always set to No for Design items
item_new.append("attributes", get_attribute('Electrostatic screen', 'NO'))

# If there is a value entered in specifics the make the item parameter as Yes
if design.specifics:
    item_new.append("attributes", get_attribute('Special parameters', 'YES'))
else:
    item_new.append("attributes", get_attribute('Special parameters', 'NO'))

# Get Item code in the below format
# DTTHZ2N/2500/15/0/0/17,5/38/95/400/1,1/3/0/Dyn5/6/2/2,5/2790/19000/100/40/IP00/C2/E2/70/0/5/YES/NO/NO
item_new.item_code = get_item_code_from_attributes(item_new)
item_new.item_name = design.title

item_new.insert()
frappe.response['message'] =  item_new
