//Setting the default dependent value for HV1 #(Story: US-2024-0044)
frappe.ui.form.on("Design", {
  refresh(frm) {
    var lDoctype = "Gitra Settings";

    // Fetch Gitra Settings document asynchronously
    frappe.model.with_doc(lDoctype, lDoctype, function () {
      // Get list of documents for Gitra Settings
      var laValues = frappe.model.get_list(lDoctype);

      // Initialize LV settings
      const laLvUniqueArray = laValues[0].lv_voltage_setting.reduce(
        (iAccumulator, iCurrent) => {
          // Reduce function to filter unique LV voltage values
          if (!iAccumulator.includes(iCurrent.um)) {
            iAccumulator.push(iCurrent.um);
          }
          return iAccumulator;
        },
        []
      );
      set_field_options("highest_operation_voltage_lv", laLvUniqueArray);
      frm.events.highest_operation_voltage_lv(frm);
      frm.events.ac_phase_lv(frm);

      // Initialize HV settings
      frm.events.fnSetHvOptions(
        frm,
        "voltage_to",
        "hv_rated_voltage",
        "um",
        "highest_operation_voltage_hv",
        false
      );
      frm.events.fnSetHvOptions(
        frm,
        "um",
        "highest_operation_voltage_hv",
        "ac_phase",
        "ac_phase_hv",
        false
      );
      frm.events.fnSetHvOptions(
        frm,
        "ac_phase",
        "ac_phase_hv",
        "li",
        "li_phase_hv",
        false
      );

      // Set defaults if new document
      if (frm.is_new()) {
        fnSetLvDefaults(frm, laValues[0]);
        fnSetHvDefaults(frm, laValues[0]);
      }
      frm.refresh_fields();
    });
  },

  // Function to set HV options based on selected criteria
  fnSetHvOptions(
    frm,
    iOnSettingsField,
    iOnField,
    iToSettingsField,
    iToField,
    iOnChange
  ) {
    // Local variable for the Gitra Settings doctype
    var lDoctype = "Gitra Settings";

    // Fetch Gitra Settings document asynchronously
    frappe.model.with_doc(lDoctype, lDoctype, function () {
      // Get list of documents for Gitra Settings
      var laValues = frappe.model.get_list(lDoctype);
      var laOptions = [];

      // Iterate through HV voltage settings
      laValues[0].hv_voltage_setting.forEach((ldHvRow) => {
        // Filter options based on specified criteria
        if (ldHvRow[iOnSettingsField] >= frm.doc[iOnField]) {
          laOptions.push(ldHvRow[iToSettingsField]);
        }
      });

      // Set field options and handle change event
      set_field_options(iToField, laOptions);
      if (iOnChange && laOptions.length > 0) {
        frm.set_value(iToField, laOptions[0]);
      }
      frm.refresh_fields();
    });
  },

  // Function to set HV defaults based on selected field
  fnSetHvDefaults(frm, iHvField) {
    frm.events.fnSetHvOptions(
      frm,
      "voltage_to",
      iHvField,
      "um",
      "highest_operation_voltage_hv",
      true
    );
    frm.events.fnSetHvOptions(
      frm,
      "um",
      "highest_operation_voltage_hv",
      "ac_phase",
      "ac_phase_hv",
      true
    );
    frm.events.fnSetHvOptions(
      frm,
      "ac_phase",
      "ac_phase_hv",
      "li",
      "li_phase_hv",
      true
    );
  },

  // Function to handle change in HV rated voltage field
  hv_rated_voltage(frm) {
    if (!frm.doc.hv_rated_voltage) return;
    frm.events.fnSetHvDefaults(frm, "hv_rated_voltage");
  },

  // Function to handle change in HV1 field
  hv1(frm) {
    if (!frm.doc.hv1) return;
    frm.events.fnSetHvDefaults(frm, "hv1");
  },

  // Function to handle change in highest operation voltage HV field
  highest_operation_voltage_hv(frm) {
    if (!frm.doc.highest_operation_voltage_hv) return;
    frm.events.fnSetHvOptions(
      frm,
      "um",
      "highest_operation_voltage_hv",
      "ac_phase",
      "ac_phase_hv",
      true
    );
  },

  // Function to handle change in AC phase HV field
  ac_phase_hv(frm) {
    if (!frm.doc.ac_phase_hv) return;
    frm.events.fnSetHvOptions(
      frm,
      "ac_phase",
      "ac_phase_hv",
      "li",
      "li_phase_hv",
      true
    );
  },

  // Function to handle change in highest operation voltage LV field
  highest_operation_voltage_lv(frm) {
    // Local variable for the Gitra Settings doctype
    var lDoctype = "Gitra Settings";

    // Fetch Gitra Settings document asynchronously
    frappe.model.with_doc(lDoctype, lDoctype, function () {
      // Get list of documents for Gitra Settings
      const laValues = frappe.model.get_list(lDoctype);

      const laUniqueArray = laValues[0].lv_voltage_setting.reduce(
        (iAccumulator, iCurrent) => {
          if (
            iCurrent.um &&
            frm.doc.highest_operation_voltage_lv &&
            iCurrent.um.toString() ===
              frm.doc.highest_operation_voltage_lv.toString() &&
            !iAccumulator.includes(iCurrent.ac_phase)
          ) {
            iAccumulator.push(iCurrent.ac_phase);
          }
          return iAccumulator;
        },
        []
      );
      set_field_options("ac_phase_lv", laUniqueArray);
    });
  },

  // Function to handle change in AC phase LV field
  ac_phase_lv(frm) {
    // Local variable for the Gitra Settings doctype
    var lDoctype = "Gitra Settings";

    // Fetch Gitra Settings document asynchronously
    frappe.model.with_doc(lDoctype, lDoctype, function () {
      // Get list of documents for Gitra Settings
      const laValues = frappe.model.get_list(lDoctype);

      const laUniqueArray = laValues[0].lv_voltage_setting.reduce(
        (iAccumulator, iCurrent) => {
          if (
            iCurrent.um &&
            frm.doc.highest_operation_voltage_lv &&
            iCurrent.ac_phase &&
            frm.doc.ac_phase_lv &&
            iCurrent.um.toString() ===
              frm.doc.highest_operation_voltage_lv.toString() &&
            iCurrent.ac_phase.toString() === frm.doc.ac_phase_lv.toString() &&
            !iAccumulator.includes(iCurrent.li)
          ) {
            iAccumulator.push(iCurrent.li);
          }
          return iAccumulator;
        },
        []
      );

      set_field_options("li_phase_lv", laUniqueArray);
    });
  },
});

// Function to set LV defaults based on selected settings
function fnSetLvDefaults(frm, iSettings) {
  var ldLvDefaults = iSettings.lv_voltage_setting.find(
    (ldX) => ldX.is_default === 1
  );
  if (ldLvDefaults) {
    frm.set_value("highest_operation_voltage_lv", ldLvDefaults.um);
    frm.set_value("ac_phase_lv", ldLvDefaults.ac_phase);
    frm.set_value("li_phase_lv", ldLvDefaults.li);
  }
}

// Function to set HV defaults based on selected settings
function fnSetHvDefaults(frm, iSettings) {
  var ldHvDefaults = iSettings.hv_voltage_setting.find(
    (ldX) => ldX.is_default === 1
  );
  if (ldHvDefaults) {
    frm.set_value("hv_rated_voltage", ldHvDefaults.voltage_to);
    frm.set_value("highest_operation_voltage_hv", ldHvDefaults.um);
    frm.set_value("ac_phase_hv", ldHvDefaults.ac_phase);
    frm.set_value("li_phase_hv", ldHvDefaults.li);
  }
}
