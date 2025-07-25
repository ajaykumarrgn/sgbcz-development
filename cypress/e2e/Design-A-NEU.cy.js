describe('Testing NEU factory for design', () => {

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

        it('should test the design can be save and delete by filling the mandatory fields', () => {
            const testdata = Cypress.env('testData');
            cy.get('.primary-action').click().wait(4000);
            cy.wait(6000)
            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().wait(500).clear({force:true}).wait(5000).type(testdata[2].Value,{force:true}).wait(4000); //factory
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            // cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(3000).type(testdata[5].Value).wait(3000);
            // Alias the element to avoid lengthy selectors
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');
            // Click the element
            cy.get('@inputField').click().wait(3000);
            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[5].Value, { force: true }).wait(4000);
            // .wait(5000) // wait before typing again
            // .type(testdata[5].Value, { force: true }) // type the correct HV value
            // .wait(3000);//enter the correct hv value 3000
            cy.wait(6000);
            cy.get('#design-__details > :nth-child(3) > .section-head').click();
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);
            //cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[34].Value,'{enter}').wait(3000); //enter the correct lv value 300
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');
            // Click the element
            cy.get('@inputField').click().wait(3000);
            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[34].Value, { force: true }).wait(3000);

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click({force:true}); //save the design
            cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click({force:true});
            cy.get(':nth-child(11) > .grey-link').click({force:true}).wait(2000); //Delete the design
            cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}).wait(3000); //yes
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();        
        })

        

        it('Should Validate the wrong hv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({ force: true }).wait(2000).clear({ force: true })

            .wait(2000)

            .type(testdata[2].Value).wait(4000); //factory



            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);

            //cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[3].Value,'{enter}'); //enter the wrong value 300            

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[3].Value, { force: true }).wait(3000);

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click()

            // cy.get('.btn-modal-close').should('be.visible');

            cy.wait(4000)
            
            cy.get('.btn-modal-close').click({ force:true })
            
            //Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();  

        });

        it('Should Validate the wrong second hv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({ force: true }).wait(2000).clear({ force: true })

            .wait(2000)

            .type(testdata[2].Value).wait(4000); //factory



            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);

            //cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[3].Value,'{enter}'); //enter the wrong value 300            

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[3].Value, { force: true }).wait(3000);
            

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .clearfix > .control-label').click()

            // cy.get('.btn-modal-close').should('be.visible');

            cy.wait(4000)
            cy.get('.btn-modal-close').click({ force:true })
            
            //Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();  
           

        });



        it('Should accept the correct hv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);

            //cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[5].Value,'{enter}').wait(3000); //enter the correct hv value 3000
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[5].Value, { force: true }).wait(3000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();

            cy.wait(4000)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();     

        });



        it('Should accept the correct second hv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click({force:true}).wait(2000);

            //cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[5].Value,'{enter}').wait(3000); //enter the correct hv value 3000
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[5].Value, { force: true }).wait(3000);

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();

            cy.wait(5000)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();     

        });


        it('Should Validate the wrong lv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click({force:true}).wait(3000);

            //cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[32].Value,'{enter}').wait(2000); //enter the wrong value 150         
            
            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[32].Value, { force: true }).wait(3000);
            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();

            //cy.get('.btn-modal-close').should('be.visible');

            cy.wait(4000)
              

        });it('Should accept the correct lv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({force:true}).clear({force:true}).wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click({force:true}).wait(1000);

            //cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[34].Value,'{enter}').wait(3000); //enter the correct lv value 300

            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[34].Value, { force: true }).wait(3000);

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click({force:true});

            cy.wait(4000)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();     

        });



        it('should Check the all the Transformer Environment for factory NEU', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({force:true}).clear({force:true}).wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-transformer_environment_tab-tab').click({force:true}).wait(3000);

            cy.get('div[data-fieldname="temperature_rise_oil"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[63].Value);

            cy.get('div[data-fieldname="temperature_rise_winding"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[68].Value);

            cy.wait(4000)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();     

        }); //Transformer Environment    



        it('Should Validate the wrong second lv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({force:true}).clear({force:true}).wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click({force:true}).wait(2000);

            //cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[32].Value,'{enter}').wait(2000); //enter the wrong value 150         

            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[32].Value, { force: true }).wait(3000);

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click({force:true});

            cy.wait(4000)
            

        });



        it('Should accept the correct lv value', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({force:true}).clear({force:true}).wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-__details > :nth-child(3) > .section-head').click();

            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click({force:true}).wait(1000);

            //cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback', { timeout: 10000 }).should('exist').type(testdata[34].Value,'{enter}').wait(3000); //enter the correct lv value 300

            cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
            .as('inputField');

            // Click the element
            cy.get('@inputField').click().wait(3000);

            // Re-fetch the element and type the value
            cy.get('@inputField').type(testdata[34].Value, { force: true }).wait(3000);

            cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click({force:true});

            cy.wait(4000)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();     

        });



        it('should Check the all the Transformer Environment for factory NEU', () => {

            const testdata = Cypress.env('testData');

            cy.get('.primary-action').click().wait(4000);
            cy.wait(4000);

            cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click({force:true}).clear({force:true}).wait(500).type(testdata[2].Value).wait(4000); //factory

            cy.get('#design-transformer_environment_tab-tab').click({force:true}).wait(3000);

            cy.get('div[data-fieldname="temperature_rise_oil"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[63].Value);

            cy.get('div[data-fieldname="temperature_rise_winding"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').should('have.value',testdata[68].Value);

            cy.wait(4000)
            // Logout after each test case
            cy.get('.nav-link > .avatar').click();
            cy.get('[onclick="return frappe.app.logout()"]').click();     

        }); //Transformer Environment    
 
    });



});