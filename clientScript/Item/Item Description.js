// Change References
// Formation of Enclosure Item Description:(Issue# : ISS-2024-00004)

frappe.ui.form.on("Item", {
  refresh(frm) {
    // Hide Create Multiple Variants option from Item form View
    //setTimeout(() => {
    //frm.remove_custom_button('Multiple Variants', 'Create');
    // }, 10);
    // Allow Edit of Item Variants table after validation error and before save
    // frm.events.fnSetAttributesToEdit(frm);
  },
  validate(frm) {
    // Allow Edit of Item Variants table after validation error and before save
    frm.events.fnSetAttributesToEdit(frm);
    var lItemDescription = "";
    var lIndex;

    if (
      !frm.doc.description ||
      frm.doc.description ==
        '<div class="ql-editor read-mode"><p><br></p></div>' ||
      frm.is_new()
    ) {
      if (frm.doc.variant_of) {
        //The following are for Enclosures
        // Find the index of 'IP Rating' attribute in the attributes array
        // Commented this line due to incorrect attribute name for rating
        // Previously, "IP Rating" was the rating attribute, 
        // but it has now been changed to "Power (kVA)"
        //lIndex = frm.doc.attributes.findIndex(element => element.attribute=="IP Rating"); //<<ISS-2024-00004

        lIndex = frm.doc.attributes.findIndex(
          (element) => element.attribute == "Power (kVA)"
        ); //<<ISS-2024-00004
        if (lIndex >= 0) {
          lItemDescription +=
            "- " +
            frm.doc.attributes[lIndex].attribute_value +
            [" [kVA]"] +
            ", ";
        }

        //The following are for Temparature Tests
        // Find the index of 'Enclosure' attribute in the attributes array
        //Previously, "eNCLOSURE" was the attribute,
        // but it has now been changed to "Enclosure IP Rating"
        //lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Enclosure"); <<ISS-2024-00004
        lIndex = frm.doc.attributes.findIndex(
          (element) => element.attribute == "Enclosure IP Rating"
        );
        // Add IP rating to the Description if there is index
        if (lIndex >= 0) {
          lItemDescription +=
            "Rating " + frm.doc.attributes[lIndex].attribute_value + ", ";
        }

        // Find the index of 'Mounting Type' attribute in the attributes array
        lIndex = frm.doc.attributes.findIndex(
          (element) => element.attribute == "Mounting Type"
        );
        // Add mounting to the Description if there is index
        if (lIndex >= 0) {
          lItemDescription += frm.doc.attributes[lIndex].attribute_value;
        }

        //>>ISS-2024-00004
        //Cooling method not include in the item descrtion 
        // for the Enclosure template
        // Find the index of 'Cooling Method' attribute in the attributes array
        // lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Cooling Method");
        // if(lIndex>=0){

        // lItemDescription   = lItemDescription + ','  + ' Cooling Method: ' + (frm.doc.attributes[lIndex].attribute_value).toString();

        // } //<<ISS-2024-00004
        if (lItemDescription) {
          lItemDescription =
            "Accessories specification:<br>" + lItemDescription;
        }
      } // if(frm.doc.variant_of)
      //Fill item description as 'Item Group specification:' 
      // if nothing is filled from Above
      if (!lItemDescription) {
        lItemDescription =
          "<p>" + frm.doc.item_group + " specification:" + "</p>";
      }
      cur_frm.set_value("description", lItemDescription);
    }
  },
  fnSetAttributesToEdit(frm) {
    // Allow Edit of Item Variants table after validation error and before save
    frm.set_df_property(
      "attributes",
      "read_only",
      frm.is_new() || frm.doc.has_variants ? 0 : 1
    );
  },
});
