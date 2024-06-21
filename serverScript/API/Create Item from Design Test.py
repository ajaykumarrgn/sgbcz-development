def get_attribute(i_variant_of, attribute, attribute_value):
    child_doc = frappe.new_doc("Item Variant Attribute")
    child_doc.variant_of = i_variant_of
    child_doc.attribute = attribute
    child_doc.attribute_value = attribute_value
    return child_doc

def fill_item_basic_details(item, item_group, variant_of):
    item.item_group = item_group
    item.include_item_in_manufacturing = 0
    item.variant_of = variant_of
    item.stock_uom = 'PC'
    return item

def fill_item_description(item, template_item_code):
    template_item = frappe.get_doc('Item', template_item_code)
    item.description = template_item.description
    return item

def remove_trailing_zeros(number_str):
    return number_str.rstrip('0').rstrip('.') if '.' in number_str else number_str

def get_item_code_from_attributes(item):
    item_code = item.variant_of
    for attribute in item.attributes:
        # frappe.msgprint(str(attribute.attribute_value))
        item_code = item_code + '/' + remove_trailing_zeros(str(attribute.attribute_value))
    return item_code

def fn_get_parameter_mapping_def():
    def lfn_add_param_map(i_attribute, i_designdoc_field, ia_param_map_def):
        ld_param_map = {'attribute': i_attribute, 'designdoc_field': i_designdoc_field}
        ia_param_map_def.append(ld_param_map)
        return ia_param_map_def

    lb_map_def = []
    lb_map_def = lfn_add_param_map('Power (kVA)', 'rating', lb_map_def)
    lb_map_def = lfn_add_param_map('HV (kV)', 'hv_rated_voltage', lb_map_def)
    lb_map_def = lfn_add_param_map('HV 1 (kV)', 'hv1', lb_map_def)
    lb_map_def = lfn_add_param_map('HV 2 (kV)', 'hv2', lb_map_def)
    lb_map_def = lfn_add_param_map('HV AC (kV)', 'ac_phase_hv', lb_map_def)
    lb_map_def = lfn_add_param_map('LV (V)', 'lv_rated_voltage', lb_map_def)
    lb_map_def = lfn_add_param_map('LV 1 (V)', 'lv1', lb_map_def)
    lb_map_def = lfn_add_param_map('LV 2 (V)', 'lv_2', lb_map_def)
    lb_map_def = lfn_add_param_map('Climatic class', 'climatic_class', lb_map_def)
    lb_map_def = lfn_add_param_map('Environmental class', 'environmental_class', lb_map_def)
    lb_map_def = lfn_add_param_map('Lpa (dB)', 'lpa', lb_map_def)
    lb_map_def = lfn_add_param_map('LWA (dB)', 'lwa', lb_map_def)
    lb_map_def = lfn_add_param_map('Vector Group LV 1', 'vector_group_lv1', lb_map_def)
    lb_map_def = lfn_add_param_map('Vector Group LV 2', 'vector_group_lv2', lb_map_def)
    lb_map_def = lfn_add_param_map('HV LI (kV)', 'li_phase_hv', lb_map_def)
    lb_map_def = lfn_add_param_map('Power LV 1 (KV)', 'power_lv1', lb_map_def)
    lb_map_def = lfn_add_param_map('Power LV 2 (KV)', 'power_lv2', lb_map_def)
    lb_map_def = lfn_add_param_map('HV Um (kV)', 'highest_operation_voltage_hv', lb_map_def)
    lb_map_def = lfn_add_param_map('Insulation Class', 'insulation_class', lb_map_def)
    lb_map_def = lfn_add_param_map('LV AC (kV)', 'ac_phase_lv', lb_map_def)
    lb_map_def = lfn_add_param_map('LV LI (kV)', 'li_phase_lv', lb_map_def)
    lb_map_def = lfn_add_param_map('LV Um (kV)', 'highest_operation_voltage_lv', lb_map_def)
    lb_map_def = lfn_add_param_map('P0 (W)', 'no_load_loss_guarantee', lb_map_def)
    lb_map_def = lfn_add_param_map('Pk (W)', 'load_loss_guarantee', lb_map_def)
    lb_map_def = lfn_add_param_map('Special parameters', 'specifics', lb_map_def)
    lb_map_def = lfn_add_param_map('Tappings - number of tappings (+/-)', 'tapping_plus', lb_map_def)
    lb_map_def = lfn_add_param_map('Tappings - number of tappings (+/-)', 'tapping_minus', lb_map_def)
    lb_map_def = lfn_add_param_map('Tappings - values (%)', 'tapping_minus_step', lb_map_def)
    lb_map_def = lfn_add_param_map('Tappings - values (%)', 'tapping_plus_step', lb_map_def)
    lb_map_def = lfn_add_param_map('Temperature rise (K)', 'temperature_rise', lb_map_def)
    lb_map_def = lfn_add_param_map('Ambient max. temperature (°C)', 'ambient_max_temperature', lb_map_def)
    lb_map_def = lfn_add_param_map('THDi (%)', 'thdi_value', lb_map_def)
    lb_map_def = lfn_add_param_map('Winding Material', 'winding_material', lb_map_def)
    lb_map_def = lfn_add_param_map('Transformer IP', 'ip_protection', lb_map_def)
    lb_map_def = lfn_add_param_map('Type of LV', 'type_lv', lb_map_def)
    lb_map_def = lfn_add_param_map('Uk (%)', 'impedance', lb_map_def)
    lb_map_def = lfn_add_param_map('Uk LV 1 (%)', 'uk_lv1', lb_map_def)
    lb_map_def = lfn_add_param_map('Uk LV 2 (%)', 'uk_lv2', lb_map_def)
    lb_map_def = lfn_add_param_map('Electrostatic Screen', '', lb_map_def)
    lb_map_def = lfn_add_param_map('Parallel coil', '', lb_map_def)
    
    return lb_map_def

