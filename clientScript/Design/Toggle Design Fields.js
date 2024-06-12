frappe.ui.form.on('Design', {
    validate(frm) {
        //Get all the HTML fields to validate 
        let fieldsToValidate = fnGetHtmlfields();
        let isValid = true;
        
        for (let field of fieldsToValidate) {
            let value = frm.doc[field.fieldname];
            
            //Check if the html value does not have the value after setting the slash
            if (!isValidHtmlField(value)) {
                frappe.msgprint("Please Enter the value in {0}. Value after slash is missing.", [field.label])
                isValid = false;
            }
        }
        
        // If any field is invalid, mark form as not validated
        if (!isValid) {
            frappe.validated = false;
        }
    },
     
    refresh: function(frm) {
        //Rendering the template when the form is refreshed
        frm.events.render_templates(frm);
        
        //When any changes made in the HTML field 
        $(document).on('change', '.attribute-input', function () {
            // Get the input element triggering the change event
            let inputElement = this;
            // Extract the fieldname associated with the HTML field
            let HTMLField = inputElement.getAttribute('data-fieldname');
            // Retrieve the value of the HTML field
            let value = inputElement.value;
            
            //This function is used to passing the value from the HTML field to Doctype field when changes are made
            fnTransposeHtmlToDocField(frm, value, HTMLField, document);
            
        });
    },
    
    render_templates: function(frm) {
        let fields = fnGetHtmlfields()

        fields.forEach(function (field) {
            let template = fnGetTemplate(frm, field);
            let data = { frm: frm, field: field };
            
            //Check the LV2 is present, show all both HTML and Docfields otherwise hide the some dependent fields based on the LV2
            if (frm.doc.lv_2) {
                // Show all fields when LV2 is present
                frm.set_df_property(field.fieldname, 'hidden', false);
                frm.set_df_property(field.fieldname, 'options', frappe.render(template, data));
            } else {
                // Hide power_lv, uk_lv, uk_hv_lv, and vector_html fields if lv_2 is not present
                if (['power_lv', 'uk_lv', 'uk_hv_lv', 'vector_html'].includes(field.fieldname)) {
                    frm.set_df_property(field.fieldname, 'hidden', true);
                    frm.set_value(field.fieldname, null);
                } else {
                    frm.set_df_property(field.fieldname, 'options', frappe.render(template, data));
                }
            }
        });
        
        //Check if the Vector group is set to visible or not based on the LV2
        if (!frm.doc.lv_2) {
          frm.set_df_property('vector_group', 'hidden', false); // Show vector_group
        } else {
            frm.set_df_property('vector_group', 'hidden', true); // Hide vector_group if lv_2 is present
        }
    },
    
    
    //Re render the html fields once doc fields are set with values
    hv_rated_voltage(frm) { frm.events.render_templates(frm); },
    hv1(frm) { frm.events.render_templates(frm); },
    lv_rated_voltage(frm) { frm.events.render_templates(frm); },
    lv1(frm) { frm.events.render_templates(frm); },
    vector_group(frm) { frm.events.render_templates(frm); },
    vector_group_lv1(frm) { frm.events.render_templates(frm); },
    vector_group_lv2(frm) { frm.events.render_templates(frm); },
    power_lv1(frm) { frm.events.render_templates(frm); },
    uk_lv1(frm) { frm.events.render_templates(frm); },
    ukhv_lv1(frm) { frm.events.render_templates(frm); },
    
    lv_2(frm) { 
        frm.events.render_templates(frm);
        //If LV2 value is not there, Clear the all dependent field values.
        if (!frm.doc.lv_2) {
            frm.set_value('power_lv1', null);
            frm.set_value('power_lv2', null);
            frm.set_value('power_lv', null);
            frm.set_value('uk_lv1', null);
            frm.set_value('uk_lv2', null);
            frm.set_value('uk_lv', null);
            frm.set_value('ukhv_lv1', null);
            frm.set_value('ukhv_lv2', null);
            frm.set_value('uk_hv_lv', null);
        }
    },
    
    // fnGetSelectOptions(fieldname, frm){
    //     return ['', '1','5','7','11'];
    // },
    
    //The function is used to get the vector group options dynamically from the Docfield
    fnGetSelectOptions: function(fieldname, frm) {
        // Fetch the options for the vector_group field dynamically
        if (fieldname === 'vector_html') {
            let options = [];
            if (frm.fields_dict.vector_group) {
                options = frm.fields_dict.vector_group.df.options.split('\n');
            }
            return options;
        }
        
    },
    
    
    //Reversing the values from the doctype field to HTML field after saving the form.
    fnTransposeDocfieldToHtml(iFieldName, frm) {
        
        switch (iFieldName) {
            case 'hv_html':
                return fnCombineDocValuesforHtml(frm, 'hv_rated_voltage', 'hv1', 'hv2');
            case 'lv_html':
                return fnCombineDocValuesforHtml(frm, 'lv_rated_voltage', 'lv1', 'lv_2');
            case 'vector_html_1':
                return frm.doc.vector_group || frm.doc.vector_group_lv1;
            case 'vector_html_2':
                return frm.doc.vector_group_lv2;
            case 'power_lv':
                return fnCombineDocValuesforHtml(frm, null, 'power_lv1', 'power_lv2');
            case 'uk_lv':
                return fnCombineDocValuesforHtml(frm, null, 'uk_lv1', 'uk_lv2');
            case 'uk_hv_lv':
                return fnCombineDocValuesforHtml(frm, null, 'ukhv_lv1', 'ukhv_lv2');
            
        }
    },
    

});

