import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    viewportHeight: 920,
    viewportWidth: 1600,
  },
});
