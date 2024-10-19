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
                
            //If ldAttribute has a default value,
            //set it to the field
            if(ldAttribute && ldAttribute.default && ldAttribute.options){
                frm.set_df_property(iAttributeName, 'options', ldAttribute.options);
                if((!frm.doc[iAttributeName] || iReset) && frm.doc.status === 'Draft'){
                    frm.set_value(iAttributeName, ldAttribute.default);
                }
                frm.refresh_field(iAttributeName);
                
            }else{
                frm.events.fngetAttributeOptionFromItemAttribute(frm, iAttributeLabel, 
            iAttributeName, iTransformerType, iReset);
            }
            
        });
    },
    
    fngetAttributeOptionFromItemAttribute(frm, iAttributeLabel, iAttributeName, iTransformerType, iReset) {
        frappe.call({
            method: 'get_transformer_ip_attribute_value',
            args: {
                'attribute': iAttributeLabel
            },
            callback: function(response) {
                let laOptions = response.message.la_options;
                frm.set_df_property(iAttributeName, 'options', laOptions.join('\n'));
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