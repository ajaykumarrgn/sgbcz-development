// Change References
// Packaging details are not automatically fetched from
// the customer record during the quotation creation process (ISS-2024-00064)
// Remove "Create New Item" Option in Quotation Item (ISS-2025-00050)

//Filter Search results
cur_frm.set_query("parent_item", "items", function (doc, cdt, cdn) {
  var laParentItems = [];
  //Filter Items not belonging to Accessories
  laParentItems = doc.items
    .filter((ldItem) => ldItem.item_group !== "Accessories")
    .map((ldItem) => {
      return ldItem.item_name;
    });
  return {
    filters: [["Item", "name", "in", laParentItems]],
  };
}),
  frappe.ui.form.on("Quotation", {
    transaction_date(frm) {
      frm.events.fnSetValidTill(frm);
    },

    //<<ISS-2024-00064
    //The doctype functionality fetch if empty has been depreciated
    //add_fetch function , it take "link_fieldname_that_connect_source_target",
    //"source_fieldname_to_fetch_from", 
	//"target_fieldname_in_current_document" as argument

    onload(frm) {
      // Detects newly added elements using DOMNodeInserted
      // Identify and remove the "Create a new Item" option
      // Dynamically in the item code, as simple items are not created.
	  // >>ISS-2025-00050
      $(document).on("DOMNodeInserted", function (event) {
        // Remove the "Create a new Item" option whenever it appears
        $("div[role='option'] p[title='Create a new Item']").parent().remove();
      }); //<<ISS-2025-00050

      frm.add_fetch("party_name", "packaging", "ll_packaging");
    },

    //ISS-2024-00064 >>

    refresh: function (frm) {
      if (!frm.doc.shipping_address_name) {
        frm.doc.shipping_address_name = frm.doc.customer_address;
        frm.refresh_fields();
      }
      if (!frm.doc.company_contact) {
        frm.doc.company_contact = frappe.session.user_fullname;
        frm.refresh_fields();
      }
      if (frm.is_new()) {
        frm.events.fnSetValidTill(frm);
        frm.events.fnSetQuotationPresets(frm);
        frm.events.fnSetTermsAndConditions(frm);
      }
      // frm.fields_dict['items'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
      //     var child = locals[cdt][cdn];
      //     //console.log(child);
      //     return {
      //         filters:[
      //             ['Item', 'has_variants', '=', 0],
      //         ],
      //         options: 'order by is_catalog_item desc'
      //     };
      // };
    },
    fnSetQuotationPresets(frm) {
      var lResponse = frappe.call({
        method: "frappe.client.get_value",
        args: {
          doctype: "Quotation Presets",
          fieldname: ["delivery_time", "delivery_text", "packaging"],
          async: false,
        },
        callback: function (ldResponse) {
          if (!frm.doc.delivery_time) {
            frm.doc.delivery_time = ldResponse.message.delivery_time;
          }
          if (!frm.doc.delivery_text) {
            frm.doc.delivery_text = ldResponse.message.delivery_text;
          }
          if (!frm.doc.ll_packaging) {
            frm.doc.ll_packaging = ldResponse.message.packaging;
          }

          frm.refresh_fields();
        },
      });
    },
    fnSetValidTill(frm) {
      frappe.call({
        method: "frappe.client.get_value",
        args: {
          doctype: "Quotation Presets",
          fieldname: ["default_validity"],
          async: false,
        },
        callback: function (ldResponse) {
          var lDefaultValidity = ldResponse.message.default_validity;
          frm.doc.valid_till = frappe.datetime.add_days(
            frm.doc.transaction_date,
            lDefaultValidity
          );
          frm.refresh_fields();
        },
      });
    },
    fnSetTermsAndConditions(frm) {
      frm.doc.tc_name = `Offer Condition_${frm.doc.language}`;
      frappe.db.get_value(
        "Terms and Conditions",
        { name: frm.doc.tc_name },
        "terms",
        function (idTermsCondition) {
          if (idTermsCondition) {
            frm.doc.terms = idTermsCondition.terms;
          }
        }
      );
      frm.refresh_fields();
    },

    // on change of customer change the terms and conditions too
    customer_name(frm) {
      frm.events.fnSetTermsAndConditions(frm);
    },
    fnGetPos(frm, idItem) {
      var ldPrevItem = frm.doc.items[item.idx - 2];
      // If a previous item is available (e.g., "DTTZ2N-1600/10/6/75"):
      // - Find the item group.
      // - If the parent item group is "Accessories" 
	  // or the item group is "Services":
      // - Increment the position (pos) by 0.1 
	  // (e.g., change 10 to 10.1, or 10.1 to 10.2).
      // - Set the parent item group to the previous item's parent item group.
      // - If the item group is "DTTZ2N":
      // - Round the previous position (pos) down 
	  // to the nearest whole number (e.g., from 10.4 to 10).
      // - Add 10 to the position (e.g., change 10.4 to 20).
      // - Set the parent item group to the item's item group.
      // - Carry forward the main item quantity 
	  // (items with whole number positions, i.e.,
      //item groups other than "Accessories" or "Services") to their sub-items.
      if (ldPrevItem) {
        frappe.call({
          method: "frappe.client.get",
          args: {
            doctype: "Item",
            name: idItem.item_code,
            async: false,
            fields: ["item_group"],
          },
          callback: function (ldResponse) {
            frappe.db.get_value(
              "Item Group",
              { name: ldResponse.message.item_group },
              "old_parent",
              function (idItemgroup) {
                if (
				  idItemgroup.old_parent == "Accessories" ||
                  ldResponse.message.item_group == "Services"
                ) {
					idItem.pos = ldPrevItem.pos + 1 / 10;
					idItem.qty = ldPrevItem.qty;
					idItem.custom_parent_item_group =
                    ldPrevItem.custom_parent_item_group;
                  frm.refresh_fields();
                } else {
				  idItem.pos = Math.floor(ldPrevItem.pos) + 10;
                  fnGetParentItemGroup(idItem);
                  frm.refresh_fields();
                }
              }
            );
          },
        });
      } else {
        // return 10;
        idItem.pos = 10;
        fnGetParentItemGroup(idItem);
        frm.refresh_fields();
      }
    },
  });

frappe.ui.form.on("Quotation Item", {
  item_code(frm, cdt, cdn) {
    var ldItem = locals[cdt][cdn];
    if (!ldItem.pos || !ldItem.custom_parent_item_group) {
      //console.log("Item code is being processed...");
      frm.events.fnGetPos(frm, ldItem);
      //commented this line because we are
      //setting the pos and custom_parent_item_group
      //  item.pos = frm.events.fnGetPos(frm, item);
      ldItem.rate = frm.doc.price_list_rate;
      frm.refresh_fields();
      //console.log("Item code processing complete.");
    }
  },
});

//function to get the parent item group
function fnGetParentItemGroup(idItem) {
  frappe.db.get_value(
    "Item Group",
    idItem.item_group,
    "parent_item_group",
    function (iValue) {
		idItem.custom_parent_item_group =
        iValue.parent_item_group === "All Item Groups"
          ? idItem.item_group
          : iValue.parent_item_group;
    }
  );
}
