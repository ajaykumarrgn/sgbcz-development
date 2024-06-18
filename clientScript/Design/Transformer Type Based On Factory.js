frappe.ui.form.on('Design', {
    onload(frm) {
        
        // For backward compatibility:
        // Designs created before adding the factory option.
        // If the status is 'Calculation Received', set:
        // Factory: 'SGBCZ'
        // Transformer Type: 'DTTHZ2N'
        
        if(!frm.is_new()){
            if (frm.doc.status === 'Calculation Received' && 
            (!frm.doc.factory || !frm.doc.transformer_type)) {
                frm.set_value('factory', 'SGBCZ');
                frm.set_value('transformer_type', 'DTTHZ2N');
                if(frm.doc.item){
                    frm.set_value('status', 'Item Created');
                }
                frm.save();
                fnUpdateButtonGroup(frm);
            }
        }
    },

    factory(frm) {
        //design creation is only for sgbcz transformer to
        //restrict it in other region by hidding the is_design checkbox
           
        if (frm.doc.factory != 'SGBCZ') {
            frm.set_value('is_design', 0);
            frm.set_df_property('is_design', 'hidden', 1);
        } else {
             frm.set_df_property('is_design', 'hidden', 0);
        }
        fnFetchTransformerType(frm);
    },

    refresh(frm) {   
        fnFetchTransformerType(frm);
        fnUpdateButtonGroup(frm);
        if(frm.is_new()){
            fnDirectMaterial(frm)
        }
    },

    //when is_design checkbox is enabled
    //display only create design button
    is_design(frm) {
        // Update button whenever the checkbox is enabled
        fnUpdateButtonGroup(frm);
        fnDirectMaterial(frm);

    },

    status(frm) {
        // Update button whenever the status field changes
        fnUpdateButtonGroup(frm);
        fnDirectMaterial(frm);
    },
    
    // If the user removes the value in the item field,
    // the status will be changed based on whether the 
    //item was created from design (with gitra calculation)
    // or without gitra calculation.
    
    item(frm){
        if(!frm.doc.item && frm.doc.status === "Item Created"){
            if(frm.doc.is_design === 1){
                frm.set_value('status', 'Calculation Received');
                frm.save().then(function() {
                    fnUpdateButtonGroup(frm);
                });
            }else{
                frm.set_value('status', 'Draft');
                frm.save().then(function() {
                    fnUpdateButtonGroup(frm);
                });
            }
        }
    }
});

function fnFetchTransformerType(frm) {
    //calling the get_item_variant_based_on_factory
    //to get the list of item template available for the
    //selected factory
              
    //restrict XML Data tab for other region except SGBCZ
        
    var lXmlDataTab = document.getElementById('design-xml_data_tab-tab');
        
    if (frm.doc.factory != "SGBCZ") {
        lXmlDataTab.hidden = true;
    } else {
        lXmlDataTab.hidden = false;
    }
    
    //Mapped the factory with its relevant item group
    const ldTransformerMapping = {
        "SGBCZ": "DTTHZ2N",
        "RGB": "RGB",
        "NEUMARK": "NEU"
    };
        
    const lGetItemGroup = ldTransformerMapping[frm.doc.factory];
    let lCurrentTransformerType = frm.doc.transformer_type;

    frappe.call({
        method: "get_item_variant_based_on_factory",
        args: { "factory": lGetItemGroup },
        callback: function(response) {
            if (response.message) {
                set_field_options('transformer_type', response.message)
               
            }
        }
    });

}

