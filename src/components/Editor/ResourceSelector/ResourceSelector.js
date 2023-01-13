import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { Component } from "react";
import "./ResourceSelector.css";

// Hacer que este selector permita crear un objeto
// con los recursos como keys y valores arbitrarios
// ejemplo: {"wood": 5, "work": -2}
// Positivo es ganancia, negativo es costo.

class ResourceSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      resourceCounts: this.props.resources,
    };
  }

  renderResourceList() {
    let resourceList = [];
    Object.keys(this.props.value).map((i, index) =>
      resourceList.push(
        <div className="resource-setter" key={index}>
          <img
            className="resource-icon"
            src={this.props.renders[this.props.resourceData[i].img].src}
          />
          <Typography className="resource-number">
            {this.props.value[i]}
          </Typography>
        </div>
      )
    );
    if (resourceList.length == 0) {
      return <Typography>Nothing</Typography>;
    }
    return resourceList;
  }

  renderResourceTable() {
    let resourceList = [];
    Object.keys(this.props.resourceData).map((i, index) =>
      resourceList.push(
        <Grid container className="table-resource" key={index}>
          <Grid item xs={9} className="table-resource-label">
            <img
              className="resource-icon"
              src={this.props.renders[this.props.resourceData[i].img].src}
            />
            <Typography className="resource-number">
              {this.props.resourceData[i].name}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              type="number"
              className="resource-textfield"
              value={this.props.value[i]}
              onChange={(e) => this.handleResourceChange(i, e.target.value)}
            ></TextField>
          </Grid>
        </Grid>
      )
    );
    return resourceList;
  }

  handleResourceChange(resource, newValue) {
    let newList = { ...this.props.value };
    if (newValue != 0) {
      newList[resource] = newValue;
    } else {
      delete newList[resource];
    }
    this.props.onChange(newList);
  }

  openModal() {
    this.setState({ open: true });
  }

  closeModal() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <Box>
          <Typography className="inline">{this.props.label}</Typography>
          <Button onClick={() => this.openModal()}>
            {this.renderResourceList()}
          </Button>
        </Box>
        <Modal open={this.state.open} onClose={() => this.closeModal()}>
          <Box className="modal">
            <br></br>
            <Typography variant="h6">Resources</Typography>
            <br></br>
            <Box className="resource-list">{this.renderResourceTable()}</Box>
            <Button onClose={() => this.closeModal()}>Accept</Button>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default ResourceSelector;
