gitra_settings = frappe.get_doc('Gitra Settings').as_dict()
def to_technical_name(i_attribute):
    # Convert to lowercase
    lowercase_string = i_attribute.lower()

    # Replace spaces with underscores
    technical_name = lowercase_string.replace(" ", "_")
    return technical_name
for attribute in gitra_settings.attributes:
    attribute_name = to_technical_name(attribute.parameter)
    if (int(doc.get(attribute_name)) < int(attribute.min) or int(doc.get(attribute_name)) > int(attribute.max)):
        msg_str = attribute.parameter + ' not in range ' + '(' + attribute.min + ', '+ attribute.max + ')'
        frappe.throw(msg_str)
  