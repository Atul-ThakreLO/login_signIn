import pg from "pg";
import env from "dotenv";

env.config({ path: "./.env" });

const db = new pg.Client({
  user: process.env.pgUserName,
  host: "localhost",
  database: process.env.pgDataBase,
  password: process.env.pgPassword,
  port: process.env.pgPORT,
});

db.connect();

export default db;