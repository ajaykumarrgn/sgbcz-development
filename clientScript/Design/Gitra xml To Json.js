//Change Request
//TASK-2024-00299: To calculate the direct material cost with 200, considering the design based on the parallel coil.
frappe.ui.form.on("Design", {
  refresh(frm) {
    /*
     * The function loads the xml-js library, converts xml to json
     * stores the json to field gitra_json_downstream
     * @params {xmlString} string calculated xml received from Gitra
     * @params {fileUrl} string cdn of xml-js javascript library
     */
    function fnConvertXmlToJson(iXmlString, iFileUrl) {
      const LD_OPTIONS = {
        compact: true,
        ignoreAttributes: true, //ignores attributes and nodes
      };

      // create a script node in the html document
      // equivalent to <script src="https://unpkg.com/xml-js@1.6.11/dist/xml-js.min.js" 
      // type="text/javascript"></script>
      let LD_DOMScriptEle = document.createElement("script");

      LD_DOMScriptEle.setAttribute("src", iFileUrl);
      LD_DOMScriptEle.setAttribute("type", "text/javascript");

      document.body.appendChild(LD_DOMScriptEle);

      // success event
      LD_DOMScriptEle.addEventListener("load", () => {
        // Call the xml2json from the xml-js library and parse the as Json object
        const LD_JSONDATA = JSON.parse(xml2json(iXmlString, LD_OPTIONS));
        //console.log()
        // convert to string so that it can be stored to the code field
        frm.doc.gitra_json_downstream = JSON.stringify(LD_JSONDATA, null, 2);

        // Repalce the "," with "." as decimal separator
        // parseFloat(text.replace(",", "."));
        // set the currency field from the gitra xml to design
        frm.set_value(
          "currency",
          LD_JSONDATA.sgb.TGtWickelzettel.preiswaehrung._text
        );
        // set the direct material cost field from the gitra xml to design
        frm.set_value(
          "direct_material_cost",
          parseFloat(
            LD_JSONDATA.sgb.TGtWickelzettel.preisauseds._text.replace(",", ".")
          )
        );

        //>>TASK-2024-00299
        //If a parallel coil appears in the design, add 200 to the direct material cost
        const LA_TGTSPULE =
          LD_JSONDATA.sgb.TGtWickelzettel.TGtWickelzettelSystemeListe
            .TGtWickelzettelSystem[1].TGtWicklungenListe.TGtWicklung
            .TGtSpulenListe.TGtSpule;
        if (LA_TGTSPULE.length === 2) {
          frm.set_value(
            "direct_material_cost",
            parseFloat(
              LD_JSONDATA.sgb.TGtWickelzettel.preisauseds._text.replace(",", ".")
            ) + 200
          );
          // Reset this value of Labour to zero to ensure the recalculation is triggered
          frm.set_value("labour", 0);
          // Clear the last calculated on
          // for the recalculation scenario
          frm.set_value("last_calculated_on", "");
        }

        //<<TASK-2024-00299
        // refresh changes
        frm.refresh_fields();
        // save the form
        frm.save();
      });
      // error event
      LD_DOMScriptEle.addEventListener("error", (ev) => {
        console.log("Error on loading file", ev);
      });
    }
    // CDN Url of script
    var lFileUrl = "https://unpkg.com/xml-js@1.6.11/dist/xml-js.min.js";
    // Convert the Gitra XML to Json
    if (!frm.doc.gitra_json_downstream && frm.doc.gitra_xml_downstream) {
      fnConvertXmlToJson(frm.doc.gitra_xml_downstream, lFileUrl);
    } // Convert XML to JSON

    // update the last file pulled date to last changed on.
    if (frm.doc.upstream_file && !frm.doc.last_calculated_on) {
      const L_DATEPART = frm.doc.upstream_file.split("_")[1]; // Extract the date part
      frm.set_value("last_calculated_on", L_DATEPART);
      // refresh changes
      frm.refresh_fields();
      // save the form
      frm.save();
    }
  },
});
