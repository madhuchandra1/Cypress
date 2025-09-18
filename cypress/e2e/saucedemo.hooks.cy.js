describe('Basic Sauce Demo with Hooks', () => {

  // Runs once before all tests
  before(() => {
    cy.log('>>> Before all tests: Test suite setup');
  });

  // Runs once after all tests
  after(() => {
    cy.log('>>> After all tests: Test suite cleanup');
  });

  // Runs before each test
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.log('>>> Before each test: Open Sauce Demo website');
  });

  // Runs after each test
  afterEach(() => {
    cy.log('>>> After each test: Test finished');
  });

  it('should check page title', () => {
    cy.title().should('eq', 'Swag Labs');  // check browser title
  });

  it('should check page URL', () => {
    cy.url().should('include', 'saucedemo');  // check if URL contains saucedemo
  });

  it('should type into username field', () => {
    cy.get('[data-test="username"]')
      .type('standard_user')
      .should('have.value', 'standard_user'); // check entered text
  });

});
