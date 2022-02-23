// Need to import Chai library explicitly because, annoyingly, Truffle-injected Chai instance cannot be configured
// Only use the local Chai instance when asserting on promises
const localChai = require("chai");
localChai.use(require("chai-as-promised"));
export const localExpect = localChai.expect;

export const bigInt = require("big-integer");
