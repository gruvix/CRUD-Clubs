/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />

import { BASE_API_URL, apiRequestPaths, webAppPaths } from "../../src/paths";

const TEST_USER = "cypress";
const WEB_APP_BASE_URL = "http://localhost:8080";
const MODAL_APPEAR_DELAY = 500;
const TEST_TEAM_ID = 57;
const TEST_TEAM_PATH = webAppPaths.team(TEST_TEAM_ID);
const TEST_TEAM_PLAYER_PATH = apiRequestPaths.player(TEST_TEAM_ID);
const CUSTOM_CREST_UPLOAD_PATH = apiRequestPaths.updateCrest(TEST_TEAM_ID);
const TEST_TEAM_EXPECTED_IMG_SRC = `${apiRequestPaths.updateCrest(TEST_TEAM_ID)}/${TEST_TEAM_ID}.jpg`;
const LOGIN_PATH = apiRequestPaths.user;

function generateRandomString(length = 5) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
function filterTeams(filterOption: string = "Default teams", ) {
  cy.get("#search-options-button").click();
  cy.get("#search-options").contains(filterOption).click({ force: true });
}
function selectFirstVisibleTeam() {
  cy.get(".card").filter(":visible").find(".edit").first().click();
}
function customCrestPath(teamId: number | string, fileExtension: string) {
  return `${BASE_API_URL}/user/customCrest/${teamId}/${teamId}.${fileExtension}`;
}

describe("test login", () => {
  beforeEach(() => {
    cy.visit(WEB_APP_BASE_URL);
  });

  it("should show an error indicating that the username may only contain letters", () => {
    cy.get("#username")
      .type("123")
      .get("#enter-page-button")
      .click()
      .get("#username-error")
      .should("contain", "Error: Username may only contain letters");
  });

  it('should show an error indicating that the username may not be "Default"', () => {
    cy.get("#username")
      .type("Default")
      .get("#enter-page-button")
      .click()
      .get("#username-error")
      .should("contain", 'Error: "Default" is not available');
  });

  it('should login with "test"', () => {
    cy.get("#username").type(TEST_USER).get("#enter-page-button").click();
    cy.get("#username").should("have.text", TEST_USER);
  });

  it('should login then visit login page and get redirected to user page', () => {
    cy.get("#username").type(TEST_USER).get("#enter-page-button").click();
    cy.get("#username").should("have.text", TEST_USER);
    cy.visit(WEB_APP_BASE_URL);
    cy.get("#username").should("have.text", TEST_USER);
  });
});

