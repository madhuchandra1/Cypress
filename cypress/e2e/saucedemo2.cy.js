/// <reference types="cypress" />
require('cypress-xpath');
 
// ================== PAGE OBJECTS ==================
 
class BasePage {
  goto(url) { cy.visit(url); }
  goBack() { cy.go('back'); }
  goForward() { cy.go('forward'); }
  reload() { cy.reload(); }
  waitForURL(url) { cy.url().should('include', url); }
}
 
class LoginPage extends BasePage {
  get usernameInput() { return cy.get('[data-test="username"]'); }
  get passwordInput() { return cy.get('[data-test="password"]'); }
  get loginButton() { return cy.get('[data-test="login-button"]'); }
  get swagLabsTitle() { return cy.contains('Swag Labs'); }
 
  login(username, password) {
    this.usernameInput.clear().type(username);
    this.passwordInput.clear().type(password);
    this.loginButton.should('be.enabled').click();
  }
 
  verifyLoginPageLoaded() {
    cy.get('.login_logo').should('exist').and('be.visible');
    this.swagLabsTitle.should('be.visible').and('have.text', 'Swag Labs');
  }
}
 
class InventoryPage extends BasePage {
  get productsHeader() { return cy.get('[data-test="primary-header"]'); }
  get sortDropdown() { return cy.get('[data-test="product-sort-container"]'); }
  get shoppingCartLink() { return cy.get('[data-test="shopping-cart-link"]'); }
  get shoppingCartBadge() { return cy.get('[data-test="shopping-cart-badge"]'); }
  get menuButton() { return cy.get('#react-burger-menu-btn'); }
  get closeMenuButton() { return cy.get('#react-burger-cross-btn'); }
 
  verifyInventoryPageLoaded() {
    this.productsHeader.should('contain', 'Swag Labs');
    cy.contains('Products').should('be.visible');
  }
 
  openAndCloseMenu() {
    this.menuButton.should('be.visible').click();
    this.closeMenuButton.should('be.visible').click();
  }
 
  sortProducts(option) {
    this.sortDropdown.should('exist').select(option);
    cy.get('.inventory_item').first().should('be.visible');
  }
 
  addItemToCartByDataTest(dataTestValue) {
    cy.get(`[data-test="${dataTestValue}"]`)
      .should('be.visible')
      .and('have.text', 'Add to cart')
      .click();
  }
 
  getCartCount() {
    return this.shoppingCartBadge.should('exist').invoke('text');
  }
 
  goToCart() {
    this.shoppingCartLink.should('be.visible').click();
    cy.url().should('include', '/cart.html');
  }
 
  clickBackpackImage() {
    cy.xpath('//*[@id="item_4_img_link"]/img').should('be.visible').click();
  }
}
 
class ProductDetailsPage extends BasePage {
  get addToCartButton() { return cy.get('[data-test="add-to-cart"]'); }
  get productName() { return cy.get('[data-test="inventory-item-name"]'); }
  get productPrice() { return cy.get('[data-test="inventory-item-price"]'); }
 
  clickAddToCart() {
    this.addToCartButton.should('be.visible').click();
  }
 
  verifyProductDetails(expectedName, expectedPrice) {
    this.productName.should('contain', expectedName);
    this.productPrice
      .invoke('text')
      .should('match', /^\$\d+\.\d{2}$/)
      .and('contain', expectedPrice);
  }
}
 
class CartPage extends BasePage {
  get checkoutButton() { return cy.get('[data-test="checkout"]'); }
  get cartList() { return cy.get('[data-test="cart-list"]'); }
 
  clickCheckout() {
    cy.url().then(url => {
      if (url.includes('/cart.html')) {
        this.checkoutButton.should('be.visible').click();
        cy.url().should('include', '/checkout-step-one.html');
      } else {
        cy.log('Already on checkout step one, skipping checkout click');
      }
    });
  }
 
  verifyCartItem(productName, price) {
    this.cartList.should('contain', productName).and('contain', price);
  }
}
 
class CheckoutStepOnePage extends BasePage {
  get checkoutHeader() { return cy.get('.header_secondary_container'); }
  get firstNameInput() { return cy.get('[data-test="firstName"]'); }
  get lastNameInput() { return cy.get('[data-test="lastName"]'); }
  get postalCodeInput() { return cy.get('[data-test="postalCode"]'); }
  get continueButton() { return cy.get('[data-test="continue"]'); }
 
 fillInfo(firstName, lastName, postalCode) {
  if (!firstName || !lastName || !postalCode) {
    throw new Error(`❌ Missing checkout data. Got:
      firstName=${firstName},
      lastName=${lastName},
      postalCode=${postalCode}`);
  }
 
  this.checkoutHeader.should('contain', 'Checkout: Your Information');
  this.firstNameInput.clear().type(firstName);
  this.lastNameInput.clear().type(lastName);
  this.postalCodeInput.clear().type(postalCode);
  this.continueButton.should('be.enabled').click();
}
 
}
 
