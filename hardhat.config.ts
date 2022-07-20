import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_API_KEY_URL as string,
      },
    },
  },
};

export default config;
