import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./BetTable.scss";

import historyDice1 from '../../../assets/history_imgs/History_Dice1_Default.svg'
import historyDice2 from '../../../assets/history_imgs/History_Dice2_Default.svg'
import historyDice3 from '../../../assets/history_imgs/History_Dice3_Default.svg'
import historyDice4 from '../../../assets/history_imgs/History_Dice4_Default.svg'
import historyDice5 from '../../../assets/history_imgs/History_Dice5_Default.svg'
import historyDice6 from '../../../assets/history_imgs/History_Dice6_Default.svg'

import historyWinDice1 from '../../../assets/history_imgs/dicegreen1.svg'
import historyWinDice2 from '../../../assets/history_imgs/dicegreen2.svg'
import historyWinDice3 from '../../../assets/history_imgs/dicegreen3.svg'
import historyWinDice4 from '../../../assets/history_imgs/dicegreen4.svg'
import historyWinDice5 from '../../../assets/history_imgs/dicegreen5.svg'
import historyWinDice6 from '../../../assets/history_imgs/dicegreen6.svg'

export default function BasicTable(props) {
  const { children, value } = props;

  const historyimages = [
    { 'img': historyDice1 },
    { 'img': historyDice2 },
    { 'img': historyDice3 },
    { 'img': historyDice4 },
    { 'img': historyDice5 },
    { 'img': historyDice6 }
  ]

  const historywinimages = [
    { 'img': historyWinDice1 },
    { 'img': historyWinDice2 },
    { 'img': historyWinDice3 },
    { 'img': historyWinDice4 },
    { 'img': historyWinDice5 },
    { 'img': historyWinDice6 }
  ]

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell align="right">Bet</TableCell>
            <TableCell align="right">Result</TableCell>
            <TableCell align="right">Bet Amount</TableCell>
            <TableCell align="right">Win Amount</TableCell>
          </TableRow>
        </TableHead>
        {value ? (
          <TableBody>
            {value.map((row) => (
              <TableRow key={row}>
                <TableCell align="right">{row.roll.user}</TableCell>
                <TableCell align="right">
                  {row.beton.map((item, index) => (
                    <img className="historyDice" src={historyimages[Number(item["_hex"] / Math.pow(10, 0)) - 1].img} alt="dice" />
                  ))}
                </TableCell>
                {!row.roll.paid ? (
                  <TableCell align="right">{<img className="historyDice" src={historyimages[Number(row.roll.result) - 1].img} width={30} alt="dice" />}</TableCell>
                ) : (
                  <TableCell align="right">{<img className="historyDice" src={historywinimages[Number(row.roll.result) - 1].img} width={30} alt="dice" />}</TableCell>
                )}
                <TableCell align="right">{row.roll.rollAmount["_hex"] / Math.pow(10, 18)}</TableCell>
                {!row.roll.paid ? (
                  <TableCell align="right">-</TableCell>
                ) : (
                  <TableCell align="right" ><div className="winAmount">{(row.roll.paidAmount["_hex"] - row.roll.rollAmount["_hex"]) / Math.pow(10, 18)}</div></TableCell>
                )}


              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody></TableBody>
        )}

      </Table>
    </TableContainer>
  );
}