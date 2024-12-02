describe('Qsgbcz Simple Item Creation', () => {
    beforeEach(() => {
    // Read data from the Excel file
          cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envItemcreationEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {  
          Cypress.log({message:'excel data loaded',log:false});
          cy.wrap(data, {log:false}).as('testdata');
      });
  });
  it('Item Creation Flow', () => {
    // Sequence 1
    // Login  
        cy.get('@testdata').then((testdata) => {
        const url = testdata[0].Value;
        const target = testdata[1].Value;
        cy.visit(url); 
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        cy.get('#login_email').type(username);
        cy.get('#login_password').type(password);
        cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
        cy.location('pathname',{timeout:20000}).should('include', '/app');
        cy.visit(target); //use filter item group = others
        cy.get('.primary-action > .hidden-xs > .alt-underline').click(); 
        cy.wait(1000);
        cy.get('.custom-actions > .btn').click(); //Edit full form
        cy.wait(1000);
        cy.get('#item-details > :nth-child(1) > .section-body > :nth-child(1) > form > div[data-fieldname="item_code"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().type(testdata[2].Value).wait(2000); //Item code 
        cy.get('#item-details > :nth-child(1) > .section-body > :nth-child(1) > form > div[data-fieldname="item_group"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').clear().wait(3000).type(testdata[3].Value,'enter').wait(3000); //Item group
        cy.get('#page-Item > .page-head > .container > .row > .col-md-4 > .fill-width > :nth-child(1) > .flex > .ellipsis').click();
        cy.get('.primary-action > .alt-underline').click(); //Save the Item
        cy.get('#page-Item > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click(); //Dropdown Menu
        cy.get(':nth-child(12) > .grey-link').click().wait(1000); //Delete the Item 
        cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click().wait(2000); //delete permanently
    });
  });
  
  
  it('Accessory Item Creation', () => {
    // Sequence 1
    // Login  
        cy.get('@testdata').then((testdata) => {
        const url = testdata[0].Value;
        const target2 = testdata[4].Value;
        cy.visit(url); 
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        cy.get('#login_email').type(username);
        cy.get('#login_password').type(password);
        cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
        cy.location('pathname',{timeout:20000}).should('include', '/app');
        cy.visit(target2); //use filter has variant 
        cy.get('[data-label="Create"] > .btn').click().wait(1000);
        cy.get('[data-label="Single%20Variant"]').click(); 
        cy.get('.form-page > .row > .section-body > .form-column > form > div[data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(3000).type(testdata[5].Value).wait(4000); //Power (kVA)
        cy.get('div[data-fieldname="Enclosure IP Rating"] > .form-group > .control-input-wrapper > .control-input > .awesomplete > .input-with-feedback').click().type(testdata[6].Value,'enter').wait(1000); //Enclosure IP Rating
        cy.get('div[data-fieldname="Mounting Type"] > .form-group > .control-input-wrapper > .control-input > .awesomplete > .input-with-feedback').click().type(testdata[7].Value,'enter').wait(1000);   //Mounting Type
        cy.get('.modal-footer > .standard-actions > .btn-primary').click().wait(1000); //click create 
        cy.get('.primary-action > .alt-underline').click({force:true}); //Save button
  
        //Check the Description tab 
        cy.wait(3000);
        cy.get('#item-details > :nth-child(3) > .section-head').click({force:true}); //desc tab
        cy.get('.control-input > .ql-container > .ql-editor').click().should('have.text',testdata[8].Value);
  
        //Delete the item 
        cy.get('.menu-btn-group > .btn').click(); //Drop Down 
        cy.get(':nth-child(12) > .grey-link').click().wait(2000); //Delete button 
        cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click().wait(1000); //permanently delete
  
  
    });
  });
  
  
  
  })