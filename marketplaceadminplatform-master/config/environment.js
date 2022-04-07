import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

export const ENV = {
  CONTRACT_ADDRESS: {
    Car: process.env.CAR_CONTRACT_ADDRESS,
    Gasstation: process.env.GAS_CONTRACT_ADDRESS,
    Racetrackland: process.env.RACE_CONTRACT_ADDRESS,
    Mechanicshop: process.env.MECHANIC_CONTRACT_ADDRESS,
  },
  API_URL: process.env.API_URL,
  DB: {
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
  },
};
