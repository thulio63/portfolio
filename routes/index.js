const express = require("express");

const speakersRoute = require("./speakers");
const feedbackRoute = require("./feedback");

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get("/", async (request, response) => {
    const topSpeakers = await speakerService.getList();
    response.render("layout", {
      pageTitle: "Welcome",
      template: "index",
      topSpeakers,
    });
  });

  //gets home page when called with index.html
  router.get("/index.html", (request, response) => {
    response.render("layout", { pageTitle: "Welcome", template: "index" });
  });

  router.use("/speakers", speakersRoute(params));
  //added myself, mirrors html call above - not working
  router.use("/speakers.html", speakersRoute(params));

  router.use("/feedback", feedbackRoute(params));
  //added myself, mirrors html call above - not working
  router.use("/feedback.html", feedbackRoute(params));

  return router;
};
