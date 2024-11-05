// Change References
// Formation of Enclosure Item Description:(Issue# : ISS-2024-00004)
//Get Item description form the Item Template to Item Creation description
//Item description taken from Template item to Item Creation with different Trafo Type
//>> ISS-2024-00004
frappe.ui.form.on("Item", {
  validate: function (frm) {
    frm.events.set_attributes_to_edit(frm);

    var lItemDescription = ""; // Declare variables for item description
    var lIndex; // Declare the index variable

    // If there is no description or the description equals to empty editor value
    // or the form is new
    if (
      !frm.doc.description ||
      frm.doc.description ==
        '<div class="ql-editor read-mode"><p><br></p></div>' ||
      frm.is_new()
    ) {
      // Check if the item is a variant of another template item
      if (frm.doc.variant_of) {
        // Fetch the template item's description
        frappe.db.get_value(
          "Item",
          frm.doc.variant_of,
          "description",
          function (iTemplate) {
            if (iTemplate.description) {
              lItemDescription = iTemplate.description;
            } else {
              // The following are for Enclosures
              // Find the index of 'Power (kVA)' attribute in the attributes array
              lIndex = frm.doc.attributes.findIndex(
                (element) => element.attribute == "Power (kVA)"
              );
              // Add power to the Description if there is index
              if (lIndex >= 0) {
                lItemDescription +=
                  "- " +
                  frm.doc.attributes[lIndex].attribute_value +
                  " [kVA], ";
              }

              // Find the index of 'Enclosure IP Rating' attribute in the attributes array
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

              // If no description is built, fill item description as 'Item Group specification:'
              if (!lItemDescription) {
                lItemDescription =
                  "<p>" + frm.doc.item_group + " specification:" + "</p>";
              }
            }
            // Set the description
            cur_frm.set_value("description", lItemDescription);
          }
        );
      } else{
        // For non-variant items, follow the same logic
        lIndex = frm.doc.attributes.findIndex(
          (element) => element.attribute == "Power (kVA)"
        );
        if (lIndex >= 0) {
          lItemDescription +=
            "- " + frm.doc.attributes[lIndex].attribute_value + " [kVA], ";
        }

        lIndex = frm.doc.attributes.findIndex(
          (element) => element.attribute == "Enclosure IP Rating"
        );
        if (lIndex >= 0) {
          lItemDescription +=
            "Rating " + frm.doc.attributes[lIndex].attribute_value + ", ";
        }

        lIndex = frm.doc.attributes.findIndex(
          (element) => element.attribute == "Mounting Type"
        );
        if (lIndex >= 0) {
          lItemDescription += frm.doc.attributes[lIndex].attribute_value;
        }

        if (!lItemDescription) {
          lItemDescription =
            "<p>" + frm.doc.item_group + " specification:" + "</p>";
        }

        cur_frm.set_value("description", lItemDescription);
      }
    }
  },

  set_attributes_to_edit: function (frm) {
    // Allow Edit of Item Variants table after validation error and before save
    frm.set_df_property(
      "attributes",
      "read_only",
      frm.is_new() || frm.doc.has_variants ? 0 : 1
    );
  },
});
// << ISS-2024-00004
