/* eslint-disable */
 
describe('Sales Table Report', () => {

  before(() => {
  // Read data from the Excel file
    cy.task('readExcelFile', { filePath: './cypress/e2e/variables/envSales TableEU000010500028.xlsx'}).then((data) => {
          cy.wrap(data).as('testdata');
      });
  });
  
  // Sequence 1: Login and navigate to Sales Table Report
  it('Sales Table', () => {
      const username = Cypress.env('username');
      const password = Cypress.env('password'); 
      //Fetching data from the Excel sheet
      cy.get('@testdata').then((testdata) => {
          const source = testdata[0].Value;  
          const target = testdata[1].Value; 
          const salesOrder = testdata[4].Value; 
          const customer = testdata[5].Value; 
          const deliveryNote = testdata[6].Value; 
          const incoterms = testdata[7].Value; 
          const customerGroup = testdata[8].Value; 
          const territory = testdata[9].Value; 
          const documentationLanguage = testdata[10].Value; 
          const itemCode = testdata[12].Value; 
          const idNumber = testdata[13].Value; 
          const rdgNumber = testdata[14].Value; 
          const rating = testdata[15].Value; 
          const trafoType = testdata[16].Value; 
          const hvVolt = testdata[17].Value; 
          const lvVolt = testdata[18].Value; 
          const vectorGroup = testdata[19].Value; 
          const uk = testdata[20].Value; 
          const tappings = testdata[21].Value; 
          const p0 = testdata[22].Value; 
          const pk = testdata[23].Value; 
          const li = testdata[24].Value; 
          const thdi = testdata[25].Value; 
          const ipProtection = testdata[26].Value; 
          const electroStaticScreen = testdata[27].Value; 
          const hv1Volt = testdata[28].Value; 
          const hv2Volt = testdata[29].Value; 
          const po = testdata[30].Value; 
          const poDate = testdata[31].Value; 
          const oaConfirmedDate = testdata[32].Value; 
          const deliveryDate = testdata[35].Value; 
          const storageFee = testdata[37].Value; 
          const transformerStatus = testdata[38].Value; 
          const orderValue = testdata[40].Value; 
          const priceGTS = testdata[41].Value; 
          const paymentCondition = testdata[44].Value; 
          const antiVibrationPads = testdata[48].Value; 
          const controlUnit = testdata[54].Value; 
          const sgbAccount = testdata[63].Value; 

          
  
      cy.visit(source);
      
      // Typing into inputs
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);
      
      // Clicking the login button and waiting for navigation
      cy.get('.form-signin > :nth-child(1) > .page-card-actions > .btn').click({force: true});
      //cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click({force: true});
      cy.location('pathname', { timeout: 10000 }).should('include', '/app');
      
      // Visit the target URL
      cy.visit(target);
      
      // Clear and type dates in the input fields
      // cy.wait(3000);
      
      cy.get('#page-query-report > .page-body > .page-wrapper > .page-content > .row > .layout-main-section-wrapper', { timeout: 10000 }).should('be.visible');
      
      cy.get('#page-query-report > .page-body > .page-wrapper > .page-content > .row > .layout-main-section-wrapper', { timeout: 10000 }).should('be.visible');
      cy.wait(3000);
      cy.get('.dt-cell--col-2 > .dt-cell__content > .dt-filter', { timeout: 10000 })
          .should('be.visible')
          .type(salesOrder);
      cy.wait(4000);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-2 > .dt-cell__content', { timeout: 10000 })
          .should('be.visible')
          .contains(salesOrder);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-4 > .dt-cell__content').contains(customer);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-3 > .dt-cell__content').contains(deliveryNote);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-13 > .dt-cell__content').contains(incoterms);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-5 > .dt-cell__content').contains(customerGroup);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-7 > .dt-cell__content').contains(territory);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-8 > .dt-cell__content').contains(documentationLanguage);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-9 > .dt-cell__content')
          .invoke('text')
          .should((text) => {
          const normalizedText = text.trim();
          const expectedText = testdata[11]?.Value 
          ? testdata[11].Value.replace(/\s+/g, ' ').trim() 
          : '';
          expect(normalizedText).to.equal(expectedText);
          });
          
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-10 > .dt-cell__content').contains(itemCode);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-11 > .dt-cell__content').contains(idNumber);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-12 > .dt-cell__content').contains(rdgNumber);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-6 > .dt-cell__content').contains(trafoType);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-14 > .dt-cell__content').contains(rating);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-15 > .dt-cell__content').contains(hvVolt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-16 > .dt-cell__content').contains(lvVolt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-17 > .dt-cell__content').contains(vectorGroup);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-18 > .dt-cell__content').contains(uk);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-19 > .dt-cell__content').contains(tappings);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-20 > .dt-cell__content').contains(p0);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-21 > .dt-cell__content').contains(pk);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-22 > .dt-cell__content').contains(li);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-23 > .dt-cell__content').contains(thdi);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-24 > .dt-cell__content').contains(ipProtection);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-25 > .dt-cell__content').contains(electroStaticScreen);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-26 > .dt-cell__content').contains(hv1Volt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-27 > .dt-cell__content').contains(hv2Volt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-28 > .dt-cell__content').contains(po);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-29 > .dt-cell__content').contains(poDate);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-30 > .dt-cell__content')
      .should('have.css', 'color', 'rgb(51, 60, 68)');
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-31 > .dt-cell__content').contains(oaConfirmedDate);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-32 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[33]?.Value 
        ? testdata[33].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-33 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[34]?.Value 
        ? testdata[34].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-34 > .dt-cell__content').contains(deliveryDate); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-35 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[36]?.Value 
        ? testdata[36].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-36 > .dt-cell__content').contains(storageFee);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-37 > .dt-cell__content').contains(transformerStatus);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-38 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[39]?.Value 
        ? testdata[39].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-39 > .dt-cell__content').contains(orderValue);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-40 > .dt-cell__content').contains(priceGTS);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-41 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[42]?.Value 
        ? testdata[42].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
          
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-42 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[43]?.Value 
        ? testdata[43].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-43 > .dt-cell__content').contains(paymentCondition); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-44 > .dt-cell__content') 
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[45]?.Value 
        ? testdata[45].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-45 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[46]?.Value 
        ? testdata[46].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-46 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[47]?.Value 
        ? testdata[47].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-47 > .dt-cell__content').contains(antiVibrationPads);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-48 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[49]?.Value 
        ? testdata[49].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-49 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[50]?.Value 
        ? testdata[50].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-50 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[51]?.Value 
        ? testdata[51].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-51 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[52]?.Value 
        ? testdata[52].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-52 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[53]?.Value 
        ? testdata[53].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-53 > .dt-cell__content').contains(controlUnit);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-54 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[55]?.Value 
        ? testdata[55].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-55 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[56]?.Value 
        ? testdata[56].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-56 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[57]?.Value 
        ? testdata[57].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-57 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[58]?.Value 
        ? testdata[58].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-58 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[59]?.Value 
        ? testdata[59].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-59 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[60]?.Value 
        ? testdata[60].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-60 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[61]?.Value 
        ? testdata[61].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-61 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[62]?.Value 
        ? testdata[62].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-62 > .dt-cell__content').contains(sgbAccount);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-63 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[64]?.Value 
        ? testdata[64].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-64 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[65]?.Value 
        ? testdata[65].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-65 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[66]?.Value 
        ? testdata[66].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-66 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[67]?.Value 
        ? testdata[67].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-67 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[68]?.Value 
        ? testdata[68].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-68 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
        const normalizedText = text.trim();
        const expectedText = testdata[69]?.Value 
        ? testdata[69].Value.replace(/\s+/g, ' ').trim() 
        : '';
        expect(normalizedText).to.equal(expectedText);
        });

      cy.wait(2000);
      cy.get('.dt-cell--col-2 > .dt-cell__content > .dt-filter', { timeout: 10000 })
          .should('be.visible')
          .clear();
      cy.wait(3000);
      cy.get('.dt-cell--col-6 > .dt-cell__content > .dt-filter', { timeout: 20000 })
          .should('be.visible')
          .type("RGB");
      cy.wait(4000);
      cy.get('.dt-scrollable__no-data', { timeout: 10000 })
        .should('be.visible');
      cy.wait(2000);
      cy.get('.dt-cell--col-6 > .dt-cell__content > .dt-filter', { timeout: 20000 })
          .should('be.visible')
          .clear();
      cy.get('.cursor-pointer', { timeout: 10000 })
        .should('be.visible')
        .click();
      cy.get('[data-value="RGB"]', { timeout: 10000 })
        .should('be.visible')
        .click();
      cy.wait(2000);
      cy.get('.container > .row').click()
      cy.wait(3000);
      cy.get('.dt-cell--col-6 > .dt-cell__content > .dt-filter', { timeout: 20000 })
          .should('be.visible')
          .type("RGB");
      cy.get('.dt-row-1 > .dt-cell--col-6 > .dt-cell__content > div', { timeout: 20000 })
        .should('be.visible')
        .contains("RGB");
      

      }); 
      });
    
  });