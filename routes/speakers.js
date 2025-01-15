const express = require("express");

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get("/", async (request, response, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const speakers = await speakerService.getList();
      return response.render("layout", {
        pageTitle: "My Work",
        template: "speakers",
        speakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/:shortname", async (request, response, next) => {
    try {
      const artwork = await speakerService.getArtworkForSpeaker(
        request.params.shortname
      );
      const speaker = await speakerService.getSpeaker(request.params.shortname);
      return response.render("layout", {
        pageTitle: "My Work",
        template: "speakers-detail",
        speaker,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
