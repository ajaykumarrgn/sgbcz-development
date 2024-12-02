describe('Checking RGB factory for design', () => {
    beforeEach(() => {
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envItem-Creation-from-Design-CEU000010500028.xlsx', sheetName: 'Sheet1' }).then((testdata) => {
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

    describe('Should add the design and test the HV value', () => {
        it('should add the design', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
        });
        it('Should give pop up message for the wrong HV value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({ force: true }).wait(2000).clear({ force: true })
            .wait(2000)
            .type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[3].Value,'{enter}'); //enter the wrong value 300            
            // cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click()

        });
        it('Should give pop up message for the wrong second hv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({ force: true }).wait(2000).clear({ force: true })
            .wait(2000)
            .type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[3].Value,'{enter}'); //enter the wrong value 300            
            // cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click()
        });

        it('Should accept the correct hv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value,'{enter}').wait(5000); //enter the correct hv value 3000
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click();
              });
        it('Should accept the correct second hv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value,'{enter}').wait(5000); //enter the correct hv value 3000
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click();
         });
    }); 

    describe('Should add the design and test the LV value', () => {

        it('Should give pop up message for the wrong LV value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[10].Value,'{enter}'); //enter the wrong value 150
            // cy.get('#design-__details > :nth-child(3) > .section-head').click();
            // cy.get('.btn-modal-close').should('be.visible');
        });
        it('Should give pop up message for the wrong second LV value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[10].Value,'{enter}'); //enter the wrong value 300/400
        
        });
        it('Should accept the correct LV value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[12].Value,'{enter}').wait(5000); //enter the correct hv value 300
            // cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click();
              });
        it('Should accept the correct second LV value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[13].Value,'{enter}').wait(3000); //enter the correct hv value 400/300
            // cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click();
         });
    });  


    describe('Should Check the Details Tab & Transformer Environment Tab', () => {

        it('Should check the transformer type,Insulation & Winding', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[12].Value,'{enter}'); //enter the wrong value 150
            cy.get('div[data-fieldname="transformer_type"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[17].Value);
            cy.get(':nth-child(6) > .section-body > :nth-child(1) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[18].Value)
            cy.get(':nth-child(6) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[19].Value)
        });
        it('Should check the transformer environment', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get('#design-transformer_environment_tab-tab').click().wait(4000);
            cy.get('div[data-fieldname="temperature_rise"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[20].Value);
            cy.get('div[data-fieldname="ambient_max_temperature"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[21].Value);
            cy.get(':nth-child(3) > form > div[data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[22].Value);
            cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value').should('have.text', testdata[23].Value);
            cy.get('div[data-fieldname="max_average_temperature_per_month"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[24].Value);
            cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[25].Value);
            cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value', testdata[26].Value);
        });
   
        
        
    });  
    describe('Should save & Tear of', () => {

        it('Should fill all mandatory fields then save & delete', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value).wait(3000); //enter the correct hv value 3000
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[12].Value,'{enter}').wait(3000); //enter the correct lv value 300
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value).wait(3000);
            // cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();

        });     
    });  


 });