frappe.ui.form.on('Item', {
onload (frm) {
setTimeout(() => {
    $("[data-doctype='Material Request']").hide();
    $("[data-doctype='Supplier Quotation']").hide();
    $("[data-doctype='Website Item']").hide();
    }, 10);
}
})