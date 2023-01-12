import React, { Component } from "react";
import { colorPalette } from "../../../classes/IslandPIXI";
import "./ColorPalette.css";

class ColorPalette extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        {colorPalette.map((value, index) => (
          <button
            key={index}
            style={{
              background: "#" + value,
              borderColor: index == this.props.value ? "#FFFFFF" : "#000000",
            }}
            className="color-button"
            onClick={() => this.props.onChange(index)}
          ></button>
        ))}
      </div>
    );
  }
}

export default ColorPalette;
