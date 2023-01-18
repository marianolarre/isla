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
  Fab,
  Collapse,
  Zoom,
  Slide,
} from "@mui/material";
import GameGraphics from "../../classes/GameGraphics.js";
import { Link } from "react-router-dom";
import { Button, Popper } from "@mui/material";
import ResourceDisplay from "../ResourceDisplay/ResourceDisplay.js";
import "./GamePanel.css";
import $ from "jquery";
import { isEmptyObject } from "jquery";
import {
  AutoStories,
  ChevronLeft,
  ChevronRight,
  Event,
  House,
  ListAlt,
  LocationCity,
  Menu,
  TrendingUp,
} from "@mui/icons-material";

class GamePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      currentCiv: 0,
      currentMenu: 0,
      menuOpen: true,
    };
  }

  /* #region React lifecycle */
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

  /* #endregion */

  /* #region Handle graphic events */
  handleGraphicsLoaded() {
    this.setState({ ready: true });
  }

  handleSpriteHover(data, spritePointer) {
    this.setState({ popperOpen: true });
  }

  handleSpriteClick(data, spritePointer) {}

  handleSpriteExit() {
    this.setState({ popperOpen: false });
  }
  /* #endregion */

  /* #region Menu Control */
  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }
  /* #endregion */

  /* #region Income Panel */
  getEntityIncome(entity, base) {
    const chosen = entity.chosen || 0;
    if (entity.prod != null) {
      return entity.prod[chosen];
    }
    if (base.prod != null) {
      return base.prod[chosen];
    }
    return null;
  }

  addToProduction(target, add) {
    for (let k in add) {
      if (target[k] == null) {
        target[k] = add[k];
      } else {
        target[k] += add[k];
      }
    }
  }

  renderIncome() {
    const civ = this.props.worldData.civilizations[this.state.currentCiv];
    const bases = this.props.worldData.bases;
    const options = {
      primary_color: civ.primary_color,
    };
    // Event income
    // Entity income
    let entityIncome = {};
    let entityIncomeElements = [];
    for (let b in civ.state.entities) {
      for (let i in civ.state.entities[b]) {
        const income = this.getEntityIncome(civ.state.entities[b][i], bases[b]);
        if (isEmptyObject(income)) continue;
        this.addToProduction(entityIncome, income);
        const str = this.graphics.pixi.transformImgString(
          bases[b].img,
          options
        );
        entityIncomeElements.push(
          <Stack direction="row">
            <Stack direction="row">
              <img
                className="render small-render"
                src={this.graphics.renders[str].src}
              ></img>
              <h2>{bases[b].name}</h2>
            </Stack>
            <ResourceDisplay
              value={income}
              resourceData={this.props.worldData.resources}
              renders={this.graphics.renders}
            ></ResourceDisplay>
          </Stack>
        );
      }
    }
    return entityIncomeElements;
  }
  /* #endregion */

  /* #region Entities Panel */
  renderEntities() {
    const civ = this.props.worldData.civilizations[this.state.currentCiv];
    const bases = this.props.worldData.bases;
    const options = {
      primary_color: civ.primary_color,
    };
    let imgList = [];
    for (let i in civ.state.entities) {
      const base = this.props.worldData.bases[i];
      const str = this.graphics.pixi.transformImgString(base.img, options);
      imgList.push(
        <Accordion>
          <AccordionSummary>
            <img
              className="render small-render no-margin"
              src={this.graphics.renders[str].src}
            ></img>
            <h2 style={{ margin: "auto" }}>{base.name}</h2>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{base.desc}</Typography>
          </AccordionDetails>
        </Accordion>
      );
    }
    return <>{imgList}</>;
  }
  /* #endregion */

  /* #region Game Master Panel */
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

  /* #endregion */

  render() {
    const civ = this.props.worldData.civilizations[this.state.currentCiv];
    if (!this.state.ready) {
      return <p>Loading</p>;
    }
    return (
      <>
        <Slide direction="right" in={!this.state.menuOpen}>
          <Box>
            <Fab className="open-menu-fab" onClick={() => this.toggleMenu()}>
              <ChevronRight></ChevronRight>
            </Fab>
          </Box>
        </Slide>
        <Slide direction="right" in={this.state.menuOpen}>
          <Box id="control-panel">
            <Stack className="scroller">
              {this.state.currentMenu == 0 && (
                <Box className="menu">
                  <h2>{civ.state.title}</h2>
                  <p>{civ.state.desc}</p>
                </Box>
              )}

              {this.state.currentMenu == 1 && (
                <Box className="menu">{this.renderIncome()}</Box>
              )}

              {this.state.currentMenu == 2 && (
                <Box className="menu">
                  <div className="scroller">{this.renderEntities()}</div>
                </Box>
              )}

              {this.state.currentMenu == 3 && (
                <Box className="menu">
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </Box>
              )}

              {this.state.currentMenu == 4 && (
                <Box className="menu">
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </Box>
              )}

              {this.state.currentMenu == 5 && (
                <Box className="menu">
                  <BottomNavigation value={this.state.currentCiv}>
                    {this.renderCivButtons()}
                  </BottomNavigation>
                  <Link to="/editor">
                    <Button>Editor</Button>
                  </Link>
                </Box>
              )}
            </Stack>
            <BottomNavigation
              value={this.state.currentMenu}
              className="menu-bottom-nav"
            >
              <BottomNavigationAction
                label="City"
                icon={<LocationCity></LocationCity>}
                onClick={() => this.setState({ currentMenu: 0 })}
              ></BottomNavigationAction>
              <BottomNavigationAction
                label="Income"
                icon={<TrendingUp></TrendingUp>}
                onClick={() => this.setState({ currentMenu: 1 })}
              ></BottomNavigationAction>
              <BottomNavigationAction
                label="Entities"
                icon={<House></House>}
                onClick={() => this.setState({ currentMenu: 2 })}
              ></BottomNavigationAction>
              <BottomNavigationAction
                label="Events"
                icon={<Event></Event>}
                onClick={() => this.setState({ currentMenu: 3 })}
              ></BottomNavigationAction>
              <BottomNavigationAction
                label="Orders"
                icon={<ListAlt></ListAlt>}
                onClick={() => this.setState({ currentMenu: 4 })}
              ></BottomNavigationAction>
              <BottomNavigationAction
                label="Game Master"
                icon={<AutoStories></AutoStories>}
                onClick={() => this.setState({ currentMenu: 5 })}
              ></BottomNavigationAction>
            </BottomNavigation>
            <Fab className="close-menu-fab" onClick={() => this.toggleMenu()}>
              <ChevronLeft></ChevronLeft>
            </Fab>
          </Box>
        </Slide>
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
