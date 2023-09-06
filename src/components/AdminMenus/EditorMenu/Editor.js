import React, { Component } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import EntityEditor from "../EntityEditor/EntityEditor";
import { IslandPIXI } from "../../../classes/IslandPIXI";
import "./Editor.css";
import {
  ArrowBack,
  Flag,
  House,
  Inventory,
  Lightbulb,
  Save,
} from "@mui/icons-material";
import ResourceEditor from "../ResourceEditor/ResourceEditor";
import CivilizationEditor from "../CivilizationEditor/CivilizationEditor";
import IdeaEditor from "../IdeaEditor/IdeaEditor";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.worldData = { ...this.props.worldData };
    this.state = { tab: "civilization", loaded: false };
  }

  componentWillMount() {
    this.graphics = {};

    this.graphics.pixi = new IslandPIXI({
      width: 256,
      height: 256,
      scale: 0.1,
    });

    this.editorGraphics = {};
    this.editorGraphics.pixi = new IslandPIXI({
      width: 256,
      height: 256,
      scale: 1,
    });

    this.graphics.renders = [];
    this.graphics.pixi.app.loader.load((loader, resources) => {
      this.createAllGraphicsFromData(this.props.worldData);
      this.setState({ loaded: true });
    });
  }

  renderHTMLFromString(graphicString, options) {
    let str = graphicString;
    if (options != null) {
      str = this.graphics.pixi.transformImgString(str, options);
    }
    if (this.graphics.renders[str] == null) {
      const container = this.graphics.pixi.imageStringToContainer(str);
      this.graphics.renders[str] = this.graphics.pixi.renderHTMLImage(
        container,
        0.25
      );
      container.destroy();
    }
  }

  createAllGraphicsFromData(worldData) {
    console.log(worldData);
    for (var resource in worldData.resources) {
      this.renderHTMLFromString(worldData.resources[resource].img);
    }
    for (var idea in worldData.ideas) {
      this.renderHTMLFromString(worldData.ideas[idea].img);
    }
    for (var base in worldData.bases) {
      this.renderHTMLFromString(worldData.bases[base].img);
    }
    for (var civ in worldData.civilizations) {
      this.renderHTMLFromString(worldData.civilizations[civ].img);
    }
    for (let i in worldData.civilizations) {
      const civ = worldData.civilizations[i];
      this.renderHTMLFromString(civ.img);
      for (var baseId in worldData.bases) {
        this.renderHTMLFromString(worldData.bases[baseId].img, {
          primary_color: civ.primary_color,
        });
      }
    }
  }

  handleTabChange(ev, newValue) {
    this.setState({ tab: newValue });
  }

  handleWorldDataChange(newValue, callback) {
    this.worldData = newValue;
    this.createAllGraphicsFromData(newValue);
    this.forceUpdate(callback);
  }

  downloadWorldData() {
    this.downloadObjectAsJson(this.worldData, "testWorldData");
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
        <Button style={{ float: "left" }}>
          <ArrowBack></ArrowBack>
        </Button>
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
          <Tab
            value="civilization"
            icon={<Flag></Flag>}
            label="Civilizaciones"
          />
          <Tab value="entity" icon={<House></House>} label="Entidades" />
          <Tab
            value="resource"
            icon={<Inventory></Inventory>}
            label="Recursos"
          />
          <Tab value="idea" icon={<Lightbulb></Lightbulb>} label="Ideas" />
        </Tabs>

        {this.state.loaded && this.state.tab == "civilization" && (
          <CivilizationEditor
            worldData={this.worldData}
            graphics={this.graphics}
            editorGraphics={this.editorGraphics}
            onChange={(e, callback) => this.handleWorldDataChange(e, callback)}
          ></CivilizationEditor>
        )}
        {this.state.loaded && this.state.tab == "entity" && (
          <EntityEditor
            worldData={this.worldData}
            graphics={this.graphics}
            editorGraphics={this.editorGraphics}
            onChange={(e, callback) => this.handleWorldDataChange(e, callback)}
          ></EntityEditor>
        )}
        {this.state.loaded && this.state.tab == "resource" && (
          <ResourceEditor
            worldData={this.worldData}
            graphics={this.graphics}
            editorGraphics={this.editorGraphics}
            onChange={(e, callback) => this.handleWorldDataChange(e, callback)}
          ></ResourceEditor>
        )}
        {this.state.loaded && this.state.tab == "idea" && (
          <IdeaEditor
            worldData={this.worldData}
            graphics={this.graphics}
            editorGraphics={this.editorGraphics}
            onChange={(e, callback) => this.handleWorldDataChange(e, callback)}
          ></IdeaEditor>
        )}
      </div>
    );
  }
}

export default Editor;
