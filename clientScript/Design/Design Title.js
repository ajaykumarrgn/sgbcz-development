//In Earlier, we have the formation of the Design name 
// as Rating/HV/LV/Impedance/Li Phase
// Now ,sometimes HV1 and HV2 or LV1 and Lv2 are present, 
// so that change the formation
// as Rating/HV1/HV2/LV/Impedance/Li Phase 
// or Rating/HV/LV1/LV2/Impedance/Li Phase.
cur_frm.cscript.custom_validate = function (doc) {
  function fnGetCleanString(iFloat, isHV) {
    if (iFloat === null || iFloat === undefined) {
      return "";
    }
    var lFloatInStr = isHV
      ? (parseFloat(iFloat) / 1000).toString()
      : iFloat.toString();
    // Remove trailing zeros after the decimal point
    lFloatInStr = lFloatInStr.replace(/(\.\d*?)0+$/, "$1");
    // Replace . with ,
    return lFloatInStr.replace(/\./g, ",");
  }
  function fnCombineVoltageValues(iV, iV1, iV2, isHV) {
    return iV
      ? fnGetCleanString(iV, isHV)
      : iV1 && iV2
      ? fnGetCleanString(iV1, isHV) + "/" + fnGetCleanString(iV2, isHV)
      : "";
  }

  // Determine the impedance or uk values 
  // based on factory and LV1 and LV2 fields
  function fnPutImpedanceOrUK() {
    if (doc.lv1 && doc.lv_2) {
      // If both LV1 and LV2 are present
      if (doc.factory === "RGB") {
        return (
          fnGetCleanString(doc.uk_lv1, false) +
          "/" +
          fnGetCleanString(doc.uk_lv2, false)
        );
      } else if (doc.factory === "NEU") {
        return (
          fnGetCleanString(doc.ukhv_lv1, false) +
          "/" +
          fnGetCleanString(doc.ukhv_lv2, false)
        );
      } else {
        // If factory is neither RGB nor NEU, return empty string
        return "";
      }
    } else {
      // If LV1 and LV2 are not both present, return impedance
      return doc.impedance || "";
    }
  }

  // Generate document title based on field values
  var lDocTitle =
    doc.transformer_type +
    " " +
    doc.rating +
    "/" +
    fnCombineVoltageValues(doc.hv_rated_voltage, doc.hv1, doc.hv2, true) +
    "/" +
    fnCombineVoltageValues(doc.lv_rated_voltage, doc.lv1, doc.lv_2, false) +
    "/" +
    fnPutImpedanceOrUK() +
    "/" +
    doc.li_phase_hv;

  // Set the document title
  doc.title = lDocTitle;
};
