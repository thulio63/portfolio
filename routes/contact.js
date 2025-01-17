const express = require("express");
const { check, validationResult } = require("express-validator");

const validations = [
  check("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("A name is required"),
  check("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email address is required"),
  check("subject")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("A subject is required"),
  check("message")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("A message is required"),
];

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  router.get("/", async (request, response, next) => {
    try {
      const contact = await feedbackService.getList();
      const errors = request.session.contact
        ? request.session.contact.errors
        : false;

      const successMessage = request.session.contact
        ? request.session.contact.message
        : false;
      request.session.contact = {};
      //throw new Error("fuck!");
      return response.render("layout", {
        pageTitle: "Contact",
        template: "contact",
        contact,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post("/", validations, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        request.session.contact = {
          errors: errors.array(),
        };
        return response.redirect("/contact");
      }

      const { name, email, subject, message } = request.body;
      await feedbackService.addEntry(name, email, subject, message);
      request.session.contact = {
        message: "Your message has been posted!",
      };
      return response.redirect("/contact");
    } catch (err) {
      return next(err);
    }
  });

  router.post("/api", validations, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.json({ errors: errors.array() });
      }
      const { name, email, subject, message } = request.body;
      await feedbackService.addEntry(name, email, subject, message);
      const contact = await feedbackService.getList();
      return response.json({
        contact,
        successMessage: "Thank you for leaving a message!",
      });
    } catch (err) {
      return next(err);
    }
  });
  return router;
};
