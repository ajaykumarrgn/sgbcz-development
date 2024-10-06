frappe.ui.form.on('Design', {
	refresh(frm) {
	    if(frm.is_new()){
	        var lDoctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
            frappe.model.with_doc(lDoctype, lDoctype, function() {
                var laValues = frappe.model.get_list(lDoctype);
                // Set values from Gitra Settings to the form fields
                frm.doc.temperature_rise_gitra = laValues[0].temperature_rise;
                frm.doc.temperature_rise_datasheet = laValues[0].temperature_rise;
                frm.doc.temperature_rise = laValues[0].temperature_rise;
                frm.doc.ambient_max_temperature = laValues[0].ambient_max_temperature;
                frm.doc.max_average_temperature_per_year = laValues[0].max_average_temperature_per_year;
                frm.doc.max_average_temperature_per_month = laValues[0].max_average_temperature_per_month;
                //incase of duplicating the design
                //set the ip protection to 'IP00'
                frm.doc.ip_protection = 'IP00';
                frm.refresh_fields();
	        });
	    }

		// your code here
	},
	fnInitializeTemperatureDefaults(frm){
	    var lDoctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
            frappe.model.with_doc(lDoctype, lDoctype, function() {
                var laValues = frappe.model.get_list(lDoctype);
                // Set values from Gitra Settings to the form fields
                frm.doc.ambient_max_temperature = laValues[0].ambient_max_temperature;
                frm.doc.max_average_temperature_per_year = laValues[0].max_average_temperature_per_year;
                frm.doc.max_average_temperature_per_month = laValues[0].max_average_temperature_per_month;
                frm.refresh_fields();
                frappe.msgprint('Transformer Environment Reset To Default', 'Please revisit IP Protection');
	        });
	    
	},
	fnCalculateTemperatureRise(frm,  on_field){
	    // Function to calculate temperature rise
		var lDoctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(lDoctype, lDoctype, function() {
            const laValues = frappe.model.get_list(lDoctype);
            // Get the temperature difference, it cannot be negative
            var temperatureDelta =  Math.max((frm.doc[on_field] - laValues[0][on_field]), 0);
            
            var ldIpProtectionRating = laValues[0].ip_protection_setting.find(x => x.rating === frm.doc.rating);
            //Find the next higher rating for custom rating(ie if standard rating is not found)
            if(!ldIpProtectionRating){
                ldIpProtectionRating = laValues[0].ip_protection_setting.find(x => x.rating > frm.doc.rating);
            }
            const lIpProtectionTemperature = ldIpProtectionRating[frm.doc.ip_protection.toLowerCase()];
            //Temperature rise datasheet will be used in datasheets. This is the data that will be shared to the customer
            //in the transformer technical datasheet.
            frm.doc.temperature_rise_datasheet = frm.doc.temperature_rise - (temperatureDelta * laValues[0].temperature_rise_ratio);
            //Temperature rise will be used for Gitra Calculation which includes IP protection factors as well
            const lTemperatureDeltaWithIp = lIpProtectionTemperature - temperatureDelta;
            frm.doc.temperature_rise_gitra = frm.doc.temperature_rise + (lTemperatureDeltaWithIp * laValues[0].temperature_rise_ratio);
            //Harmonize the average temperatures. For eg max_average_temperature_per_year is increased by 3 degree add 3 degree
            //to max_average_temperature_per_year and ambient_max_temperature
            frm.doc.max_average_temperature_per_month = laValues[0].max_average_temperature_per_month + temperatureDelta;
            frm.doc.max_average_temperature_per_year = laValues[0].max_average_temperature_per_year + temperatureDelta;
            frm.doc.ambient_max_temperature = laValues[0].ambient_max_temperature + temperatureDelta;
            
            frm.refresh_fields();
          
        });
	    
	}, max_average_temperature_per_month(frm){
        // When the max average temperature per month field is changed
        frm.events.fnCalculateTemperatureRise(frm, 'max_average_temperature_per_month');
    }, max_average_temperature_per_year(frm){
        // When the max average temperature per year field is changed
        frm.events.fnCalculateTemperatureRise(frm, 'max_average_temperature_per_year');
    }, ambient_max_temperature(frm) {
        // When the ambient max temperature field is changed
        frm.events.fnCalculateTemperatureRise(frm, 'ambient_max_temperature');
    }, ip_protection(frm) {
        // When the IP protection field is changed
        frm.events.fnCalculateTemperatureRise(frm, 'max_average_temperature_per_year');
        
    }, temperature_rise(frm) {
        // When the temperature rise field is changed
		// Update temperature rise fields and initialize defaults
        frm.doc.temperature_rise_datasheet = frm.doc.temperature_rise;
        frm.doc.temperature_rise_gitra = frm.doc.temperature_rise;
        frm.doc.ip_protection = 'IP00';
        frm.events.fnInitializeTemperatureDefaults(frm);
    }
    
    
});