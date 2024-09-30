def get_attribute(i_variant_of, attribute, attribute_value):
    child_doc = frappe.new_doc("Item Variant Attribute")
    child_doc.variant_of = i_variant_of
    child_doc.attribute = attribute
    child_doc.attribute_value = attribute_value
    return child_doc

# Fill basic details of the item
def fill_item_basic_details(item, item_group, variant_of):
    item.item_group = item_group
    item.include_item_in_manufacturing = 0
    item.variant_of = variant_of
    item.stock_uom = 'PC'
    return item

# Fill item description from template item
def fill_item_description(item, template_item_code):
    template_item = frappe.get_doc('Item', template_item_code)
    item.description = template_item.description
    return item

def fn_update_or_append_item_code_format(attribute, attribute_value):
    l_b_found = False

    # Iterate directly over the list and update if a match is found
    for item in l_a_item_code_format:
        if item['attribute'] == attribute:
            if attribute_value == 0:
                # Update the attribute_value if attribute_value is 0
                item['attribute_value'] = attribute_value
            l_b_found = True
            break

    # If no match was found, append the new attribute and value
    if not l_b_found:
        l_a_item_code_format.append({'attribute': attribute, 'attribute_value': attribute_value})

 # Remove trailing zeros from a number string
def fn_remove_trailing_zeros(number_str):
    return number_str.rstrip('0').rstrip('.') if '.' in number_str else number_str

# Generate item code from its attributes
def fn_get_item_code_from_attributes(i_d_item):
    item_code = i_d_item.variant_of
  # Create a lookup dictionary for item_code_format to access attribute_value by attribute
    ld_item_code_format_dict = {a['attribute']: a['attribute_value'] for a in l_a_item_code_format}
    
    for attribute in i_d_item.attributes:
        # Check if the current attribute is present in ld_item_code_format_dict
        if attribute.attribute in ld_item_code_format_dict:
            # Use the attribute_value from item_code_format
            item_code = item_code + '/' + fn_remove_trailing_zeros(str(ld_item_code_format_dict[attribute.attribute]))
        else:
            # Use the attribute's own attribute_value if not found in item_code_format
            item_code = item_code + '/' + fn_remove_trailing_zeros(str(attribute.attribute_value))
    return item_code

 # Define the parameter mapping definitions
