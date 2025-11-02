const express = require("express");
const authRoutes = require("./routes/auth.routes");
const examRoutes = require("./routes/exams.routes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const ALLOWED_ORIGINS = [
    "*"
];

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    optionsSuccessStatus: 200
}));

app.use("/api", authRoutes);
app.use("/api", examRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});