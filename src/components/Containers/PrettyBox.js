import { Box } from "@mui/material";
import React, { Component } from "react";
import "./MyContainers.css";

class PrettyBox extends Component {
  state = {};
  render() {
    return (
      <Box className="pretty-box-outline">
        <Box className="pretty-box-container">{this.props.children}</Box>
      </Box>
    );
  }
}

export default PrettyBox;
