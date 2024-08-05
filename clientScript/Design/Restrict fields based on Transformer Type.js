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
                frm.fields_dict['lv_rated_voltage'].df.placeholder = 'LV';
            }
 
            // Triggering the toggle fields based on the factory by here.
            frm.trigger('fnToggleFields');
        }
    },
    // When factory is changed, fields also changed for that dependent request.
    factory: function(frm) {
            //set the lv1 and lv 2 to null
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
        
    },
    
    refresh: function(frm) {
       
        if(frm.doc.status != 'Draft'){
          setTimeout(function() {
             fnHTMLFieldsReadOnly();
        }, 500);
            frm.set_read_only();
            frm.disable_save();
        }
        if(frm.doc.is_design){
          
            fnIsDesignBasedFields(frm)
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
                //the mentioned fields will be hide from display
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
            
            
            //at RGB hide parallel_coil
            //hide uk_hv_lv, impedance based on the presence of lv 2 value
            if (frm.doc.factory === 'RGB') {
                frm.toggle_display('uk_hv_lv', frm.doc.lv_2 ? false : true);
                frm.toggle_display('impedance', frm.doc.lv_2 ? false : true);
                frm.toggle_display('parallel_coil', false);
            }
            
            //at RGB hide parallel_coil
            //hide impedance based on the presence of lv 2 value
            if (frm.doc.factory === 'NEU') {
                frm.toggle_display('impedance', frm.doc.lv_2 ? false : true);
                frm.toggle_display('parallel_coil', false);
            }
            
            if (frm.doc.factory === 'SGBCZ') {
                
                //for is_design or lv 2 value present 
                //hide the parallel coil
                if (frm.doc.is_design || frm.doc.hv2 > 0) {
                    frm.toggle_display('parallel_coil', false);
                }
                
                //for is_design hide the type of lv
                if (frm.doc.is_design) {
                    frm.toggle_display('type_lv', false);
                }
            }
           
        
    },
    
    // Set the default value for the THDi is 5 when designing the transformer
    // When calculation is needed by Gitra, only need HV 
    //rated voltage not HV1 and HV2
    is_design: function(frm) {
        if (frm.doc.is_design) {
            
            //message indicating what are the fields are resetted
            frappe.msgprint(__('Resetted THDi value to 5 and LPA to 0'));
            
            //set the default value for thdi and lpa
            frm.set_value('thdi', 5);
            frm.set_value('lpa', 0);
    
            //reset the placeholder of hv_rated_voltage
            frm.fields_dict['hv_rated_voltage'].set_label('HV Value(V)');
            frm.set_df_property('hv_rated_voltage', 'placeholder', 'HV');
          
            fnIsDesignBasedFields(frm)
            
            
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
 
            //the thdi value can either be 5 or 20 
            //for SGBCZ is_design condition
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
        
        //When there is double voltage on HV then Parallel coil 
        //should be hidden for SGBCZ.
        
        if (frm.doc.factory === 'SGBCZ' && !frm.doc.is_design) {
            frm.set_df_property('parallel_coil', 'hidden', frm.doc.hv2 > 0);
         }
    },
 
    // When the factory is changed, dependent fields also
    // want to be show or hide based on the factory
    validate: function(frm) {
            
            //for SGBCZ LV should be mandatory
            if (frm.doc.factory === 'SGBCZ' && !frm.doc.lv_rated_voltage) {
                frappe.msgprint(__('LV Value is mandatory'));
                frappe.validated = false; 
                return;
            }
            
            //For RGB if lv_2 is given rating lv1, rating lv2 and
            //uk_lv1 and uk_lv2 are mandatory
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
            
            //For NEU if lv_2 is given rating lv1, rating lv2 and
            // ukhv_lv1, ukhv_lv2 are mandatory
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

function fnIsDesignBasedFields(frm){
     // Hide hv_html field
    frm.toggle_display('hv_html', false);
    // Display hv_rated_voltage field
    frm.toggle_display('hv_rated_voltage', true);
    //make hv_rated_voltage field mandatory
    frm.set_df_property('hv_rated_voltage', 'reqd', true);
    //there will be no type of lv
    frm.set_df_property('type_lv', 'hidden', true);
    //electrostatic_screen, parallel_coil should be hidden on sgncz is_design condition
    frm.set_df_property('electrostatic_screen', 'hidden', frm.doc.factory === 'SGBCZ' && frm.doc.is_design);
    frm.set_value('electrostatic_screen', 0);
    frm.set_df_property('parallel_coil', 'hidden', frm.doc.factory === 'SGBCZ' && frm.doc.is_design);
    //restricting vector group, climatic and enviromental class option
    //later this value will be maintained in gitra settings
    frm.set_df_property('vector_group', 'options', ['Dyn1', 'Dyn5', 'Dyn7', 'Dyn11']);
    frm.set_df_property('climatic_class', 'options', ['C2', 'C3']);
    frm.set_df_property('environmental_class', 'options', ['E2', 'E3']);
}

// When changing the HTMl field, clear the below field value
// as well as html input value
function fnResetValues(frm) {
 
        frm.set_value('lv_rated_voltage', '');
        frm.set_value('highest_operation_voltage_hv', '');
        frm.set_value('ac_phase_hv', '');
        frm.set_value('li_phase_hv', '');
        
        //clearing html field(hv_html, lv_html)
        
        let hvHtmlInput = $(frm.fields_dict.hv_html.wrapper).find('input');
        hvHtmlInput.val('');
        let lvHtmlInput = $(frm.fields_dict.lv_html.wrapper).find('input');
        lvHtmlInput.val('');
    
}

//function to make html field read_only
function fnHTMLFieldsReadOnly() {
    //looping through each fields
    Object.keys(cur_frm.fields_dict).forEach(fieldname => {
        let htmlField = cur_frm.fields_dict[fieldname].$wrapper;

        if (htmlField) {
           
                htmlField.find('.control-input').each(function() {
                    // Find the parent .form-group and then hide the .control-input div
                    let parentFormGroup = $(this).closest('.form-group');
                    $(this).hide();

                    // Show the next immediate sibling of the parent .form-group div
                    parentFormGroup.find('.control-value').show();
                });
            
        } else {
            // console.error(`${fieldname} not found`);
        }
    });
}
