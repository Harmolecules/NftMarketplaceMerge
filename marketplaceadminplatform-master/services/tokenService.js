import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { connect, disconnect } from "../helpers/db.js";
import { getTokensOfOwner, transferToken } from "./contractService.js";

export const listTransfer = async (publicKey, assetType) => {
  try {
    const client = await connect();
    const query = `SELECT ${assetType}s.id as id,name, saleStatus, ethAddress, saleLastCurrency, saleLastPrice, saleLastDate, Transactions.buyerEthAddress as buyerEthAddress from ${assetType}s inner join Transactions ON ${assetType}s.saleCurrentTransactionId = Transactions.transactionId WHERE ${assetType}s.saleStatus = 3 AND ethAddress = "${publicKey}"`;
    const dbResult = await client.query(query);
    await disconnect();
    const assets = await getTokensOfOwner(publicKey, assetType);

    const result = {
      validOne: dbResult.filter((el) => assets.includes(el.id.toString())),
      missingOne: dbResult.filter((el) => !assets.includes(el.id.toString())),
    };

    console.info(
      "-------------------------------- Transfer Pending Items -----------------------------"
    );
    console.log(JSON.parse(JSON.stringify(result.validOne)));
    console.warn(
      "-------------------- Transfer Pending Items In the Database but not in the blockchain -------------------"
    );
    console.warn(JSON.parse(JSON.stringify(result.missingOne)));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendTransfer = async (
  publicKey,
  privateKey,
  assetType,
  numberToProcess
) => {
  try {
    const client = await connect();
    const query = `SELECT ${assetType}s.id as id,name, saleStatus, ethAddress, saleLastCurrency, saleLastPrice, saleLastDate, Transactions.buyerEthAddress as buyerEthAddress, Transactions.id as transactionPId from ${assetType}s inner join Transactions ON ${assetType}s.saleCurrentTransactionId = Transactions.transactionId WHERE ${assetType}s.saleStatus = 3 AND ethAddress = "${publicKey}"`;
    const dbResult = await client.query(query);
    const assets = await getTokensOfOwner(publicKey, assetType);

    const result = {
      validOne: dbResult.filter((el) => assets.includes(el.id.toString())),
      missingOne: dbResult.filter((el) => !assets.includes(el.id.toString())),
    };
    for (let el of result.validOne?.slice(0, numberToProcess)) {
      const result = await transferToken(
        el.ethAddress,
        el.buyerEthAddress,
        el.id,
        assetType,
        publicKey,
        privateKey
      );
      console.log(
        `-----------------------------------Transaction Log For Asset ID: ${el.id} -------------------------------`
      );
      console.log(result);
      if (result.blockNumber) {
        console.log(
          `- INFO: Success to send asset to the buyer: ${el.buyerEthAddress}`
        );
        console.log(`- INFO: Updating database for asset #${el.id}`);
        const query = `UPDATE ${assetType}s SET saleStatus = 5, ethAddress = ?, saleCurrentTransactionId = null WHERE id = ?;`;
        try {
          await client.query("START TRANSACTION;");
          await client.query(query, [el.ethAddress, el.id]);
          await client.query(
            ' INSERT INTO TransactionLogs (transactionHash, assetType, timeStamp, assetID, toAddress, action, ethAddress) VALUES (?, ?, ? , ?, ?, "asset sent", ?);',
            [
              result.transactionHash,
              assetType,
              new Date(),
              el.id,
              el.buyerEthAddress,
              el.ethAddress,
            ]
          );
          await client.query("COMMIT");
          console.info(`- INFO: DB UPDATE SUCCESS: ${el.id}`);
        } catch (err) {
          console.log(err);
          await client.query("ROLLBACK;");
          console.error(`- ERROR: Updating DB Failed For Asset ${el.id}`);
        }
      } else {
        console.error(`- ERROR: Transfer Failed: ${el.id}`);
      }
    }

    await disconnect();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
