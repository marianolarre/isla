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
  Popover,
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
import IdeaPanel from "./IdeaPanel.js";
import OrderPanel from "./OrderPanel.js";
import EntityCard from "../EntityCard/EntityCard.js";
import GameMasterPanel from "./GameMasterPanel.js";
import OrderCard from "../OrderCard/OrderCard.js";
import gameData from "../../data/deserializedTestGameData.js";
import PrettyBox from "../Containers/PrettyBox.js";

const ENTITY = 1;
const ORDER = 2;

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
      selectionOpen: false,
      hoverOpen: false,
      /*selectedData: {},
      selectedType: 0,
      selectedPointer: 0,
      selectionAnchor: null,*/
    };
  }

  /* #region React lifecycle */
  componentWillMount() {
    this.graphics = new GameGraphics(
      gameData,
      () => this.handleGraphicsLoaded(),
      (bounds, data, pointer, type) =>
        this.handleSpriteHover(bounds, data, pointer, type),
      (bounds, data, pointer, type) =>
        this.handleSpriteClick(bounds, data, pointer, type),
      () => this.handleSpriteExit(),
      () => this.handleDeselect(),
      () => this.handleDeselect()
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

  handleSpriteHover(bounds, data, spritePointer, type) {
    if (this.state.selectionOpen) {
      return null;
    }
    this.showHoverCard(bounds, data, spritePointer, type);
  }

  handleSpriteClick(bounds, data, spritePointer, type) {
    this.setState({ hoverOpen: false });
    this.showEntityCard(bounds, data, spritePointer, type);
  }

  handleSpriteExit() {
    if (this.state.selectionOpen) {
      return null;
    }
    this.setState({ hoverOpen: false });
  }

  handleDeselect() {
    this.setState({ selectionOpen: false, hoverOpen: false });
  }

  showEntityCard(bounds, data, spritePointer, type) {
    $("#selection-anchor").css({
      left: bounds.x,
      top: bounds.y,
      width: bounds.width,
      height: bounds.height,
    });
    this.setState({
      selectionOpen: true,
      selectedData: data,
      selectedPointer: spritePointer,
      selectedType: type,
    });
  }

  showHoverCard(bounds, data, spritePointer, type) {
    if (this.state.selectionOpen) {
      return null;
    }
    $("#selection-anchor").css({
      left: bounds.x,
      top: bounds.y,
      width: bounds.width,
      height: bounds.height,
    });
    this.setState({
      hoverOpen: true,
      selectedData: data,
      selectedPointer: spritePointer,
      selectedType: type,
    });
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
    const civ = gameData.civilizations[this.state.currentCiv];
    for (let i in civ.state.resources) {
      let singleResource = {};
      let resource = civ.state.resources[i];
      singleResource[i] = resource.current;
      elements.push(
        <Box display="inline-block" key={i}>
          {
            <ResourceDisplay
              key={i}
              resourceData={civ.state.resources}
              graphics={this.graphics}
              value={singleResource}
            />
          }
        </Box>
      );
    }
    return elements;
  }

  renderIncome() {
    const civ = gameData.civilizations[this.state.currentCiv];
    const bases = gameData.bases;
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
              resourceData={gameData.resources}
              graphics={this.graphics}
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

  handleCivChange(civId) {
    this.setState({ currentCiv: civId });
  }

  /* #region Entities Panel */
  renderEntities() {
    const civ = gameData.civilizations[this.state.currentCiv];
    const bases = gameData.bases;
    const options = {
      primary_color: civ.primary_color,
    };
    let imgList = [];
    for (let i in civ.state.entities) {
      const base = gameData.bases[i];
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

  render() {
    const civ = gameData.civilizations[this.state.currentCiv];
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
              {/*<Tab
                label="Resources"
                icon={<TrendingUp></TrendingUp>}
                onClick={() => this.setState({ currentMenu: 1 })}
              ></Tab>
              <Tab
                label="Ideas"
                icon={<Lightbulb></Lightbulb>}
                onClick={() => this.setState({ currentMenu: 2 })}
    ></Tab>*/}
              <Tab
                label="Orders"
                icon={<ListAlt></ListAlt>}
                onClick={() => this.setState({ currentMenu: 3 })}
              ></Tab>
              {/*<Tab
                label="Game Master"
                icon={<AutoStories></AutoStories>}
                onClick={() => this.setState({ currentMenu: 4 })}
    ></Tab>*/}
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
                  <Typography>{civ.state.description}</Typography>
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
                  worldData={gameData}
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
                <IdeaPanel
                  worldData={gameData}
                  civilization={this.state.currentCiv}
                  graphics={this.graphics}
                ></IdeaPanel>
              </TabPanel>

              {/* Orders */}
              <TabPanel
                value={this.state.currentMenu}
                index={3}
                className="tab-panel"
              >
                <OrderPanel
                  gameData={gameData}
                  civilization={this.state.currentCiv}
                  graphics={this.graphics}
                ></OrderPanel>
              </TabPanel>

              {/* Game Master */}
              <TabPanel
                value={this.state.currentMenu}
                index={4}
                className="tab-panel"
              >
                <GameMasterPanel
                  worldData={gameData}
                  civilization={this.state.currentCiv}
                  graphics={this.graphics}
                  onCivChange={(civId) => this.handleCivChange(civId)}
                ></GameMasterPanel>
              </TabPanel>
            </Box>

            <Fab className="close-menu-fab" onClick={() => this.toggleMenu()}>
              <ChevronLeft></ChevronLeft>
            </Fab>
          </Box>
        </Slide>
        <Box id="selection-anchor">
          {/*<Box
            className="selection-outline"
            sx={{ display: this.state.selectionOpen ? "block" : "none" }}
          ></Box>*/}
        </Box>
        <Popper
          open={this.state.selectionOpen}
          anchorEl={$("#selection-anchor").get(0)}
          placement="top"
          modifiers={[
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
          ]}
          sx={{ zIndex: 1 }}
        >
          <Box className="selection-popup">
            {this.state.selectedType == ENTITY && (
              <EntityCard
                gameData={gameData}
                graphics={this.graphics}
                entity={this.state.selectedData.entity}
                civilization={this.state.selectedData.civilization}
              ></EntityCard>
            )}
            {this.state.selectedType == ORDER && (
              <OrderCard
                worldData={gameData}
                graphics={this.graphics}
                order={this.state.selectedData.order}
                civilization={this.state.selectedData.civilization}
              ></OrderCard>
            )}
          </Box>
        </Popper>

        <Popper
          open={this.state.hoverOpen}
          anchorEl={$("#selection-anchor").get(0)}
          placement="top"
          modifiers={[
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
          ]}
          sx={{ zIndex: 1 }}
        >
          <PrettyBox className="selection-popup">
            {this.state.selectedType == ENTITY && (
              <Stack>
                <Typography>{this.state.selectedData.entity.name}</Typography>
                {this.state.selectedData.entity.action && (
                  <ResourceDisplay
                    resourceData={civ.state.resources}
                    graphics={this.graphics}
                    value={this.state.selectedData.entity.action}
                  ></ResourceDisplay>
                )}
              </Stack>
            )}
            {this.state.selectedType == ORDER && (
              <Typography>
                {this.state.selectedData.order.description}
              </Typography>
            )}
          </PrettyBox>
        </Popper>
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
