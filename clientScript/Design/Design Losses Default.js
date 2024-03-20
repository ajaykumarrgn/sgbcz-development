frappe.ui.form.on('Design', {
    /*
	* This function is to compute the custom losses
	* @params frm 
	* @params losses_setting field as defined in the Gitra Settings
	*/
    compute_custom_losses(frm, losses_setting){
        //Sort Rating as integer as Rating is defined as Data in Rating Doctype
        losses_setting.sort((a, b) => {
        const numA = parseInt(a.rating, 10);
        const numB = parseInt(b.rating, 10);

        if (numA < numB) {
            return -1;
        }
        if (numA > numB) {
            return 1;
        }
          return 0;
        });
        const rating_int = parseInt(frm.doc.rating, 10);
        const index = losses_setting.findIndex(x => parseInt(x.rating,10) > rating_int);
        const rating_losses_higher = losses_setting[index];
        const rating_losses_lower = losses_setting[index-1];
        //just copy the lower rating values to get all the fields copied
        //also we need take the noises from lower design
        var custom_losses = {};
        
        const arithmatic_average = (frm.doc.rating - rating_losses_lower.rating)
                                        /
                                    (rating_losses_higher.rating - rating_losses_lower.rating);
        // Compute the custom losses
        custom_losses.no_load_loss =    Math.round(rating_losses_lower.no_load_loss 
                                            + 
                                        arithmatic_average*(rating_losses_higher.no_load_loss - rating_losses_lower.no_load_loss));
        custom_losses.load_loss =   Math.round(rating_losses_lower.load_loss 
                                        + 
                                    arithmatic_average*(rating_losses_higher.load_loss - rating_losses_lower.load_loss));
        custom_losses.rating = frm.doc.rating;
        custom_losses.lwa = rating_losses_lower.lwa;
        custom_losses.lpa_distance = rating_losses_lower.lpa_distance;
        custom_losses.lpa = rating_losses_lower.lpa;
        return custom_losses;
    },
    /*
    * This function retrieves the standard losses from Gitra Settings or computes custom losses if not found
    * @params frm 
    */
    get_standard_losses(frm,refresh_all_fields,field_for_validation,settings_field){
         var doctype = "Gitra Settings";
        // Initialize the model with doctype Gitra Settings
            frappe.model.with_doc(doctype, doctype, function() {
                const values = frappe.model.get_list(doctype);
                var rating_losses = values[0].losses_setting.find(x => x.rating === frm.doc.rating);
               
                if(rating_losses){
                    
                } else {
                    // Calculate custom_losses if rating_losses not found
                    const custom_losses = frm.events.compute_custom_losses(frm, values[0].losses_setting);
                    rating_losses = custom_losses;
                }
                
                if(refresh_all_fields){
                    frm.doc.no_load_loss_guarantee = rating_losses.no_load_loss;
                    frm.doc.lpa = rating_losses.lpa;
                    frm.doc.load_loss_guarantee = rating_losses.load_loss;
                    frm.doc.lpa_distance = rating_losses.lpa_distance;
                    frm.doc.lwa = rating_losses.lwa;
                }
                if(frm.doc[field_for_validation]>rating_losses[settings_field]){
                    //Format string to Camel Case(Like This String)
                    var formatted_field = field_for_validation.replace(/_/g, ' ').replace(/\b\w/g, function(match){
                        return match.toUpperCase();
                    });
                    const message_string = 'Value higher than (' + rating_losses[settings_field] +')' + ' Not Allowed';
                    frappe.msgprint(message_string, formatted_field);
                    //Restore back the field to maximum value
                    frm.doc[field_for_validation]=rating_losses[settings_field];
                }
                frm.refresh_fields();
	        });
        
    },
    
	refresh(frm) {
		if(frm.is_new()){
	        // Call get_standard_losses function on refresh if form is new
		    frm.events.get_standard_losses(frm,true);
	    }
	    if(frm.doc.lwa!==''){
	        frm.doc.lpa = '0';
	        frm.doc.lpa_distance = '0';
	        //frm.toggle_enable("lpa", false); //to make field readonly or editable
	        //frm.toggle_enable("lpa_distance", false); //to make field readonly or editable
	    }else{
	        frm.doc.lwa = '0';
	        frm.doc.lpa_distance = '1';
	    }
	},
	rating(frm){
	   //Call get_standard_losses function on rating field change
	    frm.events.get_standard_losses(frm,true);
	},
	no_load_loss_guarantee(frm){
	    frm.events.get_standard_losses(frm,false,'no_load_loss_guarantee','no_load_loss'); 
	},
	load_loss_guarantee(frm){
	    frm.events.get_standard_losses(frm,false,'load_loss_guarantee','load_loss'); 
	},
	lwa(frm){
	    frm.events.get_standard_losses(frm,false,'lwa','lwa'); 
	    if(frm.doc.lwa!==''){
	        frm.doc.lpa = '0';
	        frm.doc.lpa_distance = '0';
	        frm.refresh_fields();
	        //frm.toggle_enable("lpa", false); //to make field readonly or editable
	        //frm.toggle_enable("lpa_distance", false); //to make field readonly or editable
	    }
	},
	lpa(frm){
	    if(frm.doc.lpa!=='0'){
	        frm.doc.lwa = '0';
	        frm.doc.lpa_distance = '1';
	        frm.refresh_fields();
	        //frm.toggle_enable("lwa", false); //to make field readonly or editable
	       // frm.toggle_enable("lpa_distance", false); //to make field readonly or editable
	    }
	}
	
});