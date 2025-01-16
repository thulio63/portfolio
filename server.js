const express = require("express");
const path = require("path");
const routes = require("./routes");
const cookieSession = require("cookie-session");
const createError = require("http-errors");
const bodyParser = require("body-parser");

const FeedbackService = require("./services/FeedbackService");
const SpeakerService = require("./services/SpeakerService");
const { render } = require("ejs");

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

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.locals.siteName = "Andrew Thul";

app.use(express.static(path.join(__dirname, "./static")));

app.use(async (request, response, next) => {
  try {
    const names = await speakerService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  "/",
  routes({
    feedbackService,
    speakerService,
  })
);

app.use((request, response, next) => {
  return next(createError(404, "File not found"));
});

app.use((err, request, response) => {
  //deleted "next" after response
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render("error");
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
