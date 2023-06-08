import { Box, Button, Stack, Typography } from "@mui/material";
import React, { Component } from "react";

class MainMenu extends Component {
  state = {};
  render() {
    return (
      <Stack>
        <Button variant="contained">
          <Typography>Play</Typography>
        </Button>
        <Button variant="contained">
          <Typography>Master</Typography>
        </Button>
        <Button variant="contained">
          <Typography>Draw</Typography>
        </Button>
      </Stack>
    );
  }
}

export default MainMenu;
