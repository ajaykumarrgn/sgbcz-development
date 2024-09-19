frappe.ui.form.on('Design', {
    refresh(frm) {
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
        frappe.call({
            method: 'get_transformer_ip_attribute_value',
            args: {
               'attribute': 'Transformer IP'
            },
            callback: function(response) {
                if (response.message) {
                    let transformer_ip_values = response.message.la_options;
                    // Set the values as options for the ip_protection field
                    frm.set_df_property('ip_protection', 'options', transformer_ip_values.join('\n'));
                    frm.refresh_field('ip_protection');
                } else {
                   //set to default value
                   frm.set_df_property('ip_protection', 'options', ['IP00']);
                   frm.refresh_field('ip_protection');
                }
            }
        });
    }
});
