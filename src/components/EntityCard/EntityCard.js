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
        <>
          <br></br>
          <Typography>Producción:</Typography>
        </>
      );
    }
    for (let a in this.props.entity.prod) {
      optionList.push(
        <Box className="entity-production">
          <ResourceDisplay
            resourceData={this.props.worldData.resources}
            renders={this.props.renders}
            value={this.props.entity.prod[a]}
          ></ResourceDisplay>
        </Box>
      );
    }
    return optionList;
  }

  render() {
    const civ = this.props.worldData.civilizations[this.props.civilization];
    const options = {
      primary_color: civ.primary_color,
    };
    console.log(this.props);
    const str = this.props.pixi.transformImgString(
      this.props.entity.img,
      options
    );

    return (
      <Box className="entity-card">
        <Stack>
          <Typography className="title">{this.props.entity.name}</Typography>

          <Stack direction="row" sx={{ margin: "auto" }} spacing={2}>
            <Box sx={{ marginTop: "10px" }}>
              <ResourceDisplay
                negated
                resourceData={this.props.worldData.resources}
                renders={this.props.renders}
                value={this.props.entity.cost}
              ></ResourceDisplay>
            </Box>
            <Box></Box>
            <Forward style={{ margin: "auto" }}></Forward>
            <img
              src={this.props.renders[str].src}
              className="render big-render no-margin"
            ></img>
          </Stack>
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
