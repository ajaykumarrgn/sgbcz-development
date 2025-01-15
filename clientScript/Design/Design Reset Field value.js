// Change References
// In SGBCZ only, retain the UK (%) and IP Protection values
// when switching both from non-design to 'Is Design' 
// and from 'Is Design' to non-design. (ISS-2024-00129)

frappe.ui.form.on('Design', {
    
	factory(frm){
	    fnResetValues(frm);
	},
	is_design(frm){
	    fnResetValues(frm);
	}
});
 
function fnResetValues(frm) {
    //function to reset the field with default as empty
    function fnResetFields(iaFields, defaultValue = '') {
        for (let lField of iaFields) {
            frm.set_value(lField, defaultValue);
        }
    }
    //reset item tab fields for changing the behaviour of the factory 
    function fnResetItemTabFields(iaFields) {
        for (let iField of iaFields) {
            frm.set_value(iField, '');
            if (frm.doc.factory === 'SGBCZ' && !frm.doc.is_design) {
                //Make the field visible and editable
                //when the factory is 'SGBCZ' and also is not the design, 
                frm.set_df_property(iField, "hidden", iField !== 'direct_material_cost');
                frm.set_df_property(iField, "read_only", false);
            } else {
                // Otherwise, hide the field and make it as read-only
                frm.set_df_property(iField, "hidden", true);
                frm.set_df_property(iField, "read_only", true);
            }
        }
    }
    //To clear HTML fields when changing the one factory to another.
    function fnResetHtmlFields(iaFields) {
        for (let lField of iaFields) {
            let htmlInput = $(frm.fields_dict[lField].wrapper).find('input');
            htmlInput.val('');
        }
    }
    // Restore the default values after resetting the factory values
    function fnResetToDefault(iaFields) {
        for (let lFieldname of iaFields) {
            const FIELD_META = frm.meta.fields.find(field => 
                    field.fieldname === lFieldname);
            if (FIELD_META) {
                // In SGBCZ, Retain the Uk value when transition 
                // both from non- design to is design 
                // and from 'Is Design' to non-design.>>(ISS-2024-00129) 
                if (frm.doc.factory === 'SGBCZ' && lFieldname === 'impedance') {
                    // Skip resetting the impedance field 
                    // for the current iteration.
                    // Use continue to skip this field only.
                    // Reset the remaining fields as usual.
                    continue; 
                }
                //<<(ISS-2024-00129)
                frm.set_value(lFieldname, FIELD_META.default);
            }
        }
    }
    if (frm.doc.status === 'Draft') {
        // When the factory is 'SGBCZ' and 
        // switches from non-design to is_design, 
        // reset specific fields to empty, as hv2 is not present in is_design.
        if (frm.doc.hv2 && frm.doc.factory === 'SGBCZ') {
            fnResetFields([
                'hv_rated_voltage', 'highest_operation_voltage_hv', 
                'ac_phase_hv', 'li_phase_hv', 'hv1', 'hv2'
            ]);
        }
        // In SGBCZ, only one LV value is allowed. 
        // When switching from the other two factories,
        // such as RGB and NEU, 
        // reset the LV-related fields mentioned below to empty.
        if(frm.doc.lv_2 && frm.doc.factory === 'SGBCZ'){
            fnResetFields([
                'lv_rated_voltage', 'lv1', 'lv_2']);
        }
        
        // Resetting item tab fields when shifting the factory
        fnResetItemTabFields([
            "direct_material_cost", "labour", "production_overhead", 
            "cost_of_goods", "sales_overhead", "administrative_overhead",
            "total_cost"
        ]);
        
        //reset to meta data default
        fnResetToDefault(['tapping_plus_step', 'impedance']);
        
        if(!frm.doc.is_design){
            //reset to meta data default
            fnResetToDefault(['rating']);
        }
            
        if (frm.doc.hv2 && frm.doc.factory === 'SGBCZ') {
            // Clearing HTML field values
            fnResetHtmlFields(['hv_html']);
        }
        
        if(frm.doc.lv_2 && frm.doc.factory === 'SGBCZ'){
            // Clearing HTML field values
            fnResetHtmlFields(['lv_html']);
        }

        //onchange of each factory clear every field
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