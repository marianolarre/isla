import { Forward } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import ResourceDisplay from "../ResourceDisplay/ResourceDisplay";
import "./EntityCard.css";

class EntityCard extends Component {
  state = {};

  renderOptions() {
    let optionList = [];
    if (this.props.entity.prod != null && this.props.entity.prod.length > 0) {
      optionList.push(
        <Box key={-1}>
          <br></br>
          <Typography>Producción:</Typography>
        </Box>
      );
    }
    for (let a in this.props.entity.prod) {
      optionList.push(
        <Box className="action-container" key={a}>
          <ResourceDisplay
            resourceData={this.props.worldData.resources}
            graphics={this.props.graphics}
            value={this.props.entity.prod[a]}
          ></ResourceDisplay>
        </Box>
      );
    }
    return optionList;
  }

  render() {
    const civ = this.props.worldData.civilizations[this.props.civilization];
    let str = this.props.entity.img;
    if (civ != null) {
      const options = {
        primary_color: civ.primary_color,
      };
      str = this.props.graphics.pixi.transformImgString(
        this.props.entity.img,
        options
      );
    }

    let requirements = null;
    let results = null;

    if (this.props.entity.cost != null) {
      let req = this.props.entity.cost._requirement;
      if (req !== null) {
        requirements = <Typography color={"#ff0"}>{req}</Typography>;
      }

      let res = this.props.entity.cost._result;
      if (res !== null) {
        results = <Typography color={"#8ff"}>{res}</Typography>;
      }
    }

    let cost = { ...this.props.entity.cost };
    delete cost._requirement;
    delete cost._result;

    return (
      <Box className="entity-card">
        <Stack>
          <Typography className="title">{this.props.entity.name}</Typography>
          {requirements}
          <Stack direction="row" sx={{ margin: "auto" }} spacing={2}>
            <Box sx={{ marginTop: "10px" }}>
              <ResourceDisplay
                negated
                resourceData={this.props.worldData.resources}
                graphics={this.props.graphics}
                value={cost}
              ></ResourceDisplay>
            </Box>
            <Box></Box>
            <Forward style={{ margin: "auto" }}></Forward>
            <img
              src={this.props.graphics.renders[str].src}
              className="render big-render no-margin"
            ></img>
          </Stack>
          {results}
          <Typography className="description">
            {this.props.entity.desc}
          </Typography>
          {this.renderOptions()}
        </Stack>
      </Box>
    );
  }
}

export default EntityCard;
