import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import "./EntityEditor.css";
import GraphicsEditor from "../../GraphicsEditor/GraphicsEditor";
import ResourceSelector from "../../Editor/ResourceSelector/ResourceSelector";
import ResourceDisplay from "../../ResourceDisplay/ResourceDisplay";
import { ArrowUpward, Delete } from "@mui/icons-material";
import EntryList from "../../Editor/EntryList/EntryList";

class EntityEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: {
        name: "",
        desc: "",
        cost: {},
        prod: [],
        img: "",
      },
      keyChange: "",
      currentBase: "",
      graphicData: [],
      currentImage: 0,
      currentResourceType: "",
      currentResourceID: 0,
      resourceSelectorOpen: false,
      currentCiv: 0,
    };
  }

  handleGraphicsChange(newValue, variable) {
    let newBase = { ...this.state.base };
    const newGraphicData = [...newBase.img];
    newGraphicData[this.state.currentImage][variable] = newValue;
    newBase.img = newValue;
    this.setState({ base: newBase }, this.updateGraphicDataString);
  }

  renderEntityProductions() {
    let prodList = [];
    for (let i in this.state.base.prod) {
      prodList.push(
        <Stack key={i} direction="row">
          <Button
            fullWidth
            sx={{ display: "block" }}
            className="resource-button"
            onClick={() => this.handleEditResource("prod", i)}
          >
            <ResourceDisplay
              value={this.state.base.prod[i]}
              resourceData={this.props.worldData.resources}
              graphics={this.props.graphics}
            ></ResourceDisplay>
          </Button>
          <Box style={{ float: "right" }}>
            <IconButton
              disabled={i == 0}
              onClick={() => this.handleMoveProductionUp(i)}
            >
              <ArrowUpward></ArrowUpward>
            </IconButton>
            <IconButton
              color="error"
              onClick={() => this.handleRemoveProduction(i)}
            >
              <Delete></Delete>
            </IconButton>
          </Box>
        </Stack>
      );
    }
    return prodList;
  }

  handleEditResource(type, id) {
    this.setState({
      currentResourceID: id,
      currentResourceType: type,
      resourceSelectorOpen: true,
    });
  }

  handleRemoveProduction(i) {
    let newBase = { ...this.state.base };
    newBase.prod.splice(i, 1);
    this.setState({ base: newBase });
  }

  handleMoveProductionUp(i) {
    if (i == 0) return;
    let newBase = { ...this.state.base };
    let temp = { ...newBase.prod[i] };
    newBase.prod[i] = newBase.prod[i - 1];
    newBase.prod[i - 1] = temp;
    this.setState({ base: newBase });
  }

  handleMoveProductionDown(i) {
    if (i >= this.state.base.prod.length - 1) return;
    let newBase = { ...this.state.base };
    let temp = { ...newBase.prod[i + 1] };
    newBase.prod[i + 1] = newBase.prod[i];
    newBase.prod[i] = temp;
    this.setState({ base: newBase });
  }

  addProduction() {
    let newBase = { ...this.state.base };
    newBase.prod.push({});
    this.setState({ base: newBase });
  }

  handleResourceSelectorClose() {
    this.setState({ resourceSelectorOpen: false });
  }

  getCurrentResource() {
    // If its an array, use the Id. Otherwise, just return it.
    if (Array.isArray(this.state.base[this.state.currentResourceType])) {
      return this.state.base[this.state.currentResourceType][
        this.state.currentResourceID
      ];
    } else {
      return this.state.base[this.state.currentResourceType];
    }
  }

  handleResourceSelectorChange(newValue) {
    // If its an array, use the Id. Otherwise, just edit it.
    let newBase = { ...this.state.base };
    if (Array.isArray(newBase[this.state.currentResourceType])) {
      newBase[this.state.currentResourceType][this.state.currentResourceID] =
        newValue;
    } else {
      newBase[this.state.currentResourceType] = newValue;
    }
    this.setState({ base: newBase });
  }

  applyChanges() {
    if (this.state.currentBase == "") return;

    let newWorldData = { ...this.props.worldData };
    newWorldData.bases[this.state.currentBase] = { ...this.state.base };

    if (this.state.currentBase !== this.state.keyChange) {
      Object.defineProperty(
        newWorldData.bases,
        this.state.keyChange,
        Object.getOwnPropertyDescriptor(
          newWorldData.bases,
          this.state.currentBase
        )
      );
      newWorldData.bases[this.state.currentBase] = null;
      delete newWorldData.bases[this.state.currentBase];
    }

    this.props.onChange(newWorldData, () =>
      this.setState({ currentBase: this.state.keyChange })
    );
  }

  handleKeyChange(new_key) {
    this.setState({ keyChange: new_key });
  }

  handleBaseChange(newValue, variable) {
    let newBase = { ...this.state.base };
    newBase[variable] = newValue;
    this.setState({ base: newBase });
  }

  handleRemoveBase(id) {
    let newWorldData = { ...this.props.worldData };
    newWorldData.bases[id] = null;
    delete newWorldData.bases[id];
    if (id == this.state.currentBase) {
      this.setState({ currentBase: "" }, () =>
        this.props.onChange(newWorldData)
      );
    } else {
      this.props.onChange(newWorldData);
    }
  }

  handleAddBase() {
    let newWorldData = { ...this.props.worldData };
    const newBase = {
      name: "Unnamed entity",
      desc: "Description unknown",
      cost: {},
      prod: [],
      img: "000WWGG0",
    };
    let newKey = prompt("Ingrese un nombre único");
    newWorldData.bases[newKey] = newBase;
    this.applyChanges();
    this.props.onChange(newWorldData, () => this.handleSelectBase(newKey));
  }

  handleSelectBase(baseId) {
    this.applyChanges();
    const base = this.props.worldData.bases[baseId];
    this.setState({ base: base, currentBase: baseId, keyChange: baseId });
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
              src={this.props.graphics.renders[value.img].src}
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
    if (this.state.base === undefined) {
      return <CircularProgress></CircularProgress>;
    }
    let primaryColor =
      this.props.worldData.civilizations[this.state.currentCiv] == null
        ? 5
        : this.props.worldData.civilizations[this.state.currentCiv]
            .primary_color;
    return (
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
            <Paper elevation={2} id="list" className="scrolling-panel">
              <EntryList
                entries={this.props.worldData.bases}
                graphics={this.props.graphics}
                primaryColor={primaryColor}
                value={this.state.currentBase}
                onSelect={(e) => this.handleSelectBase(e)}
                onRemove={(e) => this.handleRemoveBase(e)}
                onAdd={(e) => this.handleAddBase(e)}
              ></EntryList>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper elevation={2} className="panel scrolling-panel">
              <Button onClick={() => this.applyChanges()}>Apply Changes</Button>
              <TextField
                fullWidth
                label="Nombre único"
                variant="filled"
                value={this.state.keyChange}
                onChange={(e) => this.handleKeyChange(e.target.value)}
              ></TextField>
              <div className="spacer"></div>
              <TextField
                fullWidth
                label="Name"
                variant="filled"
                value={this.state.base.name}
                onChange={(e) => this.handleBaseChange(e.target.value, "name")}
              ></TextField>
              <div className="spacer"></div>
              <TextField
                fullWidth
                label="Description"
                variant="filled"
                value={this.state.base.desc}
                onChange={(e) => this.handleBaseChange(e.target.value, "desc")}
              ></TextField>
              <div className="spacer"></div>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Cost</Typography>
                  <Button
                    fullWidth
                    sx={{ display: "block" }}
                    className="resource-button"
                    onClick={() => this.handleEditResource("cost", 0)}
                  >
                    <ResourceDisplay
                      value={this.state.base.cost}
                      resourceData={this.props.worldData.resources}
                      graphics={this.props.graphics}
                    ></ResourceDisplay>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Production</Typography>
                  {this.renderEntityProductions()}
                  <Button onClick={() => this.addProduction()}>
                    Add production option
                  </Button>
                </Grid>
              </Grid>
              <div className="spacer"></div>
              <Typography>Graphic</Typography>
              <BottomNavigation value={this.state.currentCiv}>
                {this.renderCivButtons()}
              </BottomNavigation>
              <br></br>
              <GraphicsEditor
                containerId="entity-preview"
                graphics={this.props.editorGraphics}
                primaryColor={primaryColor}
                value={this.state.base.img}
                scale={1}
                onChange={(e) => this.handleBaseChange(e, "img")}
              ></GraphicsEditor>
            </Paper>
          </Grid>
        </Grid>
        <ResourceSelector
          resourceData={this.props.worldData.resources}
          open={this.state.resourceSelectorOpen}
          value={this.getCurrentResource()}
          graphics={this.props.graphics}
          onClose={() => this.handleResourceSelectorClose()}
          onChange={(e) => this.handleResourceSelectorChange(e)}
        ></ResourceSelector>
      </div>
    );
  }
}

export default EntityEditor;
