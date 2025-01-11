const express = require("express");

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get("/", async (request, response) => {
    const speakers = await speakerService.getList();
    response.render("layout", {
      pageTitle: "My Work",
      template: "speakers",
      speakers,
    });
  });

  router.get("/:shortname", async (request, response) => {
    const speaker = await speakerService.getSpeaker(request.params.shortname);
    response.render("layout", {
      pageTitle: "My Work",
      template: "speakers-detail",
      speaker,
    });
  });

  return router;
};
