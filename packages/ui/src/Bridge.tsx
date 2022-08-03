import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, Select, TextField } from "@mui/material";

const currencies = [
  {
    value: "Ether",
    label: "ETH",
  },
  {
    value: "Ether",
    label: "FTM",
  },
];

export default function Bridge(): JSX.Element {
  const [currency, setCurrency] = React.useState("EUR");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrency(event.target.value);
  };

  return (
    <Box>
      <div>
        <TextField variant="standard" value={123123}></TextField>
        <TextField
          select
          value={currency}
          onChange={handleChange}
          SelectProps={{ native: true }}
          variant="standard"
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </div>
      <div>
        <TextField variant="standard" value={123123}></TextField>
        <FormControl variant="standard">
          <Select
            labelId="select-network"
            id="select-network"
            value={"0x4"}
            onChange={() => console.log(123)}
          >
            <MenuItem value={"0x4"}>ETH</MenuItem>
            <MenuItem value={"0x3"}>Ethereum Ropsten</MenuItem>
            <MenuItem value={"0xFA2"}>Fantom Testnet</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Box>
  );
}
