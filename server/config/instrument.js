// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
// const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://bdf8a21a037ecae769b0f65000ba16ca@o4509821003300864.ingest.us.sentry.io/4509821010706432",

   integrations: [
    Sentry.nodeContextIntegration(),
     Sentry.mongooseIntegration()
],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});