def fn_get_parameter_mapping_def():
    def lfn_add_param_map(i_attribute, i_designdoc_field, la_param_map_def):
        ld_param_map = {'attribute': i_attribute, 'designdoc_field': i_designdoc_field}
        la_param_map_def.append(ld_param_map)
        return la_param_map_def

    # Add mappings
    la_param_map_def = []
    la_param_map_def = lfn_add_param_map('Power (kVA)', 'rating', la_param_map_def)
    la_param_map_def = lfn_add_param_map('HV (kV)', 'hv_rated_voltage', la_param_map_def)
    la_param_map_def = lfn_add_param_map('HV 1 (kV)', 'hv1', la_param_map_def)
    la_param_map_def = lfn_add_param_map('HV 2 (kV)', 'hv2', la_param_map_def)
    la_param_map_def = lfn_add_param_map('HV AC (kV)', 'ac_phase_hv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('LV (V)', 'lv_rated_voltage', la_param_map_def)
    la_param_map_def = lfn_add_param_map('LV 1 (V)', 'lv1', la_param_map_def)
    la_param_map_def = lfn_add_param_map('LV 2 (V)', 'lv_2', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Climatic class', 'climatic_class', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Environmental class', 'environmental_class', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Lpa (dB)', 'lpa', la_param_map_def)
    la_param_map_def = lfn_add_param_map('LWA (dB)', 'lwa', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Vector Group', 'vector_group', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Vector Group LV 1', 'vector_group_lv1', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Vector Group LV 2', 'vector_group_lv2', la_param_map_def)
    la_param_map_def = lfn_add_param_map('HV LI (kV)', 'li_phase_hv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Rating LV1 (kVA)', 'power_lv1', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Rating LV2 (kVA)', 'power_lv2', la_param_map_def)
    la_param_map_def = lfn_add_param_map('HV Um (kV)', 'highest_operation_voltage_hv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Insulation Class', 'insulation_class', la_param_map_def)
    la_param_map_def = lfn_add_param_map('LV AC (kV)', 'ac_phase_lv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('LV LI (kV)', 'li_phase_lv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('LV Um (kV)', 'highest_operation_voltage_lv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('P0 (W)', 'no_load_loss_guarantee', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Pk (W)', 'load_loss_guarantee', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Special parameters', 'specifics', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Tappings - number of tappings (+/-)', 'tapping_plus', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Tappings - number of tappings (+/-)', 'tapping_minus', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Tappings - values (%)', 'tapping_minus_step', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Tappings - values (%)', 'tapping_plus_step', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Temperature rise (K)', 'temperature_rise', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Ambient max. temperature (°C)', 'ambient_max_temperature', la_param_map_def)
    la_param_map_def = lfn_add_param_map('THDi (%)', 'thdi', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Winding Material', 'winding_material', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Transformer IP', 'ip_protection', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Type of LV', 'type_lv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Uk (%)', 'impedance', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Uk LV 1 (%)', 'uk_lv1', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Uk LV 2 (%)', 'uk_lv2', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Electrostatic screen', 'electrostatic_screen', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Parallel coil', 'parallel_coil', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Cooling', 'cooling_method', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Type of Cooling Medium', 'type_cooling', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Bushings HV', 'bushing_hv', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Temperature Rise Winding (K)', 'temperature_rise_winding', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Temperature rise Oil (k)', 'temperature_rise_oil', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Uk HV LV 1 (%)', 'ukhv_lv1', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Uk HV LV 2 (%)', 'ukhv_lv2', la_param_map_def)

    return la_param_map_def

# Get design document field for a given attribute
def fn_get_design_doc_field(i_attribute, la_parameter_map_def):
    for ld_param in la_parameter_map_def:
        if ld_param['attribute'] == i_attribute:
            return ld_param['designdoc_field']

# Append attribute to the item
def append_attribute(attribute_name, attribute_value):
    if attribute_name not in existing_attributes:
        if isinstance(attribute_value, (int, float)):
            item_new.append("attributes", get_attribute(design.transformer_type, attribute_name, attribute_value))
        else:
            item_new.append("attributes", get_attribute(design.transformer_type, attribute_name, str(attribute_value)))
        existing_attributes.add(attribute_name)

#function to convert volt ti kV
def fn_convert_to_kv(i_value):
    # Convert value to integer and divide by 1000
    l_result = int(i_value) / 1000
    # Check if result is a whole number
    if l_result.is_integer():
        # Return as integer string if whole number
        return str(int(l_result))
    else:
        # Return as string with decimal part if not a whole number
        return str(l_result)

# Fetch the design details from the request
l_design_id = frappe.form_dict.get('design')
ld_design = frappe.get_doc('Design', l_design_id)  # Define design here

la_parameter_map_def = fn_get_parameter_mapping_def()

# Determine item group and variant based on transformer type
if ld_design.factory == 'SGBCZ':
    item_group = 'DTTHZ2N'
    variant_of = 'DTTHZ2N'
elif ld_design.factory == 'RGB':
    item_group = 'RGB'
    variant_of = ld_design.transformer_type
elif ld_design.factory == 'NEU':
    item_group = 'NEU'
    variant_of = ld_design.transformer_type
else:
    frappe.response['message'] = 'Unsupported transformer type.'
    # frappe.throw('Unsupported transformer type.')

# Create a new item document
item_new = frappe.new_doc('Item')
item_new.item_name = ld_design.title
item_new = fill_item_basic_details(item_new, item_group, variant_of)
item_new = fill_item_description(item_new, variant_of)
item_new.standard_rate = ld_design.total_cost
item_new.design = ld_design.name

#initialize an empty array
l_a_item_code_format = []

# Initialize a flag to check if either 'lwa' or 'lpa' has been set
lwa_set = False
lpa_set = False

# Append attributes while avoiding duplicates
existing_attributes = set()

la_template_attributes = frappe.get_doc('Item', ld_design.transformer_type).attributes
if not la_template_attributes:
    frappe.msgprint("Template attributes not found")

for ld_attribute in la_template_attributes:
    # Retrieve the design document field corresponding to the attribute
    ld_designdoc_field = fn_get_design_doc_field(ld_attribute.attribute, la_parameter_map_def)

    # Retrieve the 'numeric_values' attribute from the database
    ld_doc_attr = frappe.db.get_value('Item Attribute', ld_attribute.attribute, ['numeric_values'])

    # Initialize ld_docvalue to 0
    ld_docvalue = 0

    ld_docAbb = 0

    # Get the value from the design document
    ld_docvalue_temp = ld_design.get(ld_designdoc_field)

    # If the attribute has numeric values
    if ld_doc_attr:
        # If the corresponding document field has a value captured
        if ld_docvalue_temp:
            # If the document field is not of type float or int
            # (i.e., a non-numeric value or char or string type)
            if not (isinstance(ld_docvalue_temp, float) or isinstance(ld_docvalue_temp, int)):
                # Convert the char or string value to float
                ld_docvalue_temp = float(ld_docvalue_temp)
            # If the document field value is a whole number then
            # make the type as int to trim the .00s
            if ld_docvalue_temp % 1 == 0:
                ld_docvalue_temp = int(ld_docvalue_temp)
            ld_docvalue = ld_docvalue_temp
    else:
        #get the abbreviation for the attribute value
        ld_doc_abbr = frappe.db.get_value(
                'Item Attribute Value',
                {'parent': ld_attribute.attribute, 'attribute_value':ld_docvalue_temp },  
                'abbr'
            )
        if ld_doc_abbr:
            l_a_item_code_format.append({'attribute': ld_attribute.attribute, 'attribute_value': ld_doc_abbr})
        ld_docvalue = ld_docvalue_temp
                
    # Conditionally append attributes
    if ld_attribute.attribute == 'Electrostatic screen':
        if ld_design.electrostatic_screen == 0:
            item_new.append("attributes", get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, 'NO'))
            fn_update_or_append_item_code_format(ld_attribute.attribute, 0)
           
        else:
            item_new.append("attributes", get_attribute(
                 ld_design.transformer_type, ld_attribute.attribute, 'YES'))
            fn_update_or_append_item_code_format(ld_attribute.attribute, 1)
           
    elif ld_attribute.attribute == 'Parallel coil':
        if ld_design.parallel_coil == 0:
            item_new.append("attributes", get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, 'NO'))
            fn_update_or_append_item_code_format(ld_attribute.attribute, 0)
           
        else:
            item_new.append("attributes", get_attribute(
                 ld_design.transformer_type, ld_attribute.attribute, 'YES'))
            fn_update_or_append_item_code_format(ld_attribute.attribute, 1)
           
    elif ld_attribute.attribute == 'Special parameters':
        if ld_design.specifics:
            item_new.append("attributes", get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, 'YES'))
            item_new.custom_specifics = ld_design.specifics
            fn_update_or_append_item_code_format(ld_attribute.attribute, 1)
        else:
            item_new.append("attributes", get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, 'NO'))
            fn_update_or_append_item_code_format(ld_attribute.attribute, 0)

    #Tappings - number of tappings (+/-) should take greater value in 
    #either design's tapping_plus or tapping_minus
    elif ld_attribute.attribute == 'Tappings - number of tappings (+/-)':
        l_tapping_plus = int(ld_design.tapping_plus)
        l_tapping_minus = int(ld_design.tapping_minus)
        
        if l_tapping_plus > l_tapping_minus:
            item_new.append("attributes", get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, l_tapping_plus))
            fn_update_or_append_item_code_format(ld_attribute.attribute, l_tapping_plus)
        else:
            item_new.append("attributes", get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, l_tapping_minus))
            fn_update_or_append_item_code_format(ld_attribute.attribute, l_tapping_minus)

    #if lv_2 has a value then vector group should be 0
    #if not vector group lv1 and lv2 should be 0
    elif ld_attribute.attribute in ['Vector Group', 'Vector Group LV 1', 'Vector Group LV 2']:
        if ld_attribute.attribute == 'Vector Group':
            attribute_value = ld_design.vector_group if ld_design.lv_2 == 0 else 0
        elif ld_attribute.attribute == 'Vector Group LV 1':
            attribute_value = ld_design.vector_group_lv1 if ld_design.lv_2 != 0 else 0
        elif ld_attribute.attribute == 'Vector Group LV 2':
            attribute_value = ld_design.vector_group_lv2 if ld_design.lv_2 != 0 else 0
        item_new.append("attributes", get_attribute(
            ld_design.transformer_type, ld_attribute.attribute, attribute_value
        ))
        fn_update_or_append_item_code_format(ld_attribute.attribute, attribute_value)
    
    elif ld_attribute.attribute in ['Uk (%)', 'Uk LV 1 (%)', 'Uk LV 2 (%)', 'Uk HV LV 1 (%)', 'Uk HV LV 2 (%)']:
        if ld_attribute.attribute == 'Uk (%)':
            attribute_value = ld_design.impedance if ld_design.uk_lv2 == 0 and ld_design.ukhv_lv2 == 0  else 0
        elif ld_attribute.attribute == 'Uk LV 1 (%)':
            attribute_value = ld_design.uk_lv1 if ld_design.uk_lv2 != 0 else 0
        elif ld_attribute.attribute == 'Uk LV 2 (%)':
            attribute_value = ld_design.uk_lv2 if ld_design.uk_lv2 != 0 else 0
        elif ld_attribute.attribute == 'Uk HV LV 1 (%)':
            attribute_value = ld_design.ukhv_lv1 if ld_design.ukhv_lv2 != 0 else 0
        elif ld_attribute.attribute == 'Uk HV LV 2 (%)':
            attribute_value = ld_design.ukhv_lv2 if ld_design.ukhv_lv2 != 0 else 0
        item_new.append("attributes", get_attribute(
            ld_design.transformer_type, ld_attribute.attribute, attribute_value
        ))

  # Converting HV, HV 1, HV 2 from V to kV
    elif ld_attribute.attribute in ['HV (kV)', 'HV 1 (kV)', 'HV 2 (kV)']:
        hv_value_map = {
            'HV (kV)': ld_design.hv_rated_voltage,
            'HV 1 (kV)': ld_design.hv1,
            'HV 2 (kV)': ld_design.hv2
        }
        hv_in_kv_str = fn_convert_to_kv(hv_value_map[ld_attribute.attribute])
        item_new.append("attributes", get_attribute(
            ld_design.transformer_type, ld_attribute.attribute, hv_in_kv_str))

    else:
        item_new.append("attributes", get_attribute(ld_design.transformer_type, ld_attribute.attribute, ld_docvalue))

