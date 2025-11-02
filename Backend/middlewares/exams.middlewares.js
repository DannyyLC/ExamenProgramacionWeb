const users = require("../models/users.json");
const exams = require("../models/exams.json");

exports.verifyExamPurchased = (req, res, next) => {
  const { examenId } = req.params;
  const userId = req.userId;
  req.examenId = examenId;
  if (!examenId) {
    return res.status(400).json({ error: "Falta el ID del examen." });
  }
  
  const user = users.find(u => u.username === userId);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado." });
  }

  if (!user.comprados.includes(examenId)) {
    return res.status(403).json({ error: "Examen no comprado." });
  }

  next();
};

exports.verifyExamPassed = (req, res, next) => {
  const { examenId } = req.params;
  const userId = req.userId;
  req.examenId = examenId;

  if (!examenId) {
    return res.status(400).json({ error: "Falta el ID del examen." });
  }
  const examen = exams[examenId];
  if (!examen) {
    return res.status(404).json({ error: "Examen no encontrado." });
  }
  const user = users.find(u => u.username === userId);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado." });
  }

  const intento = user.intentos.find(i => i.examenId === examenId);
  if (!intento) {
    return res.status(404).json({ error: "El usuario no ha realizado el examen." });
  }

  const puntuacionMinima = examen.puntuacionMinima || 70;

  if (intento.calificacion < puntuacionMinima) {
    return res.status(403).json({ error: "Examen no aprobado." });
  }

  next();
};
