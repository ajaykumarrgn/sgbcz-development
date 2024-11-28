frappe.ui.form.on("Design", {
  /*
   * This function is to compute the custom losses
   * @params frm
   * @params iLossesSetting field as defined in the Gitra Settings
   */
  fnComputeCustomLosses(frm, iLossesSetting) {
    const LOSSES_SETTINGS = iLossesSetting.filter(
      (item) => item.transformer_type === frm.doc.transformer_type
    );
    // Sort iLossesSetting by rating, which is
    //defined as a Data type in the Rating Doctype
    LOSSES_SETTINGS.sort((a, b) => {
      const L_NUMA = parseInt(a.rating, 10);
      const L_NUMB = parseInt(b.rating, 10);
      if (L_NUMA < L_NUMB) {
        return -1;
      }
      if (L_NUMA > L_NUMB) {
        return 1;
      }
      return 0;
    });
    // Convert the rating from the form to a decimal (base 10) integer
    const L_RATING_INT = parseInt(frm.doc.rating, 10);
    // Find the first index with a rating larger than frm.doc.rating
    const L_INDEX = LOSSES_SETTINGS.findIndex(
      (x) => parseInt(x.rating, 10) > L_RATING_INT
    );

    // Initialize an empty dict for ldCustomLosses
    var ldCustomLosses = {
      no_load_loss: "",
      load_loss: "",
      lwa: "",
      lpa_distance: "",
      lpa: "",
    };

    if (L_INDEX > 0) {
      //Get the higher rating loss from gitra settings
      const L_RATING_LOSSES_HIGHER = LOSSES_SETTINGS[L_INDEX];

      //Get the lower rating lossgitra  setting
      //(one place before the higher rating)
      const L_RATING_LOSSES_LOWER = LOSSES_SETTINGS[L_INDEX - 1];

      //computing arithmetic average
      const L_ARITHMETIC_AVERAGE =
        (frm.doc.rating - L_RATING_LOSSES_LOWER.rating) /
        (L_RATING_LOSSES_HIGHER.rating - L_RATING_LOSSES_LOWER.rating);
      //append the value
      ldCustomLosses = {
        no_load_loss: Math.round(
          L_RATING_LOSSES_LOWER.no_load_loss +
            L_ARITHMETIC_AVERAGE *
              (L_RATING_LOSSES_HIGHER.no_load_loss -
                L_RATING_LOSSES_LOWER.no_load_loss)
        ),
        load_loss: Math.round(
          L_RATING_LOSSES_LOWER.load_loss +
            L_ARITHMETIC_AVERAGE *
              (L_RATING_LOSSES_HIGHER.load_loss -
                L_RATING_LOSSES_LOWER.load_loss)
        ),
        rating: frm.doc.rating,
        lwa: L_RATING_LOSSES_LOWER.lwa,
        lpa_distance: String(L_RATING_LOSSES_LOWER.lpa_distance),
        lpa: L_RATING_LOSSES_LOWER.lpa,
      };

      return ldCustomLosses;
    } else {
      //if higer index is not found return empty dict
      return ldCustomLosses;
    }
  },

  /*
   * This function retrieves the standard losses from Gitra Settings
   * or computes custom losses if not found
   * @params frm
   * @params iSetDefaultValue - 
   * -Flag to determine if default values should be set.
   * @params iFieldForValidation - The name of the field to be validated.
   * @params iSettingsField - field name in gitra Losses child table
   */
  fnGetStandardLosses(
    frm,
    iSetDefaultValue,
    iFieldForValidation,
    iSettingsField
  ) {
    var ldDoctype = "Gitra Settings";
    frappe.model.with_doc(ldDoctype, ldDoctype, function () {
      const LA_VALUES = frappe.model.get_list(ldDoctype);
      //get the losses based on rating and transformer type
      var lRatingLosses = LA_VALUES[0].losses_setting.find(
        (x) =>
          x.rating === frm.doc.rating &&
          x.transformer_type === frm.doc.transformer_type
      );

      if (!lRatingLosses) {
        // Calculate custom losses if rating_losses not found
        lRatingLosses = frm.events.fnComputeCustomLosses(
          frm,
          LA_VALUES[0].losses_setting
        );
      }

      if (iSetDefaultValue) {
        frm.doc.no_load_loss_guarantee = lRatingLosses.no_load_loss;
        frm.doc.load_loss_guarantee = lRatingLosses.load_loss;
        //converted into string because 0 is not displaying
        frm.doc.lpa_distance = String(lRatingLosses.lpa_distance);
        frm.doc.lwa = lRatingLosses.lwa;
        frm.doc.lpa = lRatingLosses.lpa;
      }
      if (
        frm.doc[iFieldForValidation] > lRatingLosses[iSettingsField] &&
        lRatingLosses[iSettingsField] !== ""
      ) {
        //Format string to Camel Case(Like This String)
        var formattedField = iFieldForValidation
          .replace(/_/g, " ")
          .replace(/\b\w/g, function (match) {
            return match.toUpperCase();
          });
        //the message content is updated as per the requirement below
        // const MESSAGE_STRING = 'Value higher than 
        //(' + lRatingLosses[iSettingsField] +')' + ' Not Allowed';
        const MESSAGE_STRING =
        "The value is higher than " + lRatingLosses[iSettingsField];
        frappe.msgprint(MESSAGE_STRING, formattedField);
        // The line below is commented out because 
        // other factories may have higher noise rates.
        // Therefore,requested to only 
        // display a message (as updated above)
        // and allow the user to change the value
        // without automatically reverting it.
        //Restore back the field to maximum value
        //frm.doc[iFieldForValidation]=lRatingLosses[iSettingsField];
      }

      frm.refresh_fields();
    });
  },

  refresh(frm) {
    if (frm.is_new()) {
      frm.events.fnGetStandardLosses(frm, true);
    }
  },

  //onchange of transformer type field
  transformer_type(frm) {
    frm.events.fnGetStandardLosses(frm, true);
  },
  //onchange of factory field
  factory(frm) {
    frm.events.fnGetStandardLosses(frm, true);
  },
  //onchange of rating field
  rating(frm) {
    frm.events.fnGetStandardLosses(frm, true);
  },
  //onchange of no load loss guarantee field
  no_load_loss_guarantee(frm) {
    frm.events.fnGetStandardLosses(
      frm,
      false,
      "no_load_loss_guarantee",
      "no_load_loss"
    );
  },
  //onchange of load loss guarantee field
  load_loss_guarantee(frm) {
    frm.events.fnGetStandardLosses(
      frm,
      false,
      "load_loss_guarantee",
      "load_loss"
    );
  },
  //onchange of lwa field
  lwa(frm) {
    frm.events.fnGetStandardLosses(frm, false, "lwa", "lwa");
    if (frm.doc.is_design) {
      // Logic to set LPA to 0 if LWA is present
      if (frm.doc.lwa && frm.doc.lwa !== 0) {
        frm.set_value("lpa", 0);
      }
    }
  },
  //onchange of lpa field
  lpa(frm) {
    frm.events.fnGetStandardLosses(frm, false);
    if (frm.doc.is_design) {
      // Logic to set LWA to 0 if LPA is present
      if (frm.doc.lpa && frm.doc.lpa !== 0) {
        frm.set_value("lwa", 0);
      }
    }
  },
});
