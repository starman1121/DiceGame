export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const SERVER_API_URL = "https://testnetapi.trustroll.win"

// export const SERVER_API_URL = "https://api.trustroll.win";


export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

export const TOKEN_DECIMALS = 18;

export const POOL_GRAPH_URLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  97: {    
    Game_ADDRESS: "0x5035ee6cE2cA892c9E97F4D52f0770C19374361F",
    dGame_ADDRESS: "0xdeC2a3A7170CFdb48E75985D928BabDd1c790fD8",
    Eagle_BNB_ADDRESS:"0xcc55164bD257FC902964ACE48FdB6AeC1C472bE2",
    WBNB_USDT_LP_ADDRESS : "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
    TREASURY_ADDRESS: "0xcbe0F6a0A00c0bF8b4838A52538C77264C9347f4",
    BURN_ADDRESS:"0x000000000000000000000000000000000000dead",  
  },
  56: {
    
  },
};
