describe('Testing Is Design Scenarios', () => {

    beforeEach(() => {
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envItem-Creation-from-Design-DEU000010500028.xlsx', sheetName: 'Sheet1' }).then((testdata) => { 
            Cypress.log({ message: 'excel data loaded', log: false });       
            // Store the loaded Excel data in Cypress environment variables (or directly within the test)        
            Cypress.env('testData', testdata);        
            const url = testdata[0].Value;         
            const target = testdata[1].Value;         
            cy.visit(url);         
            const username = Cypress.env('username');        
            const password = Cypress.env('password');        
            cy.get('#login_email').type(username);        
            cy.get('#login_password').type(password);        
            cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();        
            cy.location('pathname', { timeout: 20000 }).should('include', '/app');        
            cy.visit(target);      
        });     

    });
    describe('Testcase for Is Design and Parallel Design', () => {
    
        it('Should verify "Is Design" checkbox is enabled', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click();
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(4000); 
            cy.get('.btn-modal-close').click({force: true});
            cy.wait(300);
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
        it('Should display an error when an invalid HV range is entered', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click();
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(4000);
            cy.get('.btn-modal-close').click({force: true});
            cy.wait(2000);
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[2].Value)
            .type('{enter}');
            cy.wait(2000);
        });
        it('Should validate HV Value and its Dependent fields', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click();
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(4000);
            cy.get('.btn-modal-close').click({force: true});
            cy.wait(2000);
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.wait(2000); 
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[3].Value)
            .type('{enter}')    
            cy.wait(4000);
            cy.get(':nth-child(3) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .should('have.value', testdata[4].Value);
            cy.get(':nth-child(3) > .section-body > :nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[5].Value);
            cy.get(':nth-child(3) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[6].Value);
            cy.wait(300)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
        it('Should validate Invalid LV range with error', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click();
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(4000);
            cy.get('.btn-modal-close').click({force: true});
            cy.wait(2000);
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.wait(2000); 
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[3].Value)
            .type('{enter}')
            cy.wait(4000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(2000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[7].Value)
            .type('{enter}') 
            cy.wait(2000);
        });
       
        it('Should validate the Invalid UK Value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click();
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(4000);
            cy.get('.btn-modal-close').click({force: true});
            cy.wait(2000);
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.wait(2000); 
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[3].Value)
            .type('{enter}')
            cy.wait(4000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(2000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[8].Value)
            .type('{enter}') 
            cy.wait(2000);
            cy.get(':nth-child(5) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').clear()
            .type(testdata[9].Value)
            .type('{enter}')
            cy.wait(300);
        });
        
        it('Should validate the LPA have value and LWA Value as Zero', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click();
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(2000);
            cy.get('.btn-modal-close').click();
            cy.wait(2000);
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.wait(2000); 
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[3].Value)
            .type('{enter}')
            cy.wait(4000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(2000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[8].Value)
            .type('{enter}') 
            cy.wait(2000);
            cy.get(':nth-child(5) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').clear()
            .type(testdata[10].Value)
            .type('{enter}') 
            cy.get('#design-guaranties_values_tab-tab').click()
            cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').clear();
            cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[11].Value)
            .type('{enter}') 
            cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(1) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .should('have.value', testdata[12].Value);
            cy.wait(300);
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
        it('Should validate the LWA have value and LPA Value as Zero & created Design', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click();
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(2000);
            cy.get('.btn-modal-close').click();
            cy.wait(2000);
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.wait(2000); 
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[3].Value)
            .type('{enter}')
            cy.wait(4000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(2000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[8].Value)
            .type('{enter}') 
            cy.wait(2000);
            cy.get(':nth-child(5) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').clear()
            .type(testdata[10].Value)
            .type('{enter}') 
            
            cy.get(':nth-child(7) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click({force:true})
            .type(testdata[17].Value)
            .type('{enter}')

            cy.get('#design-guaranties_values_tab-tab').click()
            cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(1) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').clear()
            .type(testdata[13].Value)
            .type('{enter}') 
            cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .should('have.value', testdata[14].Value);
            cy.wait(300);

                       
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click().wait(1000)
            cy.get('.custom-actions > .btn').click().wait(1000)


            // // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
        
    });
    

    describe('Validate the Parallel Design', () => {
        it('Run Node Script After Design created', () => {
        // Change directory, install dependencies, and execute the Node.js scripts
        cy.exec('cd "/home/emp23002/lens-test-automation/gitraTesting" && npm i && node getGitraDesign2.js && node updateDesign.js', { failOnNonZeroExit: false }).wait(10000)
            .then((result) => {
            Cypress.log({ message: `Script output: ${result.stdout}`, log: true }); 
            });
        });

        it('Should validate the status has been Changed', () => {
        // Only repeat the initial visit and login steps
        // cy.get('@testdata').then((testdata) => {
        const testdata = Cypress.env('testData');
            const url = testdata[0].Value;
            const target = testdata[1].Value;

            cy.get('[data-original-title="Title"] > .input-with-feedback').click()
            cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click()

            cy.wait (10000);
            // // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
        it('Create the Parallel design Item ', () => {
            
            const testdata = Cypress.env('testData');
            const url = testdata[0].Value;
            const target = testdata[1].Value;

            cy.get('[data-original-title="Title"] > .input-with-feedback').click()
            cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click()
            cy.get('.custom-actions > .btn').click(); //create item

            cy.wait(20000)
            
        });

        it('Should Verify the Item has been Created ', () => {
            
            const testdata = Cypress.env('testData');
             const url = testdata[0].Value;
             const target = testdata[1].Value;
             const target2 = testdata[18].Value; // Performe calculation filter / 18
            const target4 = testdata[29].Value;
            cy.get('[data-original-title="Title"] > .input-with-feedback').click()
            cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click()
            cy.wait(4000)
            cy.get('.custom-actions > .btn').click(); //view item
            cy.wait(3000)
            //cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click().wait(2000);
            cy.get('#item-variants_section-tab').click().wait(500);
            cy.get('.data-row > .bold > .static-area > a').should('contain.text', 'Parallel coil');
            cy.get('[data-name="f1d98904a5"] > .data-row > .bold > .static-area > a').should('contain.text', 'YES').wait(4000);
           // Tear off
            //Go to the item 
            cy.visit(target4);
            cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click().wait(500)
            cy.get(':nth-child(4) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().wait(1000)
            cy.get(':nth-child(4) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').clear().wait(2000)
            cy.get('#page-Item > .page-head > .container > .row > .col > .standard-actions > .primary-action').click()

            cy.visit(target2);
            cy.get('[data-original-title="Status"] > .input-with-feedback').select('').wait(3000);
            cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click().wait(1000);
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn > :nth-child(1)').click().wait(1000);
            //cy.get(':nth-child(12) > .grey-link').click().wait(2000);
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .dropdown-menu > :nth-child(11) > .grey-link').click()
            cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click({force:true})
            
            cy.visit(target4);
            cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click().wait(1000);
            cy.get('#page-Item > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn > :nth-child(1)').click().wait(1000);
            cy.get(':nth-child(12) > .grey-link').click().wait(1000);
            cy.get('.modal-footer > .standard-actions > .btn-primary').click().wait(2000);
        });  
        

            
    });
});

