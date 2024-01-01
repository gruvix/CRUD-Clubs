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

  it('should show an error indicating that the username may not be "Default"', () => {
    cy.get('#username').type('Default').get('#enter-page-button').click()
      .get('#username-error')
      .should('contain', '"Default" is not available');
  });

  it('should login with "test"', () => {
    cy.get('#username').type('test').get('#enter-page-button').click();
  });

  it.only('should delete a team and reset the teams', () => {
    cy.intercept('PATCH', '/user/**/reset').as('resetTeams');
    cy.get('#username').type('test').get('#enter-page-button').click();
    cy.get('h5').first().then(($text) => {
      const teamName = $text.text();
      cy.get('.delete').first().click();

      cy.get('.card-title').first().should('not.contain', teamName);
      cy.get('#reset-teams-button').click().wait('@resetTeams');
      cy.get('.card-title').first().should('contain', teamName);
    });
  });
});