class CheckoutStepTwoPage extends BasePage {
  get finishButton() { return cy.get('[data-test="finish"]'); }
  get overviewHeader() { return cy.get('.header_secondary_container'); }
 
  verifyOverviewPage() {
    this.overviewHeader.should('contain', 'Checkout: Overview');
  }
 
  clickFinish() {
    this.finishButton.should('be.visible').click();
  }
}
 
class CheckoutCompletePage extends BasePage {
  get completeHeader() { return cy.get('.header_secondary_container'); }
  get thankYouMessage() { return cy.get('[data-test="complete-header"]'); }
  get backHomeButton() { return cy.get('[data-test="back-to-products"]'); }
 
  verifyCompletePage() {
    this.completeHeader.should('contain', 'Checkout: Complete!');
    this.thankYouMessage.should('contain', 'Thank you for your order!');
  }
 
  clickBackHome() {
    this.backHomeButton.should('be.visible').click();
  }
}
 
// ================== TEST SUITE ==================
 
describe('Saucedemo Full Workflow Test', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const productDetailsPage = new ProductDetailsPage();
  const cartPage = new CartPage();
  const checkoutOne = new CheckoutStepOnePage();
  const checkoutTwo = new CheckoutStepTwoPage();
  const checkoutComplete = new CheckoutCompletePage();
 
  // ---------- HOOKS ----------
  before(function() {
    cy.log('Starting Saucedemo Workflow Test Suite');
 
    // ONE-TIME SETUP: API seed example
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
      .its('status')
      .should('eq', 200);
 
    // Load fixture for checkout info
    cy.fixture('checkoutUser.json').as('userData');
  });
 
  beforeEach(function() {
    // Responsive test
    //cy.viewport(1280, 720);
 
    // Mock inventory API before loading page (explicit wait demo)
    //cy.intercept('GET', '**/inventory.json').as('getInventory');
 
    // fresh login
    loginPage.goto('https://www.saucedemo.com/');
    loginPage.verifyLoginPageLoaded();
    loginPage.login('standard_user', 'secret_sauce');
 
    // Explicit wait for inventory API
    //cy.wait('@getInventory');
 
    inventoryPage.verifyInventoryPageLoaded();
  });
 
  afterEach(() => {
    cy.log('Test case completed ✔️');
  });
 
  after(() => {
    cy.log('All tests finished. Cleaning up if necessary.');
  });
 
  // ---------- ACTUAL TEST ----------
  it('Complete E2E Flow with Navigation & Reloads', function () {
    // Step 1: Inventory interactions
    inventoryPage.openAndCloseMenu();
    inventoryPage.sortProducts('lohi');
    inventoryPage.clickBackpackImage();
 
    // Step 2: Product details
    productDetailsPage.verifyProductDetails('Sauce Labs Backpack', '$29.99');
    productDetailsPage.clickAddToCart();
 
    // Step 3: Back to inventory and add more items
    cy.go('back');
    inventoryPage.verifyInventoryPageLoaded();
    inventoryPage.addItemToCartByDataTest('add-to-cart-sauce-labs-bike-light');
    inventoryPage.addItemToCartByDataTest('add-to-cart-sauce-labs-bolt-t-shirt');
    inventoryPage.getCartCount().should('equal', '3');
 
    // Step 4: Cart verification
    inventoryPage.goToCart();
    cartPage.verifyCartItem('Sauce Labs Backpack', '$29.99');
    cartPage.verifyCartItem('Sauce Labs Bike Light', '$9.99');
    cartPage.verifyCartItem('Sauce Labs Bolt T-Shirt', '$15.99');
    cartPage.clickCheckout();
 
    // Step 5: Checkout step one with fixture data
    cy.go('back');
    cy.go('forward');
    cy.reload();
    cartPage.clickCheckout();
 
    cy.get('@userData').then((userData) => {
  expect(userData.firstName, 'firstName in fixture').to.exist;
  expect(userData.lastName, 'lastName in fixture').to.exist;
  expect(userData.postalCode, 'postalCode in fixture').to.exist;
  checkoutOne.fillInfo(userData.firstName, userData.lastName, userData.postalCode);
});
 
    // Step 6: Checkout step two
    cy.reload();
    checkoutTwo.verifyOverviewPage();
    checkoutTwo.clickFinish();
 
    // Step 7: Checkout complete
    checkoutComplete.verifyCompletePage();
    checkoutComplete.clickBackHome();
 
    // Step 8: Back to inventory
    inventoryPage.verifyInventoryPageLoaded();
  });
});