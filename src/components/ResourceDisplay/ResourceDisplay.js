import React, { Component } from "react";
import { isEmptyObject } from "jquery";
import { Typography, Box, Stack, Tooltip } from "@mui/material";
import { ArrowRight, Clear, Forward, NotInterested } from "@mui/icons-material";
import "./ResourceDisplay.css";

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
        <Tooltip disableInteractive title={<Typography>Hacer nada</Typography>}>
          <Clear className="resource-arrow"></Clear>
        </Tooltip>
      );
    }
    Object.keys(this.props.value).map((i, index) => {
      let element = (
        <div className="resource-setter" key={index}>
          <Tooltip
            title={
              <Typography>
                {this.props.value[i]} {this.props.resourceData[i].name}
              </Typography>
            }
            disableInteractive
          >
            <div>
              <img
                className="render resource-icon"
                src={
                  this.props.graphics.renders[this.props.resourceData[i].img]
                    .src
                }
              />

              <Typography className="resource-number">
                {this.props.value[i]}
              </Typography>
            </div>
          </Tooltip>
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
      <Stack direction="row" className="resource-display">
        {costs}
        <Forward className="resource-arrow"></Forward>
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
