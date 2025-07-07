# Not allow to create Item from the duplicate Design (ISS-2025-00030)
def fn_get_attribute(i_variant_of, i_attribute, i_attribute_value):
    ld_child_doc = frappe.new_doc("Item Variant Attribute")
    ld_child_doc.variant_of = i_variant_of
    ld_child_doc.attribute = i_attribute
    ld_child_doc.attribute_value = i_attribute_value
    return ld_child_doc


# Fill basic details of the item
def fn_fill_item_basic_details(id_item, i_item_group, i_variant_of):
    id_item.item_group = i_item_group
    id_item.include_item_in_manufacturing = 0
    id_item.variant_of = i_variant_of
    id_item.stock_uom = "PC"
    return id_item

# Fill item description from template item
def fn_fill_item_description(id_item, i_template_item_code):
    ld_template_item = frappe.get_doc("Item", i_template_item_code)
    id_item.description = ld_template_item.description
    return id_item


def fn_update_or_append_item_code_format(i_attribute, i_attribute_value):
    l_b_found = False

    # Iterate directly over the list and update if a match is found
    for ld_item in la_item_code_format:
        if ld_item["attribute"] == i_attribute:
            # Initially, la_item_code_format captures the default value for the Vector Group,
            # as well as defaults for Vector Group LV1 and Vector Group LV2 in case LV2 is absent.
            # However, if LV2 is present, we must override the default and 
            # set the Vector Group to 0.
            # Additionally, if LV2 is not present, both Vector Group LV1 and Vector Group LV2
            # should be set to 0
            if i_attribute_value == 0:
                # Update the attribute_value if attribute_value is 0
                ld_item["attribute_value"] = i_attribute_value
            l_b_found = True
            break

    # If no match was found, append the new attribute and value
    if not l_b_found:
        la_item_code_format.append(
            {"attribute": i_attribute, "attribute_value": i_attribute_value}
        )


# Remove trailing zeros from a number string
def fn_remove_trailing_zeros(i_number_str):
    return i_number_str.rstrip("0").rstrip(".") if "." in i_number_str else i_number_str


# Generate item code from its attributes
def fn_get_item_code_from_attributes(id_item):
    l_item_code = id_item.variant_of
    # Create a lookup dictionary for item_code_format to access attribute_value by attribute
    ld_item_code_format_dict = {
        a["attribute"]: a["attribute_value"] for a in la_item_code_format
    }

    for ld_attribute in id_item.attributes:
        # Check if the current attribute is present in ld_item_code_format_dict
        if ld_attribute.attribute in ld_item_code_format_dict:
            # Use the attribute_value from item_code_format
            l_item_code = (
                l_item_code
                + "/"
                + fn_remove_trailing_zeros(
                    str(ld_item_code_format_dict[ld_attribute.attribute])
                )
            )
        else:
            # Use the attribute's own attribute_value if not found in item_code_format
            l_item_code = (
                l_item_code
                + "/"
                + fn_remove_trailing_zeros(str(ld_attribute.attribute_value))
            )
    return l_item_code


