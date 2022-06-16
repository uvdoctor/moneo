import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://moneo.in',
    specPattern: 'src/**/*spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

  },
});
