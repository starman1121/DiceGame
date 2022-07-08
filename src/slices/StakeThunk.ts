import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";

import { abi as GameAbi } from "../abi/GameContract.json";
import { clearPendingTxn } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, loadAccountDetails } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";


interface IUAData {
  betAmount:Number,
  chosenDice:Number,
  address: string;  
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const Beting= createAsyncThunk(
  "stake/Beting",
  async ({ betAmount,chosenDice, address,provider, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    
    const signer = provider.getSigner();

    let staking = new ethers.Contract(addresses[networkID].Game_ADDRESS as string, GameAbi, signer);

    let claimTx;
    let uaData: IUAData = {
      betAmount:betAmount,
      chosenDice:chosenDice,      
      address: address,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      uaData.type = "claim";
      claimTx = await staking.MakeRoll(          
          chosenDice,
          {value: ethers.utils.parseUnits(betAmount.toString(), "ether"),
          gasLimit: 1000000
          }
        );

      const receipt = await claimTx.wait();

      uaData.txHash = claimTx.hash;

     const currentIdex = await staking.currentRollIndex();

     const result = await staking.Rolls(currentIdex-1);

     const betOn = await staking.getGuess(currentIdex-1);

     const ret = {
         result: result,
         betOn: betOn
     }   

    return ret;      
      
        
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to claim more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (claimTx) {
        dispatch(clearPendingTxn(claimTx.hash));
      }
    }
    // dispatch(getBalances({ address, networkID, provider }));
  },
);


