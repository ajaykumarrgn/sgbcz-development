frappe.ui.form.on('Design', {
    onload: function(frm) {
        // Setting default values on form load
        frm.set_value('factory', 'SGBCZ');
        frm.set_value('transformer_type', 'DTTHZ2N');
        frm.trigger('toggle_fields');
    },

    refresh: function(frm) {
        frm.trigger('toggle_fields');
    },

    transformer_type: function(frm) {
        frm.trigger('toggle_fields');
    },

    toggle_fields: function(frm) {
        const fields_to_toggle = [
            'bushing_hv', 'type_lv', 'vector_html', 'lv_html',
            'power_lv', 'uk_lv', 'uk_hv_lv',
            'insulation_class', 'winding_material',
            'cooling', 'type_cooling'
        ];

        console.log('Transformer Type:', frm.doc.transformer_type);

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
            frm.set_df_property('vector_html', 'hidden', true);
            frm.set_df_property('lv_rated_voltage', 'hidden', true);
        } else {
            // If other types are possible, add additional logic here
            fields_to_toggle.forEach(field => {
                frm.toggle_display(field, true);
            });
            frm.set_df_property('vector_group', 'hidden', false);
        }
    },

    validate: function(frm) {
        // Validation logic for power_lv2
        if (frm.doc.transformer_type === 'DTTH2N' && frm.doc.lv_2) {
            let errors = false; 
        
            if (!frm.doc.power_lv2) {
                frappe.msgprint(__('Power LV2 is missing. Please enter a value in the format "Power LV1/Power LV2".'));
                errors = true;
            }
            else if (!frm.doc.uk_lv2) {
                frappe.msgprint(__('UK LV2 is missing. Please enter a value in the format "UK LV1/UK LV2".'));
                errors = true;
            }
            else if (!frm.doc.ukhv_lv2) {
                frappe.msgprint(__('UK HV LV2 is missing. Please enter a value in the format "UK HV LV1/UK HV LV2".'));
                errors = true;
            }
            else if (!frm.doc.vector_group_lv1) {
                frappe.msgprint(__('Vector Group 1 is missing'));
                frm.set_value('vector_html', '');  
                errors = true;
            }
        
            if (errors) {
                frappe.validated = false; 
            }
        }
    }
});
