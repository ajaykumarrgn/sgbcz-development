frappe.ui.form.on('Design', {
    onload: function(frm) {
        // Setting default values on both factory and transformer type.
        frm.set_value('factory', 'SGBCZ');
        frm.set_value('transformer_type', 'DTTHZ2N');
        frm.trigger('toggle_fields');
    },

    refresh: function(frm) {
        frm.trigger('toggle_fields');
    },
    
    // When the value of 'transformer_type' field changes
    transformer_type: function(frm) {
        frm.trigger('toggle_fields');
    },
    //Toggling the fields based on the transformer type
    toggle_fields: function(frm) {
        const fields_to_toggle = [
            'bushing_hv', 'type_lv', 'vector_html', 'lv_html',
            'power_lv', 'uk_lv', 'ukhv_lv',
            'insulation_class', 'winding_material',
            'cooling', 'type_cooling'
        ];

        //If the transformer type is DTTHZ2N, the above mention toggle fields is not visible 
        //Show all the fields to the other transformers except DTTHZ2N 
        if (frm.doc.transformer_type === 'DTTHZ2N') {
            fields_to_toggle.forEach(field => {
                frm.toggle_display(field, false);
            });
            frm.set_df_property('vector_group', 'hidden', false);
            frm.set_df_property('lv_rated_voltage', 'hidden', false);
        } else if (frm.doc.transformer_type === 'DTTH2N') {
            fields_to_toggle.forEach(field => {
                frm.toggle_display(field, true);
            });
            //frm.set_df_property('vector_html', 'hidden', true);
            frm.set_df_property('lv_rated_voltage', 'hidden', true);
        } else {
            // If other types are possible, add additional logic here
            fields_to_toggle.forEach(field => {
                frm.toggle_display(field, true);
            });
            frm.set_df_property('vector_group', 'hidden', false);
        }
    },
});
