import React, { Component } from "react";
import {
  Stack,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
} from "@mui/material";
import GameGraphics from "../../classes/GameGraphics.js";
import { Link } from "react-router-dom";
import { Button, Popper } from "@mui/material";
import "./GamePanel.css";

class GamePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      currentCiv: 0,
      civilization: this.props.worldData.civilizations[0],
    };
  }

  componentWillMount() {
    this.graphics = new GameGraphics(
      this.props.worldData,
      () => this.handleGraphicsLoaded(),
      (d, sp) => this.handleSpriteHover(d, sp),
      (d, sp) => this.handleSpriteClick(d, sp),
      () => this.handleSpriteExit()
    );
  }

  componentDidMount() {
    this.graphics.mount();
  }

  componentWillUnmount() {
    this.graphics.unmount();
  }

  handleGraphicsLoaded() {
    this.setState({ ready: true });
    console.log(Object.keys(this.graphics.renders));
  }

  handleSpriteHover(data, spritePointer) {}

  handleSpriteClick(data, spritePointer) {}

  handleSpriteExit() {}

  renderEntities() {
    let imgList = [];
    for (let i in this.graphics.renders) {
      console.log("AAA");
      console.log(i);
      imgList.push(
        <img
          className="render"
          src={this.graphics.renders[i].src}
          style={{ width: "64px", height: "auto", textShadow: "0 0 4px white" }}
        ></img>
      );
    }
    return <>{imgList}</>;
  }

  render() {
    return (
      <>
        <Stack id="control-panel">
          <Accordion>
            <AccordionSummary>
              <img
                className="render"
                src={
                  this.graphics.renders[this.state.civilization.img] == null
                    ? ""
                    : this.graphics.renders[this.state.civilization.img].src
                }
                alt=""
              ></img>
              <h1>{this.state.civilization.name}</h1>
            </AccordionSummary>
            <AccordionDetails>
              <div className="block">
                <h2>{this.state.civilization.state.title}</h2>
                <div className="scroller">
                  <p>{this.state.civilization.state.desc}</p>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <img src="./../../../img/icons/income.png" alt=""></img>
              <h1>Ingresos</h1>
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <img src="./../../../img/icons/events.png" alt=""></img>
              <h1>Entidades</h1>
            </AccordionSummary>
            <AccordionDetails>
              <div className="block">
                <div className="scroller">{this.renderEntities()}</div>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <img src="./../../../img/icons/events.png" alt=""></img>
              <h1>Eventos</h1>
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <img src="./../../../img/icons/orders.png" alt=""></img>
              <h1>Ordenes</h1>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Box flex={1}></Box>

          <Accordion>
            <AccordionSummary>
              <h1>Game Master</h1>
            </AccordionSummary>
            <AccordionDetails>
              <Link to="/editor">
                <Button>Editor</Button>
              </Link>
            </AccordionDetails>
          </Accordion>
        </Stack>
        <Popper open={false}>This is a popper</Popper>
      </>
    );
  }
}
/*
// Resize PIXI canvas
function reportWindowSize() {
  this.game.graphics.app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.onresize = reportWindowSize;
*/
export default GamePanel;
