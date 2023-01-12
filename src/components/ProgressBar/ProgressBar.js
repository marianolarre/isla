import React, { Component } from "react";
import "./ProgressBar.css";

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let total = this.props.total;
    let deltaPercent = Math.abs(this.props.delta);
    let fillPercent = this.props.fill - Math.max(deltaPercent, 0);
    let emptyPercent = total - fillPercent - deltaPercent;
    let filled = {
      width: (fillPercent / total) * 100 + "%",
    };
    let empty = {
      width: (emptyPercent / total) * 100 + "%",
    };
    let delta = {
      width: (deltaPercent / total) * 100 + "%",
    };
    let text = this.props.fill + "/" + total;
    if ((this.props.delta != null) & (this.props.delta != 0)) {
      text += " (";
      if (this.props.delta > 0) {
        text += "+";
      }
      text += this.props.delta + ")";
    }
    return (
      <>
        <div className="bar-container">
          <div className="bar-filled" style={filled}></div>
          {this.props.delta > 0 && (
            <div className="bar-positive" style={delta}></div>
          )}
          {this.props.delta < 0 && (
            <div className="bar-negative" style={delta}></div>
          )}
          <div className="bar-empty" style={empty}></div>
        </div>
        <p className="numbers">{text}</p>
      </>
    );
  }
}

export default ProgressBar;
