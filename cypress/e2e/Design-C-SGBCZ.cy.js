describe('SGBCZ factory non is design', () => {
    beforeEach(() => {
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envItem-Creation-from-Design-AEU000010500028.xlsx', sheetName: 'Sheet1' }).then((testdata) => {
            Cypress.log({ message: 'excel data loaded', log: false });
            // Store the loaded Excel data in Cypress environment variables (or directly within the test)
            Cypress.env('testData', testdata);
            const url = testdata[0].value;
            cy.visit(url);
            const username = Cypress.env('username');
            const password = Cypress.env('password');
            cy.get('#login_email').type(username);
            cy.get('#login_password').type(password);
            cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
            cy.location('pathname', { timeout: 20000 }).should('include', '/app');
        });
    });
    describe('Add a Design and check the Details', () => {
            it('should add the design and check the factory tranformer type and ratings', () => {
                const testdata = Cypress.env('testData');
                const target = testdata[1].value;
                cy.visit(target);
                cy.get('.primary-action').click().wait(5000);
                cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
                  .should('have.value',testdata[2].value);
                cy.get('div[data-fieldname="transformer_type"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
                  .should('have.value',testdata[3].value);
                cy.get(':nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
                  .should('have.value',testdata[4].value);
                cy.wait(300);
                // Logout after each test case
                cy.get('.nav-link > .avatar').click();
                cy.get('[onclick="return frappe.app.logout()"]').click();
                cy.wait(300);
            });
        });

    describe('Add a HV Value and check the dependent fields', () => {
        it('should add the HV Value and check its range', () => {
            const testdata = Cypress.env('testData');
            const target = testdata[1].value;
            cy.visit(target);
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .click().type(testdata[5].value,'enter',{force:true}).wait(2000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.wait(600);
            cy.get('.modal-title').should('be.visible');
            cy.get('.btn-modal-close').click();
            cy.wait(300);
            // cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            //   .click().clear().type(testdata[6].value,{force: true}).wait(2000);
            cy.get(':nth-child(3) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[7].value);
            cy.get(':nth-child(3) > .section-body > :nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[8].value);
            cy.get(':nth-child(3) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[9].value);
            cy.wait(300)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
    });

    describe('Add a LV Value and check the dependent fields', () => {
        it('should add the LV Value and check its range', () => {
            const testdata = Cypress.env('testData');
            const target = testdata[1].value;
            cy.visit(target);
            cy.get('.primary-action').click().wait(4000);
            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000).type(testdata[10].value,'enter').wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click();
            cy.wait(600);
            cy.get('.modal-header > .fill-width').should('be.visible');
            cy.get('.btn-modal-close').click();
            // cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            //   .click({force: true}).clear().type(testdata[11].value,{force:true}).wait(1000);
            cy.wait(300);
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
        it('should check the dependent values of LV', () => {
            const testdata = Cypress.env('testData');
            const target = testdata[1].value;
            cy.visit(target);
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(4) > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value', testdata[12].value); 
            cy.get(':nth-child(4) > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[13].value);
            cy.get(':nth-child(4) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[14].value);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[15].value);
            cy.wait(300);
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);

        });
    });
    describe('Check the Fields and parallel coil', () => {
        it('should Check vectar group, thdi and ip protection fields are visible', () => {
            const testdata = Cypress.env('testData');
            const target = testdata[1].value;
            cy.visit(target);
            cy.get('.primary-action').click().wait(4000);
            cy.get('div[data-fieldname="vector_group"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[16].value);
            cy.get(':nth-child(2) > form > div[data-fieldtype="Int"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[17].value);
            cy.get('div[data-fieldname="ip_protection"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[18].value);
            cy.get(':nth-child(5) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .should('have.value',testdata[19].value);
            cy.wait(300);
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
         });
        it('should Check the Parallel coil field is visible', () => {
            const testdata = Cypress.env('testData');
            const target = testdata[1].value;
            cy.visit(target);
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(2) > form > .form-group.frappe-control > .checkbox > label > .label-area').should('be.visible');
            cy.wait(300);
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);

        });
    });
    describe('Saving and Tear off', () => {
        it('should save the Design and delete', () => {
            const testdata = Cypress.env('testData');
            const target = testdata[1].value;
            cy.visit(target);
            cy.get('.primary-action').click().wait(4000);
            // Click the element and wait for any updates
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .click();

            // Wait for the page to settle (e.g., after re-rendering)
            cy.wait(2000); // Adjust this time as needed based on your page's behavior

            // Re-query the element to ensure it's available
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .type(testdata[6].value);

            cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
              .click().wait(1000).type(testdata[11].value).wait(1000);
            cy.get('#design-item_tab-tab').click();
            cy.get('div[data-fieldname="direct_material_cost"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().clear().wait(1000).type(testdata[20].value);
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click({force:true});
            cy.get(':nth-child(11) > .grey-link').click({force:true}).wait(2000); //Delete the design
            cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}).wait(3000); //yes
            cy.wait(300);
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();
            cy.wait(300);
        });
        
    });
});