require('cypress-xpath');

describe('Sauce Demo Spec', () => {
  
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    // Login before each test
    cy.get('[data-test="username"]').clear().type('standard_user').should('have.value', 'standard_user');
    cy.get('[data-test="password"]').clear().type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  });

  it('should verify item existence', () => {
    cy.get('#add-to-cart-sauce-labs-backpack').should('exist');
    cy.get('.bm-menu-wrap').should('exist');
    cy.get('.bm-menu-wrap12').should('not.exist');
  });

  it('should toggle burger menu visibility', () => {
    cy.get('.bm-menu-wrap').should('not.be.visible');
    cy.get('.bm-burger-button').click();
    cy.get('.bm-menu-wrap').should('be.visible');
  });

  it('should verify text content', () => {
    cy.get('.app_logo').should('have.text', 'Swag Labs');
    cy.xpath('//*[@id="item_4_title_link"]/div').should('include.text', 'Sauce Labs');
    cy.get('.app_logo').should('not.have.text', 'Swag Labs Backpack');
    cy.xpath('//*[@id="item_0_title_link"]/div').should('contain', 'Bike Light');
    cy.xpath('//*[@id="inventory_container"]/div/div[2]/div[2]/div[2]/div')
      .invoke('text')
      .should('match', /^\$\d+\.\d{2}$/);
  });

  it('should check attributes', () => {
    cy.get('#item_4_title_link').should('have.attr', 'href', '#');
    cy.get('#item_4_title_link').should('not.have.attr', 'target');
  });

  it('should verify CSS classes', () => {
    cy.get('[data-test="inventory-container"]').should('have.class', 'inventory_container');
    cy.get('[data-test="inventory-container"]').should('not.have.class', 'inactive');
  });

  it('should check element lengths', () => {
    cy.get('.app_logo').should('have.length', 1);
    cy.get('.app_logo').should('have.length.greaterThan', 0);
  });

  it('should chain assertions on Add to Cart button', () => {
    cy.get('#add-to-cart-sauce-labs-backpack')
      .should('be.visible')
      .and('have.text', 'Add to cart')
      .and('not.have.class', 'disabled');
  });

  it('should assert against a function for inventory items', () => {
    cy.get('.inventory_item_name').should(($list) => {
      cy.task('log', `Inventory item count: ${$list.length}`);
      expect($list).to.have.length(6);
      expect($list.first()).to.contain('Sauce Labs Backpack');
    });
  });

  it('should verify URL checks', () => {
    cy.url().should('include', '/inventory.html');
    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html');
  });

});
