import { useCallback, useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  Container,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import { trim, formatCurrency } from "../../helpers";
import { changeApproval, changeStake, changeClaim, Beting } from "../../slices/StakeThunk";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

import imgDice1 from '../../assets/dice_imgs/Game_1Dice_Not_Selected.svg'
import imgDice1Selected from '../../assets/dice_imgs/Game_1Dice_Selected.svg'
import imgDice2 from '../../assets/dice_imgs/Game_2Dice_Not_Selected.svg'
import imgDice2Selected from '../../assets/dice_imgs/Game_2Dice_Selected.svg'
import imgDice3 from '../../assets/dice_imgs/Game_3Dice_Not_Selected.svg'
import imgDice3Selected from '../../assets/dice_imgs/Game_3Dice_Selected.svg'
import imgDice4 from '../../assets/dice_imgs/Game_4Dice_Not_Selected.svg'
import imgDice4Selected from '../../assets/dice_imgs/Game_4Dice_Selected.svg'
import imgDice5 from '../../assets/dice_imgs/Game_5Dice_Not_Selected.svg'
import imgDice5Selected from '../../assets/dice_imgs/Game_5Dice_Selected.svg'
import imgDice6 from '../../assets/dice_imgs/Game_6Dice_Not_Selected.svg'
import imgDice6Selected from '../../assets/dice_imgs/Game_6Dice_Selected.svg'
import { getDiceWinAmount, getBetMask } from "./calculate";
import { SERVER_API_URL } from "../../constants";
import axios from 'axios';
import BetTable from "./component/BetTable";

import historyDice1 from '../../assets/history_imgs/History_Dice1_Default.svg'
import historyDice2 from '../../assets/history_imgs/History_Dice2_Default.svg'
import historyDice3 from '../../assets/history_imgs/History_Dice3_Default.svg'
import historyDice4 from '../../assets/history_imgs/History_Dice4_Default.svg'
import historyDice5 from '../../assets/history_imgs/History_Dice5_Default.svg'
import historyDice6 from '../../assets/history_imgs/History_Dice6_Default.svg'

import winIcon from '../../assets/history_imgs/You_Win_Icon_Checked.svg'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Stake({ activeDice = 1 }) {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);

  const changeView = (event, newView) => {
    setView(newView);
  };

  const balance = useSelector(state => {
    return state.account.balances && state.account.balances.balance;
  });

  const rollData = useSelector(state => {
    return state.app.rollData;
  });

  let buttonText = "Connect Wallet(BSC)";
  let clickFunc = connect;

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const choices = { '1': true, '2': false, '3': false, '4': false, '5': false, '6': false }
  // const choice = saveGamblerChoice.getOldChoice(betOn, choices, modulo, gameResult.modulo)
  const active = [1];
  const [diceMask, setDiceMask] = useState(choices)
  const [chosenDice, setChosenDice] = useState(active)

  const [betAmount, setBetAmount] = useState(0);

  const [isResult, setResult] = useState(false);

  const [isPaid, setPaid] = useState(false);

  const [isWait, setWait] = useState(false);

  const [resulAmount, setResultAmount] = useState(0);

  const images = [
    { 'img': imgDice1, 'imgSelected': imgDice1Selected },
    { 'img': imgDice2, 'imgSelected': imgDice2Selected },
    { 'img': imgDice3, 'imgSelected': imgDice3Selected },
    { 'img': imgDice4, 'imgSelected': imgDice4Selected },
    { 'img': imgDice5, 'imgSelected': imgDice5Selected },
    { 'img': imgDice6, 'imgSelected': imgDice6Selected }
  ]
  const historyimages = [
    { 'img': historyDice1 },
    { 'img': historyDice2 },
    { 'img': historyDice3 },
    { 'img': historyDice4 },
    { 'img': historyDice5 },
    { 'img': historyDice6 }
  ]

  /*********** each dice image click ***************** */  

  function handleDice(e) {
    const value = e.target.id

    let id = Number(value)
    const copy = { ...diceMask }
    if (!chosenDice.includes(id) && (chosenDice.length === 5)) {

      if (!copy[activeDice]) {
        return
      }
      const index = chosenDice.indexOf(1)
      let temp = chosenDice;
      temp.splice(index, 1)

      setChosenDice([...chosenDice, id])

      copy[activeDice] = false
      copy[value] = true
      setDiceMask({ ...diceMask, ...copy })

    } else if (!chosenDice.includes(id)) {
      copy[value] = true
      setDiceMask({ ...diceMask, ...copy })
      setChosenDice([...chosenDice, id])

    } else if (chosenDice.includes(id) && chosenDice.length > 1) {
      const index = chosenDice.indexOf(id)

      copy[value] = false
      setDiceMask({ ...diceMask, ...copy })

      let temp = chosenDice;
      temp.splice(index, 1)
      setChosenDice([...temp])
    }
  }

  /*********** dice images *************** */

  const diceToShow = []
  for (let i = 1; i <= 6; i++) {
    diceToShow.push(
      <div className="dice-item" key={i}>
        <img src={diceMask[i] ? images[i - 1].imgSelected : images[i - 1].img} alt="dice" id={i} onClick={handleDice} />
      </div>
    )
  }

  const winChance = (chosenDice.length) / 6 * 100;


  /******** bet pay ********* */
  const chosenArray = [];

  for (let i = 0; i < 6; i++) {
    if (!chosenDice.includes(i)) {
      chosenArray.push(i);
    }
  }

  /******** bet val ********* */
  let betVal;
  betVal = getDiceWinAmount(chosenDice, betAmount, 6);
  const betPays = betAmount == 0 ? Number(betVal.winAmount) / 0.01 : Number(betVal.winAmount) / betAmount;

  /********  play Now button click  ********* */


  const placeBet = async () => {

    setWait(true);

    let betmask;
    betmask = getBetMask(chosenDice, 6);
    const modulo = 6;

    const ret = await dispatch(
      Beting({
        betAmount,
        chosenDice,
        address,
        provider,
        networkID: chainID,
      }),
    );

    setWait(false);

    try {
      if (ret.payload.result) {
        setWait(false);
        setResult(true);
        try {
          if (ret.payload.result.paid === false) {
            setPaid(false);
          }
          else {
            setPaid(true);
          }
          setResultAmount(ret.payload);
        } catch (error) {
          console.log("error");
        }
      }
    } catch (error) {
      console.log("error");
    }
  };

  const clickAgain = async () => {
    setResult(false);
  }
  const getAmount = resulAmount ? resulAmount.result.paidAmount / Math.pow(10, 18) : 0;
  const getBetOn = resulAmount ? resulAmount.betOn : 0;
  const getResult = resulAmount ? resulAmount.result.result - 1 : 0;

  return (
    <>
      <div id="stake-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
        <Container
          style={{
            paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
            paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          }}
        >

          <Box className={`hero-metrics`}>
            <Paper className="ohm-card">
              
              <Box display="flex" flexWrap="wrap" alignItems="center">
                {isWait ? (
                    <Box className="dice_play" >
                      <span class="loading">
                        <span class="loading-item"></span>
                        <span class="loading-item_middle"></span>
                        <span class="loading-item"></span>

                        <span className="load_title">  Loading  </span>

                        <span class="loading-item"></span>
                        <span class="loading-item_middle"></span>
                        <span class="loading-item"></span>
                      </span>
                    </Box>
                    ) : (
                      <Box className="dice_play" >
                        {!isResult ? (
                          <Box className="" >
                            <div className="card-header">
                              <Typography variant="h5">Choose the dice number(s)to bet on</Typography>
                            </div>

                            <div className="staking-area">
                              <div className="dice">
                                {diceToShow}
                              </div>

                              <Box className="stake-action-row " display="flex" alignItems="center">
                                <label className="bet_title">Your bet:</label>
                                <Button className="bet_plus_btn" variant="outlined" onClick={() => setBetAmount((Number(betAmount == 0 ? 0.05 : betAmount) + 0.05).toFixed(2))} color="inherit"> +</Button>
                                <FormControl className="ohm-input" variant="outlined" color="primary">
                                  <InputLabel htmlFor="amount-input"></InputLabel>
                                  <OutlinedInput
                                    id="amount-input"
                                    type="number"
                                    placeholder="Enter an amount"
                                    className="stake-input"
                                    value={betAmount}
                                    onChange={e => setBetAmount(e.target.value)}
                                    labelWidth={0}
                                  />
                                </FormControl>
                                <Button className="bet_min_btn" variant="outlined" onClick={() => setBetAmount((Number(betAmount <= 0 ? 0 : betAmount - 0.05)).toFixed(2))} color="inherit"> -</Button>
                              </Box>

                              {!address ? (
                                <Box className="stake-action-row" display="flex" alignItems="center">
                                  <Button className="bet_value_btn" variant="outlined" onClick={() => setBetAmount(0.10)} color="inherit">0.10</Button>
                                  <Button className="bet_value_btn" variant="outlined" onClick={() => setBetAmount(0.25)} color="inherit">0.25</Button>
                                  <Button className="bet_value_btn" variant="outlined" onClick={() => setBetAmount(0.50)} color="inherit">0.50</Button>
                                </Box>
                              ) : (

                                <Box className="stake-action-row" display="flex" alignItems="center">
                                  <Button className="bet_value_btn" variant="outlined" onClick={() => setBetAmount(0.10)} color="inherit">0.10</Button>
                                  <Button className="bet_value_btn" variant="outlined" onClick={() => setBetAmount(0.25)} color="inherit">0.25</Button>
                                  <Button className="bet_value_btn" variant="outlined" onClick={() => setBetAmount(0.50)} color="inherit">0.50</Button>
                                  <Button className="bet_value_btn" variant="outlined" onClick={() => setBetAmount(balance)} color="inherit">max</Button>
                                </Box>

                              )}

                              <Box className="stake-bet-row" display="flex" alignItems="center">
                                {!address ? (
                                  <Button className="stake-bet-btn" variant="outlined" onClick={clickFunc} color="inherit">CONNECT</Button>
                                ) : (
                                  <Button className="stake-bet-btn" variant="outlined" onClick={placeBet} color="inherit">PLAY NOW</Button>
                                )}
                              </Box>
                            </div>
                          </Box>

                        ) : (
                          <Box className="stake-bet-result" display="flex" alignItems="center">

                            {isPaid ? (
                              <Box className="dice_play" >
                                <div className="card-header">
                                  <Typography variant="h5">You Win</Typography>
                                  <Box className="win-check" >
                                    <img className="win-check-icon" src={winIcon} alt="WinCheck" width={25} />
                                    <Typography className="win-check-img" variant="h4"> {getAmount} BNB</Typography>
                                  </Box>
                                </div>
                                <h3>Your bet on:</h3>
                                <div className="betOn">
                                  {Array.isArray(getBetOn) ? getBetOn.map((row) => (
                                    <img className="historyDice" src={historyimages[row - 1].img} alt="dice" />
                                  )) : 0}
                                </div>

                                <h3>Result:</h3>
                                <img className="historyDice" src={historyimages[getResult].img} alt="dice" />
                                <Box className="stake-bet-row" display="flex" alignItems="center">
                                  <Button className="stake-bet-btn" variant="outlined" onClick={clickAgain} color="inherit">PLAY AGAIN</Button>
                                </Box>
                              </Box>

                            ) : (
                              <Box className="dice_play" >
                                <div className="card-header">
                                  <Typography variant="h5">You Lost</Typography>
                                  <Typography variant="h6"></Typography>
                                </div>
                                <h3>Your bet on:</h3>
                                <div className="betOn">
                                  {Array.isArray(getBetOn) ? getBetOn.map((row) => (
                                    <img className="historyDice" src={historyimages[row - 1].img} alt="dice" />
                                  )) : 0}
                                </div>

                                <h3>Result:</h3>
                                <img className="historyDice" src={historyimages[getResult].img} alt="dice" />
                                <Box className="stake-bet-row" display="flex" alignItems="center">
                                  <Button className="stake-bet-btn" variant="outlined" onClick={clickAgain} color="inherit">PLAY AGAIN</Button>
                                </Box>
                              </Box>
                            )}

                          </Box>
                          

                        )}
                    </Box>
                  
                  )}
                  <Box className="dice_payout" >
                    <div className="card-header">
                      <div className="pay_row">
                        <p>Winning chance</p>
                        <Typography variant="h3">{winChance.toFixed(2)} %</Typography>
                      </div>
                      <div className="pay_row">
                        <p>Winning bet pays</p>
                        <Typography variant="h3">{betPays.toFixed(2)} x</Typography>
                        {/* <p>You will win {betAmount ? (betAmount * betPays).toFixed(2) : (0.01 * betPays).toFixed(2)} BNB </p> */}
                        {/* <p>1% fee, 0.001 BNB to jackpot </p> */}
                      </div>
                      <div className="pay_row">
                        <p>Win Amount</p>
                        <Typography variant="h3">{betAmount ? (betAmount * betPays).toFixed(2) : (0.05 * betPays).toFixed(2)} BNB </Typography>
                        {/* <Typography variant="h3">0.10 BNB</Typography> */}
                        {/* <p>Lucky number is 888!</p> */}
                      </div>
                    </div>
                  </Box>
                </Box>
             


              <Box className="dice_table_area" >
                <div className="card-header_table"><Typography variant="h3">All Bets</Typography></div>
                {/* <Tabs
                  key={String(zoomed)}
                  centered
                  value={view}
                  textColor="primary"
                  indicatorColor="primary"
                  className="stake-tab-buttons"
                  onChange={changeView}
                  aria-label="stake tabs"
                >
                  <Tab label="All" {...a11yProps(0)} />
                  <Tab label="My&nbsp;bets" {...a11yProps(1)} />
                </Tabs> */}

                <Box className="stake-action-row " display="flex" alignItems="center">
                  {/* <TabPanel value={view} index={0} className="stake-tab-panel">
                    <BetTable value={rollData} />
                  </TabPanel>
                  <TabPanel value={view} index={1} className="stake-tab-panel">
                    <BetTable value={rollData} />
                  </TabPanel> */}
                  <BetTable value={rollData} />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default Stake;