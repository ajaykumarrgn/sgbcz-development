frappe.ui.form.on('Design', {
	refresh(frm) {
		if (frm.doc.status === 'Calculation Received') {
            // Disable all fields on the form
            //frm.set_read_only();
            //frm.disable_save();
        }
	},

	/*
	* This function is validate the min and max values of the given input
	* the min and max values are defined in the Gitra settings for a field
	* @params frm 
	* @params attribute_label field as defined in the Gitra Settings
	* @params attribute_name field in the current design for validation
	*/
	validate_attribute_range(frm, attribute_label, attribute_name){

        var doctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(doctype, doctype, function() {
            // Then from the model get the list. This will return all attributes of the model including child table
            var values = frappe.model.get_list(doctype);
            // Find the specific attribute based on the attribute_label
            var attribute = values[0].attributes.find(value => value.parameter === attribute_label)
            // Check if the attribute value is within the specified range and display an error message if it is not.
            if(frm.doc[attribute_name] < attribute.min || frm.doc[attribute_name] > attribute.max){
                frappe.msgprint(attribute_label, 'Attribute not in Range')
            }
            })
	},
	hv_rated_voltage(frm){
	    // Get the Gitra Settings
	    // Gitra Settings is a single doctype and must retrieved using the following ways
	   frm.events.validate_attribute_range(frm, 'HV Rated Voltage', 'hv_rated_voltage')
	},
	impedance(frm){
	    // Get the Gitra Settings
	    // Gitra Settings is a single doctype and must retrieved using the following ways
	   frm.events.validate_attribute_range(frm, 'Impedance', 'impedance')
	},
	lv_rated_voltage(frm){
	    // Get the Gitra Settings
	    // Gitra Settings is a single doctype and must retrieved using the following ways
	   frm.events.validate_attribute_range(frm, 'LV Rated Voltage', 'lv_rated_voltage')
	},
	
})