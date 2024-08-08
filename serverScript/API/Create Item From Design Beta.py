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

 # Remove trailing zeros from a number string
def remove_trailing_zeros(number_str):
    return number_str.rstrip('0').rstrip('.') if '.' in number_str else number_str

# Generate item code from its attributes
def get_item_code_from_attributes(item):
    item_code = item.variant_of
    for attribute in item.attributes:
        item_code = item_code + '/' + remove_trailing_zeros(str(attribute.attribute_value))
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
    la_param_map_def = lfn_add_param_map('Power LV 1 (KV)', 'power_lv1', la_param_map_def)
    la_param_map_def = lfn_add_param_map('Power LV 2 (KV)', 'power_lv2', la_param_map_def)
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
    la_param_map_def = lfn_add_param_map('THDi (%)', 'thdi_value', la_param_map_def)
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

def get_lwa_attribute_value(design):
    # Placeholder implementation, replace with actual logic
    return design.get('lwa', 0)

def get_lpa_attribute_value(design):
    # Placeholder implementation, replace with actual logic
    return design.get('lpa', 0)

# Fetch the design details from the request
design_id = frappe.form_dict.get('design')
design = frappe.get_doc('Design', design_id)  # Define design here

la_parameter_map_def = fn_get_parameter_mapping_def()

# Determine item group and variant based on transformer type
if design.transformer_type == 'DTTHZ2N':
    item_group = 'DTTHZ2N'
    variant_of = 'DTTHZ2N'
# elif design.transformer_type == 'DTTH2N':
#     item_group = 'RGB'
#     variant_of = 'DTTH2N'
# elif design.transformer_type == 'DOTML':
#     item_group = 'NEU'
#     variant_of = 'DOTML'
elif design.transformer_type in ['DTTH2N', 'DTTHK2NG', 'DTTHDG', 'DTTH2NG']:
    item_group = 'RGB'
    variant_of = design.transformer_type
elif design.transformer_type in ['DOTML', 'DMTML', 'DSTML', 'DOTDG']:
    item_group = 'NEU'
    variant_of = design.transformer_type
else:
    frappe.response['message'] = 'Unsupported transformer type.'
    # frappe.throw('Unsupported transformer type.')

# Create a new item document
item_new = frappe.new_doc('Item')
item_new.item_name = design.title
item_new = fill_item_basic_details(item_new, item_group, variant_of)
item_new = fill_item_description(item_new, variant_of)
item_new.standard_rate = design.total_cost
item_new.design = design.name

# Initialize a flag to check if either 'lwa' or 'lpa' has been set
lwa_set = False
lpa_set = False

# Append attributes while avoiding duplicates
existing_attributes = set()

la_template_attributes = frappe.get_doc('Item', design.transformer_type).attributes
if not la_template_attributes:
    frappe.msgprint("Template attributes not found")

