frappe.ui.form.on('Design', {
    refresh(frm) {
       fnFetchTransformerIpValues(frm);
    },
    transformer_type(frm){
        fnFetchTransformerIpValues(frm);
    },
    is_design(frm){
        fnFetchTransformerIpValues(frm);
    },
    factory(frm){
        fnFetchTransformerIpValues(frm);
    }
});

 /**
 * API Method: get_transformer_ip_attribute_value
 *
 * This method retrieves the list of attribute values for a given attribute.
 *
 * @param {string} attribute - The attribute name for which the values are to be fetched.
 * @returns {Object} - An object containing the attribute values.
 * @returns {Array}  ld_options - Array of attribute values for the given attribute.
 * 
 * Initially, the "ip_protection" field had a default value of 'IP00' and options maintained
 * at the customization level of the Design doctype. We are now switching to dynamically 
 * fetching the options from item attribute
 * 
 **/
function fnFetchTransformerIpValues(frm) {
    frappe.call({
        method: 'get_transformer_ip_attribute_value',
        args: {
            'attribute': 'Transformer IP'
        },
        callback: function(response) {
            let laTransformerIpValues = response.message ? response.message.la_options : ['IP00'];
            frm.set_df_property('ip_protection', 'options', laTransformerIpValues.join('\n'));
            if (!frm.doc.ip_protection) {
                frm.set_value('ip_protection', laTransformerIpValues[0]);
            }
            frm.refresh_field('ip_protection');
        }
    });
}
