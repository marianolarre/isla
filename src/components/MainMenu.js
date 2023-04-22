import { Box, Button, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class MainMenu extends Component {
  state = {};
  render() {
    return (
      <Stack>
        <Link to="play">
          <Button variant="contained">
            <Typography>Play</Typography>
          </Button>
        </Link>
        <Link to="master">
          <Button variant="contained">
            <Typography>Master</Typography>
          </Button>
        </Link>
        <Link to="draw">
          <Button variant="contained">
            <Typography>Draw</Typography>
          </Button>
        </Link>
      </Stack>
    );
  }
}

export default MainMenu;
