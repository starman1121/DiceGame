import { useEffect, useState } from "react";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";

import "./treasury-dashboard.scss";

function TreasuryDashboard() {  
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  }); 
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });
  const treasury = useSelector(state => {
    return state.app.treasury_balance;
  });

  const tvl = useSelector(state => {
    return state.app.tvl;
  });

  const burnBalance = useSelector(state => {
    return state.app.burnBalance;
  });
 


  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className={`hero-metrics`}>
          <Paper className="ohm-card">
          
          </Paper>
        </Box>      
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
