import React, { Component } from "react";
import { Tabs, Tab } from "@mui/material";
import EntityEditor from "./EntityEditor/EntityEditor";
import { IslandPIXI } from "../../classes/IslandPIXI";
import "./Editor.css";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: "entity", loaded: false };
  }

  componentWillMount() {
    this.pixi = new IslandPIXI({
      width: 512,
      height: 512,
      backgroundColor: 0x86d369,
      scale: 2,
    });

    this.renders = [];
    this.pixi.app.loader.load((loader, resources) => {
      this.createAllGraphicsFromData(this.props.worldData);
      this.setState({ loaded: true });
    });
  }

  createAllGraphicsFromData(worldData) {
    for (let i in worldData.resources) {
      const res = worldData.resources[i];
      const container = this.pixi.imgStringToContainer(res.img);
      this.renders[res.img] = this.pixi.renderHTMLImage(container, 0.5);
    }
  }

  handleTabChange(ev, newValue) {
    this.setState({ tab: newValue });
  }

  render() {
    return (
      <div id="editor">
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
            worldData={this.props.worldData}
            pixi={this.pixi}
            renders={this.renders}
          ></EntityEditor>
        )}
      </div>
    );
  }
}

export default Editor;