// This function is used to set the document field values to HTML values.
// If a single value is provided in the HV Value HTML field (i.e., it is set to the HV Rated Voltage field).
// If two values are provided by splitting the slash in the HV Value HTML field (i.e., HV1 / HV2), the first value is set in HV1, and the second value is set in HV2.

function fnCombineDocValuesforHtml(frm, iDocField, iDocField1, iDocField2) {
    if (frm.doc[iDocField]) {
        return frm.doc[iDocField];
    } else if (frm.doc[iDocField1] && frm.doc[iDocField2]) {
        return frm.doc[iDocField1] + '/' + frm.doc[iDocField2];
    }
    return '';
}

// This function operates based on the field type such as data, select.
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


//This function is setting value from the HTML field to docfield
function fnTransposeHtmlToDocField(frm, iValue, iHtmlField, iDocument) {
    
    // The purpose of this function is to split combined values and set them into two different document fields.
    function lfnSplitnSet(frm, iValue, field, field1, field2, label1, label2){
        let lSplit = iValue.split('/');
        
        // Check if the value is not present after the slash and display the error message.
        //Split the HTML value and set into the 2 different fields (for eg., first value in field1/second value in field2)
       // If there are not two values in the HTML field without a slash, it directly sets the value into the HV Rated Voltage field.

        if (lSplit.length > 1) {
            if (lSplit[1].trim() === '') {
                frappe.throw(__("Enter the ") + label2 + (" value") );
                return;
            } 
            frm.set_value(field1, lSplit[0]);
            frm.set_value(field2, lSplit[1]);
            if (field) {frm.set_value(field, null);}
            
        } else {
            if(field) {frm.set_value(field, iValue);}
            frm.set_value(field1, null);
            frm.set_value(field2, null);
        } 
    }
    //This function is used to clear the dependent field values based on LV2 field
    function lfnClearDependencies(frm, iValue, field, dependentFields, labels){
        
        if(!frm.doc[field]){
            dependentFields.forEach(function (dependentField, index) {
                frm.set_value(dependentField, null);
            });
        } else {
            lfnSplitnSet(frm, iValue, null, dependentFields[0], dependentFields[1], labels[0], labels[1]);  
        }
    }

    //Triggering the values based on the HTML fields
    switch (iHtmlField) {
        case 'hv_html':
            lfnSplitnSet(frm, iValue, 'hv_rated_voltage', 'hv1', 'hv2', 'HV 1', 'HV 2')
            break;
        case 'lv_html':
            lfnSplitnSet(frm, iValue, 'lv_rated_voltage', 'lv1', 'lv_2', 'LV 1', 'LV 2')
            
            break;
        case 'power_lv':
            lfnClearDependencies(frm, iValue, 'lv_2', ['power_lv1', 'power_lv2', 'power_lv'], ['Power LV1', 'Power LV2'])

            break;
        case 'uk_lv':
            lfnClearDependencies(frm, iValue, 'lv_2', ['uk_lv1', 'uk_lv2', 'uk_lv'], ['UK LV1', 'UK LV2'])

            break;
        case 'uk_hv_lv':
            lfnClearDependencies(frm, iValue, 'lv_2', ['ukhv_lv1', 'ukhv_lv2', 'uk_hv_lv', ['UK HV LV1', 'UK HV LV2']])

            break;
            
        case 'vector_html_1':
            frm.set_value('vector_group', iValue);
           
            break;
            
        case 'vector_html_2':
            if(frm.doc.vector_group || frm.doc.vector_group_lv1) {
                frm.set_value('vector_group_lv1', frm.doc.vector_group || frm.doc.vector_group_lv1);
                frm.set_value('vector_group_lv2', iValue);
                frm.set_value('vector_group', null);
            }
            else {
                
                frappe.throw("Vector group 1 Value is missing")
            }
            break;
    }
}

