frappe.ui.form.on('Design', {
	refresh(frm) {
	    if(frm.is_new()){
	        var doctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
            frappe.model.with_doc(doctype, doctype, function() {
                var values = frappe.model.get_list(doctype);
                // Set values from Gitra Settings to the form fields
                frm.doc.temperature_rise_gitra = values[0].temperature_rise
                frm.doc.temperature_rise_datasheet = values[0].temperature_rise
                frm.doc.temperature_rise = values[0].temperature_rise
                frm.doc.ambient_max_temperature = values[0].ambient_max_temperature
                frm.doc.max_average_temperature_per_year = values[0].max_average_temperature_per_year
                frm.doc.max_average_temperature_per_month = values[0].max_average_temperature_per_month
                frm.refresh_fields();
	        })
	    }

		// your code here
	},
	initialize_temperature_defaults(frm){
	    var doctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
            frappe.model.with_doc(doctype, doctype, function() {
                var values = frappe.model.get_list(doctype);
                // Set values from Gitra Settings to the form fields
                frm.doc.ambient_max_temperature = values[0].ambient_max_temperature
                frm.doc.max_average_temperature_per_year = values[0].max_average_temperature_per_year
                frm.doc.max_average_temperature_per_month = values[0].max_average_temperature_per_month
                frm.refresh_fields();
                frappe.msgprint('Transformer Environment Reset To Default', 'Please revisit IP Protection')
	        })
	    
	},
	calculate_temperature_rise(frm,  on_field){
	    // Function to calculate temperature rise
		var doctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(doctype, doctype, function() {
            const values = frappe.model.get_list(doctype);
            // Get the temperature difference, it cannot be negative
            var temperature_delta =  Math.max((frm.doc[on_field] - values[0][on_field]), 0);
            
            var ip_protection_rating = values[0].ip_protection_setting.find(x => x.rating === frm.doc.rating)
            //Find the next higher rating for custom rating(ie if standard rating is not found)
            if(!ip_protection_rating){
                ip_protection_rating = values[0].ip_protection_setting.find(x => x.rating > frm.doc.rating)
            }
            const ip_protection_temperature = ip_protection_rating[frm.doc.ip_protection.toLowerCase()]
            //Temperature rise datasheet will be used in datasheets. This is the data that will be shared to the customer
            //in the transformer technical datasheet.
            frm.doc.temperature_rise_datasheet = frm.doc.temperature_rise - (temperature_delta * values[0].temperature_rise_ratio)
            //Temperature rise will be used for Gitra Calculation which includes IP protection factors as well
            const temperature_delta_with_ip = ip_protection_temperature - temperature_delta
            frm.doc.temperature_rise_gitra = frm.doc.temperature_rise + (temperature_delta_with_ip * values[0].temperature_rise_ratio)
            //Harmonize the average temperatures. For eg max_average_temperature_per_year is increased by 3 degree add 3 degree
            //to max_average_temperature_per_year and ambient_max_temperature
            frm.doc.max_average_temperature_per_month = values[0].max_average_temperature_per_month + temperature_delta
            frm.doc.max_average_temperature_per_year = values[0].max_average_temperature_per_year + temperature_delta
            frm.doc.ambient_max_temperature = values[0].ambient_max_temperature + temperature_delta
            
            frm.refresh_fields();
          
        })
	    
	}, max_average_temperature_per_month(frm){
        // When the max average temperature per month field is changed
        frm.events.calculate_temperature_rise(frm, 'max_average_temperature_per_month');
    }, max_average_temperature_per_year(frm){
        // When the max average temperature per year field is changed
        frm.events.calculate_temperature_rise(frm, 'max_average_temperature_per_year');
    }, ambient_max_temperature(frm) {
        // When the ambient max temperature field is changed
        frm.events.calculate_temperature_rise(frm, 'ambient_max_temperature');
    }, ip_protection(frm) {
        // When the IP protection field is changed
        frm.events.calculate_temperature_rise(frm, 'max_average_temperature_per_year');
        
    }, temperature_rise(frm) {
        // When the temperature rise field is changed
		// Update temperature rise fields and initialize defaults
        frm.doc.temperature_rise_datasheet = frm.doc.temperature_rise;
        frm.doc.temperature_rise_gitra = frm.doc.temperature_rise;
        frm.doc.ip_protection = 'IP00';
        frm.events.initialize_temperature_defaults(frm);
    }
    
    
})