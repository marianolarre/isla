import React, { Component } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import EntityEditor from "./EntityEditor/EntityEditor";
import { IslandPIXI } from "../../classes/IslandPIXI";
import "./Editor.css";
import { Save } from "@mui/icons-material";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.worldData = { ...this.props.worldData };
    this.state = { tab: "entity", loaded: false };
  }

  componentWillMount() {
    this.pixi = new IslandPIXI({
      width: 256,
      height: 256,
      backgroundColor: 0x86d369,
      scale: 1,
    });

    this.renders = [];
    this.pixi.app.loader.load((loader, resources) => {
      this.createAllGraphicsFromData(this.props.worldData);
      this.setState({ loaded: true });
    });
  }

  renderHTMLFromString(graphicString) {
    if (this.renders[graphicString] == null) {
      const container = this.pixi.imgStringToContainer(graphicString);
      this.renders[graphicString] = this.pixi.renderHTMLImage(container, 0.25);
      container.destroy();
    }
  }

  createAllGraphicsFromData(worldData) {
    for (let i in worldData.resources) {
      const res = worldData.resources[i];
      this.renderHTMLFromString(res.img);
    }
    for (var entityBase in worldData.bases) {
      this.renderHTMLFromString(worldData.bases[entityBase].img);
    }
  }

  handleTabChange(ev, newValue) {
    this.setState({ tab: newValue });
  }

  handleWorldDataChange(newValue) {
    this.worldData = newValue;
    this.createAllGraphicsFromData(newValue);
    this.forceUpdate();
  }

  downloadWorldData() {
    this.downloadObjectAsJson(this.worldData, "textWorldData");
  }

  downloadObjectAsJson(exportObj, exportName) {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  render() {
    return (
      <div id="editor">
        <Button
          style={{ float: "right" }}
          onClick={() => this.downloadWorldData()}
        >
          <Save></Save>
        </Button>
        <Tabs
          centered
          value={this.state.tab}
          onChange={(ev, newValue) => this.handleTabChange(ev, newValue)}
        >
          <Tab value="civilizations" label="Civilizaciónes" />
          <Tab value="entity" label="Entidades" />
          <Tab value="resources" label="Recursos" />
          <Tab value="tech" label="Investigaciónes" />
        </Tabs>

        {this.state.loaded && this.state.tab == "entity" && (
          <EntityEditor
            worldData={this.worldData}
            pixi={this.pixi}
            renders={this.renders}
            onChange={(e) => this.handleWorldDataChange(e)}
          ></EntityEditor>
        )}
      </div>
    );
  }
}

export default Editor;
