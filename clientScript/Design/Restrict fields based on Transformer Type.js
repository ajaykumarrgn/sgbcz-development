frappe.ui.form.on('Design', {
    onload: function(frm) {
        if (frm.is_new()) {
            // Set the default factory as "SGBCZ" and trafo type as "DTTHZ2N" 
            //when the design form is new
            frm.set_value('factory', 'SGBCZ');
            frm.set_value('transformer_type', 'DTTHZ2N');
 
            // In the SGBCZ factory used only one LV value 
            // so I have renamed the LV rated Voltage into LV value
            frm.fields_dict['lv_rated_voltage'].df.label = 'LV Value(V)';
 
            // If factory is SGBCZ, set the LV rated voltage 
            //as a mandatory field
            // not for other Trafo.
            // Other Trafo sometimes have the LV1 and LV2 as mandatory
            // so that Lv rated Voltage is not mandatory for other factories
            // Set the LV placeholder when the single LV value is needed.
            if (frm.doc.factory === 'SGBCZ') {
                frm.set_df_property('lv_rated_voltage', 'reqd', true);
                frm.fields_dict['lv_rated_voltage'].$input.attr('placeholder', 'LV');
            }
 
            // Triggering the toggle fields based on the factory by here.
            frm.trigger('fnToggleFields');
        }
    },
    // When factory is changed, fields also changed for that dependent request.
    factory: function(frm) {
        if (frm.is_new()) {
            frm.set_value('lv1', '');   
            frm.set_value('lv_2', ''); 
            fnResetValues(frm);
            
            switch (frm.doc.factory) {
                case 'SGBCZ':
                    frm.set_df_property('lv_rated_voltage', 'reqd', true);
                    frm.set_value('transformer_type', 'DTTHZ2N');
                    break;
                case 'RGB':
                case 'NEU':
                    frm.set_df_property('lv_rated_voltage', 'reqd', false);
                    frm.set_value('transformer_type', 
                                frm.doc.factory === 'RGB' ? 'DTTH2N' : 'DOTML');
                    break;
            }
            
            frm.trigger('fnToggleFields');
            frm.trigger('fnUpdateInsulationClass');
            frm.trigger('fnTappings');
        }
    },
    
    refresh: function(frm) {
        if(frm.doc.status != 'Draft'){
            frm.set_read_only();
            frm.disable_save();
        }
        if(frm.doc.is_design){
            frm.toggle_display('hv_html', false);
            // Display hv_rated_voltage field
            frm.toggle_display('hv_rated_voltage', true);
            frm.set_df_property('hv_rated_voltage', 'reqd', true);
            frm.set_df_property('electrostatic_screen', 'hidden', frm.doc.factory === 'SGBCZ' && frm.doc.is_design);
            frm.set_value('electrostatic_screen', 0);
            frm.set_df_property('vector_group', 'options', ['Dyn1', 'Dyn5', 'Dyn7', 'Dyn11']);
            frm.set_df_property('climatic_class', 'options', ['C2', 'C3']);
            frm.set_df_property('environmental_class', 'options', ['E2', 'E3']);
        }
     
            frm.trigger('fnTappings');
            frm.trigger('fnUpdateInsulationClass');
            frm.trigger('fnToggleFields');
        
    },
    // Set the options for the insulation class varying for the factory
    fnUpdateInsulationClass: function(frm) {
      
            let laOptions = [];
            switch (frm.doc.factory) {
                case 'RGB':
                    laOptions = ['F', 'H'];
                    break;
                case 'NEU':
                    laOptions = ['A', 'B', 'C', 'F', 'H'];
                    break;
            }
            frm.set_df_property('insulation_class', 'options', laOptions);
        
    },
    // Set the options for the Tappings is varying based on factory
    fnTappings: function(frm) {
      
            let laTappings = [];
            switch (frm.doc.factory) {
                case 'SGBCZ':
                    laTappings = ['2', '3'];
                    break;
                case 'RGB':
                case 'NEU':
                    laTappings = ['2', '3', '4', '5', '6', '7', '8'];
            }
            frm.set_df_property('tapping_plus', 'options', laTappings);
            frm.set_df_property('tapping_minus', 'options', laTappings);
        
    },
    // This function is used to hide and show fields 
    //based on the factory by controlling here.
    fnToggleFields: function(frm) {
       
            const FIELDS = [
                'vector_html', 'power_lv', 'uk_lv', 'uk_hv_lv', 'lv_html',
                'insulation_class', 'winding_material', 'cooling_method',
                'type_cooling', 'impedance', 'lv_rated_voltage', 'bushing_hv',
                'cooling_method', 'type_cooling', 'temperature_rise',
                'temperature_rise_oil', 'temperature_rise_winding',
                'climatic_class', 'environmental_class',
                'temperature_rise_datasheet', 'temperature_rise_gitra',
                'parallel_coil','ip_protection','type_lv'
            ];
 
            FIELDS.forEach(field => frm.toggle_display(field, false));
 
            let laShowFields = [];
            switch (frm.doc.factory) {
                case 'SGBCZ':
                    laShowFields = ['vector_group', 'impedance', 
                                    'lv_rated_voltage', 'temperature_rise',
                                    'climatic_class', 'environmental_class',
                                    'temperature_rise_datasheet',
                                    'ip_protection',
                                    'temperature_rise_gitra',
                                    'parallel_coil','type_lv'];
                    break;
                case 'RGB':
                    laShowFields = FIELDS.filter(field => ![
                                'lv_rated_voltage', 'bushing_hv',
                                'cooling_method', 'type_cooling',
                                'uk_hv_lv', 'temperature_rise_oil',
                                'temperature_rise_winding',
                                'temperature_rise_datasheet',
                                'temperature_rise_gitra',
                                'parallel_coil'].includes(field));
                    laShowFields.push('temperature_rise');
                    break;
                case 'NEU':
                    laShowFields = FIELDS.filter(field => ![
                                'lv_rated_voltage', 'uk_lv',
                                'temperature_rise', 'climatic_class',
                                'environmental_class','ip_protection',
                                'temperature_rise_datasheet','type_lv',
                                'temperature_rise_gitra',
                                'parallel_coil'].includes(field));
                    laShowFields.push('temperature_rise_oil', 
                                      'temperature_rise_winding');
                    break;
            }
 
            laShowFields.forEach(field => frm.toggle_display(field, true));
 
            if (frm.doc.factory === 'RGB' && frm.doc.lv_2) {
                frm.toggle_display('uk_hv_lv', false);
                frm.toggle_display('impedance', false);
            }
            if(frm.doc.factory === 'SGBCZ' && frm.doc.is_design) {
                frm.toggle_display('parallel_coil', false);
                frm.toggle_display('type_lv', false);
            }
        
    },
    
    // Set the default value for the THDi is 5 when designing the transformer
    // When calculation is needed by Gitra, only need HV 
    //rated voltage not HV1 and HV2
    is_design: function(frm) {
        if (frm.doc.is_design) {
            frappe.msgprint(__('Resetted THDi value to 5 and LPA to 0'));
            frm.ignore_thdi_change = true;
            frm.set_value('thdi', 5);
            frm.set_value('lpa', 0);
            // Hide hv_html field
            frm.toggle_display('hv_html', false);
            // Display hv_rated_voltage field
            frm.toggle_display('hv_rated_voltage', true);
            frm.set_df_property('hv_rated_voltage', 'reqd', true);
            frm.set_df_property('type_lv', 'hidden', true);
            frm.fields_dict['hv_rated_voltage'].set_label('HV Value(V)');
            frm.fields_dict['hv_rated_voltage'].$input.attr('placeholder', 'HV');
            frm.set_df_property('electrostatic_screen', 'hidden', frm.doc.factory === 'SGBCZ' && frm.doc.is_design);
            frm.set_value('electrostatic_screen', 0);
            frm.set_df_property('parallel_coil', 'hidden', frm.doc.factory === 'SGBCZ' && frm.doc.is_design);
            frm.set_df_property('vector_group', 'options', ['Dyn1', 'Dyn5', 'Dyn7', 'Dyn11']);
            frm.set_df_property('climatic_class', 'options', ['C2', 'C3']);
            frm.set_df_property('environmental_class', 'options', ['E2', 'E3']);
            
        } else {
            // Display hv_html field
            frm.toggle_display('hv_html', true);
            // Hide hv_rated_voltage field
            frm.toggle_display('hv_rated_voltage', false);
            frm.set_df_property('type_lv', 'hidden', false);
            frm.set_df_property('electrostatic_screen', 'hidden', false);
            frm.set_df_property('parallel_coil', 'hidden', false);
            frm.set_df_property('vector_group', 'options', [ 'Dyn1', 'Dyn5', 'Dyn7', 'Dyn11','Yy0','Yd1',
            'Yd5','Yd7','Yd11','YD1','Yz1','Yz5','YZ5','Yz7','Yz11','Dzn0']);
            frm.set_df_property('climatic_class', 'options', ['C2', 'C3', 'C4', 'C5']);
            frm.set_df_property('environmental_class', 'options', ['E2', 'E3', 'E4', 'E5']);
            
        }
    },
    // When designing the transformer need to follow some condition
    // such as THDi is either 5 or 20
    // Otherwise it accepts from 5 to 99,
    // it exceeds this value arise the error message
    thdi: function(frm) {
       
            let thdiValue = frm.doc.thdi;
            if (!thdiValue) return;
 
            // if (frm.ignore_thdi_change) {
            //     frm.ignore_thdi_change = false;
            //     return;
            // }
 
            if (frm.doc.is_design) {
                if (![5, 20].includes(thdiValue)) {
                    frm.set_value('thdi','');
                    frappe.throw('Enter the THDi Value as 5 or 20');
                    
                }
            } else {
                if (thdiValue < 5 || thdiValue > 99) {
                    frappe.throw('Enter a THDi value between 5 and 99');
                }
            }
        
    },
    
    hv2(frm){
        if(frm.doc.hv2 > 0){
             frm.set_df_property('parallel_coil', 'hidden', true);
        }else{
             frm.set_df_property('parallel_coil', 'hidden', false);
        }
    },
 
    // When the factory is changed, dependent fields also
    // want to be show or hide based on the factory
    validate: function(frm) {
     
            if (frm.doc.factory === 'SGBCZ' && !frm.doc.lv_rated_voltage) {
                frappe.msgprint(__('LV Value is mandatory'));
                frappe.validated = false; 
                return;
            }
            if (frm.doc.factory === 'RGB' && frm.doc.lv_2 && 
            (!frm.doc.power_lv1 || !frm.doc.power_lv2)) {
                frappe.msgprint(__('Please enter both Rating LV1 and Rating LV2 for RGB'));
                frappe.validated = false;
                return;
            } else if (frm.doc.factory === 'RGB' && frm.doc.lv_2 && 
            (!frm.doc.uk_lv1 || !frm.doc.uk_lv2)) {
                frappe.msgprint(__('Please enter both UK LV1 and UK LV2 for RGB'));
                frappe.validated = false;
                return;
            }
            
            if (frm.doc.factory === 'NEU' && frm.doc.lv_2 && 
            (!frm.doc.power_lv1 || !frm.doc.power_lv2)) {
                frappe.msgprint(__('Please enter both Rating LV1 and Rating LV2 for RGB'));
                frappe.validated = false;
                return;
            } else if (frm.doc.factory === 'NEU' && frm.doc.lv_2 && 
            (!frm.doc.ukhv_lv1 || !frm.doc.ukhv_lv2)) {
                frappe.msgprint(__('Please enter both UK HV LV1 and UK HV LV2'));
                frappe.validated = false;
                return;
            }
 
            frappe.validated = true; // If all validations pass
        }
    
});
 
// When changing the HTMl field, clear the below field value
// as well as html input value
function fnResetValues(frm) {
 
        frm.set_value('lv_rated_voltage', '');
        frm.set_value('highest_operation_voltage_hv', '');
        frm.set_value('ac_phase_hv', '');
        frm.set_value('li_phase_hv', '');
        let hvHtmlInput = $(frm.fields_dict.hv_html.wrapper).find('input');
        hvHtmlInput.val('');
        let lvHtmlInput = $(frm.fields_dict.lv_html.wrapper).find('input');
        lvHtmlInput.val('');
    
}