# Define the parameter mapping definitions
def fn_get_parameter_mapping_def():
    def lfn_add_param_map(i_attribute, i_designdoc_field, la_param_map_def):
        ld_param_map = {"attribute": i_attribute, "designdoc_field": i_designdoc_field}
        la_param_map_def.append(ld_param_map)
        return la_param_map_def

    # Add mappings
    la_param_map_def = []
    la_param_map_def = lfn_add_param_map("Power (kVA)", "rating", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "HV (kV)", "hv_rated_voltage", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("HV 1 (kV)", "hv1", la_param_map_def)
    la_param_map_def = lfn_add_param_map("HV 2 (kV)", "hv2", la_param_map_def)
    la_param_map_def = lfn_add_param_map("HV AC (kV)", "ac_phase_hv", la_param_map_def)
    la_param_map_def = lfn_add_param_map("LV (V)", "lv_rated_voltage", la_param_map_def)
    la_param_map_def = lfn_add_param_map("LV 1 (V)", "lv1", la_param_map_def)
    la_param_map_def = lfn_add_param_map("LV 2 (V)", "lv_2", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "Climatic class", "climatic_class", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Environmental class", "environmental_class", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("Lpa (dB)", "lpa", la_param_map_def)
    la_param_map_def = lfn_add_param_map("LWA (dB)", "lwa", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "Vector Group", "vector_group", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Vector Group LV 1", "vector_group_lv1", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Vector Group LV 2", "vector_group_lv2", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("HV LI (kV)", "li_phase_hv", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "Rating LV1 (kVA)", "power_lv1", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Rating LV2 (kVA)", "power_lv2", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "HV Um (kV)", "highest_operation_voltage_hv", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Insulation Class", "insulation_class", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("LV AC (kV)", "ac_phase_lv", la_param_map_def)
    la_param_map_def = lfn_add_param_map("LV LI (kV)", "li_phase_lv", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "LV Um (kV)", "highest_operation_voltage_lv", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "P0 (W)", "no_load_loss_guarantee", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Pk (W)", "load_loss_guarantee", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Special parameters", "specifics", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Tappings - number of tappings (+/-)", "tapping_plus", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Tappings - number of tappings (+/-)", "tapping_minus", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Tappings - values (%)", "tapping_minus_step", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Tappings - values (%)", "tapping_plus_step", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Temperature rise (K)", "temperature_rise", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Ambient max. temperature (°C)", "ambient_max_temperature", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("THDi (%)", "thdi", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "Winding Material", "winding_material", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Transformer IP", "ip_protection", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("Type of LV", "type_lv", la_param_map_def)
    la_param_map_def = lfn_add_param_map("Uk (%)", "impedance", la_param_map_def)
    la_param_map_def = lfn_add_param_map("Uk LV 1 (%)", "uk_lv1", la_param_map_def)
    la_param_map_def = lfn_add_param_map("Uk LV 2 (%)", "uk_lv2", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "Electrostatic screen", "electrostatic_screen", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Parallel coil", "parallel_coil", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("Cooling", "cooling_method", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "Type of Cooling Medium", "type_cooling", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("Bushings HV", "bushing_hv", la_param_map_def)
    la_param_map_def = lfn_add_param_map(
        "Temperature Rise Winding (K)", "temperature_rise_winding", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map(
        "Temperature rise Oil (k)", "temperature_rise_oil", la_param_map_def
    )
    la_param_map_def = lfn_add_param_map("Uk HV LV 1 (%)", "ukhv_lv1", la_param_map_def)
    la_param_map_def = lfn_add_param_map("Uk HV LV 2 (%)", "ukhv_lv2", la_param_map_def)

    return la_param_map_def


# Get design document field for a given attribute
def fn_get_design_doc_field(i_attribute, la_parameter_map_def):
    for ld_param in la_parameter_map_def:
        if ld_param["attribute"] == i_attribute:
            return ld_param["designdoc_field"]


# Append attribute to the item
def fn_append_attribute(i_attribute_name, i_attribute_value):
    if i_attribute_name not in la_existing_attributes:
        if isinstance(i_attribute_value, (int, float)):
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    design.transformer_type, i_attribute_name, i_attribute_value
                ),
            )
        else:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    design.transformer_type, i_attribute_name, str(i_attribute_value)
                ),
            )
        la_existing_attributes.add(i_attribute_name)


# function to convert volt ti kV
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
l_design_id = frappe.form_dict.get("i_design")
# Process the API code based on the GET and POST method
l_method = frappe.form_dict.get("i_method")

ld_design = frappe.get_doc("Design", l_design_id)  # Define design here

la_parameter_map_def = fn_get_parameter_mapping_def()

l_item_group = frappe.db.get_value("Item", {"name": ld_design.transformer_type, 
                "has_variants": 1}, ["item_group"])

# Determine item group and variant based on transformer type
if ld_design.factory == "SGBCZ":
    #Commented for story >>US-2025-0603
    # item_group = "DTTHZ2N"
    # variant_of = "DTTHZ2N"
    #>>US-2025-0603
    #Used transformer_type as used for other factories story >>US-2025-0603
    item_group = l_item_group
    variant_of = ld_design.transformer_type
    # <<US-2025-0603
elif ld_design.factory == "RGB":
    item_group = l_item_group
    variant_of = ld_design.transformer_type
elif ld_design.factory == "NEU":
    item_group = l_item_group
    variant_of = ld_design.transformer_type
else:
    frappe.response["message"] = "Unsupported transformer type."
    # frappe.throw('Unsupported transformer type.')

# Create a new item document
ld_item_new = frappe.new_doc("Item")
ld_item_new.item_name = ld_design.title
ld_item_new = fn_fill_item_basic_details(ld_item_new, item_group, variant_of)
ld_item_new = fn_fill_item_description(ld_item_new, variant_of)
ld_item_new.standard_rate = ld_design.total_cost
ld_item_new.design = ld_design.name

# initialize an empty array
la_item_code_format = []

# Append attributes while avoiding duplicates
la_existing_attributes = set()

la_template_attributes = frappe.get_doc("Item", ld_design.transformer_type).attributes
if not la_template_attributes:
    frappe.msgprint("Template attributes not found")

for ld_attribute in la_template_attributes:
    # Retrieve the design document field corresponding to the attribute
    ld_designdoc_field = fn_get_design_doc_field(
        ld_attribute.attribute, la_parameter_map_def
    )

    # Retrieve the 'numeric_values' attribute from the database
    l_doc_attr = frappe.db.get_value(
        "Item Attribute", ld_attribute.attribute, ["numeric_values"]
    )

    # Initialize l_docvalue to 0
    l_docvalue = 0

    # Get the value from the design document
    ld_docvalue_temp = ld_design.get(ld_designdoc_field)

    # If the attribute has numeric values
    if l_doc_attr:
        # If the corresponding document field has a value captured
        if ld_docvalue_temp:
            # If the document field is not of type float or int
            # (i.e., a non-numeric value or char or string type)
            if not (
                isinstance(ld_docvalue_temp, float) or isinstance(ld_docvalue_temp, int)
            ):
                # Convert the char or string value to float
                ld_docvalue_temp = float(ld_docvalue_temp)
            # If the document field value is a whole number then
            # make the type as int to trim the .00s
            if ld_docvalue_temp % 1 == 0:
                ld_docvalue_temp = int(ld_docvalue_temp)
            l_docvalue = ld_docvalue_temp
    else:
        # get the abbreviation for the attribute value
        ld_doc_abbr = frappe.db.get_value(
            "Item Attribute Value",
            {"parent": ld_attribute.attribute, "attribute_value": ld_docvalue_temp},
            "abbr",
        )
        if ld_doc_abbr:
            la_item_code_format.append(
                {"attribute": ld_attribute.attribute, "attribute_value": ld_doc_abbr}
            )
        l_docvalue = ld_docvalue_temp

    # Conditionally append attributes
    if ld_attribute.attribute == "Electrostatic screen":
        if ld_design.electrostatic_screen == 0:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, "NO"
                ),
            )
            fn_update_or_append_item_code_format(ld_attribute.attribute, 0)

        else:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, "YES"
                ),
            )
            fn_update_or_append_item_code_format(ld_attribute.attribute, 1)

    elif ld_attribute.attribute == "Parallel coil":
        if ld_design.parallel_coil == 0:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, "NO"
                ),
            )
            fn_update_or_append_item_code_format(ld_attribute.attribute, 0)

        else:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, "YES"
                ),
            )
            fn_update_or_append_item_code_format(ld_attribute.attribute, 1)

    elif ld_attribute.attribute == "Special parameters":
        if ld_design.specifics:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, "YES"
                ),
            )
            ld_item_new.custom_specifics = ld_design.specifics
            fn_update_or_append_item_code_format(ld_attribute.attribute, 1)
        else:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, "NO"
                ),
            )
            fn_update_or_append_item_code_format(ld_attribute.attribute, 0)

    # Tappings - number of tappings (+/-) should take greater value in
    # either design's tapping_plus or tapping_minus
    elif ld_attribute.attribute == "Tappings - number of tappings (+/-)":
        l_tapping_plus = int(ld_design.tapping_plus)
        l_tapping_minus = int(ld_design.tapping_minus)

        if l_tapping_plus > l_tapping_minus:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, l_tapping_plus
                ),
            )
            fn_update_or_append_item_code_format(ld_attribute.attribute, l_tapping_plus)
        else:
            ld_item_new.append(
                "attributes",
                fn_get_attribute(
                    ld_design.transformer_type, ld_attribute.attribute, l_tapping_minus
                ),
            )
            fn_update_or_append_item_code_format(
                ld_attribute.attribute, l_tapping_minus
            )

    # if lv_2 has a value then vector group should be 0
    # if not vector group lv1 and lv2 should be 0
    elif ld_attribute.attribute in [
        "Vector Group",
        "Vector Group LV 1",
        "Vector Group LV 2",
    ]:
        if ld_attribute.attribute == "Vector Group":
            attribute_value = ld_design.vector_group if ld_design.lv_2 == 0 else 0
        elif ld_attribute.attribute == "Vector Group LV 1":
            attribute_value = ld_design.vector_group_lv1 if ld_design.lv_2 != 0 else 0
        elif ld_attribute.attribute == "Vector Group LV 2":
            attribute_value = ld_design.vector_group_lv2 if ld_design.lv_2 != 0 else 0
        ld_item_new.append(
            "attributes",
            fn_get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, attribute_value
            ),
        )
        fn_update_or_append_item_code_format(ld_attribute.attribute, attribute_value)

    elif ld_attribute.attribute in [
        "Uk (%)",
        "Uk LV 1 (%)",
        "Uk LV 2 (%)",
        "Uk HV LV 1 (%)",
        "Uk HV LV 2 (%)",
    ]:
        if ld_attribute.attribute == "Uk (%)":
            attribute_value = (
                ld_design.impedance
                if ld_design.uk_lv2 == 0 and ld_design.ukhv_lv2 == 0
                else 0
            )
        elif ld_attribute.attribute == "Uk LV 1 (%)":
            attribute_value = ld_design.uk_lv1 if ld_design.uk_lv2 != 0 else 0
        elif ld_attribute.attribute == "Uk LV 2 (%)":
            attribute_value = ld_design.uk_lv2 if ld_design.uk_lv2 != 0 else 0
        elif ld_attribute.attribute == "Uk HV LV 1 (%)":
            attribute_value = ld_design.ukhv_lv1 if ld_design.ukhv_lv2 != 0 else 0
        elif ld_attribute.attribute == "Uk HV LV 2 (%)":
            attribute_value = ld_design.ukhv_lv2 if ld_design.ukhv_lv2 != 0 else 0
        ld_item_new.append(
            "attributes",
            fn_get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, attribute_value
            ),
        )

    # Converting HV, HV 1, HV 2 from V to kV
    elif ld_attribute.attribute in ["HV (kV)", "HV 1 (kV)", "HV 2 (kV)"]:
        hv_value_map = {
            "HV (kV)": ld_design.hv_rated_voltage,
            "HV 1 (kV)": ld_design.hv1,
            "HV 2 (kV)": ld_design.hv2,
        }
        hv_in_kv_str = fn_convert_to_kv(hv_value_map[ld_attribute.attribute])
        ld_item_new.append(
            "attributes",
            fn_get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, hv_in_kv_str
            ),
        )

    else:
        ld_item_new.append(
            "attributes",
            fn_get_attribute(
                ld_design.transformer_type, ld_attribute.attribute, l_docvalue
            ),
        )

