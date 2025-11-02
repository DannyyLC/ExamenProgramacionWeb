const express = require("express");
const { login, logout, getProfile } = require("../controllers/auth.controllers");
const { verifyToken } = require("../middlewares/auth.middlewares");

const router = express.Router();

router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);

module.exports = router;
