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
            'type_lv', 'vector_html', 'lv_html',
            'power_lv', 'uk_lv',
            'insulation_class', 'winding_material', 
            'cooling', 'type_cooling', 'uk_hv_lv'
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
            frm.set_df_property('impedance', 'hidden', true);
            frm.set_df_property('uk_hv_lv', 'hidden', true);
        } else {
            // If other types are possible, add additional logic here
            fields_to_toggle.forEach(field => {
                frm.toggle_display(field, true);
            });
            frm.set_df_property('vector_group', 'hidden', false);
        }
    },
    thdi: function(frm) {
    let is_valid = frm.doc.factory === 'SGBCZ' ? [5, 20].includes(frm.doc.thdi) : (frm.doc.thdi >= 5 && frm.doc.thdi <= 99);
    let error_message = frm.doc.factory === 'SGBCZ' ? __('Enter the THDi Value 5 or 20') : __('Enter the THDi Value between 5 and 99');

    if (!is_valid) {
        if (!frm.thdi_error_shown) {
            frappe.msgprint(error_message);
            frm.thdi_error_shown = true;
        }
        frm.set_value('thdi', '');
    } else {
        frm.thdi_error_shown = false;
    }
}


    
});
