frappe.ui.form.on('Gitra Settings', {
    transformer_type: function(frm) {
        setTimeout(function() {
            fnAddChildTableRows(frm);
        }, 1000); // Delay execution by 1 second
    },
    refresh: function(frm) {
        setTimeout(function() {
            fnAddChildTableRows(frm);
        }, 1000); // Delay execution by 1 second
    }
});

function fnAddChildTableRows(frm) {
    //Array of Child Tables in Gitra Settings
    var laChildTables = ['attributes', 'hv_voltage_setting', 'lv_voltage_setting', 'ip_protection_setting', 'losses_setting'];
    
    laChildTables.forEach(function(iChildTableName) {
        var ldChildTable = frm.fields_dict[iChildTableName].grid;

        // Check if ldChildTable exists and has a wrapper
        if (ldChildTable && ldChildTable.wrapper) {
            var lAddButton = ldChildTable.wrapper.find('.grid-add-row');

            // Check if the add button is found
            if (lAddButton.length > 0) {
                
                //Add a new click event to the Add Row Button
                lAddButton.on('click', function() {
                    setTimeout(function() {
                        var lTransformerType = frm.doc.transformer_type;
                        var lLastRow = ldChildTable.grid_rows[ldChildTable.grid_rows.length - 1];
                        //Assign the transformer_type value to it
                        lLastRow.doc.transformer_type = lTransformerType;
                        ldChildTable.refresh();
                    }, 100); // Delay to ensure the row is created
                });
            }
        }
    });
}
