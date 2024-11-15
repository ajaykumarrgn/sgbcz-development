describe('qsgbcz Sales Order', () => {
  beforeEach(() => {
    // Read data from the Excel file
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envWeekly LoadEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {  
        Cypress.log({message:'excel data loaded',log:false});
        cy.wrap(data, {log:false}).as('testdata');
    });
});
it('weekly load', () => {
// Sequence 1
// Login  
  cy.get('@testdata').then((testdata) => {
      const url = testdata[0].Value;
      const target = testdata[1].Value;
      const target2 = testdata[2].Value;
      const target3 = testdata[3].Value;
      const target4 = testdata[27].Value;
      const target5 = testdata[28].Value;
      cy.visit(url); 
      const username = Cypress.env('username');
      const password = Cypress.env('password');
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);
      cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
      cy.location('pathname',{timeout:20000}).should('include', '/app');



// Sales order Creation 
// Fill the mandatory fields in details tab and check 

      cy.visit(target);
      cy.get('.primary-action').click();
      cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback', { scrollBehavior: 'center' })
        .click().wait(5000).type(testdata[5].Value ,'enter').wait(5000).type('{enter}');   //customer
      cy.wait(2000);
      cy.get(':nth-child(2) > .section-body > :nth-child(3) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .click().wait(3000).type(testdata[4].Value).wait(5000); //purchase order date
      cy.get('div[data-fieldname="delivery_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .click().wait(4000).type(testdata[6].Value).wait(5000); //Date 
      cy.get('.has-error > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .click().wait(2000).type(testdata[7].Value).wait(3000); //purchase order date
      cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col-md-4 > .fill-width > :nth-child(1) > .flex > .ellipsis').click(); 
      cy.get('div[data-fieldname="documentation_language"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')  
        .click().type(testdata[8].Value).type('{enter}');   //documentaion language 
      cy.get(':nth-child(6) > .section-body > .form-column > form > .frappe-control > .grid-field > .control-label').click(); //item tab
      cy.get('.rows > .grid-row > .data-row > .col-xs-3')
        .click().wait(3000).type(testdata[9].Value); //Item code
      cy.get(':nth-child(6) > .section-body > .form-column > form > [data-fieldtype="Table"] > .grid-field > .control-label').click(); //item tab
      cy.get('.col-xs-1.bold > .field-area > .form-group > .input-with-feedback').should('have.value',testdata[10].Value); //qnty
      cy.get('.col-xs-2.text-right > .field-area > .form-group > .input-with-feedback').should('have.value',testdata[11].Value);//Rate
      cy.get('[data-fieldname="total"] > .form-group > .control-input-wrapper > .control-value').should('have.text',testdata[12].Value);//Total
      cy.get('[data-fieldname="total_qty"] > .form-group > .control-input-wrapper > .control-value').should('have.text',testdata[13].Value);//Total qty
      cy.get('[data-fieldname="grand_total"] > .form-group > .control-input-wrapper > .control-value').should('have.text',testdata[14].Value);//Grand total
      cy.get('[data-fieldname="rounded_total"] > .form-group > .control-input-wrapper > .control-value').should('have.text',testdata[15].Value);//Round total
//Address and Contact
// Validate the address and Contacts 
      cy.get('#sales-order-contact_info-tab').click({force:true});
      cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="customer_address"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
        .should('have.value', testdata[16].Value); // Customer Address 
      cy.get('#sales-order-contact_info > :nth-child(2) > .section-body > :nth-child(1) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
        .invoke('text')  
        .then((text) => {
          const actualText = text.replace(/\s+/g, ' ').trim(); 
          const expectedText = testdata[17].Value.replace(/\s+/g, ' ').trim(); 
          expect(actualText).to.eq(expectedText); 
        });// Address 
      cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldname="territory"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
        .should('have.value', testdata[22].Value); //Territory 
      cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(1) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
        .invoke('val')  
        .then((value) => {
          const expectedString = String(testdata[18].Value);  
          expect(value.trim()).to.eq(expectedString);  
        }); //Company Address Name 
      cy.wait(4000);
      cy.get('#sales-order-contact_info > :nth-child(4) > .section-body > :nth-child(2) > form > [data-fieldtype="Small Text"] > .form-group > .control-input-wrapper > .control-value')
        .invoke('text')  
        .then((text) => {
          const actualText = text.replace(/\s+/g, ' ').trim(); 
          const expectedText = testdata[23].Value.replace(/\s+/g, ' ').trim(); 
          expect(actualText).to.include(expectedText); 
          }); // Company Address 
//Save and submit the Sales Order
      cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .primary-action').click(); //Save
      cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .primary-action').click(); //Submit
      cy.wait(1000);
      cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}); //yes

//Create Delivery Note from sales order
      cy.wait(3000);
      cy.get('[data-label="Create"] > .btn').click();
      cy.get('.dropdown-menu > [data-label="Delivery%20Note"]').click(); //Delivery note 
      cy.wait(5000);
      cy.get('#delivery-note-__details > :nth-child(7) > .section-head').click(); //Schedule Lines Model 
      cy.get('.rows > .grid-row > .data-row > [data-fieldname="planned_production_end_date"]').click().wait(3000).type(testdata[6].Value).wait(2000);   //Planned Production Date 
      cy.get('#delivery-note-__details > :nth-child(7) > .section-head').click(); //Schedule Lines Model
//Save the delivery note and go to the weekly load and check the value 
      cy.get('#page-Delivery\\ Note > .page-head > .container > .row > .col > .standard-actions > .primary-action').click(); //Save
      cy.wait(2000);

// Go to the weekly load url and store the value in the variable
      cy.visit(target3);
      cy.visit(target2);
      // Store the value in a variable
      let fieldValue; 
      cy.get('.dt-row-3 > .dt-cell--col-6 > .dt-cell__content > div')
        .invoke('text') 
        .then((text) => {
          fieldValue = parseInt(text); 
        });

//Go to the delivery list and copy the id
      cy.visit(target4);
      cy.get('[data-original-title="ID"] > .input-with-feedback').clear();
      cy.wait(3000);
      cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .level-item.ellipsis > .ellipsis').click();
      cy.wait(2000);
      cy.get('.disabled').invoke('text').then((text) => {
        cy.wrap(text.trim()).as('fieldValue2'); 
      }); 

//Submit the Delivery Note 
      cy.get('#page-Delivery\\ Note > .page-head > .container > .row > .col > .standard-actions > .primary-action').click(); //Submit
      cy.wait(3000);
      cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click({force:true}); //yes

// Go to the weekly load url and check the value is 2  
      cy.visit(target3);
      cy.visit(target2);            
      cy.get('.dt-row-3 > .dt-cell--col-6 > .dt-cell__content > div')
        .invoke('text')
        .then((text) => {
          // Convert text to a number for comparison
          const updatedFieldValue = parseInt(text);
          // Assert that the new value is equal to fieldValue + 1
          expect(updatedFieldValue).to.equal(fieldValue + 1);
        });

//Go to the deliverynote and tear off
        cy.visit(target4);
        cy.get('@fieldValue2').then((fieldValue2) => {
          cy.get('[data-original-title="ID"] > .input-with-feedback')
            .click()
            .type(fieldValue2, { force: true });
        });   //go to the delivery note and type the copied delivery note id
        cy.wait(2000);
        cy.get('.level-item.ellipsis > .ellipsis').click();
        cy.get('#page-Delivery\\ Note > .page-head > .container > .row > .col > .standard-actions > .btn-secondary').click().wait(1000); //Cancel the delivery note
        cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}); //yes

//Go to the repost item valuation list to cancel and delete
        cy.visit(target5);
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
        cy.get('.custom-actions > .btn').click().wait(5000);
        cy.get('.btn-modal-close').click();
        cy.get('#page-Repost\\ Item\\ Valuation > .page-head > .container > .row > .col > .standard-actions > .btn-secondary').click().wait(3000); //cancel the repost
        cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click().wait(2000);
        cy.get('#page-Repost\\ Item\\ Valuation > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click().wait(3000);//drop down
        cy.get('.menu-btn-group > .dropdown-menu > :nth-child(6) > .grey-link').click().wait(2000);
        cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click().wait(1000); //yes 
        cy.wait(3000);
//Again go to the delivery note list and delete 
        cy.visit(target4)
        cy.get('@fieldValue2').then((fieldValue2) => {
          cy.get('[data-original-title="ID"] > .input-with-feedback')
            .click()
            .clear()
            .wait(3000)
            .type(fieldValue2, { force: true });
        });   //go to the delivery note and type the copied delivery note id
        cy.wait(2000);
        cy.get('.level-item.ellipsis > .ellipsis').click(); 
        cy.wait(2000);
        cy.get('#page-Delivery\\ Note > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click().wait(1000); //drop down
        cy.get('.menu-btn-group > .dropdown-menu > :nth-child(12) > .grey-link').click({force:true}).wait(1000); //delete delivery note
        cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}); //yes
//Go to the sales order and delete 
        cy.visit(target); 
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .level-item.ellipsis > .ellipsis').click().wait(3000);
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .btn-secondary').click({force:true}).wait(1000); //cancel sales
        cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}).wait(3000); //yes
        cy.get('#page-Sales\\ Order > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click();//drop down
        cy.get('.menu-btn-group > .dropdown-menu > :nth-child(9) > .grey-link').click().wait(1000); //delete sales
        cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click().wait(2000); //yes

  });
});
})