//Make the form editable only on draft status(ISS-2024-00133)
frappe.ui.form.on('Design', {

    onload(frm){
        fnSetFormToReadOnly(frm); //<<ISS-2024-00133
    },

// When factory is changed, fields also changed for that dependent request.
//onchange of factory select field event
factory: function(frm) {
    
    //setting the default transformer type
    //based on factory
    switch (frm.doc.factory) {
        case 'SGBCZ':
            frm.set_df_property('lv_rated_voltage', 'reqd', true);
            frm.set_value('transformer_type', 'DTTHZ2N');
            break;
        case 'RGB':
            frm.set_df_property('lv_rated_voltage', 'reqd', false);
            frm.set_value('transformer_type', 'DTTH2N');
            break;
        case 'NEU':
            frm.set_df_property('lv_rated_voltage', 'reqd', false);
            frm.set_value('transformer_type', 'DOTML');
            break;
    }
    
    frm.trigger('fnToggleFields');
    
},

refresh: function(frm) {
    fnSetFormToReadOnly(frm); //<<ISS-2024-00133

    //is_design based field
    //restriction
    if(frm.doc.is_design){
      
        fnUpdateFieldBasedOnIsDesign(frm);
    }
     
    if (frm.is_new()) {
        // Set the default factory as "SGBCZ" and trafo type as "DTTHZ2N" 
        //when the design form is new
        frm.set_value('factory', 'SGBCZ');
        frm.set_value('transformer_type', 'DTTHZ2N');
        // If factory is SGBCZ, set the LV rated voltage 
        //as a mandatory field
        // not for other Trafo.
        // Other Trafo sometimes have the LV1 and LV2 as mandatory
        // so that Lv rated Voltage is not mandatory for other factories
        // Set the LV placeholder when the single LV value is needed.
        if (frm.doc.factory === 'SGBCZ') {
            frm.set_df_property('lv_rated_voltage', 'reqd', true);
            frm.fields_dict.lv_rated_voltage.df.placeholder = 'LV';
        }
        // Triggering the toggle fields based on the factory by here.
        frm.trigger('fnToggleFields');
    }
        frm.trigger('fnToggleFields');
    
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

//onchange of is_design checkbox event
is_design: function(frm) {
    if (frm.doc.is_design) {
        
        //message indicating what are the fields are resetted
        frappe.msgprint(__('Resetted THDi value to 5 and LPA to 0'));
        
        //set the default value for thdi and lpa
        frm.set_value('thdi', 5);
        frm.set_value('lpa', 0);

        //reset the placeholder of hv_rated_voltage
        frm.set_df_property('hv_rated_voltage', 'placeholder', 'HV');
        //reset the placeholder of lv_rated_voltage
        frm.set_df_property('lv_rated_voltage', 'placeholder', 'LV');
      
        fnUpdateFieldBasedOnIsDesign(frm);
        
        
    } else {
        // Display hv_html field
        frm.toggle_display('hv_html', true);
        frm.set_df_property('hv_rated_voltage', 'reqd', false);
        // Hide hv_rated_voltage field
        frm.toggle_display('hv_rated_voltage', false);
        frm.set_df_property('type_lv', 'hidden', false);
        frm.set_df_property('electrostatic_screen', 'hidden', false);
        frm.set_df_property('parallel_coil', 'hidden', false);
        frm.trigger('fnToggleFields');
    }
},


// When designing the transformer need to follow some condition
// such as THDi is either 5 or 20
// Otherwise it accepts from 5 to 99,
// it exceeds this value arise the error message

//onchange of thdi int field event
thdi: function(frm) {

    let thdiValue = frm.doc.thdi;
   
    //the thdi value can either be 5 or 20 
    //for SGBCZ is_design condition
    if (frm.doc.is_design) {
        if (![5, 20].includes(thdiValue)) {
            frappe.msgprint(__('Enter the THDi Value as 5 or 20'));
            
        }
    } else {
        if (thdiValue < 5 || thdiValue > 99) {
            frappe.msgprint(__('Enter a THDi value between 5 and 99'));
        }
    }

},

//onchange of hv2 int field event
hv2(frm){
    
    //When there is double voltage on HV then Parallel coil 
    //should be hidden for SGBCZ.
    
    if (frm.doc.factory === 'SGBCZ' && !frm.doc.is_design) {
        const SHOULD_HIDE_PARALLEL_COIL = frm.doc.hv2 > 0;
        
        // Set the 'parallel_coil' field to hidden or 
        //visible based on hv2 value
        frm.set_df_property('parallel_coil', 'hidden', SHOULD_HIDE_PARALLEL_COIL);
        
        // If hidden, set the 'parallel_coil' 
        //field value to 0
        if (SHOULD_HIDE_PARALLEL_COIL) {
            frm.set_value('parallel_coil', 0);
        }
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
        //other than sgbcz, check if either 
        //lv_rated_voltage or lv_2 is empty
        if(frm.doc.factory !== 'SGBCZ' && 
            (!frm.doc.lv_rated_voltage && !frm.doc.lv_2)){
            frappe.msgprint(__('LV Value is mandatory'));
            frappe.validated = false; 
            return;
        }
        //if lpa is present, lpa distance is mandotory
        if(frm.doc.lpa > 0 && !frm.doc.lpa_distance){
            frappe.msgprint(__('LPA Distance cannot be empty'));
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

function fnUpdateFieldBasedOnIsDesign(frm){
     // Hide hv_html field
    frm.toggle_display('hv_html', false);
    // Display hv_rated_voltage field
    frm.toggle_display('hv_rated_voltage', true);
    //make hv_rated_voltage field mandatory
    frm.set_df_property('hv_rated_voltage', 'reqd', true);
    //there will be no type of lv
    frm.set_df_property('type_lv', 'hidden', true);
    //electrostatic_screen, parallel_coil should be 
    //hidden on sgncz is_design condition
    frm.set_df_property('electrostatic_screen', 'hidden', 
        frm.doc.factory === 'SGBCZ' && frm.doc.is_design);
    frm.set_value('electrostatic_screen', 0);
    frm.set_df_property('parallel_coil', 'hidden', 
        frm.doc.factory === 'SGBCZ' && frm.doc.is_design);
}

function fnSetFormToReadOnly(frm){
    //readonly was given at refresh
    //but at some point it is not
    //working as expected so done the
    //same in onload event
    if(frm.doc.status != 'Draft' && !frm.is_new()) { //<<ISS-2024-00133
        setTimeout(function() {
        fnSetHTMLFieldsToReadOnly();
    }, 500);
        frm.set_read_only();
        frm.disable_save();
    }
}

//function to make html field read_only
function fnSetHTMLFieldsToReadOnly() {
    //looping through each fields
    Object.keys(cur_frm.fields_dict).forEach(fieldname => {
        let htmlField = cur_frm.fields_dict[fieldname].$wrapper;

        if (htmlField) {
           
                htmlField.find('.control-input').each(function() {
                    // Find the parent .form-group and then 
                    //hide the .control-input div
                    let parentFormGroup = $(this).closest('.form-group');
                    $(this).hide();

                    // Show the next immediate sibling of the 
                    //parent .form-group div
                    parentFormGroup.find('.control-value').show();
                });
            
        } else {
            // console.error(`${fieldname} not found`);
        }
    });
}