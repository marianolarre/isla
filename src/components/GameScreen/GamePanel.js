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
  Tabs,
  Tab,
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
  Flag,
  House,
  Lightbulb,
  ListAlt,
  LocationCity,
  Menu,
  TrendingUp,
} from "@mui/icons-material";
import ResourcesPanel from "./ResourcesPanel.js";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

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

  renderResources() {
    let elements = [];
    const civ = this.props.worldData.civilizations[this.state.currentCiv];
    for (let i in civ.state.resources) {
      let singleResource = {};
      singleResource[i] = civ.state.resources[i][0];
      elements.push(
        <ResourceDisplay
          key={i}
          resourceData={this.props.worldData.resources}
          renders={this.graphics.renders}
          value={singleResource}
        />
      );
    }
    return elements;
  }

  renderIncome() {
    const civ = this.props.worldData.civilizations[this.state.currentCiv];
    const bases = this.props.worldData.bases;
    const options = {
      primary_color: civ.primary_color,
    };

    // Event income
    // Entity income
    let totalIncome = {};
    let incomeElements = [];

    for (let b in civ.state.entities) {
      for (let i in civ.state.entities[b]) {
        const income = this.getEntityIncome(civ.state.entities[b][i], bases[b]);
        if (isEmptyObject(income)) continue;
        this.addToProduction(totalIncome, income);
      }
    }

    /*
    for (let i in totalIncome) {
      let singleResource = {};
      singleResource[i] = totalIncome[i];
      incomeElements.push(
        <Accordion>
          <AccordionSummary>
            <ResourceDisplay
              value={singleResource}
              resourceData={this.props.worldData.resources}
              renders={this.graphics.renders}
            ></ResourceDisplay>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{"A"}</Typography>
          </AccordionDetails>
        </Accordion>
      );
    }
    return incomeElements;*/
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
        <Accordion key={i}>
          <AccordionSummary>
            <img
              className="render small-render no-margin"
              src={this.graphics.renders[str].src}
            ></img>
            <Typography style={{ margin: "auto" }}>{base.name}</Typography>
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
            <Tabs
              orientation="vertical"
              className="tabs"
              value={this.state.currentMenu}
            >
              <Tab
                label="Overview"
                icon={<Flag></Flag>}
                onClick={() => this.setState({ currentMenu: 0 })}
              ></Tab>
              <Tab
                label="Resources"
                icon={<TrendingUp></TrendingUp>}
                onClick={() => this.setState({ currentMenu: 1 })}
              ></Tab>
              <Tab
                label="Ideas"
                icon={<Lightbulb></Lightbulb>}
                onClick={() => this.setState({ currentMenu: 2 })}
              ></Tab>
              <Tab
                label="Orders"
                icon={<ListAlt></ListAlt>}
                onClick={() => this.setState({ currentMenu: 3 })}
              ></Tab>
              <Tab
                label="Game Master"
                icon={<AutoStories></AutoStories>}
                onClick={() => this.setState({ currentMenu: 4 })}
              ></Tab>
            </Tabs>

            <Box className="tab">
              {/* Overview */}
              <TabPanel
                value={this.state.currentMenu}
                index={0}
                className="tab-panel"
              >
                <Box>
                  <Typography>{civ.state.title}</Typography>
                  <Typography>{civ.state.desc}</Typography>
                  {this.renderResources()}
                </Box>
              </TabPanel>

              {/* Resources */}
              <TabPanel
                value={this.state.currentMenu}
                index={1}
                className="tab-panel"
              >
                <ResourcesPanel
                  worldData={this.props.worldData}
                  civilization={this.state.currentCiv}
                  graphics={this.graphics}
                ></ResourcesPanel>
              </TabPanel>

              {/* Ideas */}
              <TabPanel
                value={this.state.currentMenu}
                index={2}
                className="tab-panel"
              >
                <span>{this.renderEntities()}</span>
              </TabPanel>

              {/* Orders */}
              <TabPanel
                value={this.state.currentMenu}
                index={3}
                className="tab-panel"
              >
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </TabPanel>

              {/* Game Master */}
              <TabPanel
                value={this.state.currentMenu}
                index={4}
                className="tab-panel"
              >
                <BottomNavigation value={this.state.currentCiv}>
                  {this.renderCivButtons()}
                </BottomNavigation>
                <Link to="/editor">
                  <Button>Editor</Button>
                </Link>
              </TabPanel>
            </Box>

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
