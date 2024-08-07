frappe.ui.form.on('Design', {
    
    /*
    * This function validates the min and max values of the given input
    * The min and max values are defined in the Gitra settings for a field
    * @params {Object} frm - The form object
    * @params {string} attribute_label - The field label 
    * as defined in the Gitra Settings
    * @params {string} attribute_name - The field name in 
    * the current design for validation
    * @params {string} transformer_type - The type of transformer 
    * for which the range is validated
    * @params {boolean} iShouldBeEmpty - for Data field normally will 
    * be empty, Other than that set the default if it has or 
    * the min value itself
    */
    fnValidateAttributeRange(frm, iAttribute_label, iAttribute_name, iTransformer_type, iShouldBeEmpty = true) {
        const DOCTYPE = "Gitra Settings";
 
        frappe.model.with_doc(DOCTYPE, DOCTYPE, function() {
            let ldDoc = frappe.get_doc(DOCTYPE, DOCTYPE);
            let ldAttribute = ldDoc.attributes.find(attr => 
                attr.parameter === iAttribute_label 
                && attr.transformer_type === iTransformer_type);
            let lFieldMeta = frm.meta.fields.find(field => field.fieldname === iAttribute_name);
            
            if (ldAttribute) {
                
 
                // Ensure all values are numeric for accurate comparison
                let lAttributeName = parseFloat(frm.doc[iAttribute_name]);
                let lMinValue = parseFloat(ldAttribute.min);
                let lMaxValue = parseFloat(ldAttribute.max);
 
                if (lAttributeName < lMinValue || lAttributeName > lMaxValue) {
                    frappe.msgprint({
                        title: __('Validation Error'),
                        message: __('Attribute Not in Range' + ', Min: ' + lMinValue + ', Max: ' + lMaxValue),
                        indicator: 'red'
                    });

                    //for Data field type set it to empty
                    //other than Data field type set either default 
                    //if there or minvalue
                    frm.set_value(iAttribute_name, iShouldBeEmpty ? '' : lFieldMeta ? lFieldMeta.default : lMinValue); 
                    frappe.validated = false; // Prevent form submission
                }
            } 
            // else {
            //     frappe.msgprint({
            //         title: __('Attribute Not Found'),
            //         message: __(iAttribute_label + ' for ' + iTransformer_type + ' is not found in Gitra Settings.'),
            //         indicator: 'orange'
            //     });
            // }
        });
    },

    //onchange of rating field event
    rating(frm){
         frm.events.fnValidateAttributeRange(frm, 'Rating', 'rating', frm.doc.transformer_type);
    },
    
    //onchange of hv_rated_voltage field event
    hv_rated_voltage(frm) {
       
        frm.events.fnValidateAttributeRange(frm, 'HV Rated Voltage', 'hv_rated_voltage', frm.doc.transformer_type);
    },

    //onchange of hv1 field event 
    hv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'HV1', 'hv1',frm.doc.transformer_type);
    },

    //onchange of hv2 field event
    hv2(frm) {
       
        frm.events.fnValidateAttributeRange(frm, 'HV2', 'hv2',frm.doc.transformer_type);
    },
    
    //onchange of impedance field event
    impedance(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'Impedance', 'impedance', frm.doc.transformer_type, false);
    },
    
    //onchange of lv_rated_voltage field event
    lv_rated_voltage(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'LV Rated Voltage', 'lv_rated_voltage', frm.doc.transformer_type);
    },

    //onchange of lv1 field event 
    lv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'LV1', 'lv1',frm.doc.transformer_type);
    },

    //onchange of lv_2 field event
    lv_2(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'LV2', 'lv_2',frm.doc.transformer_type);
    },

    //onchange of power_lv1 field event
    power_lv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'Rating LV1', 'power_lv1',frm.doc.transformer_type);
    },

    //onchange of power_lv2 field event
    power_lv2(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Rating LV2', 'power_lv2',frm.doc.transformer_type);
    },

    //onchange of uk_lv1 field event
    uk_lv1(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Uk LV1', 'uk_lv1',frm.doc.transformer_type);
    },

    //onchange of uk_lv2 field event
    uk_lv2(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Uk LV2', 'uk_lv2',frm.doc.transformer_type);
    },

    //onchange of ukhv_lv1 field event
    ukhv_lv1(frm) {
        
        frm.events.fnValidateAttributeRange(frm, 'Uk HV LV 1', 'ukhv_lv1',frm.doc.transformer_type);
    },

    //onchange of ukhv_lv2 field event
    ukhv_lv2(frm) {
         
        frm.events.fnValidateAttributeRange(frm, 'Uk HV LV 2', 'ukhv_lv2',frm.doc.transformer_type);
    },

    //onchange of tapping_plus_step field event
    tapping_plus_step(frm) {
        frm.events.fnValidateAttributeRange(frm, 'Tapping Plus Step', 'tapping_plus_step', frm.doc.transformer_type, false);
    },
    
    //onchange of tapping_minus_step field event
    tapping_minus_step(frm) {
        frm.events.fnValidateAttributeRange(frm, 'Tapping Minus Step', 'tapping_minus_step',frm.doc.transformer_type, false);
    },
    
});