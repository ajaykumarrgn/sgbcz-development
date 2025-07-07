//Setting the default dependent value for either HV Rated Voltage
// or HV1  #(Story: US-2024-0044)
//the LV Rated Voltage should have same logic has HV Rated Voltage
frappe.ui.form.on("Design", {
  refresh(frm) {
// Fetch Design Configuration document for story >>US-2025-0602
const LDoctype = "Design Configuration";
    // frappe.model.with_doc(LDoctype, LDoctype, function () {
    frappe.db.get_value(LDoctype, {
    transformer_type: frm.doc.transformer_type,
    is_design: frm.doc.is_design
}, ["name"]).then((ldResponse) => {
    if (ldResponse.message) {
        const LDocname = ldResponse.message.name;
 // Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(LDoctype, LDocname, function () {
      // Get list of documents for Gitra Settings
      var laValues = frappe.model.get_doc(LDoctype, LDocname);
// <<US-2025-0602
      // Initialize LV settings
      const LA_LV_UNIQUEARRAY = laValues.lv_voltage_setting.reduce(
        (iAccumulator, iCurrent) => {
          // Reduce function to filter unique LV voltage values
        //   if (iCurrent.transformer_type === frm.doc.transformer_type) {
            if (!iAccumulator.includes(iCurrent.um)) {
              iAccumulator.push(iCurrent.um);
            }
        //   }
          return iAccumulator;
        },
        []
      );
      set_field_options("highest_operation_voltage_lv", LA_LV_UNIQUEARRAY);
      frm.events.highest_operation_voltage_lv(frm);
      frm.events.ac_phase_lv(frm);

      //   Initialize HV settings
      frm.events.fnSetOptions(
        frm,
        "voltage_to",
        "hv_rated_voltage",
        "um",
        "highest_operation_voltage_hv",
        false,
        "hv"
      );
      frm.events.fnSetOptions(
        frm,
        "um",
        "highest_operation_voltage_hv",
        "ac_phase",
        "ac_phase_hv",
        false,
        "hv"
      );
      frm.events.fnSetOptions(
        frm,
        "ac_phase",
        "ac_phase_hv",
        "li",
        "li_phase_hv",
        false,
        "hv"
      );

      // Set defaults if new document
      if (frm.is_new()) {
        fnSetLvDefaults(frm, laValues);
        fnSetHvDefaults(frm, laValues);
      }
      frm.refresh_fields();
    // });
  });
    }
});
  },

  // Generic function to set options for LV and HV settings
  fnSetOptions(
    frm,
    iOnSettingsField,
    iOnField,
    iToSettingsField,
    iToField,
    iOnChange,
    type
  ) {
    //Get the Design Configuration >>US-2025-0602
    const LDoctype = "Design Configuration";

    // Determine the settings field based on type (hv or lv)
    const DESIGN_SETTING =
      type === "hv" ? "hv_voltage_setting" : "lv_voltage_setting";

    // Load the document for Gitra Settings
    // frappe.model.with_doc(LDoctype, DOCTYPE, function () {
        frappe.db.get_value(LDoctype, {
        transformer_type: frm.doc.transformer_type,
        is_design: frm.doc.is_design
    }, ["name"]).then((ldResponse) => {
        if (ldResponse.message) {
            const LDocname = ldResponse.message.name;
     // Initialize the model with doctype Gitra Settings
            frappe.model.with_doc(LDoctype, LDocname, function () {
      // Get the list of settings
      const LA_VALUE = frappe.model.get_list(LDoctype, filters={"name":LDocname, "is_design": frm.doc.is_design });
  //<<US-2025-0602
      //initializing set to avoid duplicate option
      const LA_OPTIONS = new Set();

      // Loop through the settings
      LA_VALUE[0][DESIGN_SETTING].forEach((ldRow) => {
        // Match the transformer type and compare the OnSettings field value
        // if (ldRow.transformer_type === frm.doc.transformer_type) {
          if (ldRow[iOnSettingsField] >= frm.doc[iOnField]) {
            LA_OPTIONS.add(ldRow[iToSettingsField]); // Add the valid options
          }
        // }
      });

      // Convert Set to Array and set field options
      const LA_OPTIONS_ARRAY = Array.from(LA_OPTIONS);
      set_field_options(iToField, LA_OPTIONS_ARRAY);

      // Automatically set the first option 
      // if onChange is true and options are available
      if (iOnChange && LA_OPTIONS_ARRAY.length > 0) {
        frm.set_value(iToField, LA_OPTIONS_ARRAY[0]);
      }

      // Refresh the form fields after setting the options
      frm.refresh_fields();
    // });
        });
    }
 });
  },

  // Combined function to set defaults for both LV and HV
  fnSetDefaults(frm, iField, type) {
    const OPERATION_VOLTAGE =
      type === "hv"
        ? "highest_operation_voltage_hv"
        : "highest_operation_voltage_lv";
    const AC_PHASE = type === "hv" ? "ac_phase_hv" : "ac_phase_lv";
    const LI_PHASE = type === "hv" ? "li_phase_hv" : "li_phase_lv";

    frm.events.fnSetOptions(
      frm,
      "voltage_to",
      iField,
      "um",
      OPERATION_VOLTAGE,
      true,
      type
    );
    frm.events.fnSetOptions(
      frm,
      "um",
      OPERATION_VOLTAGE,
      "ac_phase",
      AC_PHASE,
      true,
      type
    );
    frm.events.fnSetOptions(
      frm,
      "ac_phase",
      AC_PHASE,
      "li",
      LI_PHASE,
      true,
      type
    );
  },

  // Function to handle change in HV rated voltage field
  hv_rated_voltage(frm) {
    if (!frm.doc.hv_rated_voltage) return;
    frm.events.fnSetDefaults(frm, "hv_rated_voltage", "hv");
  },

  // Function to handle change in HV1 field
  hv1(frm) {
    if (!frm.doc.hv1) return;
    frm.events.fnSetDefaults(frm, "hv1", "hv");
  },
  //onchange of lv_rated_voltage
  lv_rated_voltage(frm) {
    if (!frm.doc.lv_rated_voltage) return;
    frm.events.fnSetDefaults(frm, "lv_rated_voltage", "lv");
  },
  //onchange of lv1
  lv1(frm) {
    if (!frm.doc.lv1) return;
    frm.events.fnSetDefaults(frm, "lv1", "lv");
  },

  // Function to handle change in highest operation voltage HV field
  highest_operation_voltage_hv(frm) {
    if (!frm.doc.highest_operation_voltage_hv) return;
    frm.events.fnSetOptions(
      frm,
      "um",
      "highest_operation_voltage_hv",
      "ac_phase",
      "ac_phase_hv",
      true,
      "hv"
    );
  },

  // Function to handle change in AC phase HV field
  ac_phase_hv(frm) {
    if (!frm.doc.ac_phase_hv) return;
    frm.events.fnSetOptions(
      frm,
      "ac_phase",
      "ac_phase_hv",
      "li",
      "li_phase_hv",
      true,
      "hv"
    );
  },

  // Function to handle change in highest operation voltage LV field
  highest_operation_voltage_lv(frm) {
    // Local variable for the Gitra Settings doctype
//Get the Design Configuration for story <<US-2025-0602  
const LDoctype = "Design Configuration";

    frappe.db.get_value(LDoctype, {
        transformer_type: frm.doc.transformer_type,
        is_design: frm.doc.is_design
    }, ["name"]).then((ldResponse) => {
        if (ldResponse.message) {
            const LDocname = ldResponse.message.name;
    // Fetch Gitra Settings document asynchronously
    frappe.model.with_doc(LDoctype, LDocname, function () {
      // Get list of documents for Gitra Settings
      const LA_VALUES = frappe.model.get_list(LDoctype, filters={"name":LDocname, "is_design": frm.doc.is_design } );
//<<US-2025-0602
      const LA_UNIQUEARRAY = LA_VALUES[0].lv_voltage_setting.reduce(
        (iAccumulator, iCurrent) => {
          if (
            iCurrent.um &&
            frm.doc.highest_operation_voltage_lv &&
            iCurrent.um.toString() ===
              frm.doc.highest_operation_voltage_lv.toString() &&
            !iAccumulator.includes(iCurrent.ac_phase) 
            // && iCurrent.transformer_type === frm.doc.transformer_type
          ) {
            iAccumulator.push(iCurrent.ac_phase);
          }
          return iAccumulator;
        },
        []
      );
      set_field_options("ac_phase_lv", LA_UNIQUEARRAY);
    });
        }
});
  },

  // Function to handle change in AC phase LV field
  ac_phase_lv(frm) {
    // Local variable for the Gitra Settings doctype
//Get the Design Configuration for story <<US-2025-0602
const LDoctype = "Design Configuration";
    frappe.db.get_value(LDoctype, {
        transformer_type: frm.doc.transformer_type,
        is_design: frm.doc.is_design
    }, ["name"]).then((ldResponse) => {
        if (ldResponse.message) {
            const LDocname = ldResponse.message.name;
    // Fetch Gitra Settings document asynchronously
    frappe.model.with_doc(LDoctype, LDocname, function () {
      // Get list of documents for Gitra Settings
      const LA_VALUES = frappe.model.get_list(LDoctype, filters={"name":LDocname, "is_design": frm.doc.is_design } );
//<<US-2025-0602

      const LA_UNIQUEARRAY = LA_VALUES[0].lv_voltage_setting.reduce(
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
            // && iCurrent.transformer_type === frm.doc.transformer_type
          ) {
            iAccumulator.push(iCurrent.li);
          }
          return iAccumulator;
        },
        []
      );

      set_field_options("li_phase_lv", LA_UNIQUEARRAY);
    });
        }
        });
  },

  transformer_type(frm) {
//Get the Design Configuration for story <<US-2025-0602
const LDoctype = "Design Configuration";
    frappe.db.get_value(LDoctype, {
        transformer_type: frm.doc.transformer_type,
        is_design: frm.doc.is_design
    }, ["name"]).then((ldResponse) => {
        if (ldResponse.message) {
            const LDocname = ldResponse.message.name;
    // Fetch Gitra Settings document asynchronously
    frappe.model.with_doc(LDoctype, LDocname, function () {
      // Get list of documents for Gitra Settings
      var laValues = frappe.model.get_doc(LDoctype, LDocname);
// <<US-2025-0602
      const LA_LV_UNIQUEARRAY = laValues.lv_voltage_setting.reduce(
        (iAccumulator, iCurrent) => {
          // Reduce function to filter unique LV voltage values
        //   if (iCurrent.transformer_type === frm.doc.transformer_type) {
            if (!iAccumulator.includes(iCurrent.um)) {
              iAccumulator.push(iCurrent.um);
            }
        //   }
          return iAccumulator;
        },
        []
      );
      set_field_options("highest_operation_voltage_lv", LA_LV_UNIQUEARRAY);
      if (!frm.doc.lv_rated_voltage && !frm.doc.lv_2) {
        fnSetLvDefaults(frm, laValues);
      }
      fnSetHvDefaults(frm, laValues);
    });   
    }
    })
  },
});

