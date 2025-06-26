frappe.ui.form.on("Design", {
  // commented this line for retaining the ip protection value 
  // In the SGBCZ factory When switching the non-design to is-design 
  // and vice versa
  //refresh(frm){
  onload(frm) {
      //Filtered the Design Configuration for story >>US-2025-0602
    if (frm.is_new()) {
        if (!frm.doc.transformer_type) return;
        const lDoctype = "Design Configuration";
        // Initialize the model with doctype Design Configuration
        frappe.model.with_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
        "is_design": frm.doc.is_design}, function () {
        let laValues = frappe.model.get_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
          "is_design": frm.doc.is_design});
        // <<US-2025-0602
        // Set values from Gitra Settings to the form fields
        frm.doc.temperature_rise_gitra = laValues.temperature_rise;
        frm.doc.temperature_rise_datasheet = laValues.temperature_rise;
        frm.doc.temperature_rise = laValues.temperature_rise;
        frm.doc.ambient_max_temperature = laValues.ambient_max_temperature;
        frm.doc.max_average_temperature_per_year =
          laValues.max_average_temperature_per_year;
        frm.doc.max_average_temperature_per_month =
          laValues.max_average_temperature_per_month;
        //incase of duplicating the design
        //set the ip protection to 'IP00'
        frm.doc.ip_protection = "IP00";
        frm.refresh_fields();
      });
    }
  },
  is_design(frm){
    //   if (frm.is_new()) {
    //Filtered the Design Configuration story >>US-2025-0602
        if (!frm.doc.transformer_type) return;
        const lDoctype = "Design Configuration";
        // Initialize the model with doctype Design Configuration
        frappe.model.with_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
        "is_design": frm.doc.is_design}, function () {
        let laValues = frappe.model.get_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
          "is_design": frm.doc.is_design});
        //<<US-2025-0602
        // Set values from Gitra Settings to the form fields
        frm.doc.temperature_rise_gitra = laValues.temperature_rise;
        frm.doc.temperature_rise_datasheet = laValues.temperature_rise;
        frm.doc.temperature_rise = laValues.temperature_rise;
        frm.doc.ambient_max_temperature = laValues.ambient_max_temperature;
        frm.doc.max_average_temperature_per_year =
          laValues.max_average_temperature_per_year;
        frm.doc.max_average_temperature_per_month =
          laValues.max_average_temperature_per_month;
        //incase of duplicating the design
        //set the ip protection to 'IP00'
        // retain ip if toggle for same factory in is_design
        // frm.doc.ip_protection = "IP00";
        frm.refresh_fields();
      });
    // }
  },

  fnInitializeTemperatureDefaults(frm) {
    if (!frm.doc.transformer_type) return;
    //Added for story <<US-2025-0602
    const lDoctype = "Design Configuration";
        // Initialize the model with doctype Design Configuration
        frappe.model.with_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
        "is_design": frm.doc.is_design}, function () {
        let laValues = frappe.model.get_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
          "is_design": frm.doc.is_design});
        //<<US-2025-0602
      frm.doc.ambient_max_temperature = laValues.ambient_max_temperature;
      frm.doc.max_average_temperature_per_year =
        laValues.max_average_temperature_per_year;
      frm.doc.max_average_temperature_per_month =
        laValues.max_average_temperature_per_month;
      frm.refresh_fields();
      frappe.msgprint(
        "Transformer Environment Reset To Default",
        "Please revisit IP Protection"
      );
    });
  },

  fnCalculateTemperatureRise(frm, on_field) {
    if (!frm.doc.transformer_type) return;
    //Added for story <<US-2025-0602
    const lDoctype = "Design Configuration";
        // Initialize the model with doctype Design Configuration
        frappe.model.with_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
        "is_design": frm.doc.is_design}, function () {
        let laValues = frappe.model.get_doc(lDoctype, {"transformer_type": frm.doc.transformer_type, 
          "is_design": frm.doc.is_design});
        // <<US-2025-0602
      var lTemperatureDelta = Math.max(
        frm.doc[on_field] - laValues[on_field],
        0
      );

      var ldIpProtectionRating = laValues.ip_protection_setting.find(
        (x) => x.rating === frm.doc.rating
      );

      if (!ldIpProtectionRating) {
        ldIpProtectionRating = laValues.ip_protection_setting.find(
          (x) => x.rating > frm.doc.rating
        );
      }

      const L_IPPROTECTION_TEMPERATURE =
        ldIpProtectionRating[frm.doc.ip_protection.toLowerCase()];

      frm.doc.temperature_rise_datasheet =
        frm.doc.temperature_rise -
        lTemperatureDelta * laValues.temperature_rise_ratio;

      const L_TEMPERATURE_DELTAWITHIP =
        L_IPPROTECTION_TEMPERATURE - lTemperatureDelta;

      frm.doc.temperature_rise_gitra =
        frm.doc.temperature_rise +
        L_TEMPERATURE_DELTAWITHIP * laValues.temperature_rise_ratio;

      frm.doc.max_average_temperature_per_month =
        laValues.max_average_temperature_per_month + lTemperatureDelta;
      frm.doc.max_average_temperature_per_year =
        laValues.max_average_temperature_per_year + lTemperatureDelta;
      frm.doc.ambient_max_temperature =
        laValues.ambient_max_temperature + lTemperatureDelta;

      frm.refresh_fields();
    });
  },

  max_average_temperature_per_month(frm) {
    frm.events.fnCalculateTemperatureRise(
      frm,
      "max_average_temperature_per_month"
    );
  },

  max_average_temperature_per_year(frm) {
    frm.events.fnCalculateTemperatureRise(
      frm,
      "max_average_temperature_per_year"
    );
  },

  ambient_max_temperature(frm) {
    frm.events.fnCalculateTemperatureRise(frm, "ambient_max_temperature");
  },

  ip_protection(frm) {
    frm.events.fnCalculateTemperatureRise(
      frm,
      "max_average_temperature_per_year"
    );
  },

  temperature_rise(frm) {
    frm.doc.temperature_rise_datasheet = frm.doc.temperature_rise;
    frm.doc.temperature_rise_gitra = frm.doc.temperature_rise;
    frm.doc.ip_protection = "IP00";
    frm.events.fnInitializeTemperatureDefaults(frm);
  },
});
