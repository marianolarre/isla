import React, { Component } from "react";
import GraphicsEditor from "../GraphicsEditor/GraphicsEditor";
import GameGraphics from "../../classes/GameGraphics.js";
import { IslandPIXI } from "../../classes/IslandPIXI";
import { Box, Button, Typography } from "@mui/material";
import "./Draw.css";

const examples = [
  ["House", "05wWcQN0;105WSSP0;0miRhHH0;00LbfCC0;1GibfCC0;12ddLJJ0;0X5dQBFC"],
  [
    "Farm",
    "00iWWZZ0;0SjWWYYC;2R7JFMP0;2R7jFMP0;2R7WFMP0;2R8JdMP0;2R8jdMP0;2R8WdMP0",
  ],
  [
    "Wood camp",
    "13kMKII0;185MQMM0;13kMUII0;1DkdJCF0;1DkhQCF0;43ZnPAAh;0pkoRDDV;2CkjmMMF;2CkepMMF;2CkgjMMF",
  ],
  [
    "Castle",
    "00dWWWN0;0VdWMME0;00cETIR0;0UcEHIR0;00coTIR0;0UcoHIR0;0m1WbII0;17iWcGG0;19cWaJJ0;0m1EPCC0;0m1oPCC0;13jWGJJ0;16IaFEG0;1CbEbFF0;1CboYFF0;1CcbRFF0",
  ],
  ["Fish", "3EKKWMMC;0nKZOMEk;0gJcWWWC;351jUNN0;0nKYeGJQ"],
  ["Tree", "2EkWhRR0;24DWNXX0;25CWKWWP;26BZHKKP;2LDEp99A;2LDmrBBa;2LDsn999"],
];

class Draw extends Component {
  state = {
    img: "",
  };

  componentWillMount() {
    this.renders = [];
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

  renderExamples() {
    let buttons = [];
    for (let i = 0; i < examples.length; i++) {
      buttons.push(
        <Button key={i} onClick={() => this.setState({ img: examples[i][1] })}>
          <Typography>{examples[i][0]}</Typography>
        </Button>
      );
    }
    return buttons;
  }

  render() {
    return (
      <Box
        sx={{
          paddingTop: "5vh",
          width: "100%",
          height: "90vh",
          paddingBottom: "5vh",
          color: "white",
          overflow: "auto",
        }}
      >
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
        <Typography>Examples:</Typography>
        {this.renderExamples()}
      </Box>
    );
  }
}

export default Draw;
