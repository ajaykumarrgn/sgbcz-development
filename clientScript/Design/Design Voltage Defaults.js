frappe.ui.form.on('Design', {

	refresh(frm) {
	    
    	    var doctype = "Gitra Settings";
    	    // Initialize the model with doctype Gitra Settings
            frappe.model.with_doc(doctype, doctype, function() {
                // Then from the model get the list. This will return all attributes of the model including child table    
                var values = frappe.model.get_list(doctype);
                // Extract unique values from the "lv_voltage_setting" child table
                const uniqueArray = values[0].lv_voltage_setting.reduce((accumulator, current) => {
                    if (!accumulator) {
                        accumulator = [];
                    }
                    // Check if the 'um' value is not already in the accumulator array
                    if (!accumulator.find(x => x === current.um)){accumulator.push(current.um);}
                        return accumulator;
                }, []);
                //Set the options everytime we load the document otherwise document will show empty values
                //for highest_operation_voltage_lv, ac_phase_lv and li_phase_lv when we load the docuemnt next time
                set_field_options("highest_operation_voltage_lv", uniqueArray)
                frm.events.set_hv_options(frm, 'voltage_to', 'hv_rated_voltage', 'um', 'highest_operation_voltage_hv', false);
                frm.events.set_hv_options(frm, 'um', 'highest_operation_voltage_hv', 'ac_phase', 'ac_phase_hv', false);
                frm.events.set_hv_options(frm, 'ac_phase', 'ac_phase_hv', 'li', 'li_phase_hv',false);
                //Set the options for ac phase 
                frm.events.highest_operation_voltage_lv(frm)
                //Set the options for li phase also
                frm.events.ac_phase_lv(frm);
                if(frm.is_new()){
                    // Set default values if the document is new
                    var lv_defaults = values[0].lv_voltage_setting.find(x => x.is_default === 1)
                    if(lv_defaults){
                        frm.doc.highest_operation_voltage_lv = lv_defaults.um
                        frm.doc.ac_phase_lv = lv_defaults.ac_phase
                        frm.doc.li_phase_lv = lv_defaults.li
                    }
                }
                frm.refresh_fields();
                
            });
	},
	//The following dynamic function is to set the options to the HV fields of Design based on the Gitra HV Calculation 
	//And the entered value for fields of HV For eg if HV Rated Voltage is entered as 3700 then options for 
	//Highest Operating voltage HV(Um) will be set as 7.2, 12, 17.5 and 24.
	//
	set_hv_options(frm, on_settings_field, on_field, to_settings_field, to_field,on_change){
	    var doctype = "Gitra Settings";
	    // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(doctype, doctype, function() {
            // Then from the model get the list. This will return all attributes of the model including child table    
            var values = frappe.model.get_list(doctype);
            var options = [];
            //Get all ums for voltage to equal to higher than the entered hv rated voltage 
            values[0].hv_voltage_setting.forEach(hv_row => {
                if (hv_row[on_settings_field] >=frm.doc[on_field]) {
                    options.push(hv_row[to_settings_field]);
                }
            });
            //set the options for to field from values obtained from above step
            set_field_options(to_field, options);
            
            //set the first value of option to the field only in case of on change of its dependant field
            //For already saved values do not change the field value
            if(on_change){
                frm.doc[to_field] = options[0];
            }
            frm.refresh_fields();
        }); 
	},
	hv_rated_voltage(frm){
	    //on change of HV Rated Voltage set the options for Highest Operating voltage HV(Um) based on Gitra settings
	    frm.events.set_hv_options(frm, 'voltage_to', 'hv_rated_voltage', 'um', 'highest_operation_voltage_hv',true);
	},
	highest_operation_voltage_hv(frm){
	    //on change of Highest Operating voltage HV(Um) set the options for Ac Phase HV
	    frm.events.set_hv_options(frm, 'um', 'highest_operation_voltage_hv', 'ac_phase', 'ac_phase_hv',true);
	},
	ac_phase_hv(frm){
	    //on change of Ac Phase set the options for LI Phase HV
	    frm.events.set_hv_options(frm, 'ac_phase', 'ac_phase_hv', 'li', 'li_phase_hv',true);
	},
	lv_rated_voltage(frm){
	    
	},
	highest_operation_voltage_lv(frm){
	    var doctype = "Gitra Settings";
	    // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(doctype, doctype, function() {
            //Then from the model get the list. This will return all attributes of the model including child table    
            const values = frappe.model.get_list(doctype);
            const uniqueArray = values[0].lv_voltage_setting.reduce((accumulator, current) => {
                if (!accumulator) {
                    accumulator = [];
                }
                // Check if the current voltage matches the highest operation voltage
                if(current.um.toString()===frm.doc.highest_operation_voltage_lv.toString()){
                    // Check if the current AC phase is not already in the accumulator
                    if (!accumulator.find(x => x === current.ac_phase)){accumulator.push(current.ac_phase);}
                }
                return accumulator;
            }, []);
            // Set field options for the AC phase based on the uniqueArray
            set_field_options("ac_phase_lv", uniqueArray)

        }) 
	},
	ac_phase_lv(frm){
	    var doctype = "Gitra Settings";
	    // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(doctype, doctype, function() {
            //Then from the model get the list. This will return all attributes of the model including child table    
            const values = frappe.model.get_list(doctype);
            const uniqueArray = values[0].lv_voltage_setting.reduce((accumulator, current) => {
                if (!accumulator) {
                    accumulator = [];
                }
                // Check if the highest_operation_voltage_lv and ac_phase_lv match the selected values
                if(current.um.toString()===frm.doc.highest_operation_voltage_lv.toString() && 
                    current.ac_phase.toString()===frm.doc.ac_phase_lv.toString()){
                    // Check if the current LI phase is not already in the accumulator
                    if (!accumulator.find(x => x === current.li)){accumulator.push(current.li);}
                }
                return accumulator;
            }, []);
            // Set field options for the LI phase based on the uniqueArray
            set_field_options("li_phase_lv", uniqueArray);

        }); 
	    
	}
	
});