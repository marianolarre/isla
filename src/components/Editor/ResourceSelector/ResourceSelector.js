import {
  Box,
  Button,
  Grid,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { isEmptyObject } from "jquery";
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
    };
  }

  renderResourceTable() {
    let resourceList = [];
    Object.keys(this.props.resourceData).map((i, index) =>
      resourceList.push(
        <Stack direction="row" className="table-resource">
          <Tooltip
            disableInteractive
            title={<Typography>{this.props.resourceData[i].name}</Typography>}
          >
            <img
              className="resource-icon"
              src={
                this.props.graphics.renders[this.props.resourceData[i].img].src
              }
            />
          </Tooltip>
          <TextField
            fullWidth
            type="number"
            variant="filled"
            className="resource-textfield"
            value={this.getResources(i) || ""}
            onChange={(e) => this.handleResourceChange(i, e.target.value)}
          ></TextField>
        </Stack>
      )
    );
    return resourceList;
  }

  getResources(id) {
    if (this.props.value === undefined) {
      return null;
    }
    if (isEmptyObject(this.props.value)) {
      return null;
    }
    if (id != null) {
      return this.props.value[id];
    }
    return this.props.value;
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

export default ResourceSelector;