# Append other attributes
ld_item_new.item_technical_name = ld_design.rating + " [kVA]"

# update technical name
if ld_design.hv_rated_voltage:
    hv_in_kv = fn_convert_to_kv(ld_design.hv_rated_voltage).replace(".", ",")
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", HV "
        + fn_remove_trailing_zeros(hv_in_kv)
        + " [kV]"
    )

if ld_design.hv1 and ld_design.hv2:
    hv1_in_kv = fn_convert_to_kv(ld_design.hv1).replace(".", ",")
    hv2_in_kv = fn_convert_to_kv(ld_design.hv2).replace(".", ",")

    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", HV₁ "
        + fn_remove_trailing_zeros(hv1_in_kv)
        + " [kV]"
    )
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", HV₂ "
        + fn_remove_trailing_zeros(hv2_in_kv)
        + " [kV]"
    )

if ld_design.lv_rated_voltage:
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", LV "
        + str(ld_design.lv_rated_voltage)
        + " [V]"
    )

if ld_design.lv1 and ld_design.lv_2:

    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name + ", LV₁ " + str(ld_design.lv1) + " [V]"
    )
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name + ", LV₂ " + str(ld_design.lv_2) + " [V]"
    )

if ld_design.impedance and (ld_design.uk_lv2 == 0 and ld_design.ukhv_lv2 == 0):
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", Uk "
        + fn_remove_trailing_zeros(str(ld_design.impedance))
        + " [%]"
    )

