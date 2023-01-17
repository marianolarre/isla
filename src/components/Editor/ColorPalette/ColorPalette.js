import { Typography } from "@mui/material";
import React, { Component } from "react";
import { colorPalette, teamColorGradient } from "../../../classes/IslandPIXI";
import "./ColorPalette.css";

class ColorPalette extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  background(value, index) {
    return index == 0 ? teamColorGradient : "#" + value;
  }

  shouldDisable(index) {
    return this.props.disableSpecialColors && index == 0;
  }

  render() {
    return (
      <div>
        {colorPalette.map((value, index) => (
          <button
            key={index}
            style={{
              background: this.background(value, index),
              borderColor: index == this.props.value ? "#FFFFFF" : "#000000",
            }}
            disabled={this.props.disableSpecialColors && index == 0}
            className={
              this.shouldDisable(index)
                ? "color-button invisible"
                : "color-button"
            }
            onClick={() => this.props.onChange(index)}
          ></button>
        ))}
      </div>
    );
  }
}

export default ColorPalette;
