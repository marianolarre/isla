import { Forward } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import PrettyBox from "../Containers/PrettyBox";
import PrettyButton from "../Containers/PrettyButton";
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
    if (this.props.informative || this.props.entity.prod.length == 1) {
      for (let a in this.props.entity.prod) {
        optionList.push(
          <Box key={a}>
            <ResourceDisplay
              resourceData={this.props.gameData.resources}
              graphics={this.props.graphics}
              value={this.props.entity.prod[a]}
            ></ResourceDisplay>
          </Box>
        );
      }
    } else {
      for (let a in this.props.entity.prod) {
        optionList.push(
          <PrettyButton key={a}>
            <ResourceDisplay
              resourceData={this.props.gameData.resources}
              graphics={this.props.graphics}
              value={this.props.entity.prod[a]}
            ></ResourceDisplay>
          </PrettyButton>
        );
      }
    }
    return (
      <Stack spacing={1} className="vertical-center">
        {optionList}
      </Stack>
    );
  }

  render() {
    const civ = this.props.gameData.civilizations[this.props.civilization];
    let str = this.props.entity.image;
    if (civ != null) {
      const options = {
        primary_color: civ.primary_color,
      };
      str = this.props.graphics.pixi.transformImageString(
        this.props.entity.image,
        options
      );
    }

    let requirements = null;
    let results = null;

    let req = this.props.entity.requirement;
    if (req !== null) {
      requirements = (
        <Typography className="card-requirement">{req}</Typography>
      );
    }

    let res = this.props.entity.result;
    if (res !== null) {
      results = <Typography className="cardResult">{res}</Typography>;
    }

    return (
      <PrettyBox>
        <Box className="card-header">
          <Typography className="card-title">
            {this.props.entity.name}
          </Typography>
        </Box>
        <Stack direction="row" spacing={4}>
          <Box className="vertical-center">
            <img
              src={this.props.graphics.renders[str].src}
              className="render huge-render no-margin"
            ></img>
          </Box>
          <Box sx={{ maxWidth: "200px", display: "flex" }}>
            <Typography className="description">
              {this.props.entity.description}
            </Typography>
          </Box>
          <Stack>
            <Typography>Trabajo actual</Typography>
            <ResourceDisplay
              resourceData={civ.state.resources}
              graphics={this.props.graphics}
              value={this.props.entity.action}
            ></ResourceDisplay>

            <Box className="card-separator"></Box>
            <Typography>Costo de construcción</Typography>
            {this.props.entity.cost != null && (
              <Box className="card-cost">
                {requirements}
                <ResourceDisplay
                  negated
                  resourceData={civ.state.resources}
                  graphics={this.props.graphics}
                  value={this.props.entity.cost}
                ></ResourceDisplay>
                {results}
              </Box>
            )}
          </Stack>
        </Stack>
      </PrettyBox>
    );
  }
}

export default EntityCard;
