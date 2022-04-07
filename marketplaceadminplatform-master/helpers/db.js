import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mysql = require("promise-mysql");
import { ENV } from "../config/environment.js";
let connection;
export const connect = async () => {
  if (connection) {
    return connection;
  }

  try {
    const client = await mysql.createConnection({
      database: ENV.DB.database,
      password: ENV.DB.password,
      host:  ENV.DB.host,
      port: ENV.DB.port,
      user: ENV.DB.user,
    });
    connection = client;
    return connection;
  } catch (error) {
    console.error(error);
    throw Error("Unable to connect to the database");
  }
};

export const disconnect = async () => {
  if (connection) {
    await connection.end();
    connection = null;
  }
};
