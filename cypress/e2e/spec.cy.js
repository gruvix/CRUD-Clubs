/// <reference types="cypress" />

const TEST_USER = 'cypress';
const BASE_URL = 'http://localhost:8000';
const MODAL_APPEAR_DELAY = 500;
function generateRandomString() {
  return Math.random().toString(36).substring(2);
}

describe('test login', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
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
    cy.get('#username').type(TEST_USER).get('#enter-page-button').click();
  });
});

describe('test teams view page', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
    cy.intercept('POST', '/login').as('login');
    cy.get('#username').type(TEST_USER).get('#enter-page-button').click();
    cy.wait('@login');
  });

  it('should reset teams to default', () => {
    const FIRST_TEAM_NAME = 'Arsenal FC';
    cy.get('.delete').first().click().wait(MODAL_APPEAR_DELAY);
    cy.get('#confirmation-modal-button').click();
    cy.get('#reset-teams-button').click().wait(MODAL_APPEAR_DELAY);
    cy.get('#confirmation-modal-button').click();
    cy.get('.card-title').first().should('contain', FIRST_TEAM_NAME);
  });

  it('should delete a team and reset the teams', () => {
    cy.intercept('PATCH', '/user/reset/all').as('resetTeams');
    cy.get('h5').first().then(($text) => {
      const teamName = $text.text();
      cy.get('.delete').first().click().wait(MODAL_APPEAR_DELAY);
      cy.get('#confirmation-modal-button').click();

      cy.get('.card-title').first().should('not.contain', teamName);
      cy.get('#reset-teams-button').click().wait(MODAL_APPEAR_DELAY);
      cy.get('#confirmation-modal-button').click();

      cy.get('.card-title').first().should('contain', teamName);
    });
  });
});
describe.only('test the team editor page with the first team', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
    cy.intercept('POST', '/login').as('login');
    cy.get('#username').type(TEST_USER).get('#enter-page-button').click();
    cy.wait('@login');
    cy.get('.edit').first().click();
  });

  const FIRST_TEAM_PATH = '/user/teams/57';

  it('updates all team parameters with a random string', () => {
    const randomString = generateRandomString();
    cy.get('#team-table .edit').each(($editButton, index) => {
      cy.wrap($editButton).click().parent().parent()
        .find('input')
        .type(randomString)
        .get('#team-table .apply')
        .then(($applyButton) => {
          cy.wrap($applyButton[index]).click();
        });
    });
    cy.visit(BASE_URL).get('.team-card-title').first().should('contain', randomString);
    cy.get('.edit').first().click();
    cy.get('#team-table span').each(($spanField) => {
      cy.wrap($spanField).should('contain', randomString);
    });
  });

  it.only('edits and then resets a team', () => {
    const randomString = generateRandomString();
    cy.get('#team-table .edit').first().click();
    cy.get('#team-table input').first().type(randomString).get('#team-table .apply')
      .first()
      .click();
    cy.visit(BASE_URL + FIRST_TEAM_PATH);
    cy.get('#team-table span').first().should('contain', randomString);
    cy.get('#reset-team-button').click().wait(MODAL_APPEAR_DELAY);
    cy.get('#confirmation-modal-button').click();
    cy.get('#team-table span').first().should('not.contain', randomString);
  });
});
