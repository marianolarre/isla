import {
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
import "./EntityEditor.css";
import GraphicsEditor from "../GraphicsEditor/GraphicsEditor";
import ResourceSelector from "../ResourceSelector/ResourceSelector";
import ResourceDisplay from "../../ResourceDisplay/ResourceDisplay";
import {
  ArrowDownward,
  ArrowUpward,
  Delete,
  ThirtyFpsSelect,
} from "@mui/icons-material";

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

  renderEntityList() {
    let entityList = [];
    for (let i in this.props.worldData.bases) {
      const base = this.props.worldData.bases[i];
      const str = this.props.pixi.transformImgString(base.img, {
        primary_color:
          this.props.worldData.civilizations[this.state.currentCiv]
            .primary_color,
      });
      const render = this.props.renders[str];
      entityList.push(
        <Button
          key={i}
          fullWidth
          startIcon={<img src={render != null ? render.src : ""}></img>}
          style={{ textTransform: "none" }}
          onClick={() => this.selectBase(i)}
        >
          {"[" + i + "] " + base.name}
        </Button>
      );
    }
    return entityList;
  }

  selectBase(baseId) {
    this.applyChanges();
    const base = this.props.worldData.bases[baseId];
    this.setState({ base: base, currentBase: baseId, keyChange: baseId });
  }

  renderEntityProductions() {
    let prodList = [];
    for (let i in this.state.base.prod) {
      prodList.push(
        <Stack key={i} direction="row">
          <Button
            className="resource-button"
            onClick={() => this.handleEditResource("prod", i)}
          >
            <ResourceDisplay
              value={this.state.base.prod[i]}
              resourceData={this.props.worldData.resources}
              renders={this.props.renders}
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
      currentResourceType: type,
      currentResourceID: id,
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
    this.setState(newBase);
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
      delete newWorldData.bases[this.state.currentBase];
    }

    this.props.onChange(newWorldData);
  }

  handleKeyChange(new_key) {
    this.setState({ keyChange: new_key });
  }

  handleBaseChange(newValue, variable) {
    let newBase = { ...this.state.base };
    newBase[variable] = newValue;
    this.setState({ base: newBase });
  }

  handleCivChange(civId) {
    this.setState({ currentCiv: civId });
  }

  renderCivButtons() {
    let list = [];
    this.props.worldData.civilizations.map((value, index) =>
      list.push(
        <Button key={index} onClick={() => this.handleCivChange(index)}>
          <img src={this.props.renders[value.flag_img].src}></img>
        </Button>
      )
    );
    return list;
  }

  render() {
    return (
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
            <Paper elevation={2} id="list" className="panel">
              <Typography variant="h4">Lista</Typography>
              {this.renderEntityList()}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={2} className="panel">
              <Typography variant="h4">Vista previa</Typography>
              <div id="entity-preview"></div>
              <Typography>Click and drag to move selected part.</Typography>
              <br></br>
              <Typography>Use the scroll wheel to scale part.</Typography>
              <br></br>
              {this.renderCivButtons()}
              <br></br>
              <Button onClick={() => this.applyChanges()}>Apply Changes</Button>
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper elevation={2} className="panel scrolling-panel">
              <Typography variant="h4">Configuración</Typography>
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
                <Grid item xs={4}>
                  <Typography>Cost</Typography>
                  <Button
                    className="resource-button"
                    fullWidth
                    onClick={() => this.handleEditResource("cost", 0)}
                  >
                    <ResourceDisplay
                      value={this.state.base.cost}
                      resourceData={this.props.worldData.resources}
                      renders={this.props.renders}
                    ></ResourceDisplay>
                  </Button>
                </Grid>
                <Grid item xs={8}>
                  <Typography>Production</Typography>
                  {this.renderEntityProductions()}
                  <Button onClick={() => this.addProduction()}>
                    Add production option
                  </Button>
                </Grid>
              </Grid>
              <div className="spacer"></div>
              <Typography>Graphic</Typography>
              <GraphicsEditor
                containerId="entity-preview"
                pixi={this.props.pixi}
                primaryColor={
                  this.props.worldData.civilizations[this.state.currentCiv]
                    .primary_color
                }
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
          renders={this.props.renders}
          onClose={() => this.handleResourceSelectorClose()}
          onChange={(e) => this.handleResourceSelectorChange(e)}
        ></ResourceSelector>
      </div>
    );
  }
}

export default EntityEditor;
