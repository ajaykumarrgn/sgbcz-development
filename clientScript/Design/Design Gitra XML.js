frappe.ui.form.on('Design', {
	validate(frm) {
	    function add_tappings_xml(frm, xml, tappingNodes){
	       

            // Parse the XML template to JavaScript object
            let xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
            var nodeList = xmlDoc.getElementsByTagName('TGtExportEDSAuftragStellungenListe');
            // Check if the element exists
            if (nodeList.length > 0) {
                var targetNode = nodeList[0];
    
                // Add the new nodes to the target element
                tappingNodes.forEach(function(nodeData) {
                    var newNode = xmlDoc.createElement('TGtExportEDSAuftragStellung');
                    newNode.setAttribute('nodetype', 'class')
                    var spannungNode = xmlDoc.createElement('spannung');
                    spannungNode.setAttribute('nodetype','property')
                    spannungNode.setAttribute('datatype','xs:double')
                    var spannungText = xmlDoc.createTextNode(nodeData.spannung);
                    spannungNode.appendChild(spannungText);
                    newNode.appendChild(spannungNode);
                    targetNode.appendChild(newNode);
                    targetNode.appendChild(xmlDoc.createTextNode('\n'));
                });
            }
            // Convert the XML document to a string
            var xmlString = new XMLSerializer().serializeToString(xmlDoc);
            //return xmlString;
            return formatXml(xmlString);
	    }
        function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
            var formatted = '', indent= '';
            tab = tab || '\t';
            xml.split(/>\s*</).forEach(function(node) {
                if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
                    formatted += indent + '<' + node + '>\r\n';
                if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
            });
            return formatted.substring(1, formatted.length-3);
        }

        function get_tapping_nodes(frm, tappingNodes, tapping, sign){
            
            for(var i=1; i<=frm.doc[tapping]; i++){
                
                var tappingNode = {spannung:''}
                var tapping_step = tapping + '_step'
                tappingNode.spannung =  frm.doc.hv_rated_voltage + sign*i*frm.doc[tapping_step]*frm.doc.hv_rated_voltage/100
                tappingNodes.push(tappingNode)
            }
            return tappingNodes
        }
        var doctype = "Gitra Settings";
    	// Initialize the model with doctype Gitra Settings
        frappe.model.with_doc(doctype, doctype, function() {
            // Then from the model get the list. This will return all attributes of the model including child table    
            var values = frappe.model.get_list(doctype);
            // Regular expression pattern to match variables in double curly braces
            var pattern = /\{\{([\w.]+)\}\}/g;
        
            // Resolve expressions and variables
            var xml = values[0].gitra_xml.replace(pattern, function(match, variable) {
                var value = '';
                if(variable==='frm.doc.k4_factor'){
                    var k4 = frm.doc.k4_factor == "Yes" ? '6395' : '6396';
                    value = k4;
                } else {
                    value = eval(variable);
                }
                return value || '';
            });
            let tappingNodes = [];
            tappingNodes = get_tapping_nodes(frm,tappingNodes,'tapping_minus', -1);
            tappingNodes = get_tapping_nodes(frm,tappingNodes,'tapping_plus', 1);
            
            var xmlString = add_tappings_xml(frm,xml,tappingNodes)
            frm.doc.gitra_xml = xmlString;
            
        })
        
        frm.refresh_fields();
	}
})