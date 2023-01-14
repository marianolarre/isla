import React, { Component } from "react";
import ControlPanel from "../ControlPanel/ControlPanel";
import GameGraphics from "../../classes/GameGraphics.js";
import Game from "../../classes/Game.js";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "./GamePanel.css";

class GamePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.game = new Game(this.props.worldData);
    this.graphics = new GameGraphics(this.game);
    this.currentCiv = 0;
  }

  componentDidMount() {
    this.graphics.mount();
  }

  componentWillUnmount() {
    this.graphics.unmount();
  }

  render() {
    return (
      <>
        <ControlPanel
          game={this.game}
          currentCiv={this.currentCiv}
          graphics={this.graphics}
        ></ControlPanel>
      </>
    );
  }
}
/*
// Resize PIXI canvas
function reportWindowSize() {
  this.graphics.app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.onresize = reportWindowSize;
*/
export default GamePanel;
