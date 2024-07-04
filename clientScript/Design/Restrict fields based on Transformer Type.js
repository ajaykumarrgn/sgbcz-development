frappe.ui.form.on('Design', {
    onload: function(frm) {
        if (frm.is_new()) {
            frm.set_value('factory', 'SGBCZ');
            frm.set_value('transformer_type', 'DTTHZ2N');
            frm.fields_dict['lv_rated_voltage'].df.label = 'LV Value(V)';
           if (frm.doc.factory === 'SGBCZ') {
                frm.set_df_property('lv_rated_voltage', 'reqd', true);
            }

        }
        frm.trigger('toggle_fields');
    },
    
    factory: function(frm) {
        reset_values(frm);
        
        switch (frm.doc.factory) {
            case 'SGBCZ':
                frm.set_df_property('lv_rated_voltage', 'reqd', true);
               
                frm.set_value('transformer_type', 'DTTHZ2N');
                break;
            case 'RGB':
            case 'NEU':
                frm.set_df_property('lv_rated_voltage', 'reqd', false);
                frm.set_value('transformer_type', frm.doc.factory === 'RGB' ? 'DTTH2N' : 'DOTML');
                break;
        }
        
        frm.trigger('toggle_fields');
        frm.trigger('update_insulation_class_options');
    },
    
    refresh: function(frm) {
        frm.trigger('update_insulation_class_options');
        frm.trigger('toggle_fields');
    },

    update_insulation_class_options: function(frm) {
        let options = [];
        switch (frm.doc.factory) {
            case 'RGB':
                options = ['F', 'H'];
                break;
            case 'NEU':
                options = ['A', 'B', 'C', 'F', 'H'];
                break;
        }
        frm.set_df_property('insulation_class', 'options', options);
    },
    
    toggle_fields: function(frm) {
        const fields = [
            'vector_html', 'power_lv', 'uk_lv', 'uk_hv_lv', 'lv_html',
            'insulation_class', 'winding_material', 'cooling_method', 'type_cooling',
            'impedance', 'lv_rated_voltage', 'bushing_hv', 'cooling_method',
            'type_cooling', 'temperature_rise', 'temperature_rise_oil',
            'temperature_rise_winding', 'climatic_class', 'environmental_class',
            'temperature_rise_datasheet', 'temperature_rise_gitra'
        ];

        fields.forEach(field => frm.toggle_display(field, false));

        let showFields = [];
        switch (frm.doc.factory) {
            case 'SGBCZ':
                showFields = ['vector_group', 'impedance', 'lv_rated_voltage',
                              'temperature_rise', 'climatic_class', 'environmental_class',
                              'temperature_rise_datasheet', 'temperature_rise_gitra'];
                break;
            case 'RGB':
                showFields = fields.filter(field => !['lv_rated_voltage', 'bushing_hv',
                                                      'cooling_method', 'type_cooling',
                                                      'uk_hv_lv', 'temperature_rise_oil',
                                                      'temperature_rise_winding',
                                                      'temperature_rise_datasheet',
                                                      'temperature_rise_gitra'].includes(field));
                showFields.push('temperature_rise');
                break;
            case 'NEU':
                showFields = fields.filter(field => !['lv_rated_voltage', 'uk_lv',
                                                      'impedance', 'temperature_rise',
                                                      'climatic_class', 'environmental_class',
                                                      'temperature_rise_datasheet',
                                                      'temperature_rise_gitra'].includes(field));
                showFields.push('temperature_rise_oil', 'temperature_rise_winding');
                break;
        }

        showFields.forEach(field => frm.toggle_display(field, true));

        if (frm.doc.factory === 'RGB' && frm.doc.lv_2) {
            frm.toggle_display('uk_hv_lv', false);
            frm.toggle_display('impedance', false);
        }
    },
    
    is_design: function(frm) {
        if (frm.doc.is_design) {
            frm.set_value('thdi', '5');
        }
    },

    thdi: function(frm) {
        let thdiValue = Number(frm.doc.thdi);
        if (!frm.doc.thdi) return;

        if (frm.doc.is_design) {
            if (![5, 20].includes(thdiValue)) {
                  
                frappe.throw('Enter the THDi Value as 5 or 20');
            }
        } else {
            if (thdiValue < 5 || thdiValue > 99) {
                frappe.throw('Enter a THDi value between 5 and 99');
            }
        }
    },

    validate: function(frm) {
        if (frm.doc.factory === 'SGBCZ' && !frm.doc.lv_rated_voltage) {
            frappe.msgprint('LV Value is mandatory');
            frappe.validated = false; 
            return;
        }
        if (frm.doc.factory === 'RGB' && frm.doc.lv_2 && (!frm.doc.power_lv1 || !frm.doc.power_lv2)) {
            frappe.msgprint('Please enter both Rating LV1 and Rating LV2 for RGB');
            frappe.validated = false;
            return;
        } else if (frm.doc.factory === 'RGB' && frm.doc.lv_2 && (!frm.doc.uk_lv1 || !frm.doc.uk_lv2)) {
            frappe.msgprint('Please enter both UK LV1 and UK LV2 for RGB');
            frappe.validated = false;
            return;
        }
        
        if (frm.doc.factory === 'NEU' && frm.doc.lv_2 && (!frm.doc.power_lv1 || !frm.doc.power_lv2)) {
            frappe.msgprint('Please enter both Rating LV1 and Rating LV2 for RGB');
            frappe.validated = false;
            return;
        } else if (frm.doc.factory === 'NEU' && frm.doc.lv_2 && (!frm.doc.ukhv_lv1 || !frm.doc.ukhv_lv2)) {
            frappe.msgprint('Please enter both UK HV LV1 and UK HV LV2');
            frappe.validated = false;
            return;
        } 

        frappe.validated = true; // If all validations pass
    }
});

function reset_values(frm) {
    frm.set_value('lv_rated_voltage', '');
    frm.set_value('highest_operation_voltage_hv', '');
    frm.set_value('ac_phase_hv', '');
    frm.set_value('li_phase_hv', '');
    let hvHtmlInput = $(frm.fields_dict.hv_html.wrapper).find('input');
    hvHtmlInput.val('');
    let lvHtmlInput = $(frm.fields_dict.lv_html.wrapper).find('input');
    lvHtmlInput.val('');
}