import express from "express";
import { getJoyas, getJoyasFiltros, prepareReport } from "./db/consultas.js";

const app = express();
const PORT = 3000;

const reportMiddleware = async (req, res, next) => {
  try {
    await prepareReport(req.method, "inventario");
    next();
  } catch (error) {
    next(error);
  }
};

app.use(reportMiddleware);

app.get("/joyas", async (req, res) => {
  try {
    const { limits, page, order_by } = req.query;
    const joyas = await getJoyas({ limits, page, order_by });
    res.json(joyas);
  } catch (error) {
    console.error("Error en ruta /joyas:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      message: error.message,
    });
  }
});

app.get("/joyas/filtros", async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    const joyas = await getJoyasFiltros({
      precio_min,
      precio_max,
      categoria,
      metal,
    });
    res.json(joyas);
  } catch (error) {
    console.error("Error en ruta /joyas/filtros:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
