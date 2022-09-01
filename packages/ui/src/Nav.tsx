import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, Link, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import * as Metamask from "./metamask";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Nav(): JSX.Element {
    const connectedAddress = sessionStorage.connectedAddress;
    const initialState = {
        currentChainId: sessionStorage.currentChainId ?? "0x4",
        connectedAddress: connectedAddress,
    };
    const [state, setState] = React.useState(initialState);

    const connectWallet = async () => {
        await Metamask.connect(state.currentChainId);
        const connectedAddress = Metamask.getConnectedAddress();
        setState({ ...state, connectedAddress: connectedAddress });
        sessionStorage.connectedAddress = connectedAddress;
    };

    const switchNetwork = async (event: SelectChangeEvent) => {
        const chainId = event.target.value;
        if (state.connectedAddress) {
            await Metamask.connect(chainId);
        }
        setState({ ...state, currentChainId: chainId });
        sessionStorage.currentChainId = chainId;
    };

    const disconnectWallet = () => {
        sessionStorage.clear();
        setState({ ...state, connectedAddress: null });
    };

    return (
        <AppBar position="static" color="transparent">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        <Link href="/" underline="none" color="black">
                            <h3>TugaBridge</h3>
                        </Link>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                labelId="select-network"
                                id="select-network"
                                value={state.currentChainId}
                                onChange={switchNetwork}
                            >
                                {/* todo foreach networks */}
                                <MenuItem value={"0x4"}>Ethereum Rinkeby</MenuItem>
                                <MenuItem value={"0x3"}>Ethereum Ropsten</MenuItem>
                                <MenuItem value={"0xFA2"}>Fantom Testnet</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {state.connectedAddress ? (
                            <Button variant="outlined">
                                {state.connectedAddress} &nbsp;&nbsp;
                                <Tooltip title="Disconnect wallet" onClick={disconnectWallet}>
                                    <LogoutIcon />
                                </Tooltip>
                            </Button>
                        ) : (
                            <Button variant="outlined" onClick={connectWallet}>
                                Connect
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
