//Earlier the vector group options are "1, 7, 5, 11...."
//but on factory development the vector group option is change
//to "Dyn1, Dyn5, Yy......"
//Earilier THDi is calculated indirectly based on K4 Factor (Yes , No)
//In Factory development we have added THDi directly in doctype

frappe.ui.form.on('Design', {
    onload: function(frm) {
        if (!frm.is_new() && (frm.doc.status == 'Calculation Received' || 
            frm.doc.status == 'Item Created')) {
            var lVectorGroup = parseInt(frm.doc.vector_group);
            
            if(frm.doc.thdi == null  && frm.doc.k4_factor ) {
                if(frm.doc.k4_factor == 'Yes'){
                    frm.set_value('thdi',20);
                }
                else {
                    frm.set_value('thdi',5);
                }
                
            }
            if (!isNaN(lVectorGroup)) {
                frm.set_value('vector_group', 'Dyn' + lVectorGroup);
            } 
            frm.save();
           
        }
    }
});