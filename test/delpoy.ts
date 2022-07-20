import { expect } from "chai";
import { ethers } from "hardhat";
const { BigNumber } = require("ethers");
import hre from "hardhat";

import { DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER } from "../config";

describe("Deploy a Flash loan", () => {
  it("Should take a flash loan and be able to return it", async () => {
    const FlashLoanExample = await ethers.getContractFactory(
      "FlashLoanExample"
    );

    const flashLoanExample = await FlashLoanExample.deploy(
      POOL_ADDRESS_PROVIDER
    );
    await flashLoanExample.deployed();

    const token = await ethers.getContractAt("IERC20", DAI);
    const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");

    // Impersonat the DAI WHALE
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });

    const signer = await ethers.getSigner(DAI_WHALE);
    await token
      .connect(signer)
      .transfer(flashLoanExample.address, BALANCE_AMOUNT_DAI); // Sends our contract 2000DAI from DAI WHALE

    const tx = await flashLoanExample.createFlashLoan(DAI, 1000);
    await tx.wait();
    const remainingBalance = await token.balanceOf(flashLoanExample.address);
    expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.be.true;
  });
});
