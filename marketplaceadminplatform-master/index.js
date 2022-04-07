import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

import { validateArgs } from "./helpers/validator.js";
import { listTransfer, sendTransfer } from "./services/tokenService.js";
import { ENV } from "./config/environment.js";
const car = require("./contracts/cars.json");

const web3 = createAlchemyWeb3(ENV.API_URL);

async function main(argv) {
  try {
    const input = await validateArgs(argv);

    if (input.action == "list") {
      await listTransfer(input.publicKey, input.assetType);
    } else if (input.action == "transfer") {
      if (!input.privateKey && !input.numberToProcess) {
        throw new Error("You should input private key and numberToProcess");
      }
      await sendTransfer(
        input.publicKey,
        input.privateKey,
        input.assetType,
        input.numberToProcess
      );
    }
  } catch (err) {
    console.log(err);
  }
}

main(process.argv);
