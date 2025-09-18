// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });
// const { defineConfig } = require('cypress');
// module.exports = defineConfig({
// e2e: {
// baseUrl: 'https://opensource-demo.orangehrmlive.com',
// },
// screenshotOnRunFailure: true, // Auto-screenshot on test failure
// screenshotsFolder: 'cypress/screenshots', // Screenshots save location
// });
// const { defineConfig } = require('cypress');
// module.exports = defineConfig({
// e2e: {
// baseUrl: 'https://opensource-demo.orangehrmlive.com',
// },
// video: true, // Record videos
// videoUploadOnPasses: false, // Don't upload videos of passing tests
// videosFolder: 'cypress/videos', // Videos save location
// viewportWidth: 1280, // Set video dimensions
// viewportHeight: 720,
// });
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',

    setupNodeEvents(on, config) {
      // you can implement node event listeners here if needed
    },
  },

  // Reporter setup
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
  },

  // Screenshots
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',

  // Video recording
  video: true,
  videoUploadOnPasses: false,
  videosFolder: 'cypress/videos',

  // Viewport size
  viewportWidth: 1280,
  viewportHeight: 720,
});

