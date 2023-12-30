/// <reference types="cypress" />

describe('test the CRUD', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/');
  });

  it('passes', () => {
