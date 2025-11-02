const express = require("express");
const { comprarExamen,  obtenerExamen, registrarIntento, infoExamenes, generarConstancia, obtenerIntentos } = require("../controllers/examen.controllers");
const { verifyToken } = require("../middlewares/auth.middlewares");
const { verifyExamPurchased, verifyExamPassed } = require("../middlewares/exams.middlewares");

const router = express.Router();

router.post("/comprar", verifyToken, comprarExamen);
router.get("/info_examenes", verifyToken, infoExamenes);
router.get("/:examenId", verifyToken, verifyExamPurchased, obtenerExamen);
router.get("/:examenId/obtener_intentos", verifyToken, obtenerIntentos);
router.post("/:examenId/registrar_intento", verifyToken, verifyExamPurchased, registrarIntento);
router.post("/:examenId/generar_constancia", verifyToken, verifyExamPassed, generarConstancia);

module.exports = router;
