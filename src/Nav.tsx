import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, Select, SelectChangeEvent } from '@mui/material';
import * as Metamask from "./metamask"

const Nav = () => {
    const initialState = {
        currentChainId: '0x4',
        isConnected: false,

    };
    const [state, setState] = React.useState(initialState);

    const connectWallet = async () => {
        await Metamask.switchNetwork(state.currentChainId);
        setState({ ...state, isConnected: true });
    }

    const changeNetwork = async (event: SelectChangeEvent) => {
        const chainId = event.target.value;
        if (state.isConnected) {
            await Metamask.switchNetwork(chainId);
        }
        setState({ ...state, currentChainId: chainId });
    };

    return (
        <AppBar position="static" color='transparent'>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        TugaBridge
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                labelId="select-network"
                                id="select-network"
                                value={state.currentChainId}
                                onChange={changeNetwork}
                            >
                                <MenuItem value={"0x4"}>Ethereum Rinkeby</MenuItem>
                                <MenuItem value={"0x3"}>Ethereum Ropsten</MenuItem>
                                <MenuItem value={"0xFA2"}>Fantom Testnet</MenuItem>
                            </Select>
                        </FormControl>
                        {!state.isConnected && <Button variant="outlined" onClick={connectWallet} >Connect</Button>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Nav;