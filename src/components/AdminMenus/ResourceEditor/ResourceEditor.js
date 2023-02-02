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
import "./ResourceEditor.css";
import GraphicsEditor from "../../GraphicsEditor/GraphicsEditor";
import ResourceSelector from "../../Editor/ResourceSelector/ResourceSelector";
import ResourceDisplay from "../../ResourceDisplay/ResourceDisplay";
import { ArrowUpward, Delete } from "@mui/icons-material";
import EntryList from "../../Editor/EntryList/EntryList";

class ResourceEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {
        name: "",
        desc: "",
        img: "",
      },
      keyChange: "",
      currentResource: "",
      graphicData: [],
      currentImage: 0,
      currentResourceType: "",
      currentResourceID: 0,
      resourceSelectorOpen: false,
      currentCiv: 0,
    };
  }

  handleGraphicsChange(newValue, variable) {
    let newResource = { ...this.state.resource };
    const newGraphicData = [...newResource.img];
    newGraphicData[this.state.currentImage][variable] = newValue;
    newResource.img = newValue;
    this.setState({ resource: newResource }, this.updateGraphicDataString);
  }

  handleAddResource() {
    let newWorldData = { ...this.props.worldData };
    const newResource = {
      name: "New resource",
      desc: "New resource's description",
      img: "00MWWGG0",
    };

    let newKey = prompt("Ingrese un nombre único");
    newWorldData.resources[newKey] = newResource;
    this.applyChanges();
    this.props.onChange(newWorldData, () => this.handleSelectResource(newKey));
  }

  handleSelectResource(resourceId) {
    this.applyChanges();
    const resource = this.props.worldData.resources[resourceId];
    this.setState({
      resource: resource,
      currentResource: resourceId,
      keyChange: resourceId,
    });
  }

  handleRemoveResource(id) {
    let newWorldData = { ...this.props.worldData };
    newWorldData.resources[id] = null;
    delete newWorldData.resources[id];
    if (id == this.state.currentResource) {
      this.setState({ currentResource: "" }, () =>
        this.props.onChange(newWorldData)
      );
    } else {
      this.props.onChange(newWorldData);
    }
  }

  applyChanges() {
    if (this.state.currentResource == "") return;
    let newWorldData = { ...this.props.worldData };
    newWorldData.resources[this.state.currentResource] = {
      ...this.state.resource,
    };

    if (this.state.currentResource !== this.state.keyChange) {
      Object.defineProperty(
        newWorldData.resources,
        this.state.keyChange,
        Object.getOwnPropertyDescriptor(
          newWorldData.resources,
          this.state.currentResource
        )
      );
      delete newWorldData.resources[this.state.currentResource];
    }

    this.props.onChange(newWorldData);
  }

  handleKeyChange(new_key) {
    this.setState({ keyChange: new_key });
  }

  handleResourceChange(newValue, variable) {
    let newResource = { ...this.state.resource };
    newResource[variable] = newValue;
    this.setState({ resource: newResource });
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
                entries={this.props.worldData.resources}
                pixi={this.props.pixi}
                renders={this.props.renders}
                primaryColor={1}
                entryTemplate={{
                  name: "New resource",
                  desc: "New resource's description",
                  img: "00MWWGG0",
                }}
                value={this.state.currentResource}
                onSelect={(e) => this.handleSelectResource(e)}
                onRemove={(e) => this.handleRemoveResource(e)}
                onAdd={(e) => this.handleAddResource()}
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
                value={this.state.resource.name}
                onChange={(e) =>
                  this.handleResourceChange(e.target.value, "name")
                }
              ></TextField>
              <div className="spacer"></div>
              <TextField
                fullWidth
                label="Description"
                variant="filled"
                value={this.state.resource.desc}
                onChange={(e) =>
                  this.handleResourceChange(e.target.value, "desc")
                }
              ></TextField>
              <div className="spacer"></div>
              <Typography>Graphic</Typography>
              <GraphicsEditor
                containerId="entity-preview"
                pixi={this.props.pixi}
                disableSpecialColors={true}
                primaryColor={1}
                value={this.state.resource.img}
                scale={1}
                onChange={(e) => this.handleResourceChange(e, "img")}
              ></GraphicsEditor>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ResourceEditor;
