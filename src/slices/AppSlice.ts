import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as EagleAbi } from "../abi/Eagle.json";
import { abi as GameAbi } from "../abi/GameContract.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { createSlice, createSelector, createAsyncThunk, current } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};
export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {

    const EagleContract = new ethers.Contract(addresses[networkID].Game_ADDRESS as string, GameAbi, provider);
    const currentIndex = await EagleContract.currentRollIndex();

    const rollData = [];

    for (let i = currentIndex - 10; i < currentIndex; i++) {
      const roll = await EagleContract.Rolls(i);
      const betOn = await EagleContract.getGuess(i);
      const rowData = {
        roll: roll,
        beton: betOn
      }
      rollData.push(rowData);
    }
    rollData.reverse();


    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        rollData,
      };
    }
    return {
      rollData

    } as IAppData;
  },
);


interface IAppData {
  readonly rollData: Object;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
