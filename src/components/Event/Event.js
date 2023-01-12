import { css } from "jquery";
import React, { Component } from "react";
import ResourceList from "../ResourceList/ResourceList.js";
import ProgressBar from "../ProgressBar/ProgressBar";
import "./Event.css";

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let hasSprite = true;
    let src = this.props.event.spr;
    if (src == null) {
      hasSprite = false;
      src = this.props.worldData.eventsprite;
    }

    let progress = null;
    if (this.props.event.type == "process") {
      progress = this.props.event.prog;
    }

    return (
      <div className={"event"}>
        {
          // If it has an image and/or a position
          (hasSprite ||
            (this.props.event.x != null && this.props.event.y != null)) && (
            <div className={"imgContainer"}>
              <img src={src}></img>
            </div>
          )
        }

        <p className={"textContainer"}>{this.props.event.name}</p>
        <br></br>
        {
          // If it has a progress:
          progress != null && (
            <>
              <ProgressBar
                fill={progress[0]}
                delta={progress[1]}
                total={progress[2]}
              />
              <br></br>
            </>
          )
        }
        {
          // If it provides resources:
          this.props.event.resources != null && (
            <>
              <div className={"textContainer"}>
                <ResourceList
                  worldData={this.props.worldData}
                  list={this.props.event.resources}
                  style={"small"}
                  delta={true}
                ></ResourceList>
              </div>
              <br></br>
            </>
          )
        }
      </div>
    );
  }
}

export default Event;
