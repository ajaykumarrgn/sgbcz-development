const { defineConfig } = require("cypress");
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

module.exports = defineConfig({
  env: {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
