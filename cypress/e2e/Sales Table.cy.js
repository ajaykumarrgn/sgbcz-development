/* eslint-disable */
import * as env from './variables/envSales TableEU000010500028.js';

describe('Sales Table Report', () => {
  it('Sales Table', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
      // Sequence 1: Login and navigate to new quotation
      cy.visit(env.source);

      // Typing into inputs
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);

      // Clicking the login button and waiting for navigation
      cy.get('.form-signin > :nth-child(1) > .page-card-actions > .btn').click({force: true});
      cy.location('pathname', { timeout: 10000 }).should('include', '/app');


      // Visit the target URL
      cy.visit(env.target);

      // Clear and type dates in the input fields
      cy.wait(1000);

      cy.get('#page-query-report > .page-body > .page-wrapper > .page-content > .row > .layout-main-section-wrapper', { timeout: 10000 }).should('be.visible');

      cy.get('#page-query-report > .page-body > .page-wrapper > .page-content > .row > .layout-main-section-wrapper', { timeout: 10000 }).should('be.visible');
      cy.wait(30000);
      cy.get('.dt-cell--col-2 > .dt-cell__content > .dt-filter', { timeout: 10000 })
        .should('be.visible')
        .type(env.salesOrder);
      cy.wait(4000);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-2 > .dt-cell__content', { timeout: 10000 })
        .should('be.visible')
        .contains(env.salesOrder);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-4 > .dt-cell__content').contains(env.customer);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-3 > .dt-cell__content').contains(env.deliveryNote);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-6 > .dt-cell__content').contains(env.incoterms);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-5 > .dt-cell__content').contains(env.customerGroup);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-7 > .dt-cell__content').contains(env.territory);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-8 > .dt-cell__content').contains(env.documentationLanguage);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-9 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.reservedOrder);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-10 > .dt-cell__content').contains(env.itemCode);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-11 > .dt-cell__content').contains(env.idNumber);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-12 > .dt-cell__content').contains(env.rdgNumber);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-13 > .dt-cell__content').contains(env.trafoType);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-14 > .dt-cell__content').contains(env.rating);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-15 > .dt-cell__content').contains(env.hvVolt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-16 > .dt-cell__content').contains(env.lvVolt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-17 > .dt-cell__content').contains(env.vectorGroup);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-18 > .dt-cell__content').contains(env.uk);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-19 > .dt-cell__content').contains(env.tappings);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-20 > .dt-cell__content').contains(env.p0);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-21 > .dt-cell__content').contains(env.pk);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-22 > .dt-cell__content').contains(env.li);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-23 > .dt-cell__content').contains(env.thdi);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-24 > .dt-cell__content').contains(env.ipProtection);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-25 > .dt-cell__content').contains(env.electroStaticScreen);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-26 > .dt-cell__content').contains(env.hv1Volt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-27 > .dt-cell__content').contains(env.hv2Volt);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-28 > .dt-cell__content').contains(env.po);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-29 > .dt-cell__content').contains(env.poDate);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-30 > .dt-cell__content')
        .should('have.css', 'color', 'rgb(51, 60, 68)');
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-31 > .dt-cell__content').contains(env.oaConfirmedDate);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-32 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.plannedProductionEndDate);
        });
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-33 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.plannedWeeks);
        });  
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-34 > .dt-cell__content').contains(env.deliveryDate);  
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-35 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.onTimeDelivery);
        });  
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-36 > .dt-cell__content').contains(env.storageFee);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-37 > .dt-cell__content').contains(env.transformerStatus);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-38 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.sapReference);
        });  
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-39 > .dt-cell__content').contains(env.orderValue);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-40 > .dt-cell__content').contains(env.priceGTS);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-41 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.invoiceNumber);
        });  

      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-42 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.invoiceDate);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-43 > .dt-cell__content').contains(env.paymentCondition);  
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-44 > .dt-cell__content') 
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.productionEndDate);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-45 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.gtaSerialNumber);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-46 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.companyGurantee);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-47 > .dt-cell__content').contains(env.antiVibrationPads);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-48 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.enclosure);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-49 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.ballPoint);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-50 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.cupal);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-51 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.busbars);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-52 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.fan);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-53 > .dt-cell__content').contains(env.controlUnit);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-54 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.sensors);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-55 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.forkLift);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-56 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.siliconFree);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-57 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.testLab);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-58 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.otherAccessories);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-59 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.engineeringRequired);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-60 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.earthingSwith);
        }); 
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-61 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.surgeArrester);
        });   
        
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-62 > .dt-cell__content').contains(env.sgbAccount);
      cy.get('.dt-scrollable > .dt-row > .dt-cell--col-63 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.agent);
        });   
        cy.get('.dt-scrollable > .dt-row > .dt-cell--col-64 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.notes);
        });   
        cy.get('.dt-scrollable > .dt-row > .dt-cell--col-65 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.prepaymentInvoice);
        });   
        cy.get('.dt-scrollable > .dt-row > .dt-cell--col-66 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.prepaymentStatus);
        });   
        cy.get('.dt-scrollable > .dt-row > .dt-cell--col-67 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.prepaymentInvoice2);
        });   
        cy.get('.dt-scrollable > .dt-row > .dt-cell--col-68 > .dt-cell__content')
        .invoke('text')
        .should((text) => {
          expect(text.trim()).to.equal(env.prepaymentStatus2);
        });      
  });
});