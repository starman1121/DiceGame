import { StaticJsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import React, { ReactNode } from "react";

export enum NetworkID {
  Mainnet = 56,
  Testnet = 0xfa2,
}

