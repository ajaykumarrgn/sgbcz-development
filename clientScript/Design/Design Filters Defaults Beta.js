frappe.ui.form.on('Design', {
    
    /*
    * This function validates the min and max values of the given input
    * The min and max values are defined in the Gitra settings for a field
    * @params {Object} frm - The form object
    * @params {string} attribute_label - The field label as defined in the Gitra Settings
    * @params {string} attribute_name - The field name in the current design for validation
    * @params {string} transformer_type - The type of transformer for which the range is validated
    */
    fnValidateAttributeRange(frm, iAttribute_label, iAttribute_name, iTransformer_type) {
        const DOCTYPE = "Gitra Settings";

        frappe.model.with_doc(DOCTYPE, DOCTYPE, function() {
            let ldDoc = frappe.get_doc(DOCTYPE, DOCTYPE);
            let ldAttribute = ldDoc.attributes.find(attr => attr.parameter === iAttribute_label && attr.transformer_type === iTransformer_type);
            
            if (ldAttribute) {
                

                // Ensure all values are numeric for accurate comparison
                let AttributeName = parseFloat(frm.doc[iAttribute_name]);
                let minValue = parseFloat(ldAttribute.min);
                let maxValue = parseFloat(ldAttribute.max);

                if (AttributeName < minValue || AttributeName > maxValue) {
                    frappe.msgprint({
                        title: __('Validation Error'),
                        message: __('Attribute Not in Range' + ', Min: ' + minValue + ', Max: ' + maxValue),
                        indicator: 'red'
                    });
                    frm.set_value(iAttribute_name, ''); 
                    frappe.validated = false; // Prevent form submission
                }
            } else {
                frappe.msgprint({
                    title: __('Attribute Not Found'),
                    message: __(iAttribute_label + ' for ' + iTransformer_type + ' is not found in Gitra Settings.'),
                    indicator: 'orange'
                });
            }
        });
    },
    rating(frm){
         frm.events.fnValidateAttributeRange(frm, 'Rating', 'rating', frm.doc.transformer_type);
    },

    hv_rated_voltage(frm) {
       
        frm.events.fnValidateAttributeRange(frm, 'HV Rated Voltage', 'hv_rated_voltage', frm.doc.transformer_type);
    },
    hv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'HV1', 'hv1',frm.doc.transformer_type);
    },
    hv2(frm) {
       
        frm.events.fnValidateAttributeRange(frm, 'HV2', 'hv2',frm.doc.transformer_type);
    },

    uk(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'Uk (%)', 'impedance', frm.doc.transformer_type);
    },

    lv_rated_voltage(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'LV Rated Voltage', 'lv_rated_voltage', frm.doc.transformer_type);
    },
     
    lv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'LV1', 'lv1',frm.doc.transformer_type);
    },
    lv_2(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'LV2', 'lv_2',frm.doc.transformer_type);
    },
    power_lv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'Rating LV1', 'power_lv1',frm.doc.transformer_type);
    },
    power_lv2(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Rating LV2', 'power_lv2',frm.doc.transformer_type);
    },
    uk_lv1(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Uk LV1(%)', 'uk_lv1',frm.doc.transformer_type);
    },
    uk_lv2(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Uk LV2(%)', 'uk_lv2',frm.doc.transformer_type);
    },
    ukhv_lv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'Uk HV LV 1 (%)', 'ukhv_lv1',frm.doc.transformer_type);
    },
    ukhv_lv2(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Uk HV LV 2 (%)', 'ukhv_lv2',frm.doc.transformer_type);
    }
});