describe('Testing NEU foctory for design', () => {
    beforeEach(() => {
        
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envItem-Creation-from-Design-BEU000010500028.xlsx', sheetName: 'Sheet1' }).then((testdata) => {  
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
    describe('Should add the design and test the hv value', () => {
        it('should add the design', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
        });
        it('Should give pop up message for the wrong hv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[3].Value,'{enter}'); //enter the wrong value 300            
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
            // cy.get('.btn-modal-close').should('be.visible');
        });
        it('Should give pop up message for the wrong suffix hv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[4].Value,'{enter}').wait(3000); //enter the wrong suffix value 3000/4000
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
            // cy.get('.btn-modal-close').should('be.visible');
        });
        it('Should accept the correct hv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value,'{enter}').wait(3000); //enter the correct hv value 3000
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
        });
        it('Should accept the correct suffix hv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[6].Value,'{enter}').wait(3000); //enter the correct hv value 4000/3000
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
        });

    });

    describe('Should add the design and test the lv value', () => {
        it('should add the design', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
        });
        it('Should give pop up message for the wrong lv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[32].Value,'{enter}'); //enter the wrong value 150         
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
            //cy.get('.btn-modal-close').should('be.visible');
        });
        it('Should give pop up message for the wrong suffix lv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[33].Value).type('enter',{force:true}).wait(3000); //enter the wrong suffix value 3000/4000
            // cy.get('#page-Design > .page-head > .container > .row > .col-md-4 > .fill-width > :nth-child(1) > .flex > .ellipsis').click();
            // cy.get('.btn-modal-close').should('be.visible');
        });
        it('Should accept the correct lv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[34].Value,'{enter}').wait(3000); //enter the correct lv value 300
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
        });
        it('Should accept the correct suffix lv value', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[35].Value,'{enter}').wait(3000); //enter the correct lv value 400/300
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
        });
    });

     describe('Should Test the Transformer Types in the details tab and transformer Environment tab for factory NEU', () => {
        it('should Check the all the Transformer Types in details tab for factory NEU', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            const expectedValues = [testdata[59].Value, testdata[60].Value, testdata[61].Value, testdata[62].Value];
            cy.wait(2000);
            cy.get('div[data-fieldname="transformer_type"] > .form-group > .clearfix > .control-label').click({force:true}).wait(5000);
            cy.get('div[data-fieldname="transformer_type"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
                .find('option')
                .then((options) => {
                  const actualValues = [...options].map(option => option.value.trim());
                  cy.log('Expected Values:', expectedValues);
                  cy.log('Actual Values:', actualValues);
                  expect(options.length).to.equal(expectedValues.length);
                  options.each((index, option) => expect(option.value.trim()).to.equal(expectedValues[index]));
            }); //Transformer Types
        });
        it('should Check the all the Transformer Environment for factory NEU', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-transformer_environment_tab-tab').click({force:true}).wait(3000);
            cy.get('div[data-fieldname="temperature_rise_oil"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[63].Value);
            cy.get('div[data-fieldname="ambient_max_temperature"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[64].Value);
            cy.get(':nth-child(3) > form > div[data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[65].Value);
            cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value').should('have.text',testdata[66].Value);
            cy.get('div[data-fieldname="max_average_temperature_per_month"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[67].Value);
            cy.get('div[data-fieldname="temperature_rise_winding"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[68].Value);
        }); //Transformer Environment    
    });

     describe('Should Test design can be save and delete', () => {
        it('should test the design can be save and delete by filling the mandatory fields', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value,'{enter}').wait(3000); //enter the correct hv value 3000
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[34].Value,'{enter}').wait(3000); //enter the correct lv value 300
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click({force:true}); //save the design
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click({force:true});
            cy.get(':nth-child(11) > .grey-link').click({force:true}).wait(2000); //Delete the design
            cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}).wait(3000); //yes
 
        })     
    });

});
