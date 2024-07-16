//Earlier the vector group options are "1, 7, 5, 11...."
//but on factory development the vector group option is change
//to "Dyn1, Dyn5, Yy......"
//Earilier THDi is calculated indirectly based on K4 Factor (Yes , No)
//In Factory development we have added THDi directly in doctype
// Designs created before adding the factory option.
// If the status is 'Calculation Received', set:
// Factory: 'SGBCZ'
 // Transformer Type: 'DTTHZ2N'
 //enable is design
       

 frappe.ui.form.on('Design', {
   
    onload: function(frm) {
        if (!frm.is_new()) {
             var lCanSave = 0 ;
           
            if (frm.doc.status === 'Calculation Received' || 
            frm.doc.status === 'Item Created') {
               
                var lVectorGroup = parseInt(frm.doc.vector_group);
                
                if (frm.doc.thdi == 0 && frm.doc.k4_factor) {
                    if (frm.doc.k4_factor === 'Yes') {
                        frm.set_value('thdi', 20);
                        lCanSave = lCanSave + 1 ;
                    } else {
                        frm.set_value('thdi', 5);
                         lCanSave = lCanSave + 1 ;
                    }
                }
                if (!isNaN(lVectorGroup)) {
                    frm.set_value('vector_group', 'Dyn' + lVectorGroup);
                     lCanSave = lCanSave + 1 ;
                }
                if(!frm.doc.type_lv){
                frm.set_value('type_lv', 'Prepreg');
                 lCanSave = lCanSave + 1 ;
                }
            }

           
            if (frm.doc.status === 'Calculation Received' && (!frm.doc.factory || 
                !frm.doc.transformer_type || !frm.doc.is_design)) {
                frm.set_value('factory', 'SGBCZ');
                frm.set_value('transformer_type', 'DTTHZ2N');
                 frm.set_value('is_design', 1);
                
                frm.refresh_field('is_design');
                if (frm.doc.item) {
                    frm.set_value('status', 'Item Created');
                }
                 lCanSave = lCanSave + 1 ;
            }
            if(lCanSave > 0){
            frm.save();
            }
        }
    }
    
});
