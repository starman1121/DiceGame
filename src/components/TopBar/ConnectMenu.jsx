import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link, Slide, Fade } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import { ReactComponent as DocIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { ReactComponent as HectorIcon } from "../../assets/icons/DiceLogo.svg";

function ConnectMenu({ theme }) {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = "Connect Wallet(BSC)";
  let clickFunc = connect;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "ohm-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? " hovered-button" : "");

  const getEtherscanUrl = txnHash => {
    return chainID === 97 ? "https://testnet.bscscan.com//tx/" + txnHash : "https://bscscan.com/tx/" + txnHash;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div
      onMouseEnter={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      onMouseLeave={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      className="wallet-menu"
      id="wallet-menu"      
    >   
    
       
     <Link  href="" target="_blank" component={"a"} 
        className={`button-dapp-menu`}>
          <Typography className="menu_bar" variant="h6">
            <SvgIcon color="primary" component={DocIcon} />
           <div className="dice-doc">Doc</div>
        </Typography>                 
      </Link>

      <Link  href="" target="_blank" component={"a"} 
        className={`button-dapp-menu`}>
          <Typography variant="h6">
          <SvgIcon color="primary" component={Discord} />
        </Typography>                 
      </Link>

      <Link  href="" target="_blank" component={"a"} 
        className={`button-dapp-menu`}>
          <Typography variant="h6">
          <SvgIcon color="primary" component={Twitter} />
        </Typography>                 
      </Link>

      <Link  href="" target="_blank" component={"a"} 
        className={`button-dapp-menu`}>
          <Typography variant="h6">
          <SvgIcon color="primary" component={Telegram} />
        </Typography>                 
      </Link>

      <Button
        className={buttonStyles}
        variant="contained"
        color="secondary"
        size="large"
        style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
        onClick={clickFunc}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {buttonText}
        {pendingTransactions.length > 0 && (
          <Slide direction="left" in={isHovering} {...{ timeout: 333 }}>
            {/* <SvgIcon className="caret-down" component={CaretDownIcon} htmlColor={primaryColor} /> */}
          </Slide>
        )}
      </Button>
     

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                {pendingTransactions.map((x, i) => (
                  <Box key={i} fullWidth>
                    <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} target="_blank" rel="noreferrer">
                      <Button size="large" variant="contained" color="secondary" fullWidth>
                        <Typography align="left">
                          {x.text} <SvgIcon component={ArrowUpIcon} />
                        </Typography>
                      </Button>
                    </Link>
                  </Box>
                ))}

               
                <Box className="add-tokens">
                  <Divider color="secondary" />
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    onClick={disconnect}
                    style={{ marginBottom: "0px" }}
                    fullWidth
                  >
                    <Typography>Disconnect</Typography>
                  </Button>
                </Box>
              </Paper>
             
            </Fade>
          );
        }}
      </Popper>
    </div>
  );
}

export default ConnectMenu;