describe("test teams view page", () => {
  beforeEach(() => {
    cy.visit(WEB_APP_BASE_URL);
    cy.intercept("POST", LOGIN_PATH).as("login");
    cy.get("#username").type(TEST_USER).get("#enter-page-button").click();
    cy.wait("@login");
  });

  it("should reset teams to default", () => {
    const FIRST_TEAM_NAME = "Arsenal FC";
    cy.get(".delete").first().click().wait(MODAL_APPEAR_DELAY);
    cy.get("#confirmation-modal-button").click();
    cy.get("#reset-teams-button").click().wait(MODAL_APPEAR_DELAY);
    cy.get("#confirmation-modal-button").click();
    cy.get(".card-title").first().should("contain", FIRST_TEAM_NAME);
  });

  it("should delete a team and reset the teams", () => {
    cy.intercept("PATCH", "/user/reset/all").as("resetTeams");
    cy.get("h5")
      .first()
      .then(($text) => {
        const teamName = $text.text();
        cy.get(".delete").first().click().wait(MODAL_APPEAR_DELAY);
        cy.get("#confirmation-modal-button").click();

        cy.get(".card-title").first().should("not.contain", teamName);
        cy.get("#reset-teams-button").click().wait(MODAL_APPEAR_DELAY);
        cy.get("#confirmation-modal-button").click();

        cy.get(".card-title").first().should("contain", teamName);
      });
  });
});
describe("test the team editor page with the first team", () => {
  beforeEach(() => {
    cy.intercept("PATCH", TEST_TEAM_PATH).as("updateTeam");
    cy.visit(WEB_APP_BASE_URL);
    cy.intercept("POST", LOGIN_PATH).as("login");
    cy.intercept("GET", apiRequestPaths.teams).as("teams");
    cy.get("#username").type(TEST_USER).get("#enter-page-button").click();
    cy.wait("@login");
    cy.wait("@teams");
    filterTeams();
    selectFirstVisibleTeam();
  });

  it("updates all team parameters with a random string", () => {
    const randomString = generateRandomString();
    cy.get("#team-table .edit").each(($editButton, index) => {
      cy.wrap($editButton)
        .click()
        .parent()
        .parent()
        .find("input")
        .type(randomString)
        .get("#team-table .apply")
        .then(($applyButton) => {
          cy.wrap($applyButton[index]).click();
        });
    });
    cy.wait("@updateTeam");
    cy.wait(1000);
    cy.visit(WEB_APP_BASE_URL);
    filterTeams();
    cy.get(".team-card-title")
      .filter(":visible")
      .first()
      .should("contain", randomString);
    selectFirstVisibleTeam();
    cy.get("#team-table span").each(($spanField) => {
      cy.wrap($spanField).should("contain", randomString);
    });
  });
  it("edits and then resets a default team", () => {
    const randomString = generateRandomString();
    cy.get("#team-table .edit").first().click();
    cy.get("#team-table input")
      .first()
      .type(randomString)
      .get("#team-table .apply")
      .first()
      .click();
    cy.wait("@updateTeam");
    cy.visit(WEB_APP_BASE_URL);
    filterTeams();
    selectFirstVisibleTeam();
    cy.get("#team-table span").first().should("contain", randomString);
    cy.get("#reset-team-button").click().wait(MODAL_APPEAR_DELAY);
    cy.get("#confirmation-modal-button").click();
    cy.get("#team-table span").first().should("not.contain", randomString);
  });

  it("uploads an image to the team crest", () => {
    cy.intercept(`${CUSTOM_CREST_UPLOAD_PATH}`).as("uploadImage");
    cy.fixture("crest.jpg").then((fileContent) => {
      cy.get("#image-input").selectFile(
        {
          contents: new Cypress.Buffer(fileContent),
          fileName: "crest.jpg",
        },
        { force: true },
      );
    });
    cy.wait("@uploadImage")
      .get("#team-crest")
      .should("have.attr", "src", TEST_TEAM_EXPECTED_IMG_SRC);
  });
});
describe("test the player editor with the first default team", () => {
  beforeEach(() => {
    cy.visit(WEB_APP_BASE_URL);
    cy.intercept("POST", LOGIN_PATH).as("login");
    cy.get("#username").type(TEST_USER).get("#enter-page-button").click();
    cy.wait("@login");
    cy.get("#reset-teams-button").click().wait(MODAL_APPEAR_DELAY);
    cy.get("#confirmation-modal-button").click();
    cy.get(".edit").first().click();
  });

  it("edits a random player from a team", () => {
    cy.intercept("PATCH", TEST_TEAM_PLAYER_PATH).as("editPlayer");
    cy.get("#players-table .edit").then(($editButtons) => {
      const playersAmount = $editButtons.length;
      const randomIndex = Math.floor(Math.random() * playersAmount);
      const randomStrings = [] as string[];
      cy.get("#players-table")
        .find("[data-id]")
        .then(($playerRows) => {
          cy.wrap($playerRows[randomIndex])
            .invoke("attr", "data-id")
            .then((value) => {
              const randomPlayerId = value;
              const playerGetString = `#players-table [data-id="${randomPlayerId}"]`;
              cy.get(playerGetString).find(".edit").click();
              cy.get(playerGetString)
                .find("input")
                .each(($input, index) => {
                  const randomString = generateRandomString();
                  randomStrings.push(randomString);
                  cy.wrap($input).clear().type(randomStrings[index]);
                });

              cy.get(playerGetString).find(".apply").click();
              cy.get(playerGetString)
                .find("span")
                .each(($spanField, index) => {
                  cy.wrap($spanField).should("contain", randomStrings[index]);
                });
              cy.visit(WEB_APP_BASE_URL + TEST_TEAM_PATH).wait("@editPlayer");
              cy.get(playerGetString)
                .find("span")
                .each(($spanField, index) => {
                  cy.wrap($spanField).should("contain", randomStrings[index]);
                });
            });
        });
    });
  });
  it("adds a player to the team and shows it", () => {
    cy.intercept("POST", TEST_TEAM_PLAYER_PATH).as("addPlayer");
    const randomStrings = [] as string[];
    cy.get("#add-player-button").click();
    cy.get("#add-player-row")
      .find("input")
      .each(($input, index) => {
        const randomString = generateRandomString();
        randomStrings.push(randomString);
        cy.wrap($input).clear().type(randomStrings[index]);
      });
    cy.get("#confirm-player-button").click().wait("@addPlayer");
    cy.get("#players-table tr")
      .eq(1)
      .children()
      .children("span")
      .each(($spanField, index) => {
        cy.wrap($spanField).should("contain", randomStrings[index]);
      });
  });
  it("removes a random player", () => {
    cy.intercept("DELETE", `${TEST_TEAM_PLAYER_PATH}`).as("removePlayer");
    cy.get("#players-table .remove").then(($removeButtons) => {
      const playersAmount = $removeButtons.length;
      const randomIndex = Math.floor(Math.random() * playersAmount);
      cy.get("#players-table .remove")
        .eq(randomIndex)
        .parent()
        .parent()
        .find("span")
        .first()
        .then(($spanField) => {
          const text = $spanField.text();
          cy.get("#players-table .remove")
            .eq(randomIndex)
            .click()
            .wait(MODAL_APPEAR_DELAY);
          cy.get("#confirmation-modal-button").click().wait("@removePlayer");
          cy.get("#players-table tr")
            .eq(randomIndex)
            .find("span")
            .first()
            .should("not.contain", text);
          const newPlayersAmount = playersAmount - 1;
          cy.get("#players-table .remove").should(
            "have.length",
            newPlayersAmount,
          );
        });
    });
  });
  it.skip("removes all players", () => {
    cy.intercept("DELETE", TEST_TEAM_PLAYER_PATH).as("removePlayer");
    cy.get("#players-table .remove").then(($removeButtons) => {
      cy.wrap($removeButtons).each(($removeButton) => {
        cy.wrap($removeButton).click().wait(MODAL_APPEAR_DELAY);
        cy.get("#confirmation-modal-button").click().wait("@removePlayer");
      });
    });
  });
});
describe("test add team", () => {
  beforeEach(() => {
    cy.visit(WEB_APP_BASE_URL);
    cy.intercept("POST", LOGIN_PATH).as("login");
    cy.get("#username").type(TEST_USER).get("#enter-page-button").click();
    cy.wait("@login");
    cy.get("#search-options-button").click();
    cy.get("#search-options").contains("Custom teams").click({ force: true });
    cy.get("#add-team-button").click();
  });

  it("adds a team", () => {
    const teamFields = [] as string[];
    cy.get("#team-table input").each(($input) => {
      const randomString = generateRandomString();
      teamFields.push(randomString);
      cy.wrap($input).clear().type(randomString);
    });
    const playerFields = [] as string[];
    cy.get("#add-player-button").click().click().click();
    cy.get("#players-table input").each(($input) => {
      const randomString = generateRandomString();
      playerFields.push(randomString);
      cy.wrap($input).clear().type(randomString);
    });
    cy.intercept(`${CUSTOM_CREST_UPLOAD_PATH}`).as("uploadImage");
    cy.fixture("crest.jpg").then((fileContent) => {
      cy.get("#upload-image-input").selectFile(
        {
          contents: Cypress.Buffer.from(JSON.stringify(fileContent)),
          fileName: "crest.jpg",
        },
        { force: true },
      );
    });
    cy.get("#submit-team-button").click();
    cy.get("#team-table span").each(($spanField, index) => {
      cy.wrap($spanField).should("contain", teamFields[index]);
    });
    cy.get("#players-table span").each(($spanField, index) => {
      cy.wrap($spanField).should("contain", playerFields[index]);
    });
    cy.get("#team-id")
      .invoke("val")
      .then((teamId: string | number) => {
        const expectedNewTeamImgSrc = customCrestPath(teamId, "jpg");
        cy.get("#team-crest").should("have.attr", "src", expectedNewTeamImgSrc);
      });
    cy.get("#reset-team-button").should("has.class", "disabled");
  });
});
