frappe.ui.form.on("Design", {
  /*
   * This function is to compute the custom losses
   * @params frm
   * @params losses_setting field as defined in the Gitra Settings
   */
  fnComputeCustomLosses(frm, iLossesSetting) {
    // Sort Rating as integer as Rating is defined as Data in Rating Doctype
    iLossesSetting.sort((a, b) => {
      const lNumA = parseInt(a.rating, 10);
      const lNumB = parseInt(b.rating, 10);

      if (lNumA < lNumB) {
        return -1;
      }
      if (lNumA > lNumB) {
        return 1;
      }
      return 0;
    });

    const lRatingInt = parseInt(frm.doc.rating, 10);
    const lIndex = iLossesSetting.findIndex(
      (x) => parseInt(x.rating, 10) > lRatingInt
    );
    const lRatingLossesHigher = iLossesSetting[lIndex];
    const iRatingLossesLower = iLossesSetting[lIndex - 1];

    // Compute the custom losses
    var ldCustomLosses = {
      no_load_loss: Math.round(
        iRatingLossesLower.no_load_loss +
          ((lRatingInt - iRatingLossesLower.rating) *
            (lRatingLossesHigher.no_load_loss -
              iRatingLossesLower.no_load_loss)) /
            (lRatingLossesHigher.rating - iRatingLossesLower.rating)
      ),
      load_loss: Math.round(
        iRatingLossesLower.load_loss +
          ((lRatingInt - iRatingLossesLower.rating) *
            (lRatingLossesHigher.load_loss - iRatingLossesLower.load_loss)) /
            (lRatingLossesHigher.rating - iRatingLossesLower.rating)
      ),
      rating: frm.doc.rating,
      lwa: iRatingLossesLower.lwa,
      lpa_distance: iRatingLossesLower.lpa_distance,
      lpa: frm.doc.lpa,
    };

    return ldCustomLosses;
  },

  /*
   * This function retrieves the standard losses from Gitra Settings or computes custom losses if not found
   * @params frm
   */
  fnGetStandardLosses(
    frm,
    iRefreshAllFields,
    iFieldForValidation,
    iSettingsField
  ) {
    var lDoctype = "Gitra Settings";

    // Initialize the model with doctype Gitra Settings
    frappe.model.with_doc(lDoctype, lDoctype, function () {
      const laValues = frappe.model.get_list(lDoctype);
      var laRatingLosses = laValues[0].losses_setting.find(
        (x) => x.rating === frm.doc.rating
      );

      if (!laRatingLosses) {
        // Calculate custom_losses if rating_losses not found
        const ldCustomLosses = frm.events.compute_ldCustomLosses(
          frm,
          laValues[0].iLossesSetting
        );
        laRatingLosses = ldCustomLosses;
      }

      if (iRefreshAllFields) {
        frm.doc.no_load_loss_guarantee = laRatingLosses.no_load_loss;
        frm.doc.load_loss_guarantee = laRatingLosses.load_loss;
        frm.doc.lpa_distance = laRatingLosses.lpa_distance;
        frm.doc.lwa = laRatingLosses.lwa;
      }

      // Check if settings_field value is greater than 0 before validation
      if (
        laRatingLosses[iSettingsField] > 0 &&
        frm.doc[iFieldForValidation] > laRatingLosses[iSettingsField]
      ) {
        // Format string to Camel Case (Like This String)
        var lFormattedField = iFieldForValidation
          .replace(/_/g, " ")
          .replace(/\b\w/g, function (match) {
            return match.toUpperCase();
          });
        const lMessageString =
          "Value higher than (" +
          laRatingLosses[iSettingsField] +
          ") Not Allowed";
        frappe.msgprint(lMessageString, lFormattedField);
        // Restore back the field to the maximum value
        frm.doc[iFieldForValidation] = laRatingLosses[iSettingsField];
      }

      frm.refresh_fields();
    });
  },
  onload(frm) {
    frm.set_value('lpa', 0)
  },
  refresh(frm) {
    if (frm.is_new()) {
      // Call get_standard_losses function on refresh if form is new
      frm.events.fnGetStandardLosses(frm, true);
    }

    frm.refresh_field("no_load_loss_guarantee");
    frm.refresh_field("load_loss_guarantee");
    frm.refresh_field("lpa_distance");
    frm.refresh_field("lwa");
    // Avoid refreshing 'lpa' field to prevent clearing its value
    frm.refresh_field("lpa");
  },

  rating(frm) {
    // Call get_standard_losses function on rating field change
    frm.events.fnGetStandardLosses(frm, true);
  },

  no_load_loss_guarantee(frm) {
    frm.events.fnGetStandardLosses(
      frm,
      false,
      "no_load_loss_guarantee",
      "no_load_loss"
    );
  },

  load_loss_guarantee(frm) {
    frm.events.fnGetStandardLosses(
      frm,
      false,
      "load_loss_guarantee",
      "load_loss"
    );
  },

  lwa(frm) {
    frm.events.fnGetStandardLosses(frm, false, "lwa", "lwa");
  },

  lpa(frm) {
    // Allow changing lpa value without clearing
    frm.events.fnGetStandardLosses(frm, false, "lpa", "lpa");
  },
});