function fnUpdateButtonGroup(frm) {
    const lStatus = frm.doc.status;
    let buttonLabel = '';
    let buttonFunction = null;

    // Determine which button to show based on status
    if (lStatus === 'Draft' && frm.doc.is_design === 1) {
        buttonLabel = 'Create Design';
        buttonFunction = fncreateDesign;
    } else if (lStatus === 'Draft' && frm.doc.is_design === 0) {
        buttonLabel = 'Create Item';
        buttonFunction = fncreateItem;
    } else if (lStatus === 'Calculation Received' && !frm.doc.item) {
        buttonLabel = 'Create Item';
        buttonFunction = fncreateItem;
    } else if (lStatus === 'Item Created' && frm.doc.item) {
        buttonLabel = 'View Item';
        buttonFunction = fnviewItem;
    } else if (lStatus === 'Item Created' && !frm.doc.item) {
        buttonLabel = 'Create Item';
        buttonFunction = fncreateItem;
    }

    fnShowButtonGroup(frm, buttonLabel, buttonFunction);
}

// Function to show or hide specific button
function fnShowButtonGroup(frm, buttonLabel, buttonFunction) {
    // Clear all custom buttons
    frm.clear_custom_buttons();
    
    if (buttonLabel && buttonFunction) {
        frm.add_custom_button(__(buttonLabel), function() {
            buttonFunction(frm);
        });
    }
}

function fnDirectMaterial(frm){
    // To create item without gitra calculation, direct material cost
    // is required, so on draft status with is_design checkbox disable
    // make the direct material cost field required and editable
    if (frm.doc.status === 'Draft' && frm.doc.is_design === 0) {
        frm.set_df_property('direct_material_cost', 'read_only', 0);
        frm.set_df_property('direct_material_cost', 'reqd', 1);
    } else {
        frm.set_df_property('direct_material_cost', 'read_only', 1);
        frm.set_df_property('direct_material_cost', 'reqd', 0);
    }
    
}

function fncreateItem(frm) {
    frappe.call({
        "method": "create_item_from_design",
        "args": {
        "design": frm.doc.name, 
        },
        "callback": function(response) {
            if(response.message) {
                frappe.show_alert({
                    message: __('Item Created'),
                    indicator: 'green'
                }, 5);
                frm.set_value('item', response.message.item_code);
                frm.refresh_fields();
                frm.save().then(function(){
                    frappe.show_progress(__('Creating with Pdf..'), 50, 100, __('Please wait'));
                    frappe.call({
                        "method": "frappe.client.get",
                        "args":{
                            "doctype": "Gitra Settings"
                        },
                        "callback":function(gitraResponse){
                            
                            if(gitraResponse.message){
                                // After saving, call the fn_pdf_attachment method
                                const LA_LANGUAGES = gitraResponse.message.print_languages
                                //using the design title as filename
                                let l_title = frm.doc.title;
    
                                if (l_title) {
                                    // Find the position of the first space
                                    let l_space_index = l_title.indexOf(' ');
                                    // Remove everything up to the first space
                                    if (l_space_index !== -1) {
                                        l_title = l_title.substring(l_space_index + 1);
                                    }
                                    // Replace slashes with underscores
                                    l_title = l_title.replace(/\//g, gitraResponse.message.separator);
                                }
                                frappe.call({
                                    "method": "pdf_on_submit.api.fn_doc_pdf_source_to_target",
                                    "args": {
                                        "im_source_doc_type": frm.doc.doctype,
                                        "im_source_doc_name": frm.doc.name,
                                        "im_languages": LA_LANGUAGES,
                                        // "im_print_format": null,
                                        "im_letter_head": "Data Sheet",
                                        "im_target_doc_type": "Item",
                                        "im_target_doc_name": response.message.item_code,
                                        "im_file_name": `Datasheet_${l_title}_${frm.doc.name}_{language}`
                                    },
                                    "callback": function(pdfResponse){
                                        if(pdfResponse.message){
                                            frappe.hide_progress()
                                            frm.set_value('status', 'Item Created');
                                            frm.save();
                                                            
                                        }
                                    }
                                });
                            }
                        }
                    })

                })
                            
            }else{                        
                frappe.show_alert({
                    message:__('Error Creating Item'),
                    indicator:'red'
                }, 5); }
    }});      
}

function fncreateDesign(frm) {
    frm.set_value('status', 'Perform Calculation');
    frm.save();
}

function fnviewItem(frm) {
    frappe.set_route('item', frm.doc.item);
}
