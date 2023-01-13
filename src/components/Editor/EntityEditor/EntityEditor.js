import { Grid, Paper, TextField, Typography } from "@mui/material";
import React, { Component } from "react";
import "./EntityEditor.css";
import GraphicsEditor from "../GraphicsEditor/GraphicsEditor";
import ResourceSelector from "../ResourceSelector/ResourceSelector";

class EntityEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphicData: [],
      cost: {},
      production: {},
      graphicString: "",
      currentImage: 0,
    };
  }

  handleGraphicsChange(newValue, variable) {
    const newGraphicData = [...this.state.graphicData];
    newGraphicData[this.state.currentImage][variable] = newValue;
    this.setState({ newGraphicData }, this.updateGraphicDataString);
  }

  render() {
    return (
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={2}>
            <Paper elevation={2} id="list">
              <Typography>Lista</Typography>
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper elevation={2} className="scrolling-panel">
              <Typography variant="h4">Configuración</Typography>
              <TextField fullWidth label="Name"></TextField>
              <TextField fullWidth label="Description"></TextField>
              <ResourceSelector
                className="inline"
                label="Cost:"
                value={this.state.cost}
                resourceData={this.props.worldData.resources}
                renders={this.props.renders}
                onChange={(e) => this.setState({ cost: e })}
              ></ResourceSelector>
              <ResourceSelector
                className="inline"
                label="Production:"
                value={this.state.production}
                resourceData={this.props.worldData.resources}
                renders={this.props.renders}
                onChange={(e) => this.setState({ production: e })}
              ></ResourceSelector>
              <GraphicsEditor
                containerId="entity-preview"
                pixi={this.props.pixi}
                scale={2}
                onChange={(e) => this.handleGraphicsChange(e, "graphicString")}
              ></GraphicsEditor>
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper elevation={2}>
              <Typography variant="h4">Vista previa</Typography>
              <div id="entity-preview"></div>
              <Typography>Click and drag to move selected part.</Typography>
              <br></br>
              <Typography>Use the scroll wheel to scale part.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default EntityEditor;
