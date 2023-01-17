import React, { Component } from "react";
import {
  Stack,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  BottomNavigation,
  BottomNavigationAction,
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
  }

  handleSpriteHover(data, spritePointer) {}

  handleSpriteClick(data, spritePointer) {}

  handleSpriteExit() {}

  /* ====================================
                Entities
  ==================================== */
  renderEntities() {
    const civ = this.props.worldData.civilizations[this.state.currentCiv];
    const bases = this.props.worldData.bases;
    const options = {
      primary_color: civ.primary_color,
    };
    let imgList = [];
    for (let i in civ.state.entities) {
      const str = this.graphics.pixi.transformImgString(
        this.props.worldData.bases[i].img,
        options
      );
      imgList.push(
        <img
          className="render"
          src={this.graphics.renders[str].src}
          style={{ width: "64px", height: "auto", textShadow: "0 0 4px white" }}
        ></img>
      );
    }
    return <>{imgList}</>;
  }

  /* ====================================
                Game Master
  ==================================== */
  renderCivButtons() {
    let list = [];
    this.props.worldData.civilizations.map((value, index) =>
      list.push(
        <BottomNavigationAction
          key={index}
          onClick={() => this.handleCivChange(index)}
          icon={
            <img
              src={this.graphics.renders[value.img].src}
              style={{ margin: 0 }}
            ></img>
          }
          label={value.name}
        ></BottomNavigationAction>
      )
    );
    return list;
  }

  handleCivChange(civId) {
    this.setState({ currentCiv: civId });
  }

  render() {
    const civ = this.props.worldData.civilizations[this.state.currentCiv];
    if (!this.state.ready) {
      return <p>Loading</p>;
    }
    return (
      <>
        <Stack id="control-panel">
          <Accordion>
            <AccordionSummary>
              <img
                className="render"
                src={
                  this.graphics.renders[civ.img] == null
                    ? ""
                    : this.graphics.renders[civ.img].src
                }
                alt=""
              ></img>
              <h1>{civ.name}</h1>
            </AccordionSummary>
            <AccordionDetails>
              <div className="block">
                <h2>{civ.state.title}</h2>
                <div className="scroller">
                  <p>{civ.state.desc}</p>
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
              <img src="./../../../img/icons/buildings.png" alt=""></img>
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
              <img src="./../../../img/icons/master.png" alt=""></img>
              <h1>Game Master</h1>
            </AccordionSummary>
            <AccordionDetails>
              <BottomNavigation value={this.state.currentCiv}>
                {this.renderCivButtons()}
              </BottomNavigation>
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