//This function is to validate the HTML field values with slash
function isValidHtmlField(value) {
    if (!value) return true; 
    let parts = value.split('/');
    if (parts.length === 1) return true; 
    return parts.length === 2 && parts.every(part => part.trim() !== ''); 
}

//This function is used to define the inner html element for both fieldtype such as Data and Select
function fnGetComboTemplate(){
    
    const lSelectTemplate = `<div class="row">
    <div class="form-column col-sm-6">
        <div class="frappe-control input-max-width" data-fieldtype="Select" data-fieldname="{{ field.fieldname }}_1">
            <div class="form-group">
                <div class="clearfix">
                    <label class="control-label reqd" style="padding-right: 0px;">{{ field.label }} 1</label>
                    <span class="help"></span>
                </div>
                <div class="control-input-wrapper">
                    <div class="control-input flex align-center">
                        <select value="{{ frm.events.fnTransposeDocfieldToHtml(field.fieldname, frm) }}" type="text" autocomplete="off" class="input-with-feedback form-control ellipsis bold attribute-input" maxlength="140" data-fieldtype="Select" data-fieldname="{{ field.fieldname }}_1" placeholder="" data-doctype="Design">
                        {% selected_value = frm.events.fnTransposeDocfieldToHtml((field.fieldname + "_1"), frm) %}    
                        {% options_array = frm.events.fnGetSelectOptions(field.fieldname, frm) %}
                            {% for option in options_array %}
                                <option value="{{ option }}" {% if option == selected_value %}selected{% endif %}>{{ option }}</option>
                            {% endfor %}

                        </select>
                        <div class="select-icon ">
                            <svg class="icon icon-sm" style="">
                                <use class="" href="#icon-select"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="control-value like-disabled-input bold" style="display: none;">{{ frm.events.fnTransposeDocfieldToHtml(field.fieldname, frm) }}</div>
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
                            {% selected_value = frm.events.fnTransposeDocfieldToHtml((field.fieldname + "_2"), frm) %}    
                            {% options_array = frm.events.fnGetSelectOptions(field.fieldname, frm) %}
                            {% for option in options_array %}
                                <option value="{{ option }}" {% if option == selected_value %}selected{% endif %}>{{ option }}</option>
                            {% endfor %}

                        </select>
                        <div class="select-icon ">
                            <svg class="icon  icon-sm" style="">
                                <use class="" href="#icon-select"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="control-value like-disabled-input bold" style="display: none;">"{{frm.events.fnTransposeDocfieldToHtml(field.fieldname, frm)}}"</div>
                    <p class="help-box small text-muted"></div>
                </div>
            </div>
        </div>
    </div>
</div>
			`;
    return lSelectTemplate;
}

function fnGetDataTemplate() {
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
			</div></form>`;
    return lTemplate;
}

function fnGetHtmlfields() {
    // Define fields with their respective field names and labels
    let fields = [
        { fieldname: 'hv_html', label: 'HV Value(V)', placeholder: 'HV1/HV2', type: 'data' },
        { fieldname: 'lv_html', label: 'LV Value(V)', placeholder: 'LV1/LV2', type: 'data' },
        { fieldname: 'power_lv', label: 'Power LV', placeholder: 'Power LV1/Power LV2', type: 'data' },
        { fieldname: 'uk_lv', label: 'UK LV', placeholder: 'UK LV1/UK LV2', type: 'data' },
        { fieldname: 'uk_hv_lv', label: 'UK HV-LV', placeholder: 'UK HV LV1/UK HV LV2', type: 'data' },
        { fieldname: 'vector_html', label: 'Vector Group', type: 'combo' },
    ];
    return fields;
}

