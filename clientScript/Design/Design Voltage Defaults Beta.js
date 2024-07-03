//Settindg the default dependent value for HV1 #(Story: US-2024-0044)
frappe.ui.form.on('Design', {
    
    refresh(frm) {
        
        var l_doctype = "Gitra Settings";
        
        // Fetch Gitra Settings document asynchronously
        frappe.model.with_doc(l_doctype, l_doctype, function() {
            // Get list of documents for Gitra Settings
            var la_values = frappe.model.get_list(l_doctype);

            // Initialize LV settings
            const la_lvUniqueArray = la_values[0].lv_voltage_setting.reduce((ld_accumulator, ld_current) => {
                // Reduce function to filter unique LV voltage values
                if (!ld_accumulator.includes(ld_current.um)) {
                    ld_accumulator.push(ld_current.um);
                }
                return ld_accumulator;
            }, []);
            set_field_options("highest_operation_voltage_lv", la_lvUniqueArray);
            frm.events.highest_operation_voltage_lv(frm);
            frm.events.ac_phase_lv(frm);

            // Initialize HV settings 
            frm.events.set_hv_options(frm, 'voltage_to', 'hv_rated_voltage', 'um', 'highest_operation_voltage_hv', false);
            frm.events.set_hv_options(frm, 'um', 'highest_operation_voltage_hv', 'ac_phase', 'ac_phase_hv', false);
            frm.events.set_hv_options(frm, 'ac_phase', 'ac_phase_hv', 'li', 'li_phase_hv', false);

            // Set defaults if new document
            if (frm.is_new()) {
                fn_set_lv_defaults(frm, la_values[0]);
                fn_set_hv_defaults(frm, la_values[0]);
            }
            frm.refresh_fields();
        });
    },

    // Function to set HV options based on selected criteria
    set_hv_options(frm, on_settings_field, on_field, to_settings_field, to_field, on_change) {
        // Local variable for the Gitra Settings doctype
        var l_doctype = "Gitra Settings";
        
        // Fetch Gitra Settings document asynchronously
        frappe.model.with_doc(l_doctype, l_doctype, function() {
            // Get list of documents for Gitra Settings
            var la_values = frappe.model.get_list(l_doctype);
            var la_options = [];

            // Iterate through HV voltage settings
            la_values[0].hv_voltage_setting.forEach(ld_hv_row => {
                // Filter options based on specified criteria
                if (ld_hv_row[on_settings_field] >= frm.doc[on_field]) {
                    la_options.push(ld_hv_row[to_settings_field]);
                }
            });

            // Set field options and handle change event
            set_field_options(to_field, la_options);
            if (on_change && la_options.length > 0) {
                frm.set_value(to_field, la_options[0]);
            }
            frm.refresh_fields();
        });
    },

    // Function to set HV defaults based on selected field
    set_hv_defaults(frm, hv_field) {
        frm.events.set_hv_options(frm, 'voltage_to', hv_field, 'um', 'highest_operation_voltage_hv', true);
        frm.events.set_hv_options(frm, 'um', 'highest_operation_voltage_hv', 'ac_phase', 'ac_phase_hv', true);
        frm.events.set_hv_options(frm, 'ac_phase', 'ac_phase_hv', 'li', 'li_phase_hv', true);
    },

    // Function to handle change in HV rated voltage field
    hv_rated_voltage(frm) {
        if (!frm.doc.hv_rated_voltage) return;
        frm.events.set_hv_defaults(frm, 'hv_rated_voltage');
    },

    // Function to handle change in HV1 field
    hv1(frm) {
        if (!frm.doc.hv1) return;
        frm.events.set_hv_defaults(frm, 'hv1');
    },

    // Function to handle change in highest operation voltage HV field
    highest_operation_voltage_hv(frm) {
        if (!frm.doc.highest_operation_voltage_hv) return;
        frm.events.set_hv_options(frm, 'um', 'highest_operation_voltage_hv', 'ac_phase', 'ac_phase_hv', true);
    },

    // Function to handle change in AC phase HV field
    ac_phase_hv(frm) {
        if (!frm.doc.ac_phase_hv) return;
        frm.events.set_hv_options(frm, 'ac_phase', 'ac_phase_hv', 'li', 'li_phase_hv', true);
    },

    // Function to handle change in highest operation voltage LV field
    highest_operation_voltage_lv(frm) {
        // Local variable for the Gitra Settings doctype
        var l_doctype = "Gitra Settings";
        
        // Fetch Gitra Settings document asynchronously
        frappe.model.with_doc(l_doctype, l_doctype, function() {
            // Get list of documents for Gitra Settings
            const la_values = frappe.model.get_list(l_doctype);

            // Filter LV phase values based on selected criteria
            // const la_uniqueArray = la_values[0].lv_voltage_setting.reduce((ld_accumulator, ld_current) => {
            //     if (ld_current.um.toString() === frm.doc.highest_operation_voltage_lv.toString() && 
                
            //         !ld_accumulator.includes(ld_current.ac_phase)) {
            //         ld_accumulator.push(ld_current.ac_phase);
            //     }
            //     return ld_accumulator;
            // }, []);
            const la_uniqueArray = la_values[0].lv_voltage_setting.reduce((ld_accumulator, ld_current) => {
                if (ld_current.um && frm.doc.highest_operation_voltage_lv && 
                    ld_current.um.toString() === frm.doc.highest_operation_voltage_lv.toString() && 
                    !ld_accumulator.includes(ld_current.ac_phase)) {
                    
                    ld_accumulator.push(ld_current.ac_phase);
                }
                return ld_accumulator;
            }, []);
            set_field_options("ac_phase_lv", la_uniqueArray);
        });
    },

    // Function to handle change in AC phase LV field
    ac_phase_lv(frm) {
        // Local variable for the Gitra Settings doctype
        var l_doctype = "Gitra Settings";
        
        // Fetch Gitra Settings document asynchronously
        frappe.model.with_doc(l_doctype, l_doctype, function() {
            // Get list of documents for Gitra Settings
            const la_values = frappe.model.get_list(l_doctype);

            // Filter LV LI phase values based on selected criteria
            // const la_uniqueArray = la_values[0].lv_voltage_setting.reduce((ld_accumulator, ld_current) => {
            //     if (ld_current.um.toString() === frm.doc.highest_operation_voltage_lv.toString() && 
            //         ld_current.ac_phase.toString() === frm.doc.ac_phase_lv.toString() &&
            //         !ld_accumulator.includes(ld_current.li)) {
            //         ld_accumulator.push(ld_current.li);
            //     }
            //     return ld_accumulator;
            // }, []);
            const la_uniqueArray = la_values[0].lv_voltage_setting.reduce((ld_accumulator, ld_current) => {
                if (
                    ld_current.um && frm.doc.highest_operation_voltage_lv && 
                    ld_current.ac_phase && frm.doc.ac_phase_lv && 
                    ld_current.um.toString() === frm.doc.highest_operation_voltage_lv.toString() && 
                    ld_current.ac_phase.toString() === frm.doc.ac_phase_lv.toString() &&
                    !ld_accumulator.includes(ld_current.li)
                ) {
                    ld_accumulator.push(ld_current.li);
                }
                return ld_accumulator;
            }, []);

            set_field_options("li_phase_lv", la_uniqueArray);
        });
    }
});

// Function to set LV defaults based on selected settings
function fn_set_lv_defaults(frm, settings) {
    var ld_lvDefaults = settings.lv_voltage_setting.find(ld_x => ld_x.is_default === 1);
    if (ld_lvDefaults) {
        frm.set_value('highest_operation_voltage_lv', ld_lvDefaults.um);
        frm.set_value('ac_phase_lv', ld_lvDefaults.ac_phase);
        frm.set_value('li_phase_lv', ld_lvDefaults.li);
    }
}

// Function to set HV defaults based on selected settings
function fn_set_hv_defaults(frm, settings) {
    var ld_hvDefaults = settings.hv_voltage_setting.find(ld_x => ld_x.is_default === 1);
    if (ld_hvDefaults) {
        frm.set_value('hv_rated_voltage', ld_hvDefaults.voltage_to);
        frm.set_value('highest_operation_voltage_hv', ld_hvDefaults.um);
        frm.set_value('ac_phase_hv', ld_hvDefaults.ac_phase);
        frm.set_value('li_phase_hv', ld_hvDefaults.li);
    }
}
