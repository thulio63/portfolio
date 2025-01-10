const express = require("express");

const speakersRoute = require("./speakers");
const feedbackRoute = require("./feedback");

const router = express.Router();

module.exports = (params) => {
  router.get("/", (request, response) => {
    // if (!request.session.visitCount) {
    //   request.session.visitCount = 0;
    // }
    // request.session.visitCount += 1;
    // console.log(`Number of visits: ${request.session.visitCount}`);

    response.render("layout", { pageTitle: "Welcome", template: "index" });
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
