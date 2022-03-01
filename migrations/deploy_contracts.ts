type Network = "development" | "mainnet";

// @NOTE: Remember to reinstate any commented out deployment scripts if you're going to run the corresponding test suite for that contract
// Otherwise the contract state won't be reset after each run and tests will likely fail!

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
    return async (deployer: Truffle.Deployer, network: Network, accounts: string[]) => {
        const PFT = artifacts.require("PFT");
        await deployer.deploy(PFT);
        const PFTInstance = await PFT.deployed();

        const PORB = artifacts.require("PORB");
        await deployer.deploy(PORB);

        const porble = artifacts.require("Porble");
        await deployer.deploy<any[]>(porble, accounts[1]);

        const VestingVault = artifacts.require("VestingVault");
        await deployer.deploy(VestingVault, PFTInstance.address);
    };
};
