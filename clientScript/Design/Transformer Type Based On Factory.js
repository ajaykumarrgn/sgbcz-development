frappe.ui.form.on('Design', {
    onload(frm) {
        if (frm.doc.status === 'Calculation Received' && !frm.doc.factory || !frm.doc.transformer_type) {
            frm.set_value('factory', 'SGBCZ');
            frm.set_value('transformer_type', 'DTTHZ2N');
            frm.save()
            fnUpdateButtonGroup(frm);
        }

        // frappe.call({
        //     method: "get_item_variant_based_on_factory",
        //     args: { "factory": 'SGBCZ' },
        //     callback: function(response) {
        //         if (response.message) {
        //             frm.set_df_property('transformer_type', 'options', response.message);
        //             // Set a default value if it's one of the options
        //             if (response.message.includes('DTTHZ2N')) {
        //                 frm.set_value('transformer_type', 'DTTHZ2N');
        //             } else {
        //                 frm.set_value('transformer_type', response.message[0]);
        //             }
                    
        //         }
        //     }
        // });
    },

    factory(frm) {
        if (frm.doc.factory != 'SGBCZ') {
            frm.set_df_property('is_design', 'hidden', 1);
        } else {
            frm.set_df_property('is_design', 'hidden', 0);
        }

        const ldTransformerMapping = {
            "SGBCZ": "DTTHZ2N",
            "RGB": "RGB"
        };

        var lxmlDataTab = document.getElementById('design-xml_data_tab-tab');
        const lGetItemGroup = ldTransformerMapping[frm.doc.factory];
        if (frm.doc.factory != "SGBCZ") {
            lxmlDataTab.hidden = true;
        } else {
            lxmlDataTab.hidden = false;
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
                    if (lCurrentTransformerType && response.message.includes(lCurrentTransformerType)) {
                        frm.set_value('transformer_type', lCurrentTransformerType);
                    } else {
                        frm.set_value('transformer_type', response.message[0]);
                    }
                }
            }
        });
    },

    refresh(frm) {
        // Re-run the factory function to ensure the UI reflects the correct state
        frm.trigger('factory');
        fnUpdateButtonGroup(frm);
    },

    is_design(frm) {
        // Update button group whenever the checkbox is enabled
        fnUpdateButtonGroup(frm);
    },

    status(frm) {
        // Update button group whenever the status field changes
        fnUpdateButtonGroup(frm);
    }
});

function fnUpdateButtonGroup(frm) {
    const lStatus = frm.doc.status;
    let iShowCreateItem = false;
    let iShowCreateDesign = false;
    let iShowViewItem = false;

    // Determine which buttons to show based on status
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
         frm.set_value('status', 'Calculation Received');
    }

    // Show or hide buttons accordingly
    fnShowButtonGroup(frm, iShowCreateItem, iShowCreateDesign, iShowViewItem);
}

// Function to show or hide specific buttons in the custom button group
function fnShowButtonGroup(frm, iShowCreateItem, iShowCreateDesign, iShowViewItem) {
    // Clear all custom buttons
    frm.clear_custom_buttons();
    // frm.remove_custom_button(__('Create Design'))
    
    // // Add 'Create Item' button if needed
    if (iShowCreateItem) {

          frm.add_custom_button(__("Create Item"), function() {
                // When this button is clicked,
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
                                            // frappe.msgprint('Please wait, PDF generation has started.');
                                            frappe.show_progress('Creating Data Sheet Pdf..', 50, 100, 'Please wait');  
                                            // After saving, call the fn_pdf_attachment method
                                            const LA_LANGUAGES = ["de", "cs","fr", "en"];
                                            frappe.call({
                                                "method": "pdf_on_submit.api.fn_doc_pdf_source_to_target",
                                                "args": {
                                                    "im_source_doc_type": frm.doc.doctype,
                                                    "im_source_doc_name": frm.doc.name,
                                                    "im_languages": LA_LANGUAGES,
                                                    "im_print_format": null,
                                                    "im_letter_head": null,
                                                    "im_target_doc_type": "Item",
                                                    "im_target_doc_name": response.message.item_code
                                                },
                                                "callback": function(pdfResponse){
                                                    if(pdfResponse.message){
                                                        // frappe.msgprint("The item is created and the PDF is attached successfully.")
                                                        frappe.hide_progress()
                                                        frm.set_value('status', 'Item Created');
                                                    }
                                                }
                                        });
                		    })
                            
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
    

    // Add 'Create Design' button if needed
    if (iShowCreateDesign) {
        frm.add_custom_button(__('Create Design'), function() {
            frappe.msgprint('Create Design clicked!');
        });
    }

    // // Add 'View Item' button if needed
    if (iShowViewItem) {
       frm.add_custom_button(__('View Item'), function() {
            frappe.set_route('item', frm.doc.item);
        });
    }
}
