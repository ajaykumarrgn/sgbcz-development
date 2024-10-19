frappe.ui.form.on('Design', {
    
	factory(frm){
	    fnResetValues(frm);
	},
	is_design(frm){
	    fnResetValues(frm);
	}
});
 
function fnResetValues(frm) {
    
    function fnResetFields(iFields, defaultValue = '') {
        for (let field of iFields) {
            frm.set_value(field, defaultValue);
        }
    }
    
    function fnResetItemTabFields(iFields) {
        for (let field of iFields) {
            frm.set_value(field, '');
            if (frm.doc.factory === 'SGBCZ' && !frm.doc.is_design) {
                // If factory is 'SGBCZ' and not is_design, 
                //make the field visible and editable
                frm.set_df_property(field, "hidden", field !== 'direct_material_cost');
                frm.set_df_property(field, "read_only", false);
            } else {
                // Otherwise, hide the field and make it read-only
                frm.set_df_property(field, "hidden", true);
                frm.set_df_property(field, "read_only", true);
            }
        }
    }

    // Internal function to clear HTML fields
    function fnResetHtmlFields(iFields) {
        for (let field of iFields) {
            let htmlInput = $(frm.fields_dict[field].wrapper).find('input');
            htmlInput.val('');
        }
    }

    // Internal function to reset fields to their 
    //default values as specified in the metadata
    function fnResetToDefault(iFields) {
        for (let fieldname of iFields) {
            const FIELD_META = frm.meta.fields.find(field => 
                    field.fieldname === fieldname);
            if (FIELD_META) {
                frm.set_value(fieldname, FIELD_META.default);
            }
        }
    }

    if (frm.doc.status === 'Draft') {
        
        // Resetting specific fields to empty
        if (frm.doc.hv2 && frm.doc.factory === 'SGBCZ') {
            fnResetFields([
                'hv_rated_voltage', 'highest_operation_voltage_hv', 
                'ac_phase_hv', 'li_phase_hv', 'hv1', 'hv2'
            ]);
        }
        
        //clear only if two lv are there for SGBCZ
        if(frm.doc.lv_2 && frm.doc.factory === 'SGBCZ'){
            fnResetFields([
                'lv_rated_voltage', 'lv1', 'lv_2']);
        }

        // Resetting item tab fields
        fnResetItemTabFields([
            "direct_material_cost", "labour", "production_overhead", 
            "cost_of_goods", "sales_overhead", "administrative_overhead", "total_cost"
        ]);

        fnResetToDefault(['tapping_plus_step', 'impedance']);
        
       
        if(!frm.doc.is_design){
            fnResetToDefault(['rating']);
        }
            
        if (frm.doc.hv2 && frm.doc.factory === 'SGBCZ') {
            // Clearing HTML fields
            fnResetHtmlFields(['hv_html']);
        }
        
        if(frm.doc.lv_2 && frm.doc.factory === 'SGBCZ'){
            // Clearing HTML fields
            fnResetHtmlFields(['lv_html']);
        }

        //onchange of factory clear every field
        if(frm.doc.factory != 'SGBCZ'){
            fnResetHtmlFields(['hv_html', 'lv_html', 'power_lv']);
            fnResetFields([
                'hv_rated_voltage', 'highest_operation_voltage_hv', 
                'ac_phase_hv', 'li_phase_hv', 'hv1', 'hv2',
                'lv_rated_voltage', 'lv1', 'lv_2', 'power_lv1', 'power_lv2'
            ]);
        }
    }
}