# Append other attributes
item_new.item_technical_name = ld_design.rating + ' [kVA]'

#update technical name 
if ld_design.hv_rated_voltage:
    hv_in_kv = fn_convert_to_kv(ld_design.hv_rated_voltage).replace('.', ',')
    item_new.item_technical_name = item_new.item_technical_name + ', HV ' + fn_remove_trailing_zeros(hv_in_kv) + ' [kV]'
    
if ld_design.hv1 and ld_design.hv2:
    hv1_in_kv = fn_convert_to_kv(ld_design.hv1).replace('.', ',')
    hv2_in_kv = fn_convert_to_kv(ld_design.hv2).replace('.', ',')
    
    item_new.item_technical_name = item_new.item_technical_name + ', HV₁ ' + fn_remove_trailing_zeros(hv1_in_kv) + ' [kV]'
    item_new.item_technical_name = item_new.item_technical_name + ', HV₂ ' + fn_remove_trailing_zeros(hv2_in_kv) + ' [kV]'

if ld_design.lv_rated_voltage:
    item_new.item_technical_name = item_new.item_technical_name + ', LV ' + str(ld_design.lv_rated_voltage) + ' [V]'
    
if ld_design.lv1 and ld_design.lv_2:
   
    item_new.item_technical_name = item_new.item_technical_name + ', LV₁ ' + str(ld_design.lv1) + ' [V]'
    item_new.item_technical_name = item_new.item_technical_name + ', LV₂ ' + str(ld_design.lv_2) + ' [V]'

