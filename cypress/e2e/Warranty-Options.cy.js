describe('SGBCZ Warranty', () => {

    beforeEach(() => {
        cy.task('readExcelFile', { 
            filePath: '/home/emp23002/Cypress/cypress/e2e/variables/Warranty.xlsx', 
            sheetName: 'Sheet1' 
        }).then((LA_TESTDATA) => { // eslint-disable-line
            // Store the loaded Excel data in Cypress environment variables
            Cypress.env('testData', LA_TESTDATA);
            const L_URL = LA_TESTDATA[0].value;
            cy.visit(L_URL);
            const L_USERNAME = Cypress.env('username');
            const L_PASSWORD = Cypress.env('password');
            cy.get('#login_email').type(L_USERNAME);
            cy.get('#login_password').type(L_PASSWORD);
            cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
            cy.location('pathname', { timeout: 30000 }).should('include', '/app');          
        });
    });
    afterEach(() => {
        // Logout after each test case
        cy.get('.nav-link > .avatar').click();
        cy.get('[onclick="return frappe.app.logout()"]').click();
    });
    describe('Verify that the new warranty options were added', () => {
        it('Should Check the Warranty field Value in Customer group', () => {
            const LA_TESTDATA = Cypress.env('testData');
            cy.visit(LA_TESTDATA[1].value);
            // Wait for the window to load (optional but good practice for dynamic content)
            cy.window().should('have.property', 'document').and('have.property', 'readyState', 'complete');
            // Optionally, wait for some specific element to ensure page has fully loaded
            cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
            //check the warranty field
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .find('option')
              .contains(LA_TESTDATA[5].value) // Check for option with text '90'
              .should('exist');
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .find('option')
              .contains(LA_TESTDATA[6].value) // Check for option with text '96'
              .should('exist');
        });

        it('Should save the Customer with new Warranty Options', () => {
            const LA_TESTDATA = Cypress.env('testData');
            cy.visit(LA_TESTDATA[2].value);
            // Wait for the window to load (optional but good practice for dynamic content)
            cy.window().should('have.property', 'document').and('have.property', 'readyState', 'complete');
            cy.get('.bold > .ellipsis').click()
            // cy.get(':nth-child(5) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .find('option')
            .contains(LA_TESTDATA[5].value) // Check for option with text '90'
            .should('exist');
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .find('option')
              .contains(LA_TESTDATA[6].value) // Check for option with text '90'
              .should('exist') // Ensure the option exists
              .then((option) => {
            // Select the option by value or text
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .select(option.text());
                });
            cy.get('#page-Customer > .page-head > .container > .row > .col > .standard-actions > .primary-action').click({force:true});           
        });
    
        it('Should Check the Warranrty in sales order with the customer', () => {
            const LA_TESTDATA = Cypress.env('testData');
            cy.visit(LA_TESTDATA[3].value);
            // Wait for the window to load (optional but good practice for dynamic content)
            cy.window().should('have.property', 'document').and('have.property', 'readyState', 'complete');
            cy.get('#page-List\\/Sales\\ Order\\/List > .page-head > .container > .row > .col > .standard-actions > .primary-action > .hidden-xs').click();
            cy.get('#sales-order-__details > :nth-child(2) > .section-body > :nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
               .click().clear().wait(3000).type(LA_TESTDATA[7].value,{force:true}).wait(4000);
            cy.get('div[data-fieldname="delivery_date"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.get('#sales-order-payment_schedule_section-tab').click({force:true});
            cy.get(':nth-child(1) > .section-body > :nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',LA_TESTDATA[6].value);

        });
   
        it('Should Check the Warranrty in quotation with the customer', () => {
            const LA_TESTDATA = Cypress.env('testData');
            cy.visit(LA_TESTDATA[4].value);
            // Wait for the window to load (optional but good practice for dynamic content)
            cy.window().should('have.property', 'document').and('have.property', 'readyState', 'complete');
            cy.get('#page-List\\/Quotation\\/List > .page-head > .container > .row > .col > .standard-actions > .primary-action > .hidden-xs').click();
            cy.wait(3000);
            cy.get('div[data-fieldtype="Dynamic Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
              .click().clear().wait(3000).type(LA_TESTDATA[7].value,{force:true}).wait(2000);
            // cy.get(':nth-child(2) > form > .has-error > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.get('#quotation-terms_tab-tab').click();
            cy.get('#quotation-terms_tab > :nth-child(2) > .section-body > :nth-child(3) > form > .input-max-width > .form-group > .control-input-wrapper > .control-value').should('have.text',LA_TESTDATA[6].value);
        });

          it('Should revert the Customer with earlier Warranty Options', () => {
            const LA_TESTDATA = Cypress.env('testData');
            cy.visit(LA_TESTDATA[2].value);
            // Wait for the window to load (optional but good practice for dynamic content)
            cy.window().should('have.property', 'document').and('have.property', 'readyState', 'complete');
            cy.get('.bold > .ellipsis').click()
            // cy.get(':nth-child(5) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .find('option')
            .contains(LA_TESTDATA[5].value) // Check for option with text '90'
            .should('exist');
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .find('option')
              .contains(LA_TESTDATA[8].value) // Check for option with text '90'
              .should('exist') // Ensure the option exists
              .then((option) => {
            // Select the option by value or text
            cy.get(':nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .select(option.text());
                });
            cy.get('#page-Customer > .page-head > .container > .row > .col > .standard-actions > .primary-action').click({force:true});           
        });
       
    });
});