import { Box, Button, Stack } from "@mui/material";
import React, { Component } from "react";

class PrettyButton extends Component {
  state = {};
  render() {
    return (
      <Button
        variant="filled"
        className="pretty-button"
        sx={{
          backgroundColor: "#418A5Eff",
          marginBottom: "5px",
          padding: 0,
          textTransform: "none",
        }}
      >
        <Box className="pretty-button-box">{this.props.children}</Box>
      </Button>
    );
  }
}

export default PrettyButton;