if ld_design.uk_lv1 and ld_design.uk_lv2:
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", Uk LV₁ "
        + fn_remove_trailing_zeros(str(ld_design.uk_lv1))
        + " [%]"
    )
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", Uk LV₂ "
        + fn_remove_trailing_zeros(str(ld_design.uk_lv2))
        + " [%]"
    )

if ld_design.ukhv_lv1 and ld_design.ukhv_lv2:
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", Uk LV₁ "
        + fn_remove_trailing_zeros(str(ld_design.ukhv_lv1))
        + " [%]"
    )
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", Uk LV₂ "
        + fn_remove_trailing_zeros(str(ld_design.ukhv_lv2))
        + " [%]"
    )

if ld_design.power_lv1 and ld_design.power_lv2:
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", Rating LV₁ "
        + str(ld_design.power_lv1)
        + " [kVA]"
    )
    ld_item_new.item_technical_name = (
        ld_item_new.item_technical_name
        + ", Rating LV₂ "
        + str(ld_design.power_lv2)
        + " [kVA]"
    )


ld_item_new.item_technical_name = (
    ld_item_new.item_technical_name
    + ", P(0) "
    + str(ld_design.no_load_loss_guarantee)
    + " [W]"
)

ld_item_new.item_technical_name = (
    ld_item_new.item_technical_name
    + ", P(k) "
    + str(ld_design.load_loss_guarantee)
    + " [W]"
)

ld_item_new.item_code = fn_get_item_code_from_attributes(ld_item_new).replace(".", ",")

# ld_item_new.insert()
# frappe.response["message"] = ld_item_new

# For the GET method, check if an item already exists for the given design.
# If it doesn't exist, create a new item for the specific design (>>ISS-2025-00030).
ld_item_code_formation = ld_item_new.item_code
 
if l_method == "GET":
    l_exist = frappe.db.exists("Item", {"item_code": ld_item_code_formation})
    if l_exist:
        frappe.response["message"] = "Item already exists"
    else:
        frappe.response["message"] = "No Item"
        
        
elif l_method == "POST":
    ld_item_new.insert()
    frappe.response["message"] = {"item_code": ld_item_new.name}
 
else:
    frappe.response["message"] = "Invalid method"
#<<ISS-2025-00030
