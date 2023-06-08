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
    let requirements = null;
    let textResult = null;
    if (this.getResources() == null) {
      return (
        <Box className="resource-display">
          <Tooltip
            disableInteractive
            title={<Typography>Hacer nada</Typography>}
          >
            <Clear className="resource-arrow"></Clear>
          </Tooltip>
        </Box>
      );
    }
    let sign = 1;
    if (this.props.negated) {
      sign = -1;
    }
    Object.keys(this.props.value).map((i, index) => {
      if (this.props.resourceData[i] != null) {
        let element = (
          <div className="resource-setter" key={index}>
            <Tooltip
              title={
                <Typography>
                  {this.props.value[i] * sign} {this.props.resourceData[i].name}
                </Typography>
              }
              disableInteractive
            >
              <div>
                <img
                  className="render resource-icon"
                  src={
                    this.props.graphics.renders[
                      this.props.resourceData[i].image
                    ].src
                  }
                />

                <Typography className="resource-number">
                  {this.props.value[i] * sign}
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
      } else {
        if (i === "_requirement") {
          requirements = (
            <Typography color={"#ff0"} className={"resource-extra-info"}>
              {this.props.value[i]}
            </Typography>
          );
        }
        if (i === "_result") {
          textResult = (
            <Typography color={"#8ff"} className={"resource-extra-info"}>
              {this.props.value[i]}
            </Typography>
          );
        }
      }
    });

    let middle = null;

    if (costs.length === 0 || results.length === 0) {
      middle = (
        <Box className="resource-icon-stack">
          {costs}
          {results}
        </Box>
      );
    } else {
      middle = (
        <Stack direction="row" className="resource-icon-stack">
          {costs}
          <Forward className="resource-arrow"></Forward>
          {results}
        </Stack>
      );
    }

    return (
      <Box className="resource-display">
        <Stack>
          {requirements}
          {middle}
          {textResult}
        </Stack>
      </Box>
    );
  }

  render() {
    return this.renderResourceList();
  }
}

export default ResourceDisplay;
