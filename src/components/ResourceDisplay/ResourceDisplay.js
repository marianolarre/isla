import React, { Component } from "react";
import { isEmptyObject } from "jquery";
import { Typography, Box, Stack } from "@mui/material";
import { ArrowRight, Forward } from "@mui/icons-material";

class ResourceDisplay extends Component {
  state = {};

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

  renderResourceList() {
    let costs = [];
    let results = [];
    if (this.getResources() == null) {
      return (
        <Typography style={{ padding: 0, margin: 0 }} variant="p">
          Nothing
        </Typography>
      );
    }
    Object.keys(this.props.value).map((i, index) => {
      let element = (
        <div className="resource-setter" key={index}>
          <img
            className="render resource-icon"
            src={this.props.renders[this.props.resourceData[i].img].src}
          />
          <Typography className="resource-number">
            {this.props.value[i]}
          </Typography>
        </div>
      );
      if (this.props.value[i] < 0) {
        costs.push(element);
      } else {
        results.push(element);
      }
    });
    if (costs.length == 0 || results.length == 0) {
      return costs.concat(results);
    }
    return (
      <Stack direction="row">
        {costs}
        <Forward style={{ margin: "auto" }}></Forward>
        {results}
      </Stack>
    );
  }

  render() {
    return (
      <Box display="inline">
        {this.props.label != null && (
          <Typography
            className="inline"
            variant="p"
            style={{ margin: 0, padding: 0 }}
          >
            {this.props.label}
          </Typography>
        )}
        {this.renderResourceList()}
      </Box>
    );
  }
}

export default ResourceDisplay;