for ld_attribute in la_template_attributes:
    # Retrieve the design document field corresponding to the attribute
    ld_designdoc_field = fn_get_design_doc_field(ld_attribute.attribute, la_parameter_map_def)

    # Retrieve the 'numeric_values' attribute from the database
    ld_doc_attr = frappe.db.get_value('Item Attribute', ld_attribute.attribute, ['numeric_values'])

    # Initialize ld_docvalue to 0
    ld_docvalue = 0

    # Get the value from the design document
    ld_docvalue_temp = design.get(ld_designdoc_field)

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
        # If the attribute does not have numeric values
        # keep the original value
        ld_docvalue = ld_docvalue_temp

    # Conditionally append attributes
    if ld_attribute.attribute == 'Electrostatic screen':
        if design.electrostatic_screen == 0:
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, 'NO'))
        else:
             item_new.append("attributes", get_attribute(
                 design.transformer_type, ld_attribute.attribute, 'YES'))
    elif ld_attribute.attribute == 'Parallel coil':
        if design.parallel_coil == 0:
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, 'NO'))
        else:
             item_new.append("attributes", get_attribute(
                 design.transformer_type, ld_attribute.attribute, 'YES'))
    elif ld_attribute.attribute == 'Special parameters':
        if design.specifics:
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, 'YES'))
            item_new.custom_specifics = design.specifics
        else:
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, 'NO'))
    elif ld_attribute.attribute == 'THDi (%)':
        if design.k4_factor == 'Yes':
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, 20))
        else:
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, 5))

    #Tappings - number of tappings (+/-) should take greater value in 
    #either design's tapping_plus or tapping_minus
    elif ld_attribute.attribute == 'Tappings - number of tappings (+/-)':
        l_tapping_plus = int(design.tapping_plus)
        l_tapping_minus = int(design.tapping_minus)
        
        if l_tapping_plus > l_tapping_minus:
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, l_tapping_plus))
        else:
            item_new.append("attributes", get_attribute(
                design.transformer_type, ld_attribute.attribute, l_tapping_minus))
                    
    elif ld_attribute.attribute == 'Vector Group':
        if design.lv_2 == 0:
            attribute_value = design.vector_group
            item_new.append("attributes", get_attribute(
                design.transformer_type, 'Vector Group', attribute_value))
        else:
            item_new.append("attributes", get_attribute(
                design.transformer_type, 'Vector Group', 0))
    elif ld_attribute.attribute == 'Vector Group LV 1':
        if design.lv_2 != 0:
            vector_group_lv1_value = design.vector_group_lv1
            item_new.append("attributes", get_attribute(
                design.transformer_type, 'Vector Group LV 1', vector_group_lv1_value))
        else:
            item_new.append("attributes", get_attribute(
                design.transformer_type, 'Vector Group LV 1', 0))
    elif ld_attribute.attribute == 'Vector Group LV 2':
        if design.lv_2 != 0:
            vector_group_lv2_value = design.vector_group_lv2
            item_new.append("attributes", get_attribute(
                design.transformer_type, 'Vector Group LV 2', vector_group_lv2_value))
        else:
            item_new.append("attributes", get_attribute(
                design.transformer_type, 'Vector Group LV 2', 0))

    # elif ld_attribute.attribute == 'Vector Group':
    #     item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, ('DYN' + design.vector_group)))

    #converting hv, hv 1, hv 2 from V to kV 
    elif ld_attribute.attribute == 'HV (kV)':
        hv_in_kv_str = str(int(design.hv_rated_voltage) / 1000)
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, hv_in_kv_str))
    elif ld_attribute.attribute == 'HV 1 (kV)':
        hv_in_kv_str = str(int(design.hv1) / 1000)
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, hv_in_kv_str))
    elif ld_attribute.attribute == 'HV 2 (kV)':
        hv_in_kv_str = str(int(design.hv2) / 1000)
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, hv_in_kv_str))
            
    elif ld_designdoc_field in ['lwa', 'lpa']:
        ld_target_attribute_value = design.get(ld_designdoc_field)
        if ld_target_attribute_value is not None:
            try:
                ld_target_attribute_value = int(ld_target_attribute_value)
                if 30 <= ld_target_attribute_value <= 70:
                    append_attribute(ld_attribute.attribute, ld_target_attribute_value)
                else:
                    append_attribute(ld_attribute.attribute, 0)
            except (ValueError, TypeError):
                append_attribute(ld_attribute.attribute, 0)
        else:
            append_attribute(ld_attribute.attribute, 0)
    else:
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, ld_docvalue))

# Append other attributes
item_new.item_technical_name = design.rating + ' [kVA]'

hv_in_kv = hv_in_kv_str.replace('.', ',')

item_new.item_technical_name = item_new.item_technical_name + ', HV ' + remove_trailing_zeros(hv_in_kv) + ' [kV]'

item_new.item_technical_name = item_new.item_technical_name + ', LV ' + str(design.lv_rated_voltage) + ' [V]'

item_new.item_technical_name = item_new.item_technical_name + ', Uk ' + remove_trailing_zeros(str(design.impedance)) + ' [%]'

item_new.item_technical_name = item_new.item_technical_name + ', P(0) ' + str(design.no_load_loss_guarantee) + ' [W]'

item_new.item_technical_name = item_new.item_technical_name + ', P(k) ' + str(design.load_loss_guarantee) + ' [W]'

item_new.item_code = get_item_code_from_attributes(item_new).replace('.',',')

item_new.insert()
frappe.response['message'] = item_new
