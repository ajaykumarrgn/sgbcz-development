frappe.ui.form.on('Design', {
    refresh: function(frm) {
        // HTML template for data fields
        frm.events.render_templates(frm);
            $(document).on('change', '.attribute-input', function () {
            let inputElement = this;
            let HTMLField = inputElement.getAttribute('data-fieldname');
            let value = inputElement.value;
            
            fnTransposeHtmlToDocField(frm, value, HTMLField, document)
            // frm.set_value(HTMLField, value);
        });


    },
    render_templates: function(frm) {
        

        // Define fields with their respective field names and labels
        let fields = [
            { fieldname: 'hv_html', label: 'HV Value(V)', placeholder: 'HV1/HV2',type: 'data' },
            { fieldname: 'lv_html', label: 'LV Value(V)', placeholder: 'LV1/LV2',type: 'data' },
            { fieldname: 'power_lv', label: 'Power LV', placeholder: 'Power LV1/Power LV2',type: 'data' },
            { fieldname: 'uk_lv', label: 'UK LV',  placeholder: 'UK LV1/UK LV2', type: 'data' },
            { fieldname: 'uk_hv_lv', label: 'UK HV-LV',  placeholder: 'UK HV LV1/UK HV LV2', type: 'data' },
            { fieldname: 'vector_html', label: 'Vector Group', type: 'combo' },
           
            
        ];

        // Iterate over each field and render its template
    //     fields.forEach(function(field) {
            
    //         let template = fnGetTemplate(frm ,field);
    //         let data = { frm: frm, field: field };
    //         frm.set_df_property(field.fieldname, 'options', frappe.render(template, data));
    //     });
    // },
        fields.forEach(function(field) {
            let template = fnGetTemplate(frm, field);
            let data = { frm: frm, field: field };

            if (frm.doc.lv_2) {
                // Show all fields
                frm.set_df_property(field.fieldname, 'hidden', false);
                frm.set_df_property(field.fieldname, 'options', frappe.render(template, data));
            } else {
                // Hide power_lv, uk_lv, and uk_hv_lv fields if lv_2 is not present
                if (['power_lv', 'uk_lv', 'uk_hv_lv','vector_html'].includes(field.fieldname)) {
                    frm.set_df_property(field.fieldname, 'hidden', true);
                    frm.set_fields ('')
                } else {
                    frm.set_df_property(field.fieldname, 'options', frappe.render(template, data));
                }
            }
        });

        // Ensure specific fields are hidden if lv_2 is not present
        if (!frm.doc.lv_2) {
            ['power_lv', 'uk_lv', 'uk_hv_lv', 'vector_html'].forEach(function(fieldname) {
                frm.set_df_property(fieldname, 'hidden', true);
            });
            frm.set_df_property('vector_group', 'hidden', false); // Show vector_group
        } else {
            frm.set_df_property('vector_group', 'hidden', true); // Hide vector_group if lv_2 is present
        }
        
    },
    hv_rated_voltage(frm){frm.events.render_templates(frm)},
    hv1(frm){frm.events.render_templates(frm)},
    lv_rated_voltage(frm){frm.events.render_templates(frm)},
    
    lv1(frm){frm.events.render_templates(frm)},
    lv_2(frm){frm.events.render_templates(frm)},
    vector_group(frm) { frm.events.render_templates(frm); },
    vector_group_lv2(frm) { frm.events.render_templates(frm); },
    
    power_lv1(frm){frm.events.render_templates(frm)},
    uk_lv1(frm){frm.events.render_templates(frm)},
    ukhv_lv1(frm){frm.events.render_templates(frm)},
    
    // hv2(frm){frm.events.render_templates(frm)},
    fnTransposeDocfieldToHtml(iFieldName, frm) {
        switch(iFieldName){
            case 'hv_html':
                return fnCombineDocValuesforHtml(frm, 'hv_rated_voltage', 'hv1', 'hv2')
            case 'lv_html':
                return fnCombineDocValuesforHtml(frm, 'lv_rated_voltage', 'lv1', 'lv_2')
            case 'vector_html':
                return fnFormatDocVectorforHtml(frm);
            case 'power_lv':
                return fnCombineDocValuesforHtml(frm, null, 'power_lv1', 'power_lv2');
            case 'uk_lv':
                return fnCombineDocValuesforHtml(frm, null, 'uk_lv1', 'uk_lv2');
            case 'uk_hv_lv':
                return fnCombineDocValuesforHtml(frm, null, 'ukhv_lv1', 'ukhv_lv2');
            
        }    
    
    }
    
            

});

