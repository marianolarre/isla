import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import "./CivilizationEditor.css";
import GraphicsEditor from "../../GraphicsEditor/GraphicsEditor";
import ResourceSelector from "../../Editor/ResourceSelector/ResourceSelector";
import ResourceDisplay from "../../ResourceDisplay/ResourceDisplay";
import { ArrowUpward, Delete } from "@mui/icons-material";
import EntryList from "../../Editor/EntryList/EntryList";
import ColorPalette from "../../Editor/ColorPalette/ColorPalette";

class CivilizationEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      civilization: {
        name: "",
        player: "",
        img: "",
      },
      keyChange: "",
      currentResource: "",
      graphicData: [],
      currentImage: 0,
      currentResourceType: "",
      currentResourceID: 0,
      civilizationSelectorOpen: false,
      currentCiv: 0,
    };
  }

  handleGraphicsChange(newValue, variable) {
    let newResource = { ...this.state.civilization };
    const newGraphicData = [...newResource.img];
    newGraphicData[this.state.currentImage][variable] = newValue;
    newResource.img = newValue;
    this.setState({ civilization: newResource }, this.updateGraphicDataString);
  }

  selectResource(civilizationId) {
    this.applyChanges();
    const civilization = this.props.worldData.civilizations[civilizationId];
    this.setState({
      civilization: civilization,
      currentResource: civilizationId,
      keyChange: civilizationId,
    });
  }

  handleNewResource() {
    this.setState({
      currentResource: "new_entry",
      keyChange: "new_entry",
      civilization: {
        name: "New civilization",
        player: "New civilization's playerription",
        img: "00MWWGG0",
      },
    });
  }

  handleResourceListChange(newList) {
    let newWorldData = { ...this.props.worldData };
    newWorldData.civilizations = newList;
    this.props.onChange(newWorldData);
  }

  applyChanges() {
    if (this.state.currentResource == "") return;
    let newWorldData = { ...this.props.worldData };
    newWorldData.civilizations[this.state.currentResource] = {
      ...this.state.civilization,
    };

    if (this.state.currentResource !== this.state.keyChange) {
      Object.defineProperty(
        newWorldData.civilizations,
        this.state.keyChange,
        Object.getOwnPropertyDescriptor(
          newWorldData.civilizations,
          this.state.currentResource
        )
      );
      delete newWorldData.civilizations[this.state.currentResource];
    }

    this.props.onChange(newWorldData);
  }

  handleKeyChange(new_key) {
    this.setState({ keyChange: new_key });
  }

  handleCivilizationChange(newValue, variable) {
    let newResource = { ...this.state.civilization };
    newResource[variable] = newValue;
    this.setState({ civilization: newResource });
  }

  handleCivChange(civId) {
    this.setState({ currentCiv: civId });
  }

  renderCivButtons() {
    let list = [];
    this.props.worldData.civilizations.map((value, index) =>
      list.push(
        <BottomNavigationAction
          key={index}
          onClick={() => this.handleCivChange(index)}
          icon={
            <img
              src={this.props.renders[value.img].src}
              style={{ margin: 0 }}
            ></img>
          }
          label={value.name}
        ></BottomNavigationAction>
      )
    );
    return list;
  }

  render() {
    return (
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
            <Paper elevation={2} id="list" className="scrolling-panel">
              <EntryList
                entries={this.props.worldData.civilizations}
                pixi={this.props.pixi}
                renders={this.props.renders}
                primaryColor={
                  this.props.worldData.civilizations[this.state.currentCiv]
                    .primary_color
                }
                entryTemplate={{
                  name: "New civilization",
                  player: "New civilization's player",
                  img: "00MWWGG0",
                }}
                onSelect={(e) => this.selectResource(e)}
                onChange={(e) => this.handleResourceListChange(e)}
                onNew={(e) => this.handleNewResource()}
              ></EntryList>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper elevation={2} className="panel scrolling-panel">
              <Button onClick={() => this.applyChanges()}>Apply Changes</Button>
              <div className="spacer"></div>
              <TextField
                fullWidth
                label="Name"
                variant="filled"
                value={this.state.civilization.name}
                onChange={(e) =>
                  this.handleCivilizationChange(e.target.value, "name")
                }
              ></TextField>
              <div className="spacer"></div>
              <TextField
                fullWidth
                label="Player"
                variant="filled"
                value={this.state.civilization.player}
                onChange={(e) =>
                  this.handleCivilizationChange(e.target.value, "player")
                }
              ></TextField>
              <div className="spacer"></div>
              <Typography>Primary Color</Typography>
              <ColorPalette
                value={this.state.civilization.primary_color}
                columns={16}
                onChange={(e) =>
                  this.handleCivilizationChange(e, "primary_color")
                }
                disableSpecialColors={true}
              ></ColorPalette>
              <div className="spacer"></div>
              <Typography>Graphic</Typography>
              <GraphicsEditor
                containerId="entity-preview"
                pixi={this.props.pixi}
                disableSpecialColors
                value={this.state.civilization.img}
                scale={1}
                onChange={(e) => this.handleCivilizationChange(e, "img")}
              ></GraphicsEditor>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default CivilizationEditor;