if ld_design.impedance and (ld_design.uk_lv2 == 0 and ld_design.ukhv_lv2 == 0):    
    item_new.item_technical_name = item_new.item_technical_name + ', Uk ' + fn_remove_trailing_zeros(str(ld_design.impedance)) + ' [%]'

if ld_design.uk_lv1 and ld_design.uk_lv2:
    item_new.item_technical_name = item_new.item_technical_name + ', Uk LV₁ ' + fn_remove_trailing_zeros(str(ld_design.uk_lv1)) + ' [%]'
    item_new.item_technical_name = item_new.item_technical_name + ', Uk LV₂ ' + fn_remove_trailing_zeros(str(ld_design.uk_lv2)) + ' [%]'

if ld_design.ukhv_lv1 and ld_design.ukhv_lv2:
    item_new.item_technical_name = item_new.item_technical_name + ', Uk LV₁ ' + fn_remove_trailing_zeros(str(ld_design.ukhv_lv1)) + ' [%]'
    item_new.item_technical_name = item_new.item_technical_name + ', Uk LV₂ ' + fn_remove_trailing_zeros(str(ld_design.ukhv_lv2)) + ' [%]'

if ld_design.power_lv1 and ld_design.power_lv2:
    item_new.item_technical_name = item_new.item_technical_name + ', Rating LV₁ ' + str(ld_design.power_lv1) + ' [kVA]'
    item_new.item_technical_name = item_new.item_technical_name + ', Rating LV₂ ' + str(ld_design.power_lv2) + ' [kVA]'


item_new.item_technical_name = item_new.item_technical_name + ', P(0) ' + str(ld_design.no_load_loss_guarantee) + ' [W]'

item_new.item_technical_name = item_new.item_technical_name + ', P(k) ' + str(ld_design.load_loss_guarantee) + ' [W]'

item_new.item_code = fn_get_item_code_from_attributes(item_new).replace('.', ',')

item_new.insert()
frappe.response['message'] = item_new