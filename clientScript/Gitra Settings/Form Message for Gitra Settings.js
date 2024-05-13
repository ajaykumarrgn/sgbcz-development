frappe.ui.form.on('Gitra Settings', {
  //Refresh event
  refresh(frm) {
      fnSetIntroMessage(frm);
  },
  //Event handler for transformer_type field
  transformer_type: function(frm) {
      fnSetIntroMessage(frm);
  }
});

function fnSetIntroMessage(frm) {
  const ltransformerType = frm.doc.transformer_type;
  // Remove the Intro Message
  frm.set_intro(false);
  // Set Intro message at top of the form in blue color
  frm.set_intro(__('You are viewing the Gitra Settings for item template ') + ltransformerType, 'blue');
}
