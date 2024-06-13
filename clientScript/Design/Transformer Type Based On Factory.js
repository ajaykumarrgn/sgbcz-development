frappe.ui.form.on('Design', {
    onload(frm) {
        
        //if form is not new check the status
        //if status is Calculation Received & factory or transformer_type is not set
        //set the default value SGBCZ, DTTHZ2N for factory & transformer_type respectively
        
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
        
        //logic to show or hide is design checkbox
        if (frm.doc.factory != 'SGBCZ') {
            frm.set_value('is_design', 0);
            frm.set_df_property('is_design', 'hidden', 1);
        } else {
            frm.set_df_property('is_design', 'hidden', 0);
        }
        
        //Mapped factory with item group
        const ldTransformerMapping = {
            "SGBCZ": "DTTHZ2N",
            "RGB": "RGB",
            "NEUMARK": "NEU"
        };

        //get the item group for the selected factory and
        //XML Data Tab DOM Element
        
        var lXmlDataTab = document.getElementById('design-xml_data_tab-tab');
        const lGetItemGroup = ldTransformerMapping[frm.doc.factory];
        
        //logic to show or hide XML Data Tab
        if (frm.doc.factory != "SGBCZ") {
            lXmlDataTab.hidden = true;
        } else {
            lXmlDataTab.hidden = false;
        }

        //get the current transformer_type
        let lCurrentTransformerType = frm.doc.transformer_type;

        frappe.call({
            method: "get_item_variant_based_on_factory",
            args: { "factory": lGetItemGroup },
            callback: function(response) {
                if (response.message) {
                    frm.set_df_property('transformer_type', 'options', response.message);

                    // Check if the current transformer_type is in the new options
                    if (lCurrentTransformerType && 
                        response.message.includes(lCurrentTransformerType)) {
                        frm.set_value('transformer_type', lCurrentTransformerType);
                    } else {
                        frm.set_value('transformer_type', response.message[0]);
                    }
                }
            }
        });
    },

    refresh(frm) {
        // Re-run the factory function to ensure the UI 
        //reflects the correct state
        frm.trigger('factory');
        fnUpdateButtonGroup(frm);
    },

    is_design(frm) {
        // Update button whenever the checkbox is enabled
        fnUpdateButtonGroup(frm);
    },

    status(frm) {
        // Update button whenever the status field changes
        fnUpdateButtonGroup(frm);
    },
    item(frm){
        if(!frm.doc.item && frm.doc.status === "Item Created"){
            frm.set_value('status', 'Calculation Received');
            frm.save().then(function() {
                fnUpdateButtonGroup(frm);
            });
        }
    }
});

function fnUpdateButtonGroup(frm) {
    const lStatus = frm.doc.status;
    let iShowCreateItem = false;
    let iShowCreateDesign = false;
    let iShowViewItem = false;

    // Determine which button to show based on status
    if (lStatus === 'Draft' && frm.doc.is_design === 1) {
        iShowCreateDesign = true;
    } else if (lStatus === 'Draft' && frm.doc.is_design === 0) {
        iShowCreateItem = true;
    } else if (lStatus === 'Calculation Received' && !frm.doc.item) {
        iShowCreateItem = true;
    } else if (lStatus === 'Item Created' && frm.doc.item) {
        iShowViewItem = true;
    }else if (lStatus === 'Item Created' && !frm.doc.item) {
        iShowViewItem = false;
        iShowCreateItem = true;
    }

    // Show or hide buttons accordingly
    fnShowButtonGroup(frm, iShowCreateItem, iShowCreateDesign, iShowViewItem);
}

// Function to show or hide specific button
function fnShowButtonGroup(frm, iShowCreateItem, iShowCreateDesign, iShowViewItem) {
    // Clear all custom buttons
    frm.clear_custom_buttons();
    // frm.remove_custom_button(__('Create Design'))
    
    if (frm.doc.status === 'Draft' && frm.doc.is_design === 0) {
            // Make 'direct_material_cost' editable and mandatory
            frm.set_df_property('direct_material_cost', 'read_only', 0);
            frm.set_df_property('direct_material_cost', 'reqd', 1);
        } else {
            // Make 'direct_material_cost' read-only and not mandatory
            frm.set_df_property('direct_material_cost', 'read_only', 1);
            frm.set_df_property('direct_material_cost', 'reqd', 0);
        }
    
    //'Create Item' button with item and pdf creation logic
    if (iShowCreateItem) {

        frm.add_custom_button(__("Create Item"), function() {
            // When this button is clicked,
            frappe.call({
        	    "method": "create_item_from_design",
                "args": {
                	"design": frm.doc.name 
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
                            frappe.show_progress(__('Creating Data Sheet Pdf..'), 
                            50, 100, __('Please wait'));  
                            // After saving, call the fn_pdf_attachment method
                            const LA_LANGUAGES = ["de", "cs","fr", "en"];
                            frappe.call({
                                "method": "pdf_on_submit.api.fn_doc_pdf_source_to_target",
                                "args": {
                                    "im_source_doc_type": frm.doc.doctype,
                                    "im_source_doc_name": frm.doc.name,
                                    "im_languages": LA_LANGUAGES,
                                    // "im_print_format": null,
                                    "im_letter_head": "Data Sheet",
                                    "im_target_doc_type": "Item",
                                    "im_target_doc_name": response.message.item_code
                                 },
                                "callback": function(pdfResponse){
                                    if(pdfResponse.message){
                                        // frappe.msgprint("The item is created 
                                        //and the PDF is attached successfully.")
                                        frappe.hide_progress();
                                            frm.set_value('status', 'Item Created');
                                            frm.save();
                                    }
                                 }
                            });
                        });
                            
            //  var delivery_note = response.message.parent;
            //  frappe.set_route('delivery-note', delivery_note);
            }else{                        
                frappe.show_alert({
                    message:__('Error Creating Item'),
                    indicator:'red'
                }, 5); }
            }});   
        });
    }
    
    //'Create Design' button
    if (iShowCreateDesign) {
        frm.add_custom_button(__('Create Design'), function() {
            frm.set_value('status', 'Perform Calculation');
            frm.save();
        });
    }

    //'View Item' button with routing logic to created item
    if (iShowViewItem) {
       frm.add_custom_button(__('View Item'), function() {
            frappe.set_route('item', frm.doc.item);
        });
    }
}
