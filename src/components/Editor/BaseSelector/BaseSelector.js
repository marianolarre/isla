import { Check, CheckCircle } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Grid,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import EntityCard from "../../EntityCard/EntityCard";
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

  toggle(base) {
    let newList = [];
    if (this.props.value != null) {
      newList = [...this.props.value];
    }
    if (this.isBaseSelected(base)) {
      const index = newList.indexOf(base);
      newList.splice(index, 1);
    } else {
      newList.push(base);
    }
    this.props.onChange(newList);
  }

  isBaseSelected(base) {
    if (this.props.value === undefined) {
      return false;
    }
    if (this.props.value.length === 0) {
      return false;
    }
    return this.props.value.includes(base);
  }

  renderBases() {
    let baseList = [];
    Object.keys(this.props.worldData.bases).map((i, index) => {
      const base = this.props.worldData.bases[i];
      baseList.push(
        <Tooltip
          key={i}
          enterDelay={500}
          leaveDelay={0}
          title={
            <EntityCard
              worldData={this.props.worldData}
              graphics={this.props.graphics}
              entity={base}
            ></EntityCard>
          }
        >
          <Button className="base-button" onClick={() => this.toggle(i)}>
            <Badge
              badgeContent={<CheckCircle></CheckCircle>}
              variant="string"
              invisible={!this.isBaseSelected(i)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <img
                className="render base-icon"
                src={this.props.graphics.renders[base.img].src}
              />
            </Badge>
          </Button>
        </Tooltip>
      );
    });
    return baseList;
  }

  render() {
    return (
      <div>
        <Modal open={this.props.open} onClose={this.props.onClose}>
          <Box className="modal">
            <Box className="base-list">{this.renderBases()}</Box>
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
