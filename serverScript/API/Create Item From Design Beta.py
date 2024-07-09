# Generate the PDF only for the Design Item

# design = frappe.form_dict.design
# design = frappe.get_request_arg("design", default={})
ld_design_id = frappe.form_dict.get('design')
ld_design = frappe.get_doc('Design', ld_design_id)
#frappe.response['message'] =  design_doc

def fn_get_attribute(i_attribute, i_attribute_value):
     ld_child_doc = frappe.new_doc("Item Variant Attribute")
     ld_child_doc.variant_of = 'DTTHZ2N'
     ld_child_doc.attribute = i_attribute
     ld_child_doc.attribute_value = i_attribute_value
     return ld_child_doc
     
def fn_fill_item_basic_details(i_item):
    i_item.item_group = 'DTTHZ2N'
    i_item.include_item_in_manufacturing = 0
    i_item.variant_of =  'DTTHZ2N'
    i_item.stock_uom = 'PC'
    return i_item
# fill the item description from the the template DTTHZ2N    
def fn_fill_item_description(i_item):
    ld_template_item = frappe.get_doc('Item', 'DTTHZ2N')
    i_item.description = ld_template_item.description
    return i_item
def fn_remove_trailing_zeros(i_number_str):
    # Use rstrip() to remove trailing zeros after the decimal point
    # The '0' parameter specifies the characters to remove (in this case, trailing zeros)
    return i_number_str.rstrip('0').rstrip('.') if '.' in i_number_str else i_number_str

# Get the Item code from the list of attributes separated by /
def fn_get_item_code_from_attributes(i_item):
    #Iterate over each attribte and join the attribute value with /
    # eg DTTHZ2N/2500/15/0/0/17,5/38/95/400/1,1/3/0/Dyn5/6/2/2,5/2790/19000/100/40/IP00/C2/E2/70/0/5/YES/NO/NO
    l_item_code  = 'DTTHZ2N'
    for i_attribute in i_item.attributes:
        l_item_code  = l_item_code + '/' + fn_remove_trailing_zeros(str(i_attribute.attribute_value))
    #item_code = '/'.join(str([d.attribute_value for d in item.attributes]))
    return l_item_code
ld_item_new = frappe.get_doc(doctype='Item', name=ld_design.title)
ld_item_new = fn_fill_item_basic_details(ld_item_new)

ld_item_new = fn_fill_item_description(ld_item_new)

ld_item_new.standard_rate = ld_design.total_cost

#item_new.item_code = design.title

ld_item_new.design = ld_design.name

# Add Item Variant attributes
# Each of the Item variant attribute are parameters in the ld_design
# Also fill the item technical name
# Rating Details
ld_item_new.append("attributes", fn_get_attribute('Power (kVA)', int(ld_design.rating)))
ld_item_new.item_technical_name = ld_design.rating + ' [kVA]'

#HV Details
# Convert HV from V to KV before we add it to item attribute
# replace . with ,
# item_new.append("attributes", fn_get_attribute('HV (kV)', int(ld_design.hv_rated_voltage)/1000))
# # Remove trailing zeros after the decimal point
# hv_in_kv_str = str(int(ld_design.hv_rated_voltage)/1000)
# #hv_in_kv_str = hv_in_kv_str.replace(/(\.\d*?)0+$/, '$1');
# hv_in_kv_str = hv_in_kv_str.replace('.', ',')


# hv_in_kv_str = str(int(ld_design.hv_rated_voltage) / 1000)
# hv_in_kv_str = hv_in_kv_str.replace('.', ',')

hv_in_kv_str = str(int(ld_design.hv_rated_voltage) / 1000)
if float(hv_in_kv_str) % 1 == 0:
    ld_item_new.append("attributes", fn_get_attribute('HV (kV)', hv_in_kv_str))
else:
    hv_in_kv_str = hv_in_kv_str.replace('.', ',')
    ld_item_new.append("attributes", fn_get_attribute('HV (kV)', hv_in_kv_str))
# # Add the attribute to item_new
#item_new.append("attributes", fn_get_attribute('HV (kV)', hv_in_kv_str))


ld_item_new.item_technical_name = ld_item_new.item_technical_name + ',' + ' HV ' + fn_remove_trailing_zeros(hv_in_kv_str) + ' [kV]';

#Added by Eswari on 13-11-2023
ld_item_new.append("attributes", fn_get_attribute('HV 1 (kV)', 0))

ld_item_new.append("attributes", fn_get_attribute('HV 2 (kV)', 0))
ld_item_new.append("attributes", fn_get_attribute('HV Um (kV)', str(ld_design.highest_operation_voltage_hv)))
ld_item_new.append("attributes", fn_get_attribute('HV AC (kV)', int(ld_design.ac_phase_hv)))
ld_item_new.append("attributes", fn_get_attribute('HV LI (kV)', int(ld_design.li_phase_hv)))

#LV Details
ld_item_new.append("attributes", fn_get_attribute('LV (V)', ld_design.lv_rated_voltage))

