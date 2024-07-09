//In earlier, Validate the ranges for the HV and LV only,
//Now also validate the HV1 and LV1 ranges
frappe.ui.form.on('Design', {
    refresh(frm) {
        if (frm.doc.status === 'Calculation Received') {
            frm.set_read_only();
            frm.disable_save();
        }
    },

    /*
    * This function validates the min and max lValues of the given input
    * the min and max lValues are defined in the Gitra settings for a field
    * @params frm 
    * @params attribute_label field as defined in the Gitra Settings
    * @params attribute_name field in the current design for validation
    */
    validate_attribute_range(frm, attribute_label, attribute_name) {
        var lDoctype = "Gitra Settings";
        frappe.model.with_doc(lDoctype, lDoctype, function() {
            var lValues = frappe.model.get_list(lDoctype);
            var lAttribute = lValues[0].attributes.find(value => value.parameter === attribute_label);

            if (!lAttribute) {
                frappe.msgprint('Attribute not found in Gitra Settings.');
                return;
            }

            var lValue = parseFloat(frm.doc[attribute_name]);

            if (lValue < lAttribute.min || lValue > lAttribute.max) {
                frappe.msgprint("Attribute Not in Range");
            }
        });
    },

    validate_and_display_error(frm, attribute_label, attribute_name) {
        frm.events.validate_attribute_range(frm, attribute_label, attribute_name);
    },

    hv_rated_voltage(frm) {
        frm.events.validate_and_display_error(frm, 'HV Rated Voltage', 'hv_rated_voltage');
    },
    hv1(frm) {
        frm.events.validate_and_display_error(frm, 'HV1', 'hv1');
    },
    impedance(frm) {
        frm.events.validate_and_display_error(frm, 'Impedance', 'impedance');
    },

    lv_rated_voltage(frm) {
        frm.events.validate_and_display_error(frm, 'LV Rated Voltage', 'lv_rated_voltage');
    },
    lv1(frm) {
        frm.events.validate_and_display_error(frm, 'LV1', 'lv1');
    }, 
    
});
