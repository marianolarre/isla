import { Box, Button, Tooltip, Typography } from "@mui/material";
import React, { Component } from "react";
import EntityCard from "../EntityCard/EntityCard";
import ResourceDisplay from "../ResourceDisplay/ResourceDisplay";
import "./IdeaPanel.css";

class IdeaPanel extends Component {
  state = {};

  renderEntities() {
    const civ = this.props.worldData.civilizations[this.props.civilization];
    const options = {
      primary_color: civ.primary_color,
    };
    let imgList = [];
    for (let i in civ.state.ideas) {
      const index = civ.state.ideas[i];
      const idea = this.props.worldData.ideas[index];
      const str = this.props.graphics.pixi.transformImgString(
        idea.img,
        options
      );

      let unlockList = [];
      for (let u in idea.unlocks) {
        const unlock = this.props.worldData.bases[idea.unlocks[u]];
        const unlockstr = this.props.graphics.pixi.transformImgString(
          unlock.img,
          options
        );
        if (this.props.graphics.renders[unlockstr] == null) continue;
        unlockList.push(
          <Tooltip
            key={u}
            title={
              <EntityCard
                worldData={this.props.worldData}
                graphics={this.props.graphics}
                civilization={this.props.civilization}
                entity={unlock}
              ></EntityCard>
            }
          >
            <Button>
              <img
                src={this.props.graphics.renders[unlockstr].src}
                className="render no-margin"
              ></img>
            </Button>
          </Tooltip>
        );
      }

      let actionList = [];
      for (let a in idea.actions) {
        actionList.push(
          <Button key={a} fullWidth>
            <ResourceDisplay
              resourceData={this.props.worldData.resources}
              graphics={this.props.graphics}
              value={idea.actions[a]}
            ></ResourceDisplay>
          </Button>
        );
      }

      imgList.push(
        <Tooltip
          key={i}
          enterDelay={400}
          title={
            <>
              <Typography sx={{ fontSize: "1.2rem" }}>{idea.name}</Typography>
              <Typography>{idea.description}</Typography>
              {unlockList.length > 0 && (
                <>
                  <Typography>Permite la construcción de:</Typography>
                  {unlockList}
                </>
              )}
              {actionList}
            </>
          }
        >
          <Button>
            <img
              className="render big-render no-margin"
              src={this.props.graphics.renders[str].src}
            ></img>
          </Button>
        </Tooltip>
      );
    }
    return <>{imgList}</>;
  }

  render() {
    return <Box>{this.renderEntities()}</Box>;
  }
}

export default IdeaPanel;
