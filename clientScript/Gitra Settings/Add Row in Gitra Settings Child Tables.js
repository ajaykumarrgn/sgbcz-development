frappe.ui.form.on('Gitra Settings', {
    refresh: function(frm) {
        $('.grid-add-row').on('click', function() {
            var child_table = frm.fields_dict['attributes'].grid;
            var row = frappe.model.add_child(frm.doc, 'Gitra Attributes', 'attributes');
                // Set any required fields in the new row
            row.transformer_type = 'DTTHZ2N';
                // Refresh the table to reflect changes
            child_table.refresh();

            
        });
        

    }
});
