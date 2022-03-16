// @NOTE: KEEP THE PROD KEY IMPORT COMMENTED OUT BY DEFAULT TO SAFEGUARD AGAINST ACCIDENTAL SCRIPT RUNS
// import masterKeys from "../prod-master-keys";
import masterKeys from "../../test-master-keys";

import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { TransactionConfig } from "web3-core";
import { config } from "../../config";
import PFT_JSON from "../../build/contracts/PFT.json";
import MULTI_SIG_WALLET_JSON from "../../build/contracts/MultiSigWallet.json";
import { getTxIdFromMultiSigWallet } from "../utils/get-tx-id-from-multi-sig-wallet";

// Contract info
const PFT_ABI = PFT_JSON.abi as AbiItem[];
const MULTI_SIG_WALLET_ABI = MULTI_SIG_WALLET_JSON.abi as AbiItem[];

// @TODO: When PFT_ADDRESS is known for mainnet, add to a config object and reference instead of hard-coding here
const PFT_ADDRESS = "0x17aB05351fC94a1a67Bf3f56DdbB941aE6c63E25";

// @TODO: When MULTI_SIG_WALLET_ADDRESS is known for mainnet, add to a config object and reference instead of hard-coding here
const MULTI_SIG_WALLET_ADDRESS = "0x52C84043CD9c865236f11d9Fc9F56aa003c1f922";

const web3 = new Web3(new Web3.providers.HttpProvider(config.AVAX.localHTTP));
const PFTInstance = new web3.eth.Contract(PFT_ABI, PFT_ADDRESS);
const multiSigWalletInstance = new web3.eth.Contract(MULTI_SIG_WALLET_ABI, MULTI_SIG_WALLET_ADDRESS);

web3.eth.handleRevert = true;

async function main() {
    try {
        const dataForCallFromMultiSigWallet = PFTInstance.methods.addController(MULTI_SIG_WALLET_ADDRESS).encodeABI();

        const data = multiSigWalletInstance.methods.submitTransaction(PFT_ADDRESS, 0, dataForCallFromMultiSigWallet).encodeABI();

        const txData: TransactionConfig = {
            from: masterKeys.multiSigOwner1.address,
            to: MULTI_SIG_WALLET_ADDRESS,
            gas: "1000000",
            gasPrice: web3.utils.toWei("80", "gwei"),
            data,
        };

        console.log("Sending initial multisig tx for adding MultiSigWallet as a PFT controller...");

        const signedTxData = await web3.eth.accounts.signTransaction(txData, masterKeys.multiSigOwner1.privateKey);
        const result = await web3.eth.sendSignedTransaction(signedTxData.rawTransaction!);

        const txId = await getTxIdFromMultiSigWallet(multiSigWalletInstance);

        console.log(`${JSON.stringify(result)}\n`);
        console.log(`Initial submission to MultiSigWallet succeeded for txId=${txId}. Need a further confirmation from another owner`);
    } catch (err) {
        console.log(err);
    }
}

main();