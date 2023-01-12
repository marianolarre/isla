import React, { Component } from "react";
import "./Resource.css";

class Resource extends Component {
  constructor(props) {
    super(props);
    this.state = { resource: this.props.resource };
  }

  render() {
    let text = this.props.amount;

    if (this.props.delta) {
      if (this.props.amount >= 0) {
        text = "+" + text;
      } else {
        text = "-" + text;
      }
    }
    return (
      <div className={"resource " + this.props.type}>
        <p>{text}</p>
      </div>
    );
  }
}

export default Resource;
