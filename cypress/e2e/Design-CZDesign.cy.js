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
     
    describe('Is Design Complete flow', () => {
     
        it('Should add the new design', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
        
        });
        
        it('Should verify "Is Design" checkbox is enabled', () => {
            const testdata = Cypress.env('testData');
            
            cy.get('.primary-action').click();
            
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(4000); 
            cy.get('.btn-modal-close').click();
        });
        
        it('Should display an error when an invalid HV range is entered', () => {
            const testdata = Cypress.env('testData');
            
            cy.get('.primary-action').click();
            
            cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback').click();
            cy.wait(2000);
            cy.get('.btn-modal-close').click();
            cy.wait(2000);
            cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[2].Value)
            .type('{enter}');
            cy.wait(2000);
            
        });
        it('Should validate HV Value and its Dependent fields', () => {
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
            cy.get(':nth-child(3) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .should('have.value', testdata[4].Value);
            
            cy.get(':nth-child(3) > .section-body > :nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[5].Value);
            cy.get(':nth-child(3) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[6].Value);
        
        });
        it('Should validate Invalid LV range with error', () => {
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
            .type(testdata[7].Value)
            .type('{enter}') 
            
            cy.wait(2000);
        });
        
        it('Should validate the LV Value', () => {
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
        });
        it('Should validate the Invalid UK Value', () => {
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
            .type(testdata[9].Value)
            .type('{enter}') 
        });
        
        it('Should validate the UK Value', () => {
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
        });
        it('Should validate the LWA have value and LPA Value as Zero', () => {
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
            
            cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(1) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').clear()
            .type(testdata[13].Value)
            .type('{enter}') 
        
            cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .should('have.value', testdata[14].Value);
        });
        
        it('Save the Is Design form and then Delete the Design', () => {
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
            
            cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(1) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').clear()
            .type(testdata[13].Value)
            .type('{enter}') 
            
            cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .should('have.value', testdata[14].Value);
            
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();
            
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click();
            
            cy.get(':nth-child(11) > .grey-link > .menu-item-label').click();
            
            cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click();
        });
        
        
     });
     
    });