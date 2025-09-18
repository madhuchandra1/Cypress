require('cypress-xpath');

describe('SauceDemo Command Chaining & Control Flow', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  });

  it('uses .then() to extract and log item text', () => {
    cy.get('.inventory_item_name').first().then(($el) => {
      const itemName = $el.text();
      cy.log('First inventory item: ' + itemName);
      expect(itemName).to.include('Sauce Labs Backpack');
    });
  });

  it('uses alias .as() and re-queries after click', () => {
    cy.get('#add-to-cart-sauce-labs-backpack').as('addBtn');
    cy.get('@addBtn').should('have.text', 'Add to cart');
    cy.get('@addBtn').click();

    // After click, the button id changes → re-fetch new button
    cy.get('#remove-sauce-labs-backpack').should('have.text', 'Remove');
  });

  it('uses alias for logo and rechecks text', () => {
    cy.get('.app_logo').as('logo');
    cy.get('@logo').should('have.text', 'Swag Labs');
  });

  it('uses .within() to scope commands inside inventory container', () => {
    cy.get('#inventory_container').within(() => {
      cy.get('.inventory_item').should('have.length', 6);
      cy.contains('Sauce Labs Bike Light').should('be.visible');
    });
  });

});
