//In earlier, we have set the value 5 or 20 for the Gitra Calculation
//By using the K4 factor.
//But now we have directly set that the value into the field THDi
frappe.ui.form.on("Design", {
  validate(frm) {
    if (
      frm.doc.factory === "SGBCZ" &&
      frm.doc.transformer_type === "DTTHZ2N" &&
      frm.doc.is_design &&
      frm.doc.status === "Draft"
    ) {
      function fnAddTappingsXml(frm, iXml, iaTappingNodes) {
        // Parse the XML template to JavaScript object
        let loXmlDoc = new DOMParser().parseFromString(iXml, "text/xml");
        var lNodeList = loXmlDoc.getElementsByTagName(
          "TGtExportEDSAuftragStellungenListe"
        );
        // Check if the element exists
        if (lNodeList.length > 0) {
          var lTargetNode = lNodeList[0];

          // Add the new nodes to the target element
          iaTappingNodes.forEach(function (iNodeData) {
            var lNewNode = loXmlDoc.createElement(
              "TGtExportEDSAuftragStellung"
            );
            lNewNode.setAttribute("nodetype", "class");
            var lSpannungNode = loXmlDoc.createElement("spannung");
            lSpannungNode.setAttribute("nodetype", "property");
            lSpannungNode.setAttribute("datatype", "xs:double");
            var lSpannungText = loXmlDoc.createTextNode(iNodeData.spannung);
            lSpannungNode.appendChild(lSpannungText);
            lNewNode.appendChild(lSpannungNode);
            lTargetNode.appendChild(lNewNode);
            lTargetNode.appendChild(loXmlDoc.createTextNode("\n"));
          });
        }
        // Convert the XML document to a string
        var lXmlString = new XMLSerializer().serializeToString(loXmlDoc);
        //return lXmlString;
        return fnFormatXml(lXmlString);
      }
      function fnFormatXml(iXml, iTab) {
        // tab = optional indent value, default is tab (\t)
        var lFormatted = "",
          lIndent = "";
        iTab = iTab || "\t";
        iXml.split(/>\s*</).forEach(function (iNode) {
          // decrease indent by one 'tab'
          if (iNode.match(/^\/\w/)) lIndent = lIndent.substring(iTab.length);
          lFormatted += lIndent + "<" + iNode + ">\r\n";
          // increase indent
          if (iNode.match(/^<?\w[^>]*[^\/]$/)) lIndent += iTab; 
        });
        return lFormatted.substring(1, lFormatted.length - 3);
      }

      function fnGetTappingNodes(frm, iaTappingNodes, iTapping, iSign) {
        for (var i = 1; i <= frm.doc[iTapping]; i++) {
          var ldTappingNode = { spannung: "" };
          var lTappingStep = iTapping + "_step";
          ldTappingNode.spannung =
            frm.doc.hv_rated_voltage +
            (iSign * i * frm.doc[lTappingStep] * frm.doc.hv_rated_voltage) /
              100;
          iaTappingNodes.push(ldTappingNode);
        }
        return iaTappingNodes;
      }

      var lDoctype = "Gitra Settings";
      // Initialize the model with doctype Gitra Settings
      frappe.model.with_doc(lDoctype, lDoctype, function () {
        // Then from the model get the list.
        //This will return all attributes of the model including child table
        var laValues = frappe.model.get_list(lDoctype);
        // Regular expression pattern to match variables in double curly braces
        var lPattern = /\{\{([\w.]+)\}\}/g;

        // Resolve expressions and variables
        var lXml = laValues[0].gitra_xml.replace(
          lPattern,
          function (match, iVariable) {
            var lValue = "";
            //Commented this block for using the THDi directly
            //instead of k4_factor
            //if(iVariable==='frm.doc.k4_factor'){
            //  var lk4 = frm.doc.k4_factor == "Yes" ? '6395' : '6396';
            //  lValue = lk4;
            //} else {
            //  lValue = eval(iVariable);
            //}
            switch (iVariable) {
              case "frm.doc.thdi":
                var lThdi = frm.doc.thdi == "20" ? "6395" : "6396";
                lValue = lThdi;
                break;

              case "frm.doc.vector_group":
                //Trim the Number from Vector group
                //only option [1,5,7,11] is accepted in gitra
                let vectorGroup = frm.doc.vector_group;
                lValue = vectorGroup.replace(/\D/g, "");
                break;

              default:
                //inorder to prevent falsy in xml
                //convert it into string
                lValue = String(eval(iVariable));
                break;
            }
            return lValue || "";
          }
        );
        let laTappingNodes = [];
        laTappingNodes = fnGetTappingNodes(
          frm,
          laTappingNodes,
          "tapping_minus",
          -1
        );
        laTappingNodes = fnGetTappingNodes(
          frm,
          laTappingNodes,
          "tapping_plus",
          1
        );

        var lXmlString = fnAddTappingsXml(frm, lXml, laTappingNodes);

        frm.doc.gitra_xml = lXmlString;
      });

      frm.refresh_fields();
    }
  },
});