// Function to set LV defaults based on selected settings
function fnSetLvDefaults(frm, iSettings) {
  var ldLvDefaults = iSettings.lv_voltage_setting.find(
    (ldX) =>
      ldX.is_default === 1 
  );
  if (ldLvDefaults) {
    frm.set_value("highest_operation_voltage_lv", ldLvDefaults.um);
    frm.set_value("ac_phase_lv", ldLvDefaults.ac_phase);
    frm.set_value("li_phase_lv", ldLvDefaults.li);
  } else {
    frm.set_value("highest_operation_voltage_lv", "");
    frm.set_value("ac_phase_lv", "");
    frm.set_value("li_phase_lv", "");
  }
}

// Function to set HV defaults based on selected settings
function fnSetHvDefaults(frm, iSettings) {
  var ldHvDefaults = iSettings.hv_voltage_setting.find(
    (ldX) =>
      ldX.is_default === 1 
  );
  if (ldHvDefaults) {
    frm.set_value("hv_rated_voltage", ldHvDefaults.voltage_to);
    frm.set_value("highest_operation_voltage_hv", ldHvDefaults.um);
    frm.set_value("ac_phase_hv", ldHvDefaults.ac_phase);
    frm.set_value("li_phase_hv", ldHvDefaults.li);
  }
}
