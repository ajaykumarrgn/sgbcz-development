frappe.ui.form.on('Design', {
  fnComputeCustomLosses(frm, iLossesSetting) {
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
      const lIndex = losses_setting.findIndex(x => parseInt(x.rating, 10) > lRatingInt);
      
      const lRatingLossesHigher = iLossesSetting[lIndex];
      const lRatingLossesLower = iLossesSetting[lIndex - 1];
      
      const lArithmeticAverage = (frm.doc.rating - lRatingLossesLower.rating) /
                                 (lRatingLossesHigher.rating - lRatingLossesLower.rating);
      
      var ldCustomLosses = {
          no_load_loss: Math.round(lRatingLossesLower.no_load_loss +
                                   lArithmeticAverage * (lRatingLossesHigher.no_load_loss - lRatingLossesLower.no_load_loss)),
          load_loss: Math.round(lRatingLossesLower.load_loss +
                                lArithmeticAverage * (lRatingLossesHigher.load_loss - lRatingLossesLower.load_loss)),
          rating: frm.doc.rating,
          lwa: lRatingLossesLower.lwa,
          lpa_distance: lRatingLossesLower.lpa_distance,
          lpa: lRatingLossesLower.lpa
      };
      
      return ldCustomLosses;
  },

  fnGetStandardLosses(frm, iRefreshAllFields, iFieldForValidation, iSettingsField) {
      var ldDoctype = "Gitra Settings";
      frappe.model.with_doc(ldDoctype, ldDoctype, function() {
          const laValues = frappe.model.get_list(ldDoctype);
          var lRatingLosses = laValues[0].losses_setting.find(x => x.rating === frm.doc.rating);
             
          if (!lRatingLosses) {
              // Calculate custom losses if rating_losses not found
              lRatingLosses = frm.events.fnComputeCustomLosses(frm, laValues[0].iLossesSetting);
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