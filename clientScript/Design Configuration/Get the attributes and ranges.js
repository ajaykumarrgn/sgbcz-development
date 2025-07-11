frappe.ui.form.on("Design Configuration", {
  onload(frm) {
    // Check if form is new AND child table has rows => duplicated form
    fnIsDuplicateForm(frm);
  },
  factory(frm) {
    //When Switching the factory, clear all the fields from the form
    frm.set_value("transformer_type", "");
    frm.clear_table("attributes");
    frm.refresh_field("attributes");
    return;
  },
  transformer_type(frm) {
    if (!frm.doc.transformer_type) {
      frm.clear_table("attributes");
      frm.refresh_field("attributes");
      return;
    }

    // If duplicated form, do NOT update attributes
    // on transformer_type change
    if (fnIsDuplicateForm(frm)) {
      return;
    }
    if (frm.doc.transformer_type) {
      // Get the Item templates from the Item
      // based on the Transformer Type
      frappe.db
        .get_list("Item", {
          filters: {
            item_name: frm.doc.transformer_type,
            has_variants: 1,
          },
          fields: ["name"],
        })
        .then((laItems) => {
          if (laItems && laItems.length > 0) {
            const LitemName = laItems[0].name;

            frappe.model.with_doc("Item", LitemName, function () {
              const LdItemDoc = frappe.model.get_doc("Item", LitemName);

              // Extract attribute names (i.e.,parameters)
              // from the item based on the trafo type
              if (LdItemDoc && LdItemDoc.attributes) {
                const LaAttributes = LdItemDoc.attributes.map(
                  (ldAttr) => ldAttr.attribute
                );

                frm.clear_table("attributes");

                // Fetch the min and max ranges of the each attribute
                // get from the Item attribute list based on the trafo type
                frappe.db
                  .get_list("Item Attribute", {
                    filters: {
                      attribute_name: ["in", LaAttributes],
                    },
                    fields: ["attribute_name", "from_range", "to_range"],
                  })
                  .then((laItemAttributes) => {
                    //Mapping the attribute names into the paramater field
                    LaAttributes.forEach((ldAttribute) => {
                      let ldChildRow = frm.add_child("attributes");
                      ldChildRow.parameter = ldAttribute;

                      // Find matching attribute in item_attributes list
                      const LdMatchingAttr = laItemAttributes.find(
                        (ldAttr) => ldAttr.attribute_name === ldAttribute
                      );

                      // For each attribute name, create a child row, 
                      // assign the attribute to the parameter field,
                      // and populate the min and max range values 
                      // from the matching item attribute if found

                      if (LdMatchingAttr) {
                        ldChildRow.min = LdMatchingAttr.from_range;
                        ldChildRow.max = LdMatchingAttr.to_range;
                      }
                    });

                    frm.refresh_field("attributes");
                  });
              }
            });
          } else {
            // clear child table if no item found
            frm.clear_table("attributes");
            frm.refresh_field("attributes");
          }
        });
    } else {
      // clear child table if transformer_type cleared
      frm.clear_table("attributes");
      frm.refresh_field("attributes");
    }
  },
});

// Used to retain the item attributes even 
// if the transformer type differs within the same factory
function fnIsDuplicateForm(frm) {
  return frm.is_new() && frm.doc.attributes && frm.doc.attributes.length > 0;
}
