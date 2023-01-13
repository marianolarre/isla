import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { Component } from "react";
import "./EntityEditor.css";
import GraphicsEditor from "../GraphicsEditor/GraphicsEditor";
import ResourceSelector from "../ResourceSelector/ResourceSelector";

class EntityEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      currentBase: "",
      graphicData: [],
      cost: {},
      prod: [],
      graphicString: "",
      currentImage: 0,
    };
  }

  handleGraphicsChange(newValue, variable) {
    const newGraphicData = [...this.state.graphicData];
    newGraphicData[this.state.currentImage][variable] = newValue;
    this.setState({ newGraphicData }, this.updateGraphicDataString);
  }

  renderEntityList() {
    let entityList = [];
    for (let i in this.props.worldData.bases) {
      const base = this.props.worldData.bases[i];
      const render = this.props.renders[base.img];
      entityList.push(
        <Button
          key={i}
          fullWidth
          startIcon={<img src={render != null ? render.src : ""}></img>}
          onClick={() => this.selectBase(i)}
        >
          {base.name}
        </Button>
      );
    }
    return entityList;
  }

  selectBase(baseId) {
    const base = this.props.worldData.bases[baseId];
    console.log(base);
    this.setState({
      name: base.name,
      desc: base.desc,
      cost: base.cost,
      prod: base.prod,
      graphicString: base.img,
      graphicData: this.props.pixi.deserializeFullString(base.img),
    });
  }

  renderEntityProductions() {
    let prodList = [];
    for (let i in this.state.prod) {
      prodList.push(
        <ResourceSelector
          key={i}
          className="field"
          value={this.state.prod[i]}
          resourceData={this.props.worldData.resources}
          renders={this.props.renders}
          onChange={(e) => this.handleProductionChange(i, e)}
        ></ResourceSelector>
      );
    }
    return prodList;
  }

  handleProductionChange(i, e) {
    let prod = [...this.state.prod];
    prod[i] = e;
    this.setState({ prod: prod });
  }

  handleProductionRemove(i) {
    let prod = [...this.state.prod];
    prod.splice(i, 1);
    this.setState({ prod: prod });
  }

  handleProductionMoveUp(i) {
    if (i == 0) return;
    let prod = [...this.state.prod];
    let temp = { ...prod[i] };
    prod[i] = prod[i - 1];
    prod[i - 1] = temp;
    this.setState({ prod: prod });
  }

  handleProductionMoveDown(i) {
    console.log(i);
    if (i >= this.state.prod.length - 1) return;
    let prod = [...this.state.prod];
    console.log(prod);
    let temp = { ...prod[i] };
    prod[i] = prod[i + 1];
    prod[i + 1] = temp;
    console.log(prod);
    this.setState({ prod: prod });
  }

  addProduction() {
    let prod = [...this.state.prod];
    prod.push({});
    this.setState({ prod: prod });
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
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper elevation={2} className="panel scrolling-panel">
              <Typography variant="h4">Configuración</Typography>
              <TextField
                fullWidth
                label="Name"
                value={this.state.name}
                InputLabelProps={{ shrink: this.state.name }}
                onChange={(e) => this.setState({ name: e.target.value })}
              ></TextField>
              <div className="spacer"></div>
              <TextField
                fullWidth
                label="Description"
                value={this.state.desc}
                InputLabelProps={{ shrink: this.state.name }}
                onChange={(e) => this.setState({ desc: e.target.value })}
              ></TextField>
              <div className="spacer"></div>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Cost</Typography>
                  <ResourceSelector
                    className="field"
                    value={this.state.cost}
                    resourceData={this.props.worldData.resources}
                    renders={this.props.renders}
                    onChange={(e) => this.setState({ cost: e })}
                  ></ResourceSelector>
                </Grid>
                <Grid item xs={6}>
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
                scale={1}
                onChange={(e) => this.handleGraphicsChange(e, "graphicString")}
              ></GraphicsEditor>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default EntityEditor;
