describe('qsgbcz Sales Order', () => {
  beforeEach(() => {
    // Read data from the Excel file
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envSales OrderEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {  
        Cypress.log({message:'excel data loaded',log:false});
        cy.wrap(data, {log:false}).as('testdata');
    });
});
  it('sgbcz Sales Order', () => {
      // Sequence 1
      // Login to the qsgbcz   
      cy.get('@testdata').then((testdata) => {
        const url = testdata.find(item => item.FieldName === 'Source').Value;
        const url2 = testdata.find(item => item.FieldName === 'Target').Value;
        cy.visit(url); 
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        cy.get('#login_email').type(username);
        cy.get('#login_password').type(password);   
        cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();          
        cy.location('pathname',{timeout:20000}).should('include', '/app');
        cy.visit(url2);
        
//sales order Creation
//Fill the mandatory fields
        cy.get('.primary-action').click();
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback', { scrollBehavior: 'center' })
          .click()
          .wait(5000)
          .type(testdata[5].Value ,'enter')
          .wait(5000)
          .type('{enter}');   //customer
        cy.wait(4000);
        // Get today's date in the required format 'DD.MM.YYYY'
        const currentDate = new Date();
        const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
        const day = futureDate.getDate().toString().padStart(2, '0');
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0'); 
        const year = futureDate.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        cy.get('div[data-fieldname="delivery_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')            
          .clear()  
          .click() 
          .wait(2000) 
          .type(formattedDate + '{Enter}', { force: true })
          .wait(4000)
          .type('{enter}'); 
        cy.wait(3000);    //Delivery Date
        cy.get(':nth-child(2) > .section-body > :nth-child(3) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .type(testdata[33].Value)
          .wait(2000)
          .type('{enter}');  //customer purchase order
        cy.wait(4000);
        cy.get('div[data-fieldname="po_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        const TodayDate = new Date();
        const PastDate = new Date(TodayDate); 
        PastDate.setDate(TodayDate.getDate() - 4); 
        const Day = PastDate.getDate().toString().padStart(2, '0');
        const Month = (PastDate.getMonth() + 1).toString().padStart(2, '0'); 
        const Year = PastDate.getFullYear();
        const FormattedDate = `${Day}.${Month}.${Year}`;
        cy.get('div[data-fieldname="po_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .wait(1000)
          .type(FormattedDate + '{Enter}', { force: true }); //customer purchase order date
        cy.get('div[data-fieldname="documentation_language"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')  
          .click()
          .type(testdata[37].Value)
          .type('{enter}');   //documentaion language 
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(2) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value',testdata[32].Value);  //factory
//Get a particular Item code and check SAP no.
        cy.get('.rows > .grid-row > .data-row > .col-xs-3')
          .click()
          .type(testdata[14].Value,'enter'); //Item Code
        cy.wait(3000);
        cy.get('.col-xs-1.bold > .field-area > .form-group > .input-with-feedback')
          .type(testdata[15].Value,'enter')
          .wait(2000); //qty
        cy.wait(3000);
        cy.get('.col-xs-2.text-right > .field-area > .form-group > .input-with-feedback')
          .should('have.value',testdata[16].Value); //Rate
        cy.wait(3000);
        cy.get('[data-fieldname="total_qty"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[15].Value); // Total Quantity
        cy.wait(3000);
        cy.get('[data-fieldname="total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[16].Value); //Total (EUR)
        
//Fill the tax and Check the model 
        cy.get('div[data-fieldname="taxes_and_charges"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .type(testdata[20].Value)
          .wait(2000)
          .type('{enter}'); //Taxes and charges
        cy.get('.rows > .grid-row > .data-row > [data-fieldname="charge_type"] > .static-area')
          .should('have.text',testdata[21].Value); //Type
        cy.get('.rows > .grid-row > .data-row > [data-fieldname="account_head"] > .static-area')
          .should('have.text',testdata[22].Value); //Account head
        cy.get(':nth-child(9) > .section-body > .form-column > form > .frappe-control > .grid-field > .form-grid-container > .form-grid > .grid-body > .rows > .grid-row > .data-row > [data-fieldname="rate"] > .static-area > div')
          .should('have.text',testdata[23].Value); //Rate in tax
        cy.get('[data-fieldname="tax_amount"] > .static-area > div')
          .should('have.text',testdata[24].Value); //Amount in tax
        cy.get('[data-fieldname="total"] > .static-area > div')
          .should('have.text',testdata[25].Value); //Total in tax
        cy.get(':nth-child(10) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[26].Value); //Total Taxes and charges (EUR)
        cy.get('[data-fieldname="grand_total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[27].Value);//Grand Total
        cy.get('[data-fieldname="rounded_total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[28].Value);//Rounded Total

// Validate the address and Contacts 
        cy.get('#sales-order-contact_info-tab').click({force:true});
        cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="customer_address"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value', testdata[8].Value); // Customer Address 
        cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
          .invoke('text')  
          .then((text) => {
            const actualText = text.replace(/\s+/g, ' ').trim(); 
            const expectedText = testdata[9].Value.replace(/\s+/g, ' ').trim(); 
            expect(actualText).to.eq(expectedText); 
          });// Address Sales
        cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="territory"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value', testdata[34].Value); //Territory 
        cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(1) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .invoke('val')  
          .then((value) => {
            const expectedString = String(testdata[35].Value);  
            expect(value.trim()).to.eq(expectedString);  
          }); //Company Address Name 
        cy.wait(4000);
        cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(2) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
          .invoke('text')  
          .then((text) => {
              const actualText = text.replace(/\s+/g, ' ').trim(); 
              const expectedText = testdata[36].Value.replace(/\s+/g, ' ').trim(); 
              expect(actualText).to.include(expectedText); 
            }); // Company Address 
// Go to the more info and test
        cy.get('#sales-order-more_info-tab').click();
        cy.get('#sales-order-more_info > :nth-child(7) > .section-head').click();
        cy.get(':nth-child(7) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .click()
          .should('have.value',testdata[45].Value);
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .primary-action > .alt-underline')
          .click({force:true}); // Save the Sales Order
        cy.wait(3000);
        //Delete the sales order
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click();
        cy.get('.menu-btn-group > .dropdown-menu > :nth-child(12) > .grey-link').click();
        cy.get('.modal-footer > .standard-actions > .btn-primary').click();
        
        cy.wait(10000);
      
        });
    });

    it('NEU Sales Order', () => {
      // Sequence 1
      // Login to the qsgbcz   
      cy.get('@testdata').then((testdata) => {
        const url = testdata.find(item => item.FieldName === 'Source').Value;
        const url2 = testdata.find(item => item.FieldName === 'Target').Value;
        cy.visit(url); 
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        cy.get('#login_email').type(username);
        cy.get('#login_password').type(password);   
        cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();          
        cy.location('pathname',{timeout:20000}).should('include', '/app');
        cy.visit(url2);
        
//sales order Creation
//Fill the mandatory fields
        cy.get('.primary-action').click();
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback', { scrollBehavior: 'center' })
          .click()
          .wait(5000)
          .type(testdata[5].Value ,'enter')
          .wait(5000)
          .type('{enter}');   //customer
        cy.wait(4000);
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(2) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .click()                         
          .wait(5000)
          .clear({force:true})  
          .wait(8000)                      
          .type(testdata[46].Value + '{enter}')  
          .wait(5000);                     // Change the factory
 
        // Get today's date in the required format 'DD.MM.YYYY'
        const currentDate = new Date();
        const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 20));
        const day = futureDate.getDate().toString().padStart(2, '0');
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0'); 
        const year = futureDate.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        cy.wait(3000);
        cy.get('div[data-fieldname="delivery_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')            
          .clear()  
          .click()  
          .type(formattedDate + '{Enter}', { force: true }); 
        cy.wait(2000);    
        cy.get(':nth-child(2) > .section-body > :nth-child(3) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .type(testdata[33].Value)
          .wait(2000)
          .type('{enter}');  //customer purchase order
        cy.wait(4000);
        cy.get('div[data-fieldname="po_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        const TodayDate = new Date();
        const PastDate = new Date(TodayDate); 
        PastDate.setDate(TodayDate.getDate() - 4); 
        const Day = PastDate.getDate().toString().padStart(2, '0');
        const Month = (PastDate.getMonth() + 1).toString().padStart(2, '0'); 
        const Year = PastDate.getFullYear();
        const FormattedDate = `${Day}.${Month}.${Year}`;
        cy.get('div[data-fieldname="po_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .wait(1000)
          .type(FormattedDate + '{Enter}', { force: true }); //customer purchase order date
        cy.get('div[data-fieldname="documentation_language"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')  
          .click()
          .type(testdata[37].Value)
          .type('{enter}');   //documentaion language 
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(2) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value',testdata[46].Value);  //factory
//Get a particular Item code and check SAP no.
        cy.get('.rows > .grid-row > .data-row > .col-xs-3')
          .click()
          .type(testdata[14].Value,'enter'); //Item Code
        cy.get('.col-xs-1.bold > .field-area > .form-group > .input-with-feedback')
          .type(testdata[15].Value,'enter')
          .wait(2000); //qty
        cy.wait(3000);
        cy.get('.col-xs-2.text-right > .field-area > .form-group > .input-with-feedback')
          .should('have.value',testdata[16].Value); //Rate
        cy.wait(3000);
        cy.get('[data-fieldname="total_qty"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[15].Value); // Total Quantity
        cy.wait(3000);
        cy.get('[data-fieldname="total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[16].Value); //Total (EUR)
        cy.wait(3000);
        
        
//Fill the tax and Check the model 
        cy.get('div[data-fieldname="taxes_and_charges"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .type(testdata[20].Value)
          .wait(2000)
          .type('{enter}'); //Taxes and charges
        cy.get('.rows > .grid-row > .data-row > [data-fieldname="charge_type"] > .static-area')
          .should('have.text',testdata[21].Value); //Type
        cy.get('.rows > .grid-row > .data-row > [data-fieldname="account_head"] > .static-area')
          .should('have.text',testdata[22].Value); //Account head
        cy.get(':nth-child(9) > .section-body > .form-column > form > .frappe-control > .grid-field > .form-grid-container > .form-grid > .grid-body > .rows > .grid-row > .data-row > [data-fieldname="rate"] > .static-area > div')
          .should('have.text',testdata[23].Value); //Rate in tax
        cy.get('[data-fieldname="tax_amount"] > .static-area > div')
          .should('have.text',testdata[24].Value); //Amount in tax
        cy.get('[data-fieldname="total"] > .static-area > div')
          .should('have.text',testdata[25].Value); //Total in tax
        cy.get(':nth-child(10) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[26].Value); //Total Taxes and charges (EUR)
        cy.get('[data-fieldname="grand_total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[27].Value);//Grand Total
        cy.get('[data-fieldname="rounded_total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[28].Value);//Rounded Total

// Validate the address and Contacts 
        cy.get('#sales-order-contact_info-tab').click({force:true});
        cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="customer_address"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value', testdata[8].Value); // Customer Address 
        cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
          .invoke('text')  
          .then((text) => {
            const actualText = text.replace(/\s+/g, ' ').trim(); 
            const expectedText = testdata[9].Value.replace(/\s+/g, ' ').trim(); 
            expect(actualText).to.eq(expectedText); 
          });// Address Sales
        cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="territory"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value', testdata[34].Value); //Territory 
        cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(1) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .invoke('val')  
          .then((value) => {
            const expectedString = String(testdata[35].Value);  
            expect(value.trim()).to.eq(expectedString);  
          }); //Company Address Name 
        cy.wait(4000);
        cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(2) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
          .invoke('text')  
          .then((text) => {
              const actualText = text.replace(/\s+/g, ' ').trim(); 
              const expectedText = testdata[36].Value.replace(/\s+/g, ' ').trim(); 
              expect(actualText).to.include(expectedText); 
            }); // Company Address 
  //Go to the more info and test
         cy.get('#sales-order-more_info-tab').click();
         cy.get('#sales-order-more_info > :nth-child(7) > .section-head').click();
         cy.get(':nth-child(7) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
           .click()
           .should('have.value',testdata[46].Value);
        //Save the sales order
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .primary-action > .alt-underline').click({force:true}); // Save the Sales Order
        cy.wait(3000);
        //Delete the sales order
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click();
        cy.get('.menu-btn-group > .dropdown-menu > :nth-child(12) > .grey-link').click();
        cy.get('.modal-footer > .standard-actions > .btn-primary').click();
        
        cy.wait(10000);
    });
  });

    it('RGB Sales Order', () => {
      // Sequence 1
      // Login to the qsgbcz   
      cy.get('@testdata').then((testdata) => {
        const url = testdata.find(item => item.FieldName === 'Source').Value;
        const url2 = testdata.find(item => item.FieldName === 'Target').Value;
        cy.visit(url); 
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        cy.get('#login_email').type(username);
        cy.get('#login_password').type(password);   
        cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();          
        cy.location('pathname',{timeout:20000}).should('include', '/app');
        cy.visit(url2);
        
//sales order Creation
//Fill the mandatory fields
        cy.get('.primary-action').click();
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback', { scrollBehavior: 'center' })
          .click()
          .wait(5000)
          .type(testdata[5].Value ,'enter')
          .wait(5000)
          .type('{enter}');   //customer
        cy.wait(4000);
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(2) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .click()                         
          .wait(4000)
          .clear()  
          .wait(4000)                      
          .type(testdata[49].Value)  
          .wait(6000)
          .type('{enter}');                     // Change Factory
 
        // Get today's date in the required format 'DD.MM.YYYY'
        const currentDate = new Date();
        const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 20));
        const day = futureDate.getDate().toString().padStart(2, '0');
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0'); 
        const year = futureDate.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        cy.wait(3000);
        cy.get('div[data-fieldname="delivery_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')            
          .clear()  
          .click()  
          .type(formattedDate + '{Enter}', { force: true }); 
        cy.wait(2000);    
        cy.get(':nth-child(2) > .section-body > :nth-child(3) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .type(testdata[33].Value)
          .wait(2000)
          .type('{enter}');  //customer purchase order
        cy.wait(4000);
        cy.get('div[data-fieldname="po_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        const TodayDate = new Date();
        const PastDate = new Date(TodayDate); 
        PastDate.setDate(TodayDate.getDate() - 4); 
        const Day = PastDate.getDate().toString().padStart(2, '0');
        const Month = (PastDate.getMonth() + 1).toString().padStart(2, '0'); 
        const Year = PastDate.getFullYear();
        const FormattedDate = `${Day}.${Month}.${Year}`;
        cy.get('div[data-fieldname="po_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .wait(1000)
          .type(FormattedDate + '{Enter}', { force: true }); //customer purchase order date
        cy.get('div[data-fieldname="documentation_language"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')  
          .click()
          .type(testdata[37].Value)
          .type('{enter}');   //documentaion language 
        cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(2) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value',testdata[49].Value);  //factory
//Get a particular Item code and check SAP , RDG no.
        cy.get('.rows > .grid-row > .data-row > .col-xs-3')
          .click()
          .type(testdata[14].Value,'enter'); //Item Code
        cy.get('.col-xs-1.bold > .field-area > .form-group > .input-with-feedback')
          .type(testdata[15].Value,'enter')
          .wait(2000); //qty
        cy.wait(3000);
        cy.get('.col-xs-2.text-right > .field-area > .form-group > .input-with-feedback')
          .should('have.value',testdata[16].Value); //Rate
        cy.wait(3000);
        cy.get('[data-fieldname="total_qty"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[15].Value); // Total Quantity
        cy.wait(3000);
        cy.get('[data-fieldname="total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[16].Value); //Total (EUR)  
        cy.wait(3000);
        
//Fill the tax and Check the model 
        cy.get('div[data-fieldname="taxes_and_charges"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .type(testdata[20].Value)
          .wait(2000)
          .type('{enter}'); //Taxes and charges
        cy.get('.rows > .grid-row > .data-row > [data-fieldname="charge_type"] > .static-area')
          .should('have.text',testdata[21].Value); //Type
        cy.get('.rows > .grid-row > .data-row > [data-fieldname="account_head"] > .static-area')
          .should('have.text',testdata[22].Value); //Account head
        cy.get(':nth-child(9) > .section-body > .form-column > form > .frappe-control > .grid-field > .form-grid-container > .form-grid > .grid-body > .rows > .grid-row > .data-row > [data-fieldname="rate"] > .static-area > div')
          .should('have.text',testdata[23].Value); //Rate in tax
        cy.get('[data-fieldname="tax_amount"] > .static-area > div')
          .should('have.text',testdata[24].Value); //Amount in tax
        cy.get('[data-fieldname="total"] > .static-area > div')
          .should('have.text',testdata[25].Value); //Total in tax
        cy.get(':nth-child(10) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[26].Value); //Total Taxes and charges (EUR)
        cy.get('[data-fieldname="grand_total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[27].Value);//Grand Total
        cy.get('[data-fieldname="rounded_total"] > .form-group > .control-input-wrapper > .control-value')
          .should('have.text',testdata[28].Value);//Rounded Total

// Validate the address and Contacts 
        cy.get('#sales-order-contact_info-tab').click({force:true});
        cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="customer_address"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value', testdata[8].Value); // Customer Address 
        cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
          .invoke('text')  
          .then((text) => {
            const actualText = text.replace(/\s+/g, ' ').trim(); 
            const expectedText = testdata[9].Value.replace(/\s+/g, ' ').trim(); 
            expect(actualText).to.eq(expectedText); 
          });// Address Sales
        cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="territory"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .should('have.value', testdata[34].Value); //Territory 
        cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(1) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .invoke('val')  
          .then((value) => {
            const expectedString = String(testdata[35].Value);  
            expect(value.trim()).to.eq(expectedString);  
          }); //Company Address Name 
        cy.wait(4000);
        cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(2) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
          .invoke('text')  
          .then((text) => {
              const actualText = text.replace(/\s+/g, ' ').trim(); 
              const expectedText = testdata[36].Value.replace(/\s+/g, ' ').trim(); 
              expect(actualText).to.include(expectedText); 
            }); // Company Address 
 //Go to the more info and test
         cy.get('#sales-order-more_info-tab').click();
         cy.get('#sales-order-more_info > :nth-child(7) > .section-head').click();
         cy.get(':nth-child(7) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
           .click()
           .should('have.value',testdata[49].Value);
        //Save the sales order
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .primary-action > .alt-underline').click({force:true}); // Save the Sales Order
        cy.wait(3000);
        //Delete the sales order
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click();
        cy.get('.menu-btn-group > .dropdown-menu > :nth-child(12) > .grey-link').click();
        cy.get('.modal-footer > .standard-actions > .btn-primary').click();
        
        cy.wait(10000);
        });
    });
  })