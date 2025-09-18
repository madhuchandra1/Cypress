import './commands'

describe('OrangeHRM Login', () => {
 it('should login with custom command', () => {
 cy.login('Admin', 'admin123')
 cy.url().should('include', '/dashboard')
 })
})