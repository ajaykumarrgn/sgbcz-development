frappe.ui.form.on('Gitra Settings', {
    refresh: function(frm) {
        var fieldsToCheck = ['attributes', 'hv_voltage_setting', 'lv_voltage_setting', 'ip_protection_setting', 'losses_setting'];
        for (var i = 0; i < fieldsToCheck.length; i++) {
            hideRows(frm, fieldsToCheck[i]);
        }
    },
    transformer_type: function(frm) {
        var fieldsToCheck = ['attributes', 'hv_voltage_setting', 'lv_voltage_setting', 'ip_protection_setting', 'losses_setting'];
        for (var i = 0; i < fieldsToCheck.length; i++) {
            hideRows(frm, fieldsToCheck[i]);
        }
    }
});

function hideRows(frm, fieldName) {
    var transformerType = frm.fields_dict.transformer_type.value;
    var grid = frm.fields_dict[fieldName].grid;

    // Check if the grid object and grid_rows property are defined
    if (grid && grid.grid_rows) {
        // Iterate through each grid row
        grid.grid_rows.forEach(function(row) {
            // Check if the row and row.doc are defined
            if (row && row.doc) {
                // Get the value of the 'transformer_type' field in the current row
                var transType = row.doc.transformer_type;

                // Check if the transformer_type is not equal to 'DTTH2N'
                if (transType !== transformerType) {
                    // If not equal, hide the row
                    row.wrapper.hide(true);
                } else {
                    // Otherwise, show the row
                    row.wrapper.show(true);
                }
            }
        });
    }
};
