//In Earlier, we have the formation of the Design name as Rating/HV/LV/Impedance/Li Phase
//Now ,sometimes HV1 and HV2 or LV1 and Lv2 are present, so that change the formation
//as Rating/HV1/HV2/LV/Impedance/Li Phase or Rating/HV/LV1/LV2/Impedance/Li Phase.
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

  // Generate document title based on field values
  var docTitle =
    doc.transformer_type +
    " " +
    doc.rating +
    "/" +
    fnCombineVoltageValues(doc.hv_rated_voltage, doc.hv1, doc.hv2, true) +
    "/" +
    fnCombineVoltageValues(doc.lv_rated_voltage, doc.lv1, doc.lv_2, false) +
    "/" +
    doc.impedance +
    "/" +
    doc.li_phase_hv;

  // Set the document title
  doc.title = docTitle;
};
