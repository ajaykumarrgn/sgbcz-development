frappe.ui.form.on('Design', {
  fnComputeCustomLosses(frm, iLossesSetting) {
      iLossesSetting.sort((a, b) => {
          const L_NUMA = parseInt(a.rating, 10);
          const L_NUMB = parseInt(b.rating, 10);
          if (L_NUMA <L_NUMB) {
              return -1;
          }
          if (L_NUMA > L_NUMB) {
              return 1;
          }
          return 0;
      });
      
      const L_RATING_INT = parseInt(frm.doc.rating, 10);
      const L_INDEX = losses_setting.findIndex(x => parseInt(x.rating, 10) > L_RATING_INT);
      
      const L_RATING_LOSSES_HIGHER = iLossesSetting[L_INDEX];
      const L_RATING_LOSSES_LOWER = iLossesSetting[L_INDEX - 1];
      
      const L_ARITHMETIC_AVERAGE = (frm.doc.rating - L_RATING_LOSSES_LOWER.rating) /
                (L_RATING_LOSSES_HIGHER.rating - L_RATING_LOSSES_LOWER.rating);
      
      var ldCustomLosses = {
          no_load_loss: Math.round(L_RATING_LOSSES_LOWER.no_load_loss +
            L_ARITHMETIC_AVERAGE * (L_RATING_LOSSES_HIGHER.no_load_loss - 
            L_RATING_LOSSES_LOWER.no_load_loss)),
          load_loss: Math.round(L_RATING_LOSSES_LOWER.load_loss +
            L_ARITHMETIC_AVERAGE * (L_RATING_LOSSES_HIGHER.load_loss - 
            L_RATING_LOSSES_LOWER.load_loss)),
          rating: frm.doc.rating,
          lwa: L_RATING_LOSSES_LOWER.lwa,
          lpa_distance: L_RATING_LOSSES_LOWER.lpa_distance,
          lpa: L_RATING_LOSSES_LOWER.lpa
      };
      
      return ldCustomLosses;
  },

  fnGetStandardLosses(frm, iRefreshAllFields, iFieldForValidation, iSettingsField) {
      var ldDoctype = "Gitra Settings";
      frappe.model.with_doc(ldDoctype, ldDoctype, function() {
          const LA_VALUES = frappe.model.get_list(ldDoctype);
          var lRatingLosses = LA_VALUES[0].losses_setting.find(x => x.rating === frm.doc.rating && 
             x.transformer_type === frm.doc.transformer_type);
             
          if (!lRatingLosses) {
              // Calculate custom losses if rating_losses not found
              lRatingLosses = frm.events.fnComputeCustomLosses(frm, LA_VALUES[0].iLossesSetting);
          }
          
          if (iRefreshAllFields) {
              frm.doc.no_load_loss_guarantee = lRatingLosses.no_load_loss;
              frm.doc.load_loss_guarantee = lRatingLosses.load_loss;
              frm.doc.lpa_distance = lRatingLosses.lpa_distance;
              frm.doc.lwa = lRatingLosses.lwa;
          }
          
          frm.refresh_fields();
      });
  },
  
  refresh(frm) {
      if (frm.is_new()) {
          frm.events.fnGetStandardLosses(frm, true);
      }
      
      frm.refresh_fields();
  },
  transformer_type(frm) {
      
    frm.events.fnGetStandardLosses(frm, true);
  
  },
  
  rating(frm) {
      frm.events.fnGetStandardLosses(frm, true);
  },
  
  no_load_loss_guarantee(frm) {
      frm.events.fnGetStandardLosses(frm, false, 'no_load_loss_guarantee', 'no_load_loss');
  },
  
  load_loss_guarantee(frm) {
      frm.events.fnGetStandardLosses(frm, false, 'load_loss_guarantee', 'load_loss');
  },
  
  lwa(frm) {
      if (frm.doc.is_design) {
          frm.events.fnGetStandardLosses(frm, false, 'lwa', 'lwa');

          // Logic to set LPA to 0 if LWA is present
          if (frm.doc.lwa && frm.doc.lwa !== 0) {
              frm.set_value('lpa', 0);
          }
      }
  },
  
  lpa(frm) {
      if (frm.doc.is_design) {
          frm.events.fnGetStandardLosses(frm, false, 'lpa', 'lpa');

          // Logic to set LWA to 0 if LPA is present
          if (frm.doc.lpa && frm.doc.lpa !== 0) {
              frm.set_value('lwa', 0);
          }
      }
  },

  
});