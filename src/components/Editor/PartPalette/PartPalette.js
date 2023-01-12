import React, { Component } from "react";
import "./PartPalette.css";

class PartPalette extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let imgList = [];
    for (let i in this.props.images) {
      imgList.push(
        <button
          key={i}
          onClick={() => this.props.onChange(i)}
          className="part-button"
          style={{ borderColor: i == this.props.value ? "#FFFFFF" : "#000000" }}
        >
          <img src={this.props.images[i].src}></img>
        </button>
      );
    }
    return <>{imgList}</>;
  }
}

export default PartPalette;
