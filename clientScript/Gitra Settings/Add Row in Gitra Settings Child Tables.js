frappe.ui.form.on('Gitra Settings', {
    refresh: function(frm) {
        var laChildTables = ['attributes', 'hv_voltage_setting', 'lv_voltage_setting', 'ip_protection_setting', 'losses_setting'];

        // Iterate over each child table
        laChildTables.forEach(function(iChildTableName) {
            // Get the grid object of the current child table
            var ldChildTable = frm.fields_dict[iChildTableName].grid;
            
            // Find the "Add Row" button within the current child table
            var lAddButton = ldChildTable.wrapper.find('.grid-add-row');
            
            // Attach a one-time click event handler to the "Add Row" button of the current child table
            lAddButton.one('click', function() {
                // Get the value of 'transformer_type' field of the parent DocType "Gitra Settings"
                var lTransformerType = frm.doc.transformer_type;
                
                // Get the last added row of the current child table
                var lLastRow = ldChildTable.grid_rows[ldChildTable.grid_rows.length - 1];
                
                // Set the value of 'transformer_type' field in the last added row of the current child table
                lLastRow.doc.transformer_type = lTransformerType;
                
                // Refresh the current child table to reflect changes
                ldChildTable.refresh();
            });
        });
    }
});
