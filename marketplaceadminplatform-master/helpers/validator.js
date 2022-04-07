import { createRequire } from "module";
const require = createRequire(import.meta.url);

export const validateArgs = (args) => {
  const yargs = require("yargs")(args.slice(2));
  const argv = yargs
    .option("publicKey", {
      alias: "p",
      description: "Public Key",
      type: "string",
    })
    .option("privateKey", {
      alias: "s",
      description: "Private Key",
      type: "string",
    })
    .option("action", {
      alias: "a",
      description: "action to do",
      type: "string",
      choices: ["list", "transfer"],
    })
    .option("assetType", {
      alias: "t",
      description: "asset type",
      type: "string",
      choices: ["Car", "Gasstation", "Racetrackland", "Mechanicshop"],
    })
    .option("numberToProcess", {
      alias: "n",
      description: "Number to Process",
      type: "integer",
    })
    .demandOption(
      ["publicKey", "action", "assetType"],
      "Please provide all run and path arguments to work with this tool"
    )
    .help()
    .alias("help", "h").argv;
  const { publicKey, privateKey, action, assetType } = argv;

  return { publicKey, privateKey, action, assetType };
};
