//Added for removing the create new item option in the transformer type field
frappe.ui.form.on('Design', {
  onload(frm) {
    // Create a MutationObserver to watch for dropdowns being added to the DOM
    new MutationObserver(() => {
    // Iterate over all listbox dropdowns (used in Link field suggestions)
      $("ul[role='listbox']").each(function () {
        // Specifically target the Transformer Type input
        if ($(this).prev("input[data-fieldname='transformer_type']").length) {
        // Hide the 'Create a new Item' option (identified by the plus icon)
          $(this).find("div[role='option']:has(i.fa-plus)").hide();
        }
      });
    // Start observing changes in the document body to catch dynamically loaded dropdowns
    }).observe(document.body, { childList: true, subtree: true });
  }
});