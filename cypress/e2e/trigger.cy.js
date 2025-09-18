describe('Sauce Demo - Inventory Actions', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  });

  it('should trigger mouseover on burger menu button', () => {
    cy.get('.bm-burger-button').trigger('mouseover').should('be.visible');
  });

  it('should trigger mousedown and mouseup on Add to Cart button', () => {
    cy.get('#add-to-cart-sauce-labs-backpack')
      .as('addBtn')
      .trigger('mousedown')
      .trigger('mouseup')
      .click();
    cy.get('@addBtn').should('have.text', 'Remove');
  });
});

describe('Sauce Demo - Login Page Actions', () => {
  it('should trigger focus on username input', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]')
      .trigger('focus')
      .should('be.focused');
  });
});