function fnCombineDocValuesforHtml(frm, iDocField, iDocField1, iDocField2){
    if (frm.doc[iDocField]){ 
        return frm.doc[iDocField];
    } else if(frm.doc[iDocField1]) { 
        return frm.doc[iDocField1] + '/' + frm.doc[iDocField2];
    } 
    
}



function fnFormatDocVectorforHtml(frm) {
    // if (frm.doc.vector_group) {
    //     frm.set_value('vector_html', frm.doc.vector_group); 
    //     //frm.set_value('vector_html_2', null);
    // } else if (frm.doc.vector_group_lv2) { 
    //     frm.set_value('vector_html', frm.doc.vector_group_lv1);
    //     frm.set_value('vector_html_2', frm.doc.vector_group_lv2);
    //  }
}
function fnFormatDocLvforHtml(frm){
    if (frm.doc.lv_rated_voltage) {
        return frm.doc.lv_rated_voltage
    } else if( frm.doc.lv1) { 
        return frm.doc.lv1 + '/' + frm.doc.lv_2
    }
}
// function fnGetTemplate(frm, iField){
    
//     switch(iField.type){
//         case "data":
//             return fnGetDataTemplate();
//         case "combo":
//             return fnGetComboTemplate();
//             // if(frm.doc.lv_rated_voltage){
//             //  return fnGetSelectTemplate();
//             // } else if(frm.doc.lv1){
//             // return fnGetComboTemplate();
//             // }
//             // break;
//         default:
//             break;
//     }
//}

