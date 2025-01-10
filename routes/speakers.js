const express = require("express");

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get("/", async (request, response) => {
    const speakers = await speakerService.getList();
    return response.json(speakers);
  });

  router.get("/speakers.html", (request, response) => {
    response.render("layout", { pageTitle: "Welcome", template: "index" });
  });

  router.get("/:shortname", (request, response) => {
    return response.send(`Detail page of ${request.params.shortname}`);
  });

  return router;
};
