import React, { Component } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import EntityEditor from "../EntityEditor/EntityEditor";
import { IslandPIXI } from "../../../classes/IslandPIXI";
import "./Editor.css";
import { ArrowBack, Save } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ResourceEditor from "../ResourceEditor/ResourceEditor";
import CivilizationEditor from "../CivilizationEditor/CivilizationEditor";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.worldData = { ...this.props.worldData };
    this.state = { tab: "civilization", loaded: false };
  }

  componentWillMount() {
    this.pixi = new IslandPIXI({
      width: 256,
      height: 256,
      scale: 1,
    });

    this.renders = [];
    this.pixi.app.loader.load((loader, resources) => {
      this.createAllGraphicsFromData(this.props.worldData);
      this.setState({ loaded: true });
    });
  }

  renderHTMLFromString(graphicString, options) {
    if (this.renders[graphicString] == null) {
      let str = graphicString;
      if (options != null) {
        str = this.pixi.transformImgString(str, options);
      }
      const container = this.pixi.imgStringToContainer(str);
      this.renders[str] = this.pixi.renderHTMLImage(container, 0.25);
      container.destroy();
    }
  }

  createAllGraphicsFromData(worldData) {
    for (let i in worldData.civilizations) {
      const civ = worldData.civilizations[i];
      this.renderHTMLFromString(civ.img);
      for (var baseId in worldData.bases) {
        this.renderHTMLFromString(worldData.bases[baseId].img, {
          primary_color: civ.primary_color,
        });
      }
      for (let resId in worldData.resources) {
        const res = worldData.resources[resId];
        this.renderHTMLFromString(res.img, {
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
        <Link to="/">
          <Button style={{ float: "left" }}>
            <ArrowBack></ArrowBack>
          </Button>
        </Link>
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
          <Tab value="civilization" label="Civilizaciónes" />
          <Tab value="entity" label="Entidades" />
          <Tab value="resource" label="Recursos" />
        </Tabs>

        {this.state.loaded && this.state.tab == "civilization" && (
          <CivilizationEditor
            worldData={this.worldData}
            pixi={this.pixi}
            renders={this.renders}
            onChange={(e, callback) => this.handleWorldDataChange(e, callback)}
          ></CivilizationEditor>
        )}
        {this.state.loaded && this.state.tab == "entity" && (
          <EntityEditor
            worldData={this.worldData}
            pixi={this.pixi}
            renders={this.renders}
            onChange={(e, callback) => this.handleWorldDataChange(e, callback)}
          ></EntityEditor>
        )}
        {this.state.loaded && this.state.tab == "resource" && (
          <ResourceEditor
            worldData={this.worldData}
            pixi={this.pixi}
            renders={this.renders}
            onChange={(e, callback) => this.handleWorldDataChange(e, callback)}
          ></ResourceEditor>
        )}
      </div>
    );
  }
}

export default Editor;
