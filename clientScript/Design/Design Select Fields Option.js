frappe.ui.form.on('Design', {
    fngetAttributeOptionAndDefault(frm, iAttributeLabel, 
            iAttributeName, iTransformerType, iIsDesign, iReset = false) {
        const DOCTYPE = "Gitra Settings";
         // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(DOCTYPE, DOCTYPE, function() {
            // Then from the model get the list. This will
            // return all attributes of the model including child table
            let ldDoc = frappe.model.get_list(DOCTYPE);
            // Find the specific attribute based on the attribute_label
            //and transformer_type
            let ldAttribute = ldDoc[0].attributes.find(attr => 
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
                frm.events.fngetAttributeOptionFromItemAttribute(frm, iAttributeLabel, 
            iAttributeName, iReset);
            }
            
        });
    },
    
    //this function call get_attribute_value_from_item_attribute api
    fngetAttributeOptionFromItemAttribute(frm, iAttributeLabel, iAttributeName, iReset) {
        frappe.call({
            method: 'get_attribute_value_from_item_attribute',
            args: {
                'attribute': iAttributeLabel
            },
            callback: function(response) {
                let laOptions = response.message.la_options;
                //set the field's options
                frm.set_df_property(iAttributeName, 'options', laOptions.join('\n'));
                //if form status is Draft and value is empty or reset is true
                //set the first index of the response
                if ((!frm.doc[iAttributeName] || iReset) && frm.doc.status === 'Draft') {
                    frm.set_value(iAttributeName, laOptions[0]);
                }
                frm.refresh_field(iAttributeName);
            }
        });

    },
    
fnSetOptionsAndDefault(frm, iReset = false) {
        //Attribute mapping
        const LA_ATTRIBUTES = [
            ['Bushings HV', 'bushing_hv'],
            ['Type of LV', 'type_lv'],
            ['Vector Group LV1', 'vector_group_lv1'],
            ['Vector Group LV2', 'vector_group_lv2'],
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

        //looping the LA_ATTRIBUTES
        LA_ATTRIBUTES.forEach(laAttribute => {
            frm.events.fngetAttributeOptionAndDefault(frm, laAttribute[0], laAttribute[1], frm.doc.transformer_type, frm.doc.is_design, iReset);
        });
    },

    refresh(frm) {
        frm.events.fnSetOptionsAndDefault(frm);
    },

    is_design(frm) {
        frm.events.fnSetOptionsAndDefault(frm, true);
    },

    factory(frm) {
        frm.events.fnSetOptionsAndDefault(frm, true);
    },

    transformer_type(frm) {
        frm.events.fnSetOptionsAndDefault(frm);
    }

});