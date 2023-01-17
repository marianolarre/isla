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
      graphicData: [],
      currentImage: 0,
      currentCivilization: -1,
    };
  }

  handleGraphicsChange(newValue, variable) {
    let newCiv = { ...this.state.civilization };
    const newGraphicData = [...newCiv.img];
    newGraphicData[this.state.currentImage][variable] = newValue;
    newCiv.img = newValue;
    this.setState({ civilization: newCiv }, this.updateGraphicDataString);
  }

  handleAddCivilization() {
    let newWorldData = { ...this.props.worldData };
    const newCivilization = {
      name: "New civilization",
      player: "Unknown player",
      img: "00MWWGG0",
      primary_color: 22,
    };

    newWorldData.civilizations.push(newCivilization);
    this.props.onChange(newWorldData, () =>
      this.handleSelectCivilization(newWorldData.civilizations.length - 1)
    );
  }

  handleSelectCivilization(id) {
    this.applyChanges();
    const civilization = this.props.worldData.civilizations[id];
    this.setState({
      civilization: civilization,
      currentCivilization: id,
    });
  }

  handleRemoveCivilization(id) {
    let newWorldData = { ...this.props.worldData };
    newWorldData.civilizations.splice(id, 1);
    this.setState({ currentCivilization: -1 });
    this.props.onChange(newWorldData);
  }

  applyChanges() {
    if (
      this.state.currentCivilization < 0 ||
      this.state.currentCivilization >= this.props.worldData.length
    ) {
      return;
    }

    let newWorldData = { ...this.props.worldData };
    newWorldData.civilizations[this.state.currentCivilization] = {
      ...this.state.civilization,
    };
    this.props.onChange(newWorldData);
  }

  handleCivilizationChange(newValue, variable) {
    let newResource = { ...this.state.civilization };
    newResource[variable] = newValue;
    this.setState({ civilization: newResource });
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
                primaryColor={this.state.civilization.primary_color}
                value={this.state.currentCivilization}
                onSelect={(e) => this.handleSelectCivilization(e)}
                onRemove={(e) => this.handleRemoveCivilization(e)}
                onAdd={() => this.handleAddCivilization()}
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
