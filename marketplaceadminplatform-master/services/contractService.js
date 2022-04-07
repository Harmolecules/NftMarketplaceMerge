import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

import { ENV } from "../config/environment.js";

const car = require("../contracts/cars.json");

const web3 = createAlchemyWeb3(ENV.API_URL);

export const getTokensOfOwner = async (ownerAddress, assetType) => {
  const carContract = new web3.eth.Contract(
    car,
    ENV.CONTRACT_ADDRESS[assetType]
  );
  const assets = await carContract.methods.tokensOfOwner(ownerAddress).call();
  return assets;
};

export const transferToken = async (
  fromAddress,
  toAddress,
  tokenId,
  assetType,
  publicKey,
  privateKey
) => {
  try {
    const carContract = new web3.eth.Contract(
      car,
      ENV.CONTRACT_ADDRESS[assetType]
    );
    const nonce = await web3.eth.getTransactionCount(publicKey, "latest"); // get latest nonce
    const gasEstimate = await carContract.methods
      .transferFrom(fromAddress, toAddress, tokenId)
      .estimateGas({ from: fromAddress }); // estimate gas

    // Create the transaction
    const tx = {
      from: fromAddress,
      to: ENV.CONTRACT_ADDRESS[assetType],
      nonce: nonce,
      gas: gasEstimate,
      data: carContract.methods
        .transferFrom(fromAddress, toAddress, tokenId)
        .encodeABI({ from: fromAddress }),
    };
    const signPromise = await web3.eth.accounts.signTransaction(tx, privateKey);

    const hash = await web3.eth.sendSignedTransaction(
      signPromise.rawTransaction
    );
    return hash;
  } catch (err) {
    console.error(err);
  }
};
