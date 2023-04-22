import React, { Component } from "react";
import GraphicsEditor from "../GraphicsEditor/GraphicsEditor";
import GameGraphics from "../../classes/GameGraphics.js";
import { IslandPIXI } from "../../classes/IslandPIXI";
import { Box } from "@mui/material";
import "./Draw.css";

class Draw extends Component {
  state = {
    img: "",
  };

  componentWillMount() {
    this.editorGraphics = {};
    this.editorGraphics.pixi = new IslandPIXI({
      width: 256,
      height: 256,
      scale: 1,
    });
  }

  handleChange(e) {
    this.setState({ img: e });
  }

  render() {
    return (
      <Box sx={{ width: "100%", paddingTop: "50px", color: "white" }}>
        <Box sx={{ maxWidth: "1000px", margin: "auto" }}>
          <GraphicsEditor
            containerId="preview"
            graphics={this.editorGraphics}
            disableSpecialColors={true}
            value={this.state.img}
            scale={1}
            onChange={(e) => this.handleChange(e)}
          ></GraphicsEditor>
        </Box>
      </Box>
    );
  }
}

export default Draw;
