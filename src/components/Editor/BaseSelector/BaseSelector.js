import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import "./BaseSelector.css";

// Hacer que este selector permita crear un objeto
// con los recursos como keys y valores arbitrarios
// ejemplo: {"wood": 5, "work": -2}
// Positivo es ganancia, negativo es costo.

class BaseSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
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
              variant="filled"
              className="resource-textfield"
              value={this.isBaseSelected(i) || ""}
              onChange={(e) => this.handleResourceChange(i, e.target.value)}
            ></TextField>
          </Grid>
        </Grid>
      )
    );
    return resourceList;
  }

  isBaseSelected(id) {
    return this.props.value[id] !== undefined;
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

  handleResourceRemove() {
    this.closeModal();
    this.props.onRemove();
  }

  render() {
    return (
      <div>
        <Modal open={this.props.open} onClose={this.props.onClose}>
          <Box className="modal">
            <Box className="resource-list">{this.renderResourceTable()}</Box>
            <Button onClick={this.props.onClose} style={{ float: "right" }}>
              Accept
            </Button>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default BaseSelector;
