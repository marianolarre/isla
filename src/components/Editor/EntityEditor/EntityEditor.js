import { Grid, Paper, Typography } from "@mui/material";
import React, { Component } from "react";
import "./EntityEditor.css";
import GraphicsEditor from "../GraphicsEditor/GraphicsEditor";

class EntityEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphicData: [],
      graphicString: "",
      currentImage: 0,
    };
  }

  handleChange(newValue, variable) {
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
            <Paper elevation={2} id="list">
              <Typography>Opciónes</Typography>
              <GraphicsEditor
                containerId="entity-preview"
                options={{
                  width: 512,
                  height: 512,
                  backgroundColor: 0x86d369,
                  scale: 2,
                }}
                scale={2}
                onChange={(e) => this.handleChange(e, "graphicString")}
              ></GraphicsEditor>
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper elevation={2} id="list">
              <Typography>Vista previa</Typography>
              <div id="entity-preview"></div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default EntityEditor;
