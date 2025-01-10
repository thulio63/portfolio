const express = require("express");
const path = require("path");
const routes = require("./routes");
const cookieSession = require("cookie-session");

const FeedbackService = require("./services/FeedbackService");
const SpeakerService = require("./services/SpeakerService");

const feedbackService = new FeedbackService("./data/feedback.json");
const speakerService = new SpeakerService("./data/speakers.json");

const app = express();

const port = 3000;

app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "session",
    keys: ["helpmeplease", "iamsoalone"],
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.locals.siteName = "Andrew Thul";

app.use(express.static(path.join(__dirname, "./static")));

app.use(async (request, response, next) => {
  const names = await speakerService.getNames();
  response.locals.speakerNames = names;
  return next();
});

app.use(
  "/",
  routes({
    feedbackService,
    speakerService,
  })
);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
