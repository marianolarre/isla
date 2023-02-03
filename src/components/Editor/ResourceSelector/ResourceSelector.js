import {
  Box,
  Button,
  Grid,
  Input,
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
      filter: "",
    };
  }

  renderResourceTable() {
    let resourceList = [];
    Object.keys(this.props.resourceData).map((i, index) => {
      if (
        this.props.resourceData[i].name
          .toLowerCase()
          .includes(this.state.filter.toLowerCase())
      ) {
        resourceList.push(
          <Stack direction="row" className="table-resource" key={i}>
            <Tooltip
              disableInteractive
              title={<Typography>{this.props.resourceData[i].name}</Typography>}
            >
              <img
                className="render resource-icon"
                src={
                  this.props.graphics.renders[this.props.resourceData[i].img]
                    .src
                }
              />
            </Tooltip>
            <Input
              fullWidth
              size="small"
              type="number"
              variant="filled"
              className="resource-textfield"
              value={this.getResources(i) || ""}
              onChange={(e) => this.handleResourceChange(i, e.target.value)}
            ></Input>
          </Stack>
        );
      }
    });

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
    if (this.props.value === undefined) {
      return <></>;
    }
    return (
      <div>
        <Modal open={this.props.open} onClose={this.props.onClose}>
          <Box className="modal">
            <Box className="resource-input">
              <TextField
                fullWidth
                variant="filled"
                label="Requerimiento"
                value={this.props.value._requirement}
                onChange={(e) =>
                  this.handleResourceChange("_requirement", e.target.value)
                }
              ></TextField>
            </Box>
            <Box className="resource-input">
              <TextField
                fullWidth
                className="resource-input"
                variant="filled"
                label="Resultado"
                value={this.props.value._result}
                onChange={(e) =>
                  this.handleResourceChange("_result", e.target.value)
                }
              ></TextField>
            </Box>
            <Box className="resource-input">
              <TextField
                fullWidth
                label="Filtro"
                size="small"
                className="resource-input"
                value={this.state.filter}
                onChange={(e) => this.setState({ filter: e.target.value })}
              ></TextField>
            </Box>
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
