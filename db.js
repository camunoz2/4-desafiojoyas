import pg from "pg";

const { Client } = pg;

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "joyas",
  password: "desafiolatam",
  user: "desafiolatam",
});

await client.connect();
