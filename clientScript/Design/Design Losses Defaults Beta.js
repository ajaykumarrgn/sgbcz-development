frappe.ui.form.on('Design', {
    /*
	* This function is to compute the custom losses
	* @params frm 
	* @params losses_setting field as defined in the Gitra Settings
	*/
    compute_custom_losses(frm, losses_setting) {
        // Sort Rating as integer as Rating is defined as Data in Rating Doctype
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
        const index = losses_setting.findIndex(x => parseInt(x.rating, 10) > rating_int);
        const rating_losses_higher = losses_setting[index];
        const rating_losses_lower = losses_setting[index - 1];

        // Compute the custom losses
        var custom_losses = {
            no_load_loss: Math.round(rating_losses_lower.no_load_loss + (rating_int - rating_losses_lower.rating) * (rating_losses_higher.no_load_loss - rating_losses_lower.no_load_loss) / (rating_losses_higher.rating - rating_losses_lower.rating)),
            load_loss: Math.round(rating_losses_lower.load_loss + (rating_int - rating_losses_lower.rating) * (rating_losses_higher.load_loss - rating_losses_lower.load_loss) / (rating_losses_higher.rating - rating_losses_lower.rating)),
            rating: frm.doc.rating,
            lwa: rating_losses_lower.lwa,
            lpa_distance: rating_losses_lower.lpa_distance,
            lpa: frm.doc.lpa 
        };

        return custom_losses;
    },

    /*
    * This function retrieves the standard losses from Gitra Settings or computes custom losses if not found
    * @params frm 
    */
    get_standard_losses(frm, refresh_all_fields, field_for_validation, settings_field) {
        var doctype = "Gitra Settings";
        
        // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(doctype, doctype, function () {
            const values = frappe.model.get_list(doctype);
            var rating_losses = values[0].losses_setting.find(x => x.rating === frm.doc.rating);

            if (!rating_losses) {
                // Calculate custom_losses if rating_losses not found
                const custom_losses = frm.events.compute_custom_losses(frm, values[0].losses_setting);
                rating_losses = custom_losses;
            }

            if (refresh_all_fields) {
                frm.doc.no_load_loss_guarantee = rating_losses.no_load_loss;
                frm.doc.load_loss_guarantee = rating_losses.load_loss;
                frm.doc.lpa_distance = rating_losses.lpa_distance;
                frm.doc.lwa = rating_losses.lwa;
            }
            
            // Check if settings_field value is greater than 0 before validation
            if (rating_losses[settings_field] > 0 && frm.doc[field_for_validation] > rating_losses[settings_field]) {
                // Format string to Camel Case (Like This String)
                var formatted_field = field_for_validation.replace(/_/g, ' ').replace(/\b\w/g, function (match) {
                    return match.toUpperCase();
                });
                const message_string = 'Value higher than (' + rating_losses[settings_field] + ') Not Allowed';
                frappe.msgprint(message_string, formatted_field);
                // Restore back the field to the maximum value
                frm.doc[field_for_validation] = rating_losses[settings_field];
            }

            frm.refresh_fields();
        });
    },

    refresh(frm) {
        if (frm.is_new()) {
            
            // Call get_standard_losses function on refresh if form is new
            frm.events.get_standard_losses(frm, true);
        }

        frm.refresh_field('no_load_loss_guarantee');
        frm.refresh_field('load_loss_guarantee');
        frm.refresh_field('lpa_distance');
        frm.refresh_field('lwa');
        // Avoid refreshing 'lpa' field to prevent clearing its value
        frm.refresh_field('lpa');
    },

    rating(frm) {
        // Call get_standard_losses function on rating field change
        frm.events.get_standard_losses(frm, true);
    },

    no_load_loss_guarantee(frm) {
        frm.events.get_standard_losses(frm, false, 'no_load_loss_guarantee', 'no_load_loss');
    },

    load_loss_guarantee(frm) {
        frm.events.get_standard_losses(frm, false, 'load_loss_guarantee', 'load_loss');
    },

    lwa(frm) {
        frm.events.get_standard_losses(frm, false, 'lwa', 'lwa');
    },

    lpa(frm) {
        frm.events.get_standard_losses(frm, false, 'lpa', 'lpa'); // Allow changing lpa value without clearing
    }
});
