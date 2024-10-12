/* eslint-disable */
/// <reference types="cypress" />


Cypress.Commands.add('waitForFormToLoad', () => {
  cy.get('.layout-main > .col') 
    .should('be.visible');  
});
 
//Excel file data fetching

describe('Design Tesing', () => {
  beforeEach(() => {
    cy.task('readExcelFile', { filePath:'./cypress/e2e/variables/envDesignEU000010500028.xlsx' }).then((data) => {   
    Cypress.log({ message: 'Excel data loaded', log: false });
    cy.wrap(data).as('testdata');   
    });
});

   //Segment-1
  // Test for NEU Factory
    
  it('NEU Factory',{ retries: 3 }, () => {

    cy.get('@testdata').then((testdata) => {
      const username = Cypress.env('username');
      const password = Cypress.env('password');

      const source = testdata[0].Value;
      
      cy.visit(source);
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);
      cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
      cy.location('pathname', { timeout: 10000 }).should('include', '/app');

      const target = testdata[1].Value;
      cy.visit(target);

    
      const factory3 = testdata[3].Value;


      cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
        .should('be.visible') 
        .wait(10000)             
        .clear()            
        .wait(6000)                         
        .type(factory3, { force: true })  
        .wait(6000)    
        .type('{enter}', { force: true })  
        .invoke('val')                     
        .then(value => {
        cy.log('The current value is: ' + value); 
            expect(value).to.eq(factory3);       
          });
      
    
        
          cy.wait(7000);
        
          cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
            .should('be.visible') 
            .wait(1000)
            .should('have.value', factory3); 
        
         
        
cy.wait(3000);


    const rating = testdata[10].Value;
    
    cy.get(':nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
      .should('have.value', rating);


      
    const Hv_min = String(testdata[11].Value);
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.type(Hv_min +'{enter}');
      
      cy.wait(2000);
      cy.get('.btn-modal-close')
        .wait(2000)
        .click({ force: true });

      cy.wait(2000);

      const HV_max = String(testdata[12].Value);
      cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .clear({ force: true })
        .type(HV_max+'{enter}');

      cy.wait(4000);

      cy.get('.btn-modal-close') 
        .wait(4000)         
        .click({ force: true });
      

      cy.wait(2000);

      const NEU_HV1 = String(testdata[97].Value);
      const NEU_HV2 = String(testdata[98].Value);
      const NEU_HV1_crt = String(testdata[99].Value);
      const NEU_HV2_crt = String(testdata[100].Value);


      
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .wait(3000) // Wait for any delays
  .type(`${NEU_HV1}/${NEU_HV2}`) 
  .type('{enter}')
  .wait(2000); // Wait after typing
cy.get('.btn-modal-close')
  .click({force:true});
cy.wait(3000);
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .clear({force:true})
  .wait(3000) // Wait for any delays
  .type(`${NEU_HV1_crt}/${NEU_HV2_crt}`) 
  .type('{enter}',{force:true})// Type in the value
  .wait(2000); // Wait after typing

  
  cy.get(':nth-child(3) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
    .should('have.value', testdata[101].Value);
  cy.get(':nth-child(3) > .section-body > :nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
    .should('have.value', testdata[102].Value);  
        cy.wait(2000);
      

      
      const LV_min = String(testdata[20].Value);
      const LV_max = String(testdata[21].Value);  
      cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')            
        .type(LV_min+'{enter}', { force: true });
      cy.wait(2000);
      cy.get('.btn-modal-close')
        .wait(3000)
        .click({ force: true });

      cy.wait(3000);

      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')        .clear({ force: true })
        .wait(1000)
        .type(LV_max )
        .type('{enter}'+{force:true});

      cy.wait(3000);

      cy.get('.btn-modal-close') 
        .wait(3000)         
        .click({ force: true });

      const LV1 = String(testdata[91].Value);
      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')        
        .clear({ force: true })
        .type(LV1+'{enter}')

      cy.wait(3000);  
      cy.get('.btn-modal-close').click({force:true});        

      const Lv_HOV1 = String(testdata[92].Value);
      const Lv_HOV2 = String(testdata[93].Value);

      cy.get(':nth-child(4) > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',Lv_HOV1);

      cy.wait(2000);          

      const Lv_AC_phase1 = String(testdata[94].Value);
      const Lv_AC_phase2 = String(testdata[95].Value);


      cy.get(':nth-child(4) > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_AC_phase1);

      cy.wait(2000);          

      const Lv_LI_phase1 = String(testdata[96].Value);
      
      
      cy.get(':nth-child(4) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_LI_phase1);

      const Lv_type1 = String(testdata[32].Value);
      const Lv_type2 = String(testdata[33].Value);

      cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_type1);


      cy.get('div[data-fieldname="vector_group"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', 'Dyn1');

      const THDi = testdata[34].Value;
      cy.get(':nth-child(2) > form > div[data-fieldtype="Int"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',THDi);



        const IP_protection1 = testdata[35].Value;
        const IP_protection2 = testdata[36].Value;
        const IP_protection3 = testdata[37].Value;
        const IP_protection4 = testdata[38].Value;
        const IP_protection5 = testdata[39].Value;
        const IP_protection6 = testdata[40].Value;
        const IP_protection7 = testdata[41].Value;


      const Uk = testdata[42].Value;
      cy.get(':nth-child(5) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',Uk);


cy.get('div[data-fieldname="vector_group"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .should('have.value', 'Dyn1');


//High volgtage tab

cy.get('#design-high_voltage_tab-tab')
.click({ force: true });

cy.get('div[data-fieldname="tapping_plus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['2','3'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});

cy.get('div[data-fieldname="tapping_plus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2');

cy.get('div[data-fieldname="tapping_minus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['2','3'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});


cy.get('div[data-fieldname="tapping_minus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2');


cy.get('div[data-fieldname="tapping_plus_step"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2,5');


cy.get('[data-fieldname="tapping_minus_step"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '2.5%');

//Transformer environment

cy.get('#design-transformer_environment_tab-tab')
.click({ force: true });


cy.get('div[data-fieldname="temperature_rise"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '100,0');


cy.get('div[data-fieldname="ambient_max_temperature"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '40,0');



cy.get(':nth-child(3) > form > div[data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '20,0');


cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', 'max 1000 m above see level');


cy.get('div[data-fieldname="max_average_temperature_per_month"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '30,0');



cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['C2','C3','C4','C5'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});

cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', 'C2');



cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['E2','E3','E4','E5'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);   
});
});


cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', 'E2');


// Guaranties values

cy.get('#design-guaranties_values_tab-tab')
.click({ force: true });


cy.get(':nth-child(1) > form > [data-fieldtype="Percent"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '10%');

cy.get('div[data-fieldname="no_load_loss_guarantee"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '1395');

cy.get('div[data-fieldname="load_loss_guarantee"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '9000');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '120');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(1) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '64');

cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '0');

cy.get('div[data-fieldname="lpa_distance"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '1');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '0');



});

}); 

  //Segment-2
  //Testing for RGB Factory
  it('RGB Factory',{ retries: 3 }, () => {

    cy.get('@testdata').then((testdata) => {
      const username = Cypress.env('username');
      const password = Cypress.env('password');

      const source = testdata[0].Value;
      
      cy.visit(source);
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);
      cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
      cy.location('pathname', { timeout: 10000 }).should('include', '/app');

      const target = testdata[1].Value;
      cy.visit(target);

    
      const factory3 = testdata[3].Value;


      cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
        .should('be.visible') 
        .wait(10000)             
        .clear()            
        .wait(6000)                         
        .type(factory3, { force: true })  
        .wait(6000)    
        .type('{enter}', { force: true })  
        .invoke('val')                     
        .then(value => {
        cy.log('The current value is: ' + value); 
            expect(value).to.eq(factory3);       
          });
      
    
        
          cy.wait(7000);
        
          cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
            .should('be.visible') 
            .wait(1000)
            .should('have.value', factory3); 
        
         
        
cy.wait(3000);


    const rating = testdata[10].Value;
    
    cy.get(':nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
      .should('have.value', rating);


      
    const Hv_min = String(testdata[11].Value);
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.type(Hv_min +'{enter}');
      
      cy.wait(2000);
      cy.get('.btn-modal-close')
        .wait(2000)
        .click({ force: true });

      cy.wait(2000);

      const HV_max = String(testdata[12].Value);
      cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .clear({ force: true })
        .type(HV_max+'{enter}');

      cy.wait(4000);

      cy.get('.btn-modal-close') 
        .wait(4000)         
        .click({ force: true });
      

      cy.wait(2000);

      const RGB_HV1 = String(testdata[97].Value);
      const RGB_HV2 = String(testdata[98].Value);
      const RGB_HV1_crt = String(testdata[99].Value);
      const RGB_HV2_crt = String(testdata[100].Value);


      
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .wait(3000) // Wait for any delays
  .type(`${RGB_HV1}/${RGB_HV2}`) 
  .type('{enter}')
  .wait(2000); // Wait after typing
cy.get('.btn-modal-close')
  .click({force:true});
cy.wait(3000);
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .clear({force:true})
  .wait(3000) // Wait for any delays
  .type(`${RGB_HV1_crt}/${RGB_HV2_crt}`) 
  .type('{enter}',{force:true})// Type in the value
  .wait(2000); // Wait after typing

  
  cy.get(':nth-child(3) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
    .should('have.value', testdata[101].Value);
  cy.get(':nth-child(3) > .section-body > :nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
    .should('have.value', testdata[102].Value);  
        cy.wait(2000);
      

      
      const LV_min = String(testdata[20].Value);
      const LV_max = String(testdata[21].Value);  
      cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')            
        .type(LV_min+'{enter}', { force: true });
      cy.wait(2000);
      cy.get('.btn-modal-close')
        .wait(3000)
        .click({ force: true });

      cy.wait(3000);

      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')        .clear({ force: true })
        .wait(1000)
        .type(LV_max )
        .type('{enter}'+{force:true});

      cy.wait(3000);

      cy.get('.btn-modal-close') 
        .wait(3000)         
        .click({ force: true });

      const LV1 = String(testdata[91].Value);
      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')        
        .clear({ force: true })
        .type(LV1+'{enter}')

      cy.wait(3000);  
      cy.get('.btn-modal-close').click({force:true});        

      const Lv_HOV1 = String(testdata[92].Value);
      const Lv_HOV2 = String(testdata[93].Value);

      cy.get(':nth-child(4) > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',Lv_HOV1);

      cy.wait(2000);          

      const Lv_AC_phase1 = String(testdata[94].Value);
      const Lv_AC_phase2 = String(testdata[95].Value);


      cy.get(':nth-child(4) > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_AC_phase1);

      cy.wait(2000);          

      const Lv_LI_phase1 = String(testdata[96].Value);
      
      
      cy.get(':nth-child(4) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_LI_phase1);

      const Lv_type1 = String(testdata[32].Value);
      const Lv_type2 = String(testdata[33].Value);

      cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_type1);


      cy.get('div[data-fieldname="vector_group"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', 'Dyn1');

      const THDi = testdata[34].Value;
      cy.get(':nth-child(2) > form > div[data-fieldtype="Int"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',THDi);



        const IP_protection1 = testdata[35].Value;
        const IP_protection2 = testdata[36].Value;
        const IP_protection3 = testdata[37].Value;
        const IP_protection4 = testdata[38].Value;
        const IP_protection5 = testdata[39].Value;
        const IP_protection6 = testdata[40].Value;
        const IP_protection7 = testdata[41].Value;


      const Uk = testdata[42].Value;
      cy.get(':nth-child(5) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',Uk);


cy.get('div[data-fieldname="vector_group"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .should('have.value', 'Dyn1');


//High volgtage tab

cy.get('#design-high_voltage_tab-tab')
.click({ force: true });

cy.get('div[data-fieldname="tapping_plus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['2','3'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});

cy.get('div[data-fieldname="tapping_plus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2');

cy.get('div[data-fieldname="tapping_minus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['2','3'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});


cy.get('div[data-fieldname="tapping_minus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2');


cy.get('div[data-fieldname="tapping_plus_step"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2,5');


cy.get('[data-fieldname="tapping_minus_step"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '2.5%');

//Transformer environment

cy.get('#design-transformer_environment_tab-tab')
.click({ force: true });


cy.get('div[data-fieldname="temperature_rise"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '100,0');


cy.get('div[data-fieldname="ambient_max_temperature"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '40,0');



cy.get(':nth-child(3) > form > div[data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '20,0');


cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', 'max 1000 m above see level');


cy.get('div[data-fieldname="max_average_temperature_per_month"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '30,0');



cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['C2','C3','C4','C5'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});

cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', 'C2');



cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['E2','E3','E4','E5'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);   
});
});


cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', 'E2');


// Guaranties values

cy.get('#design-guaranties_values_tab-tab')
.click({ force: true });


cy.get(':nth-child(1) > form > [data-fieldtype="Percent"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '10%');

cy.get('div[data-fieldname="no_load_loss_guarantee"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '1395');

cy.get('div[data-fieldname="load_loss_guarantee"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '9000');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '120');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(1) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '64');

cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '0');

cy.get('div[data-fieldname="lpa_distance"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '1');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '0');


});

});

  //Segment-3
  //Testing for SGBCZ Factory

  it('SGBCZ Factory',{ retries: 3 }, () => {
    
    cy.get('@testdata').then((testdata) => {
      const username = Cypress.env('username');
      const password = Cypress.env('password');

      const source = testdata[0].Value;
      
      cy.visit(source);
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);
      cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
      cy.location('pathname', { timeout: 10000 }).should('include', '/app');

      const target = testdata[1].Value;
      cy.visit(target);

    
      const factory3 = testdata[3].Value;


      cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
        .should('be.visible') 
        .wait(10000)             
        .clear()            
        .wait(6000)                         
        .type(factory3, { force: true })  
        .wait(6000)    
        .type('{enter}', { force: true })  
        .invoke('val')                     
        .then(value => {
        cy.log('The current value is: ' + value); 
            expect(value).to.eq(factory3);       
          });
      
    
        
          cy.wait(7000);
        
          cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
            .should('be.visible') 
            .wait(1000)
            .should('have.value', factory3); 
        
         
        
cy.wait(3000);


    const rating = testdata[10].Value;
    
    cy.get(':nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
      .should('have.value', rating);


      
    const Hv_min = String(testdata[11].Value);
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.type(Hv_min +'{enter}');
      
      cy.wait(2000);
      cy.get('.btn-modal-close')
        .wait(2000)
        .click({ force: true });

      cy.wait(2000);

      const HV_max = String(testdata[12].Value);
      cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .clear({ force: true })
        .type(HV_max+'{enter}');

      cy.wait(4000);

      cy.get('.btn-modal-close') 
        .wait(4000)         
        .click({ force: true });
      

      cy.wait(2000);

      const SGBCZ_HV1 = String(testdata[97].Value);
      const SGBCZ_HV2 = String(testdata[98].Value);
      const SGBCZ_HV1_crt = String(testdata[99].Value);
      const SGBCZ_HV2_crt = String(testdata[100].Value);


      
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .wait(3000) // Wait for any delays
  .type(`${SGBCZ_HV1}/${SGBCZ_HV2}`) 
  .type('{enter}')
  .wait(2000); // Wait after typing
cy.get('.btn-modal-close')
  .click({force:true});
cy.wait(3000);
cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .clear({force:true})
  .wait(3000) // Wait for any delays
  .type(`${SGBCZ_HV1_crt}/${SGBCZ_HV2_crt}`) 
  .type('{enter}',{force:true})// Type in the value
  .wait(2000); // Wait after typing

  
  cy.get(':nth-child(3) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
    .should('have.value', testdata[101].Value);
  cy.get(':nth-child(3) > .section-body > :nth-child(3) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
    .should('have.value', testdata[102].Value);  
        cy.wait(2000);
      

      
      const LV_min = String(testdata[20].Value);
      const LV_max = String(testdata[21].Value);  
      cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')            
        .type(LV_min+'{enter}', { force: true });
      cy.wait(2000);
      cy.get('.btn-modal-close')
        .wait(3000)
        .click({ force: true });

      cy.wait(3000);

      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')        .clear({ force: true })
        .wait(1000)
        .type(LV_max )
        .type('{enter}'+{force:true});

      cy.wait(3000);

      cy.get('.btn-modal-close') 
        .wait(3000)         
        .click({ force: true });

      const LV1 = String(testdata[91].Value);
      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')        
        .clear({ force: true })
        .type(LV1+'{enter}')

      cy.wait(3000);  
      cy.get('.btn-modal-close').click({force:true});        

      const Lv_HOV1 = String(testdata[92].Value);
      const Lv_HOV2 = String(testdata[93].Value);

      cy.get(':nth-child(4) > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',Lv_HOV1);

      cy.wait(2000);          

      const Lv_AC_phase1 = String(testdata[94].Value);
      const Lv_AC_phase2 = String(testdata[95].Value);


      cy.get(':nth-child(4) > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_AC_phase1);

      cy.wait(2000);          

      const Lv_LI_phase1 = String(testdata[96].Value);
      
      
      cy.get(':nth-child(4) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_LI_phase1);

      const Lv_type1 = String(testdata[32].Value);
      const Lv_type2 = String(testdata[33].Value);

      cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', Lv_type1);


      cy.get('div[data-fieldname="vector_group"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value', 'Dyn1');

      const THDi = testdata[34].Value;
      cy.get(':nth-child(2) > form > div[data-fieldtype="Int"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',THDi);



        const IP_protection1 = testdata[35].Value;
        const IP_protection2 = testdata[36].Value;
        const IP_protection3 = testdata[37].Value;
        const IP_protection4 = testdata[38].Value;
        const IP_protection5 = testdata[39].Value;
        const IP_protection6 = testdata[40].Value;
        const IP_protection7 = testdata[41].Value;


      const Uk = testdata[42].Value;
      cy.get(':nth-child(5) > .section-body > :nth-child(4) > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .should('have.value',Uk);


cy.get('div[data-fieldname="vector_group"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
  .should('have.value', 'Dyn1');


//High volgtage tab

cy.get('#design-high_voltage_tab-tab')
.click({ force: true });

cy.get('div[data-fieldname="tapping_plus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['2','3'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});

cy.get('div[data-fieldname="tapping_plus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2');

cy.get('div[data-fieldname="tapping_minus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['2','3'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});


cy.get('div[data-fieldname="tapping_minus"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2');


cy.get('div[data-fieldname="tapping_plus_step"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '2,5');


cy.get('[data-fieldname="tapping_minus_step"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '2.5%');

//Transformer environment

cy.get('#design-transformer_environment_tab-tab')
.click({ force: true });


cy.get('div[data-fieldname="temperature_rise"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '100,0');


cy.get('div[data-fieldname="ambient_max_temperature"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '40,0');



cy.get(':nth-child(3) > form > div[data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '20,0');


cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', 'max 1000 m above see level');


cy.get('div[data-fieldname="max_average_temperature_per_month"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '30,0');



cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['C2','C3','C4','C5'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);  
});
});

cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(2) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', 'C2');



cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.find('option')  
.then((options) => {
const values = ['E2','E3','E4','E5'];   
options.each((index, option) => {
expect(option.value).to.equal(values[index]);   
});
});


cy.get('#design-transformer_environment_tab > .row > .section-body > :nth-child(3) > form > div[data-fieldtype="Select"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', 'E2');


// Guaranties values

cy.get('#design-guaranties_values_tab-tab')
.click({ force: true });


cy.get(':nth-child(1) > form > [data-fieldtype="Percent"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '10%');

cy.get('div[data-fieldname="no_load_loss_guarantee"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '1395');

cy.get('div[data-fieldname="load_loss_guarantee"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '9000');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '120');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(1) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '64');

cy.get('div[data-fieldname="lpa"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '0');

cy.get('div[data-fieldname="lpa_distance"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
.should('have.value', '1');

cy.get('#design-guaranties_values_tab > .row > .section-body > :nth-child(4) > form > [data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-value')
.should('have.text', '0');


  });

});

});
