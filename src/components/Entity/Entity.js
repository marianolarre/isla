import { css } from "jquery";
import React, { Component } from "react";
import ResourceList from "./../ResourceList/ResourceList.js";
import "./Entity.css";

class Entity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const sprites = this.props.civ.state.bases[this.props.instance.id].spr;
    let src;
    if (this.props.instance.var) {
      src = sprites[this.props.instance.var];
    } else {
      src = sprites.def;
    }
    return (
      <div className={"entity"}>
        <div className={"imgContainer"}>
          <img src={src}></img>
        </div>
        <div className={"textContainer"}>
          <ResourceList
            worldData={this.props.worldData}
            list={this.props.income}
            style={"small"}
            delta={this.props.delta}
          ></ResourceList>
        </div>
      </div>
    );
  }
}

export default Entity;
