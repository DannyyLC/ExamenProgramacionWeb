const users = require("../models/users.json");
const { createSession, deleteSession } = require("../middlewares/auth.middlewares");

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: 'username' y 'password'.",
      ejemplo: { username: "gina", password: "1234" }
    });
  }

  const match = users.find(u => u.username === username && u.password === password);

  if (!match) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  const token = createSession(match.username); 
  
  return res.status(200).json({
    mensaje: "Acceso permitido",
    usuario: { username: match.username },
    token: token
  });
};

exports.logout = (req, res) => {
  const token = req.token; 

  const deleted = deleteSession(token);

  if (deleted) {
    return res.status(200).json({ 
      mensaje: "Sesión cerrada correctamente" 
    });
  } else {
    return res.status(404).json({ 
      error: "Sesión no encontrada" 
    });
  }
};

exports.getProfile = (req, res) => {
  const userId = req.userId;

  const user = users.find(u => u.username === userId);

  if (!user) {
    return res.status(404).json({ 
      error: "Usuario no encontrado" 
    });
  }

  return res.status(200).json({
    usuario: { 
        username: user.username,
        nombreCompleto: user.nombreCompleto,
        comprados: user.comprados || [],
        intentos: user.intentos || []
    }
  });
};
