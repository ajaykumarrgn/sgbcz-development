frappe.ui.form.on("Design", {
  onload(frm) {
    if (!frm.is_new()) {
      if (
        frm.doc.status === "Calculation Received" &&
        (!frm.doc.factory || !frm.doc.transformer_type)
      ) {
        frm.set_value("factory", "SGBCZ");
        frm.set_value("transformer_type", "DTTHZ2N");
        if (frm.doc.item) {
          frm.set_value("status", "Item Created");
        }
        frm.save().then(() => {
          fnUpdateButtonGroup(frm);
        });
      }
    }
  },

  factory(frm) {
    if (frm.doc.factory !== "SGBCZ") {
      frm.set_value("is_design", 0);
      frm.set_df_property("is_design", "hidden", 1);
    } else {
      frm.set_df_property("is_design", "hidden", 0);
    }
    fnFetchTransformerType(frm);
  },

  refresh(frm) {
    fnFetchTransformerType(frm);
    fnUpdateButtonGroup(frm);
    if (frm.is_new()) {
      fnDirectMaterial(frm);
    }
  },

  is_design(frm) {
    fnUpdateButtonGroup(frm);
    fnDirectMaterial(frm);
  },

  status(frm) {
    fnUpdateButtonGroup(frm);
    fnDirectMaterial(frm);
  },

  item(frm) {
    if (!frm.doc.item && frm.doc.status === "Item Created") {
      if (frm.doc.is_design === 1) {
        frm.set_value("status", "Calculation Received");
        frm.save().then(() => {
          fnUpdateButtonGroup(frm);
        });
      } else {
        frm.set_value("status", "Draft");
        frm.save().then(() => {
          fnUpdateButtonGroup(frm);
        });
      }
    }
  },
});

function fnFetchTransformerType(frm) {
  var lXmlDataTab = document.getElementById("design-xml_data_tab-tab");
  if (frm.doc.factory !== "SGBCZ") {
    lXmlDataTab.hidden = true;
  } else {
    lXmlDataTab.hidden = false;
  }

  const ldTRANSFORMERMAPPING = {
    SGBCZ: "DTTHZ2N",
    RGB: "RGB",
    NEU: "NEU",
  };
  const lGetItemGroup = ldTRANSFORMERMAPPING[frm.doc.factory];

  frappe.call({
    method: "get_item_variant_based_on_factory",
    args: { factory: lGetItemGroup },
    callback: function (response) {
      if (response.message) {
        set_field_options("transformer_type", response.message);
      }
    },
  });
}

function fnUpdateButtonGroup(frm) {
  const STATUS = frm.doc.status;
  let iButtonLabel = "";
  let iButtonFunction = null;

  if (STATUS === "Draft" && frm.doc.is_design === 1) {
    iButtonLabel = "Create Design";
    iButtonFunction = fncreateDesign;
  } else if (STATUS === "Draft" && frm.doc.is_design === 0) {
    iButtonLabel = "Create Item";
    iButtonFunction = fncreateItem;
  } else if (STATUS === "Calculation Received" && !frm.doc.item) {
    iButtonLabel = "Create Item";
    iButtonFunction = fncreateItem;
  } else if (STATUS === "Item Created" && frm.doc.item) {
    iButtonLabel = "View Item";
    iButtonFunction = fnviewItem;
  } else if (STATUS === "Item Created" && !frm.doc.item) {
    iButtonLabel = "Create Item";
    iButtonFunction = fncreateItem;
  }

  fnShowButtonGroup(frm, iButtonLabel, iButtonFunction);
}

function fnShowButtonGroup(frm, iButtonLabel, iButtonFunction) {
  frm.clear_custom_buttons();
  if (iButtonLabel && iButtonFunction) {
    frm.add_custom_button(__(iButtonLabel), function () {
      iButtonFunction(frm);
    });
  }
}

function fnDirectMaterial(frm) {
  if (frm.doc.status === "Draft" && frm.doc.is_design === 0) {
    frm.set_df_property("direct_material_cost", "read_only", 0);
    frm.set_df_property("direct_material_cost", "reqd", 1);
  } else {
    frm.set_df_property("direct_material_cost", "read_only", 1);
    frm.set_df_property("direct_material_cost", "reqd", 0);
  }
}

function fncreateItem(frm) {
  frappe.call({
    method: "create_item_from_design",
    args: { design: frm.doc.name },
    callback: function (response) {
      if (response.message) {
        frappe.show_alert(
          { message: __("Item Created"), indicator: "green" },
          5
        );
        frm.set_value("item", response.message.item_code);
        frm.set_value("status", "Item Created");
        frm.refresh_fields();
        frm.save().then(() => {
          if (frm.doc.is_design === 1) {
            frappe.show_progress(
              __("Creating with Pdf.."),
              50,
              100,
              __("Please wait")
            );
            frappe.call({
              method: "frappe.client.get",
              args: { doctype: "Gitra Settings" },
              callback: function (gitraResponse) {
                if (gitraResponse.message) {
                  const ldDATASHEETLANGUAGES =
                    gitraResponse.message.datasheet_languages;
                  const laLANGUAGES = ldDATASHEETLANGUAGES.map(
                    (lang) => lang.language
                  );
                  let lTitle = frm.doc.title;
                  if (lTitle) {
                    let lSpaceIndex = lTitle.indexOf(" ");
                    if (lSpaceIndex !== -1) {
                      lTitle = lTitle.substring(lSpaceIndex + 1);
                    }
                    lTitle = lTitle.replace(
                      /\//g,
                      gitraResponse.message.naming_separator
                    );
                  }
                  frappe.call({
                    method: "pdf_on_submit.api.fn_doc_pdf_source_to_target",
                    args: {
                      im_source_doc_type: frm.doc.doctype,
                      im_source_doc_name: frm.doc.name,
                      im_languages: laLANGUAGES,
                      im_letter_head: "Data Sheet",
                      im_target_doc_type: "Item",
                      im_target_doc_name: response.message.item_code,
                      im_file_name: `Datasheet_${lTitle}_${frm.doc.name}_{language}`,
                    },
                    callback: function (pdfResponse) {
                      if (pdfResponse.message) {
                        frappe.hide_progress();
                        frm.save().then(() => {
                          fnUpdateButtonGroup(frm);
                        });
                      }
                    },
                  });
                }
              },
            });
          } else {
            fnUpdateButtonGroup(frm);
          }
        });
      } else {
        frappe.show_alert(
          { message: __("Error Creating Item"), indicator: "red" },
          5
        );
      }
    },
  });
}

function fncreateDesign(frm) {
  frm.set_value("status", "Perform Calculation");
  frm.save();
}

function fnviewItem(frm) {
  frappe.set_route("item", frm.doc.item);
}
