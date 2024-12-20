import { client } from "./conexion.js";

const formatJoyasHATEOAS = (joyas) => ({
  total: joyas.length,
  results: joyas.map((joya) => ({
    name: joya.nombre,
    href: `/joyas/${joya.id}`,
    stock: joya.stock,
    categoria: joya.categoria,
    metal: joya.metal,
    precio: joya.precio,
  })),
});

export const getJoyas = async ({
  limits = 6,
  page = 1,
  order_by = "id_ASC",
}) => {
  try {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;

    const consulta = {
      text: `
        SELECT * FROM inventario 
        ORDER BY ${campo} ${direccion}
        LIMIT $1 OFFSET $2`,
      values: [limits, offset],
    };

    const { rows: joyas } = await client.query(consulta);
    return formatJoyasHATEOAS(joyas);
  } catch (error) {
    console.error("Error en getJoyas:", error);
    throw error;
  }
};

export const getJoyasFiltros = async ({
  precio_min,
  precio_max,
  categoria,
  metal,
}) => {
  try {
    let filtros = [];
    let valores = [];
    let paramNum = 1;

    if (precio_min) {
      filtros.push(`precio >= $${paramNum}`);
      valores.push(precio_min);
      paramNum++;
    }

    if (precio_max) {
      filtros.push(`precio <= $${paramNum}`);
      valores.push(precio_max);
      paramNum++;
    }

    if (categoria) {
      filtros.push(`categoria = $${paramNum}`);
      valores.push(categoria);
      paramNum++;
    }

    if (metal) {
      filtros.push(`metal = $${paramNum}`);
      valores.push(metal);
      paramNum++;
    }

    let consulta = {
      text: `SELECT * FROM inventario ${
        filtros.length > 0 ? "WHERE " + filtros.join(" AND ") : ""
      }`,
      values: valores,
    };

    const { rows: joyas } = await client.query(consulta);
    return joyas;
  } catch (error) {
    console.error("Error en getJoyasFiltros:", error);
    throw error;
  }
};

export const prepareReport = async (operacion, tabla) => {
  try {
    const consulta = {
      text: `INSERT INTO operaciones (tipo_operacion, tabla, fecha) VALUES ($1, $2, NOW())`,
      values: [operacion, tabla],
    };
    await client.query(consulta);
  } catch (error) {
    console.error("Error al preparar reporte:", error);
  }
};
