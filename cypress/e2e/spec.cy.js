/// <reference types="cypress" />

describe('test the CRUD', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/');
  });

  it('should show an error indicating that the username may only contain letters', () => {
    cy.get('#username').type('123').get('#enter-page-button').click()
      .get('#username-error')
      .should('contain', 'Username may only contain letters');
  });