def fn_get_design_doc_field(i_attribute, ia_parameter_map_def):
    for l_param in ia_parameter_map_def:
        if l_param['attribute'] == i_attribute:
            return l_param['designdoc_field']
            
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
elif design.transformer_type == 'DTTH2N':
    item_group = 'RGB'
    variant_of = 'DTTH2N'
elif design.transformer_type == 'DOTML':
    item_group = 'NEU'
    variant_of = 'DOTML'

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

# ld_filters = {'parent': design.transformer_type}

# la_template_attributes = frappe.get_all('Item Variant Attribute', fields=['variant_of','attribute', 'numeric_values'], filters=ld_filters)

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
    l_designdoc_field = fn_get_design_doc_field(ld_attribute.attribute, la_parameter_map_def)
    
    # Retrieve the 'numeric_values' attribute from the database
    ld_doc_attr = frappe.db.get_value('Item Attribute', ld_attribute.attribute, ['numeric_values'])
    
    # Initialize l_docvalue to 0
    l_docvalue = 0
    
    # Get the value from the design document
    l_docvalue_temp = design.get(l_designdoc_field)
    
    # If the attribute has numeric values
    if ld_doc_attr:
        # If the corresponding document field has a value captured
        if l_docvalue_temp:
            # If the document field is not of type float or int (i.e., a non-numeric value or char or string type)
            if not (isinstance(l_docvalue_temp, float) or isinstance(l_docvalue_temp, int)):
                # Convert the char or string value to float
                l_docvalue_temp = float(l_docvalue_temp)
            # If the document field value is a whole number then make the type as int to trim the .00s
            if l_docvalue_temp % 1 == 0:
                l_docvalue_temp = int(l_docvalue_temp)
            l_docvalue = l_docvalue_temp

    # Now l_docvalue is either the proper value or 0 if it was not set
    # Here you would continue processing with l_docvalue as needed
    # For example, saving l_docvalue back to the document or further calculations

    # Optionally, if you need to print or display the value
    frappe.msgprint(str(ld_attribute.attribute) + '  ' + str(l_docvalue))

            
    # Convert the value to a string and replace '.' with ','
    # l_docvalue = str(l_docvalue)
    # l_docvalue = l_docvalue.replace('.', ',')
    
    # Conditionally append attributes
    if ld_attribute.attribute == 'Electrostatic screen':
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 'NO'))
    elif ld_attribute.attribute == 'Special parameters':
        if design.specifics:
            item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 'YES'))
        else:
            item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 'NO'))
    elif ld_attribute.attribute == 'THDi (%)':
        if design.k4_factor == 'Yes':
            item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 20))
        else:
            item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 5))
    elif ld_attribute.attribute == 'Vector Group':
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, ('DYN' + design.vector_group)))
    # elif ld_attribute.attribute == 'Parallel coil':
    #     json_data = json.loads(design.gitra_json_downstream)
    #     TGtSpule = json_data['sgb']['TGtWickelzettel']['TGtWickelzettelSystemeListe']['TGtWickelzettelSystem'][1]['TGtWicklungenListe']['TGtWicklung']['TGtSpulenListe']['TGtSpule']
    #     if len(TGtSpule) == 2:
    #         item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 'YES'))
    #     else:
    #         item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 'NO'))
    elif ld_attribute.attribute == 'HV (kV)':
        hv_in_kv_str = str(int(design.hv_rated_voltage) / 1000)
        if float(hv_in_kv_str) % 1 == 0:
            item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, hv_in_kv_str))
        else:
            # hv_in_kv_str = hv_in_kv_str.replace('.', ',')
            item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, hv_in_kv_str))
    elif l_designdoc_field in ['lwa', 'lpa']:
        l_target_attribute_value = design.get(l_designdoc_field)
        if l_target_attribute_value is not None:
            try:
                l_target_attribute_value = int(l_target_attribute_value)
                if 30 <= l_target_attribute_value <= 70:
                    append_attribute(ld_attribute.attribute, l_target_attribute_value)
                else:
                    append_attribute(ld_attribute.attribute, 0)
            except (ValueError, TypeError):
                append_attribute(ld_attribute.attribute, 0)
        else:
            append_attribute(ld_attribute.attribute, 0)
    elif ld_attribute.attribute == 'HV 1 (kV)': 
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 0))
    elif ld_attribute.attribute == 'HV 2 (kV)': 
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 0))

    elif ld_attribute.attribute == 'LV 1 (V)': 
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 0))
    elif ld_attribute.attribute == 'LV 2 (V)': 
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, 0))
    # elif ld_attribute.attribute == 'Tappings - values (%)':
    #     item_new.append("attributes", get_attribute('Tappings - values (%)', str(design.tapping_plus_step).replace('.',',')))
    # elif ld_attribute.attribute == 'LV Um (kV)':
    #     item_new.append("attributes", get_attribute('LV Um (kV)', str(design.highest_operation_voltage_lv).replace('.',',')))


    
    else:
        item_new.append("attributes", get_attribute(design.transformer_type, ld_attribute.attribute, l_docvalue))
        
    # l_docvalue = str(l_docvalue)
    # l_docvalue = l_docvalue.replace('.', ',')


# Append other attributes
item_new.item_technical_name = design.rating + ' [kVA]'

# hv_in_kv_str = str(int(design.hv_rated_voltage) / 1000)
hv_in_kv = hv_in_kv_str.replace('.', ',')

item_new.item_technical_name = item_new.item_technical_name + ', HV ' + remove_trailing_zeros(hv_in_kv) + ' [kV]'

item_new.item_technical_name = item_new.item_technical_name + ', LV ' + str(design.lv_rated_voltage) + ' [V]'

item_new.item_technical_name = item_new.item_technical_name + ', Uk ' + remove_trailing_zeros(str(design.impedance)) + ' [%]'

item_new.item_technical_name = item_new.item_technical_name + ', P(0) ' + str(design.no_load_loss_guarantee) + ' [W]'

item_new.item_technical_name = item_new.item_technical_name + ', P(k) ' + str(design.load_loss_guarantee) + ' [W]'

# frappe.msgprint(str(item_new.item_technical_name))

item_new.item_code = get_item_code_from_attributes(item_new).replace('.',',')
# frappe.msgprint(str(item_new.item_code))
item_new.insert()
frappe.response['message'] = item_new
