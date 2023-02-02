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
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import "./IdeaEditor.css";
import GraphicsEditor from "../../GraphicsEditor/GraphicsEditor";
import EntryList from "../../Editor/EntryList/EntryList";
import ResourceDisplay from "../../ResourceDisplay/ResourceDisplay";
import { ArrowUpward, Delete } from "@mui/icons-material";
import ResourceSelector from "../../Editor/ResourceSelector/ResourceSelector";
import EntityCard from "../../EntityCard/EntityCard";

class IdeaEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idea: {
        name: "",
        desc: "",
        img: "",
      },
      keyChange: "",
      currentIdea: "",
      graphicData: [],
      currentImage: 0,
      currentResourceID: 0,
      resourceSelectorOpen: false,
      currentCiv: 0,
    };
  }

  handleGraphicsChange(newValue, variable) {
    let newIdea = { ...this.state.idea };
    const newGraphicData = [...newIdea.img];
    newGraphicData[this.state.currentImage][variable] = newValue;
    newIdea.img = newValue;
    this.setState({ idea: newIdea }, this.updateGraphicDataString);
  }

  handleAddIdea() {
    let newWorldData = { ...this.props.worldData };
    const newIdea = {
      name: "New idea",
      desc: "New idea's description",
      img: "00MWWGG0",
    };

    let newKey = prompt("Ingrese un nombre único");
    newWorldData.ideas[newKey] = newIdea;
    this.applyChanges();
    this.props.onChange(newWorldData, () => this.handleSelectIdea(newKey));
  }

  getCurrentResource() {
    const actions = this.state.idea.actions;
    if (actions == null || actions.length == 0) {
      return {};
    }
    return actions[this.state.currentResourceID];
  }

  handleResourceSelectorClose() {
    this.setState({ resourceSelectorOpen: false });
  }

  handleResourceSelectorChange(newValue) {
    let newIdea = { ...this.state.idea };
    newIdea.actions[this.state.currentResourceID] = newValue;
    this.setState({ idea: newIdea });
  }

  handleSelectIdea(ideaId) {
    this.applyChanges();
    const idea = this.props.worldData.ideas[ideaId];
    this.setState({
      idea: idea,
      currentIdea: ideaId,
      keyChange: ideaId,
    });
  }

  handleRemoveIdea(id) {
    let newWorldData = { ...this.props.worldData };
    newWorldData.ideas[id] = null;
    delete newWorldData.ideas[id];
    if (id == this.state.currentIdea) {
      this.setState({ currentIdea: "" }, () =>
        this.props.onChange(newWorldData)
      );
    } else {
      this.props.onChange(newWorldData);
    }
  }

  applyChanges() {
    if (this.state.currentIdea == "") return;
    let newWorldData = { ...this.props.worldData };
    newWorldData.ideas[this.state.currentIdea] = {
      ...this.state.idea,
    };

    if (this.state.currentIdea !== this.state.keyChange) {
      Object.defineProperty(
        newWorldData.ideas,
        this.state.keyChange,
        Object.getOwnPropertyDescriptor(
          newWorldData.ideas,
          this.state.currentIdea
        )
      );
      delete newWorldData.ideas[this.state.currentIdea];
    }

    this.props.onChange(newWorldData);
  }

  handleKeyChange(new_key) {
    this.setState({ keyChange: new_key });
  }

  handleIdeaChange(newValue, variable) {
    let newIdea = { ...this.state.idea };
    newIdea[variable] = newValue;
    this.setState({ idea: newIdea });
  }

  handleCivChange(civId) {
    this.setState({ currentCiv: civId });
  }

  handleRemoveAction(i) {
    let newIdea = { ...this.state.idea };
    newIdea.actions.splice(i, 1);
    this.setState({ idea: newIdea });
  }

  handleMoveActionUp(i) {
    if (i == 0) return;
    let newIdea = { ...this.state.idea };
    let temp = { ...newIdea.actions[i] };
    newIdea.actions[i] = newIdea.actions[i - 1];
    newIdea.actions[i - 1] = temp;
    this.setState({ idea: newIdea });
  }

  handleMoveActionDown(i) {
    /*if (i >= this.state.base.actions.length - 1) return;
    let newBase = { ...this.state.base };
    let temp = { ...newBase.actions[i + 1] };
    newBase.actions[i + 1] = newBase.actions[i];
    newBase.actions[i] = temp;
    this.setState({ base: newBase });*/
  }

  handleEditResource(id) {
    this.setState({
      currentResourceID: id,
      resourceSelectorOpen: true,
    });
  }

  addAction() {
    console.log(this.state.idea);
    let newIdea = { ...this.state.idea };
    if (newIdea.actions == null || newIdea.actions.length == 0) {
      newIdea.actions = [];
    }
    newIdea.actions.push({});
    this.setState({ idea: newIdea });
  }

  renderIdeaUnlocks() {
    let unlockList = [];
    const civ = this.props.worldData.civilizations[0];
    const options = {
      primary_color: civ.primary_color,
    };

    for (let u in this.state.idea.unlocks) {
      const unlock = this.props.worldData.bases[this.state.idea.unlocks[u]];
      const unlockstr = this.props.pixi.transformImgString(unlock.img, options);
      if (this.props.renders[unlockstr] == null) continue;
      unlockList.push(
        <Tooltip
          key={u}
          title={
            <EntityCard
              worldData={this.props.worldData}
              renders={this.props.renders}
              pixi={this.props.pixi}
              civilization={this.props.civilization}
              entity={unlock}
            ></EntityCard>
          }
        >
          <Button>
            <img
              src={this.props.renders[unlockstr].src}
              className="render no-margin"
            ></img>
          </Button>
        </Tooltip>
      );
    }
  }

  renderIdeaActions() {
    let actionsList = [];
    for (let i in this.state.idea.actions) {
      actionsList.push(
        <Stack key={i} direction="row">
          <Button
            className="resource-button"
            onClick={() => this.handleEditResource(i)}
          >
            <ResourceDisplay
              value={this.state.idea.actions[i]}
              resourceData={this.props.worldData.resources}
              renders={this.props.renders}
            ></ResourceDisplay>
          </Button>
          <Box style={{ float: "right" }}>
            <IconButton
              disabled={i == 0}
              onClick={() => this.handleMoveActionUp(i)}
            >
              <ArrowUpward></ArrowUpward>
            </IconButton>
            <IconButton
              color="error"
              onClick={() => this.handleRemoveAction(i)}
            >
              <Delete></Delete>
            </IconButton>
          </Box>
        </Stack>
      );
    }
    return actionsList;
  }

  render() {
    return (
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
            <Paper elevation={2} id="list" className="scrolling-panel">
              <EntryList
                entries={this.props.worldData.ideas}
                pixi={this.props.pixi}
                renders={this.props.renders}
                primaryColor={1}
                entryTemplate={{
                  name: "New idea",
                  desc: "New idea's description",
                  img: "00MWWGG0",
                }}
                value={this.state.currentIdea}
                onSelect={(e) => this.handleSelectIdea(e)}
                onRemove={(e) => this.handleRemoveIdea(e)}
                onAdd={(e) => this.handleAddIdea()}
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
                value={this.state.idea.name}
                onChange={(e) => this.handleIdeaChange(e.target.value, "name")}
              ></TextField>
              <div className="spacer"></div>
              <TextField
                fullWidth
                label="Description"
                variant="filled"
                value={this.state.idea.desc}
                onChange={(e) => this.handleIdeaChange(e.target.value, "desc")}
              ></TextField>
              <div className="spacer"></div>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Unlocks</Typography>
                  {this.renderIdeaUnlocks()}
                  <Button onClick={() => this.addAction()}>Add Unlocks</Button>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Actions</Typography>
                  {this.renderIdeaActions()}
                  <Button onClick={() => this.addAction()}>Add Action</Button>
                </Grid>
              </Grid>
              <div className="spacer"></div>
              <Typography>Graphic</Typography>
              <GraphicsEditor
                containerId="entity-preview"
                pixi={this.props.pixi}
                disableSpecialColors={true}
                primaryColor={1}
                value={this.state.idea.img}
                scale={1}
                onChange={(e) => this.handleIdeaChange(e, "img")}
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

export default IdeaEditor;