function fnGetTemplate(frm, iField) {
    switch (iField.type) {
        case "data":
            return fnGetDataTemplate(iField.placeholder);
        case "combo":
            return fnGetComboTemplate(iField.placeholder);
        default:
            break;
    }
}
function fnTransposeHtmlToDocField(frm, iValue, iHtmlField, iDocument) {
    
    switch(iHtmlField){
        case 'hv_html':
            let lHvSplit = iValue.split('/')
            if(lHvSplit.length > 1) {
                frm.set_value('hv1', lHvSplit[0])
                frm.set_value('hv2', lHvSplit[1])
                frm.set_value('hv_rated_voltage', null)
                
            }else {
                frm.set_value('hv_rated_voltage', iValue)
                frm.set_value('hv1', null)
                frm.set_value('hv2', null)
            }
            break;
        case 'lv_html':
            let lLvSplit = iValue.split('/')
            if(lLvSplit.length > 1) {
                frm.set_value('lv1', lLvSplit[0])
                frm.set_value('lv_2', lLvSplit[1])
                frm.set_value('lv_rated_voltage', null)
                
            }else {
                frm.set_value('lv_rated_voltage', iValue)
                frm.set_value('lv1', null)
                frm.set_value('lv_2', null)
            }
            break;
            
        case 'power_lv':
           let lPowerLvSplit = iValue.split('/');
            if (lPowerLvSplit.length > 1) {
                frm.set_value('power_lv1', lPowerLvSplit[0]);
                frm.set_value('power_lv2', lPowerLvSplit[1]);
                frm.set_value('power_lv', iValue); 
            } 
            break;
            
        case 'uk_lv':
           let lUkLvSplit = iValue.split('/');
            if (lUkLvSplit.length > 1) {
                frm.set_value('uk_lv1', lUkLvSplit[0]);
                frm.set_value('uk_lv2', lUkLvSplit[1]);
                frm.set_value('uk_lv', iValue); 
                
            }
            break;
            
        case 'uk_hv_lv':
           let lUkHvLvSplit = iValue.split('/');
            if (lUkHvLvSplit.length > 1) {
                frm.set_value('ukhv_lv1', lUkHvLvSplit[0]);
                frm.set_value('ukhv_lv2', lUkHvLvSplit[1]);
                frm.set_value('uk_hv_lv', iValue); 
                
            }
            break;
            
        case 'vector_html_1':
            
            let iVector = document.querySelector('[data-fieldname="vector_html_2"]');
            
            // Check if vector_html_2 is filled
            if (iVector.value) {
                frm.set_value('vector_group_lv1', iValue);
                frm.set_value('vector_group_lv2', iVector);
                frm.set_value('vector_group', iValue);
            } else {
                frm.set_value('vector_group', iValue);
                frm.set_value('vector_group_lv1', null);
                frm.set_value('vector_group_lv2', null);
            }
            break;
        case 'vector_html_2':
            if(iValue) {
                frm.set_value('vector_group_lv2', iValue);
                frm.set_value('vector_group_lv1', frm.doc.vector_group);
                frm.set_value('vector_group', null);
            }
            else {
                // frm.set_value('vector_group', frm.doc.vector_group_lv1);
                // frm.set_value('vector_group_lv1', null);
                // frm.set_value('vector_group_lv2', null);
                if (frm.doc.vector_group_lv1) {
                    frm.set_value('vector_group', frm.doc.vector_group_lv1);
                    frm.set_value('vector_group_lv1', null);
                    frm.set_value('vector_group_lv2', null);
                } else {
            
                    frappe.msgprint(__('Vector Group 1 is mandatory'), __('Validation'));
                }
            }
            break;
            
    }
    
}
function fnGetComboTemplate(){
    
    const lSelectTemplate = `<div class="row">
    <div class="form-column col-sm-6">
        <div class="frappe-control input-max-width" data-fieldtype="Select" data-fieldname="{{field.fieldname}}_1">
            <div class="form-group">
                <div class="clearfix">
                    <label class="control-label reqd" style="padding-right: 0px;">{{field.label}} 1</label>
                    <span class="help"></span>
                </div>
                <div class="control-input-wrapper">
                    <div class="control-input flex align-center">
                        <select value="{{frm.events.fnTransposeDocfieldToHtml(field.fieldname, frm)}}" type="text" autocomplete="off" class="input-with-feedback form-control ellipsis bold attribute-input" maxlength="140" data-fieldtype="Select" data-fieldname="{{field.fieldname}}_1" placeholder="" data-doctype="Design">
                            <option></option>
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="7">7</option>
                            <option value="11">11</option>
                        </select>
                        <div class="select-icon ">
                            <svg class="icon  icon-sm" style="">
                                <use class="" href="#icon-select"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="control-value like-disabled-input bold" style="display: none;">7</div>
                    <p class="help-box small text-muted"></p>
                </div>
            </div>
        </div>
    </div>
    <div class="form-column col-sm-6">
        <div class="frappe-control input-max-width" data-fieldtype="Select" data-fieldname="{{field.fieldname}}_2">
            <div class="form-group">
                <div class="clearfix">
                    <label class="control-label" style="padding-right: 0px;">{{field.label}} 2</label>
                    <span class="help"></span>
                </div>
                <div class="control-input-wrapper">
                    <div class="control-input flex align-center">
                        <select value="{{frm.events.fnTransposeDocfieldToHtml(field.fieldname, frm)}}" type="text" autocomplete="off" class="input-with-feedback form-control ellipsis bold attribute-input" maxlength="140" data-fieldtype="Select" data-fieldname="{{field.fieldname}}_2" placeholder="" data-doctype="Design">
                            <option></option>
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="7">7</option>
                            <option value="11">11</option>
                        </select>
                        <div class="select-icon ">
                            <svg class="icon  icon-sm" style="">
                                <use class="" href="#icon-select"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="control-value like-disabled-input bold" style="display: none;">5</div>
                    <p class="help-box small text-muted"></p>
                </div>
            </div>
        </div>
    </div>
</div>
			`
		return lSelectTemplate;
}



function fnGetDataTemplate(){
    
    const lTemplate = `<form>
				<div class="frappe-control input-max-width" data-fieldtype="Data" data-fieldname="{{field.fieldname}}">
				<div class="form-group">
					<div class="clearfix">
						<label class="control-label reqd" style="padding-right: 0px;">{{field.label}}</label>
						<span class="help"></span>
					</div>
					<div class="control-input-wrapper">
						<div class="control-input"><input value ="{{frm.events.fnTransposeDocfieldToHtml(field.fieldname, frm)}}" type="text" autocomplete="off" class="input-with-feedback form-control bold attribute-input" data-fieldtype="Data" data-fieldname={{field.fieldname}} placeholder="{{field.placeholder}}" data-doctype="Design"></div>
						<div class="control-value like-disabled-input bold" style="display: none;">{{frm.events.fnTransposeDocfieldToHtml(field.fieldname, frm)}}</div>
						<p class="help-box small text-muted"></p>
					</div>
				</div>
			</div></form>`
		return lTemplate;
}