ld_item_new.item_technical_name = ld_item_new.item_technical_name + ',' + ' LV ' + str(ld_design.lv_rated_voltage) + ' [V]';

ld_item_new.append("attributes", fn_get_attribute('LV Um (kV)', str(ld_design.highest_operation_voltage_lv).replace('.',',')))
ld_item_new.append("attributes", fn_get_attribute('LV AC (kV)', int(ld_design.ac_phase_lv)))
ld_item_new.append("attributes", fn_get_attribute('LV LI (kV)', int(ld_design.li_phase_lv)))

ld_item_new.append("attributes", fn_get_attribute('Vector Group', ('DYN'+ ld_design.vector_group)))

ld_item_new.append("attributes", fn_get_attribute('Uk (%)', ld_design.impedance))
ld_item_new.item_technical_name = ld_item_new.item_technical_name + ',' + ' Uk ' + fn_remove_trailing_zeros(str(ld_design.impedance)) + ' [%]';

#Tapping Details
ld_item_new.append("attributes", fn_get_attribute('Tappings - number of tappings (+/-)', ld_design.tapping_plus))
ld_item_new.append("attributes", fn_get_attribute('Tappings - values (%)', str(ld_design.tapping_plus_step).replace('.',',')))


ld_item_new.append("attributes", fn_get_attribute('P0 (W)', ld_design.no_load_loss_guarantee))
ld_item_new.item_technical_name = ld_item_new.item_technical_name + ',' + ' P(0) ' + str(ld_design.no_load_loss_guarantee) + ' [W]';

ld_item_new.append("attributes", fn_get_attribute('Pk (W)', ld_design.load_loss_guarantee))
ld_item_new.item_technical_name = ld_item_new.item_technical_name + ',' + ' P(k) ' + str(ld_design.load_loss_guarantee) + ' [W]';

ld_item_new.append("attributes", fn_get_attribute('Temperature rise (K)', str(int(ld_design.temperature_rise))))

ld_item_new.append("attributes", fn_get_attribute('Ambient max. temperature (°C)', str(int(ld_design.ambient_max_temperature))))

ld_item_new.append("attributes", fn_get_attribute('Transformer IP', ld_design.ip_protection))
 
ld_item_new.append("attributes", fn_get_attribute('Climatic class', ld_design.climatic_class))

ld_item_new.append("attributes", fn_get_attribute('Environmental class', ld_design.environmental_class))


# Check if LWA is entered, then LPA is set to set and vice versa
if  ld_design.lwa is not None:
    ld_item_new.append("attributes", fn_get_attribute('LWA (dB)', ld_design.lwa))
    ld_item_new.append("attributes", fn_get_attribute('Lpa (dB)', 0))

else:
    ld_item_new.append("attributes", fn_get_attribute('Lpa (dB)', ld_design.lpa))
    ld_item_new.append("attributes", fn_get_attribute('LWA (dB)', 0))
    
# Depending on the k4_factor, set the 'THDi (%)' attribute with either 20% or 5%.
# Commented this block we are using the THDi directly in the ld_design 
# if ld_design.k4_factor == 'Yes':
#     item_new.append("attributes", fn_get_attribute('THDi (%)', 20))
# else:
#     item_new.append("attributes", fn_get_attribute('THDi (%)', 5))
    ld_item_new.append("attributes", fn_get_attribute('THDi (%)', ld_design.thdi))
#Add paralle coil information
#Consider 2nd record of TGtWickelzettelSystem
#if TGtSpule is an array and if the count is 2 then it is a parallel ld_design.

if ld_design.is_design:
    json_data = json.loads(ld_design.gitra_json_downstream)
    TGtSpule = json_data['sgb']['TGtWickelzettel']['TGtWickelzettelSystemeListe']['TGtWickelzettelSystem'][1]['TGtWicklungenListe']['TGtWicklung']['TGtSpulenListe']['TGtSpule']
    if len(TGtSpule) == 2:
        #item_new.append("attributes", fn_get_attribute('Parallel coil', 'P'))
        ld_item_new.append("attributes", fn_get_attribute('Parallel coil', 'YES'))
    else:
        ld_item_new.append("attributes", fn_get_attribute('Parallel coil', 'NO'))




# Electrostatic Screen is always set to No for ld_design items
ld_item_new.append("attributes", fn_get_attribute('Electrostatic screen', 'NO'))

# If there is a value entered in specifics the make the item parameter as Yes
if ld_design.specifics:
    ld_item_new.append("attributes", fn_get_attribute('Special parameters', 'YES'))
else:
    ld_item_new.append("attributes", fn_get_attribute('Special parameters', 'NO'))

# Get Item code in the below format
# DTTHZ2N/2500/15/0/0/17,5/38/95/400/1,1/3/0/Dyn5/6/2/2,5/2790/19000/100/40/IP00/C2/E2/70/0/5/YES/NO/NO
ld_item_new.item_code = fn_get_item_code_from_attributes(ld_item_new)
ld_item_new.item_name = ld_design.title

ld_item_new.insert()
frappe.response['message'] =  ld_item_new
