import React, { Component } from "react";
import { Tabs, Tab } from "@mui/material";
import EntityEditor from "./EntityEditor/EntityEditor";
import "./Editor.css";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: "entity" };
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
        {this.state.tab == "entity" && (
          <EntityEditor graphics={this.props.graphics}></EntityEditor>
        )}
      </div>
    );
  }
}

export default Editor;
