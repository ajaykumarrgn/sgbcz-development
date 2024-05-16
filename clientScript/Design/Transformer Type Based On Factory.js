frappe.ui.form.on('Design', {
   
	onload(frm){
		if(frm.doc.status === "Calculation Received"){
			frm.set_value('factory','SGBCZ')
			frm.set_value('transformer_type','DTTHZ2N')
			frm.set_value('status','Calculation Received')
			frm.doc.save()
		}
	},

	factory(frm){

        //map the item_group with respective factory
	    const ldTransformerMapping = {
	        "SGBCZ": "DTTHZ2N",
	        "RGB": "RGB"
	    }

        //get the item_group for selected factory 
	    const lGetItemGroup = ldTransformerMapping[frm.doc.factory]

        //if the select factory value is not of sgbcz then make the status read only and hide the xml tab
        //else make the status option to display "draft" and "perform calculation"
        
	    if(frm.doc.factory != "SGBCZ"){
	        frm.set_df_property('status', 'read_only', 1);
	        var lxmlDataTab = document.getElementById('design-xml_data_tab-tab')
	        lxmlDataTab.hidden = true
	        
	    }else{
	        frm.set_df_property('status', 'read_only', 0);
	        // frm.set_df_property('status', 'options', ['Draft', 'Perform Calculation', 'Calculation Received']);		
			
			frm.fields_dict.status.get_query = function() {
				const lstatus = ['Draft', 'Perform Calculation']
				return {
					filters: {
						"options": ["in", lstatus]
					}
				};
			};
			
	        var lxmlDataTab = document.getElementById('design-xml_data_tab-tab')
	        lxmlDataTab.hidden = false
	    }
	    frappe.call({
	        "method": "get_item_variant_based_on_factory",
	        "args":{"factory": lGetItemGroup},
	         
	        "callback": function(response){
	            
	           if(response.message){
	               frm.set_df_property('transformer_type', 'options', response.message);
	           }
	        }
	    })
	}
})