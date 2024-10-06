frappe.ui.form.on('Gitra Settings', {
    refresh: function(frm) {
        var laChildTable = ['attributes', 'hv_voltage_setting', 'lv_voltage_setting', 'ip_protection_setting', 'losses_setting'];
        for (var i = 0; i < laChildTable.length; i++) {
            fnHideRows(frm, laChildTable[i]);
        }
    },
    transformer_type: function(frm) {
        var laChildTable = ['attributes', 'hv_voltage_setting', 'lv_voltage_setting', 'ip_protection_setting', 'losses_setting'];
        for (var i = 0; i < laChildTable.length; i++) {
            fnHideRows(frm, laChildTable[i]);
        }
    }
});

//Function that hides the row that doesn't match the Transformer Type mentioned in the
//parent doctype "Gitra Settings"
function fnHideRows(frm, iFieldName) {
    //Get the Transformer Type from the parent doctype "Gitra Settings"
    var lTransformerType = frm.fields_dict.transformer_type.value;
    var ldGrid = frm.fields_dict[iFieldName].grid;

    // Check if the grid object and grid_rows property are defined
    if (ldGrid && ldGrid.grid_rows) {
        // Iterate through each grid row
        ldGrid.grid_rows.forEach(function(iRow) {
            // Check if the row and row.doc are defined
            if (iRow && iRow.doc) {
                // Get the value of the 'transformer_type' field in the current row
                var lTransType = iRow.doc.transformer_type;

                // Check if the transformer_type is not equal to the value of Transformer Type
                //of the parent doctype
                if (lTransType !== lTransformerType) {
                    // If not equal, hide the row
                    iRow.wrapper.hide(true);
                } else {
                    // Otherwise, show the row
                    iRow.wrapper.show(true);
                }
            }
        });
    }
};
