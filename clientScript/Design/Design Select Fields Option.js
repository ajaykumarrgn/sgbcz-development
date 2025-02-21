// Change Reference
// Create the new design without following the exist filters:>>(ISS-2024-00133)
// Design form saved twice:>>(ISS-2024-00133)
// Retain the UK(%) and IP Protection 
// when switching non design to "Is Design" : >>(ISS-2024-00129)
// Create item for RGB and NEU with two default vector values 
// (i.e) vector group lv1 and vector group lv2 (ISS-2025-00030)

frappe.ui.form.on('Design', {
    fnGetAttributeOptionAndDefault(frm, iAttributeLabel, 
            iAttributeName, iTransformerType, iIsDesign, iReset = false) {
        const L_DOCTYPE = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(L_DOCTYPE, L_DOCTYPE, function() {
            // Then from the model get the list. This will
            // return all attributes of the model including child table
            let laDoc = frappe.model.get_list(L_DOCTYPE);
            // Find the specific attribute based on the attribute_label
            //and transformer_type
            let ldAttribute = laDoc[0].attributes.find(attr => 
                attr.parameter === iAttributeLabel 
                && attr.transformer_type === iTransformerType
                && attr.is_design === iIsDesign);
            //Get the default value and options from the Gitra Attribute,
            if(ldAttribute && ldAttribute.default && ldAttribute.options){
                // set the field's option from the Gitra attribute options
                frm.set_df_property(iAttributeName, 'options', ldAttribute.options);
                //if form status is Draft and value is empty or reset is true
                //set the default value into the field
                if((!frm.doc[iAttributeName] || iReset) && frm.doc.status === 'Draft'){
                    frm.set_value(iAttributeName, ldAttribute.default);
                }
                frm.refresh_field(iAttributeName);
            }else{
                // If attributes not there in the Gitra settings
                // then it will get from the Item attribute
                frm.events.fnGetAttributeOptionFromItemAttribute(frm, iAttributeLabel, 
            iAttributeName, iReset);
            }
        });
    },
    
    //get values from item attribute through 
    //api "get_attribute_value_from_item_attribute"
    //argument as Attribute Name
    fnGetAttributeOptionFromItemAttribute(frm, iAttributeLabel, iAttributeName, iReset) {
        frappe.call({
            method: 'get_attribute_value_from_item_attribute',
            args: {
                'attribute': iAttributeLabel
            },
            callback: function(ldResponse) {
                let laOptions = ldResponse.message.la_options;
                //set the field's options
                frm.set_df_property(iAttributeName, 'options', laOptions.join('\n'));
                //if form status is Draft and value is empty or reset is true
                //set the first index of the ldResponse
                if ((!frm.doc[iAttributeName] || iReset) && frm.doc.status === 'Draft') {
                    frm.set_value(iAttributeName, laOptions[0]);
                }
                frm.refresh_field(iAttributeName);
            }
        });
    },
    // Correct the vector group attribute name 
    // based on the provided attribute list(ISS-2025-00030).
    fnSetOptionsAndDefault(frm, iReset = false, iIpProtection = false) {
        //Attribute mapping
        const LA_ATTRIBUTES = [
            ['Bushings HV', 'bushing_hv'],
            ['Type of LV', 'type_lv'],
            ['Vector Group LV 1', 'vector_group_lv1'], //<<(ISS-2025-00030)
            ['Vector Group LV 2', 'vector_group_lv2'], //<<(ISS-2025-00030)
            ['Vector Group', 'vector_group'],
            ['Insulation class', 'insulation_class'],
            ['Winding material', 'winding_material'],
            ['Cooling', 'cooling_method'],
            ['Type of cooling medium', 'type_cooling'],
            ['Tappings - number of tappings (+/-)', 'tapping_plus'],
            ['Tappings - number of tappings (+/-)', 'tapping_minus'],
            ['Climatic class', 'climatic_class'],
            ['Environmental class', 'environmental_class'],
            ['Transformer IP', 'ip_protection']
        ];
        
        LA_ATTRIBUTES.forEach(laAttribute => {
            // Retain the ip protection value
            // When switches from the non-design to is_design
            // If the attribute is 'ip_protection' 
            // Set the iIpProtection flag to true.
            // do not reset the default value in this field. >>(ISS-2024-00129)
            if (laAttribute[1] === 'ip_protection' && iIpProtection) {
                return; // Skip resetting the ip_protection field
            } //<<(ISS-2024-00129)

            // Retrieve attribute options and default values 
            // for the specified transformer type
            // and update the fields accordingly, 
            // based on the reset flag.
            frm.events.fnGetAttributeOptionAndDefault(frm, laAttribute[0], laAttribute[1], frm.doc.transformer_type, frm.doc.is_design, iReset);
        });
    },

    //refresh(frm) { //Commented this line for the issue (<<ISS-2024-00133)
    //Issue: Form saved twice in the draft status (>>ISS-2024-00133)
    //Clear the exist status filters when enter into 
    //the new design form >>(ISS-2024-00133)
    //Reseting the framework functionality of carrying 
    //the filter value to the full form on creating new document
    
    onload(frm) {
        if(frm.is_new() && frm.doc.status !== 'Draft'){
	        frm.set_value('status', 'Draft');
	    }
        frm.events.fnSetOptionsAndDefault(frm);
    },
    
    is_design(frm) {
        frm.events.fnSetOptionsAndDefault(frm, true, true); //<<(ISS-2024-00129)
    },
    
    factory(frm) {
        frm.events.fnSetOptionsAndDefault(frm, true, false); //<<(ISS-2024-00129)
    },

    transformer_type(frm) {
        frm.events.fnSetOptionsAndDefault(frm);
    },
});