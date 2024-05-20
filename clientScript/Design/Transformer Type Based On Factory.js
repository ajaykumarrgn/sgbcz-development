frappe.ui.form.on('Design', {
    onload(frm) {
        if (frm.doc.status === 'Calculation Received') {
            frm.set_value('factory', 'SGBCZ');
            frm.set_value('transformer_type', 'DTTHZ2N');
            frm.save();
            fnUpdateButtonGroup(frm);
        }

        frappe.call({
            method: "get_item_variant_based_on_factory",
            args: { "factory": 'SGBCZ' },
            callback: function(response) {
                if (response.message) {
                    frm.set_df_property('transformer_type', 'options', response.message);
                    // Set a default value if it's one of the options
                    if (response.message.includes('DTTHZ2N')) {
                        frm.set_value('transformer_type', 'DTTHZ2N');
                    } else {
                        frm.set_value('transformer_type', response.message[0]);
                    }
                    if (!frm.is_new()) {
                        frm.save();
                    }
                }
            }
        });
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

        // Save current transformer_type value
        let currentTransformerType = frm.doc.transformer_type;

        frappe.call({
            method: "get_item_variant_based_on_factory",
            args: { "factory": lGetItemGroup },
            callback: function(response) {
                if (response.message) {
                    frm.set_df_property('transformer_type', 'options', response.message);

                    // Check if the current transformer_type is in the new options
                    if (currentTransformerType && response.message.includes(currentTransformerType)) {
                        frm.set_value('transformer_type', currentTransformerType);
                    } else {
                        frm.set_value('transformer_type', response.message[0]);
                    }
                    if (!frm.is_new()) {
                        frm.save();
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
    } else if (lStatus === 'Calculation Received') {
        iShowCreateItem = true;
    } else if (lStatus === 'Item Created') {
        iShowViewItem = true;
    }

    // Show or hide buttons accordingly
    fnShowButtonGroup(frm, iShowCreateItem, iShowCreateDesign, iShowViewItem);
}

// Function to show or hide specific buttons in the custom button group
function fnShowButtonGroup(frm, iShowCreateItem, iShowCreateDesign, iShowViewItem) {
    // Clear all custom buttons
    frm.clear_custom_buttons();

    // Add 'Create Item' button if needed
    if (iShowCreateItem) {
        frm.add_custom_button(__('Create Item'), function() {
            frappe.msgprint('Create Item clicked!');
        });
    }

    // Add 'Create Design' button if needed
    if (iShowCreateDesign) {
        frm.add_custom_button(__('Create Design'), function() {
            frappe.msgprint('Create Design clicked!');
        });
    }

    // Add 'View Item' button if needed
    if (iShowViewItem) {
        frm.add_custom_button(__('View Item'), function() {
            frappe.msgprint('View item clicked!');
        });
    }
}
