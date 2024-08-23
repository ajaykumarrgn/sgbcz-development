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
    */
    fnValidateAttributeRange(frm, iAttribute_label, 
            iAttribute_name, iTransformer_type) {
        const DOCTYPE = "Gitra Settings";
         // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(DOCTYPE, DOCTYPE, function() {
            // Then from the model get the list. This will
            // return all attributes of the model including child table
            let ldDoc = frappe.model.get_list(DOCTYPE);
            // Find the specific attribute based on the attribute_label
            //and transformer_type
            let ldAttribute = ldDoc[0].attributes.find(attr => 
                attr.parameter === iAttribute_label 
                && attr.transformer_type === iTransformer_type);
            
            if(ldAttribute){
                // Ensure all values are numeric for accurate comparison
                let lAttributeName = parseFloat(frm.doc[iAttribute_name]);
                let lMinValue = parseFloat(ldAttribute.min);
                let lMaxValue = parseFloat(ldAttribute.max);
        
                if (lAttributeName < lMinValue || lAttributeName > lMaxValue) {
                    // Check if the attribute value is within the 
                    //specified range and display an error message if it is not.
                    frappe.msgprint({
                        title: __('Validation Error'),
                        message: __('Attribute Not in Range' + 
                            ', Min: ' + lMinValue + ', Max: ' + lMaxValue),
                        indicator: 'red'
                    });
                    frappe.validated = false;
                }
            }
            
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
        
        frm.events.fnValidateAttributeRange(frm, 'Impedance', 'impedance', frm.doc.transformer_type);
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
        frm.events.fnValidateAttributeRange(frm, 'Tapping Plus Step', 'tapping_plus_step', frm.doc.transformer_type);
        frm.set_value('tapping_minus_step', frm.doc.tapping_plus_step);
    },
    
    //commented this because this field will
    //take value from tapping_plus_step
    // //onchange of tapping_minus_step field event
    // tapping_minus_step(frm) {
    //     frm.events.fnValidateAttributeRange(frm, 'Tapping Minus Step', 'tapping_minus_step',frm.doc.transformer_type, false);
    // },
    validate(frm){
        frm.events.fnValidateAttributeRange(frm, 'Rating', 'rating', frm.doc.transformer_type);
        
        //HV Validation
        if(frm.doc.hv1 && frm.doc.hv2){
            frm.events.fnValidateAttributeRange(frm, 'HV1', 'hv1',frm.doc.transformer_type);
            frm.events.fnValidateAttributeRange(frm, 'HV2', 'hv2',frm.doc.transformer_type);
        }else{
            frm.events.fnValidateAttributeRange(frm, 'HV Rated Voltage', 'hv_rated_voltage', frm.doc.transformer_type);
        }
        
        //LV Valodation
        if(frm.doc.lv1 && frm.doc.lv_2){
            frm.events.fnValidateAttributeRange(frm, 'LV1', 'lv1',frm.doc.transformer_type);
            frm.events.fnValidateAttributeRange(frm, 'LV2', 'lv_2',frm.doc.transformer_type);
        }else{
            frm.events.fnValidateAttributeRange(frm, 'LV Rated Voltage', 'lv_rated_voltage', frm.doc.transformer_type);
        }
        
        //Rating Validation
        if(frm.doc.power_lv1 && frm.doc.power_lv2){
            frm.events.fnValidateAttributeRange(frm, 'Rating LV1', 'power_lv1',frm.doc.transformer_type);
            frm.events.fnValidateAttributeRange(frm, 'Rating LV2', 'power_lv2',frm.doc.transformer_type);
        }
        
        //UK LV Validation
        if(frm.doc.uk_lv1 && frm.doc.uk_lv2){
            frm.events.fnValidateAttributeRange(frm, 'Uk LV1', 'uk_lv1',frm.doc.transformer_type);
            frm.events.fnValidateAttributeRange(frm, 'Uk LV2', 'uk_lv2',frm.doc.transformer_type);
        }
        
        //UK HV LV Validation
        if(frm.doc.ukhv_lv1 && frm.doc.ukhv_lv2){
            frm.events.fnValidateAttributeRange(frm, 'Uk HV LV 1', 'ukhv_lv1',frm.doc.transformer_type);
            frm.events.fnValidateAttributeRange(frm, 'Uk HV LV 2', 'ukhv_lv2',frm.doc.transformer_type);
        }
    }
});