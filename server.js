const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================================================
// CONFIGURACIÓN
// ============================================================
const MONDAY_TOKEN = process.env.MONDAY_TOKEN || "TU_API_TOKEN_AQUI";
const BOARD_ID = "18413426463";
const PASSWORD = process.env.PASSWORD || "TU_CONTRASEÑA_AQUI";
// ============================================================

// Login
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: "Contraseña incorrecta" });
  }
});

// Proxy a Monday
app.post("/api/monday", async (req, res) => {
  try {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_TOKEN,
        "API-Version": "2024-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Info del tablero
app.get("/api/board-id", (req, res) => {
  res.json({ boardId: BOARD_ID });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
