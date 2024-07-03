frappe.ui.form.on('Design', {
    refresh(frm) {
        if (frm.doc.status === 'Calculation Received') {
            frm.set_read_only();
            frm.disable_save();
        }
    },

    /*
    * This function validates the min and max values of the given input
    * the min and max values are defined in the Gitra settings for a field
    * @params frm 
    * @params attribute_label field as defined in the Gitra Settings
    * @params attribute_name field in the current design for validation
    */
    validate_attribute_range(frm, attribute_label, attribute_name) {
        var doctype = "Gitra Settings";
        frappe.model.with_doc(doctype, doctype, function() {
            var values = frappe.model.get_list(doctype);
            var attribute = values[0].attributes.find(value => value.parameter === attribute_label);

            if (!attribute) {
                frappe.msgprint('Attribute not found in Gitra Settings.');
                return;
            }

            var value = parseFloat(frm.doc[attribute_name]);

            if (value < attribute.min || value > attribute.max) {
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
