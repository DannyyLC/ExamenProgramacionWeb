const express = require("express");
const router = express.Router();
const { registrarContacto } = require("../controllers/contact.controllers");

router.post("/contact", registrarContacto);

module.exports = router;
