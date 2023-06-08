import { Box, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import "./OrderPanel.css";
import PrettyButton from "../Containers/PrettyButton";

class OrderPanel extends Component {
  state = {};

  renderOrders() {
    const civ = this.props.gameData.civilizations[this.props.civilization];
    const options = {
      primary_color: civ.primary_color,
    };

    let buttonList = [];

    for (let i in civ.state.orders) {
      const order = civ.state.orders[i];
      buttonList.push(
        <PrettyButton>
          <Stack direction="row">
            <img
              class="render"
              style={{ padding: "5px", paddingRight: "15px" }}
              src="img/order.png"
            ></img>
            <Stack>
              <Typography fontStyle="italic">{order.description}</Typography>
            </Stack>
          </Stack>
        </PrettyButton>
      );
    }

    /*let imgList = [];
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
          <IdeaTooltip
            sx={{ backgroundColor: "#0000" }}
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
            <Button
              variant="filled"
              className="pretty-button"
              sx={{
                backgroundColor: "#418A5Eff",
                marginBottom: "5px",
                paddingTop: "10px",
                width: "auto",
                margin: "5px",
              }}
            >
              <Box className="pretty-button-box">
                <img
                  src={this.props.graphics.renders[unlockstr].src}
                  className="render no-margin"
                ></img>
              </Box>
            </Button>
          </IdeaTooltip>
        );
      }

      let actionList = [];
      for (let a in idea.actions) {
        actionList.push(
          <Box className="action-container">
            <PrettyButton key={a} fullWidth>
              <ResourceDisplay
                resourceData={this.props.worldData.resources}
                graphics={this.props.graphics}
                value={idea.actions[a]}
              ></ResourceDisplay>
            </PrettyButton>
          </Box>
        );
      }

      imgList.push(
        <IdeaTooltip
          className="invisible-tooltip"
          key={i}
          enterDelay={400}
          title={
            <PrettyBox>
              <Typography sx={{ fontSize: "1.2rem" }}>{idea.name}</Typography>
              <Typography>{idea.description}</Typography>
              {actionList.length > 0 && (
                <>
                  <Typography>Permite las siguientes acciones:</Typography>
                  <Stack spacing={1}>{actionList}</Stack>
                </>
              )}
              {unlockList.length > 0 && (
                <>
                  <Typography>Permite la construcción de:</Typography>
                  {unlockList}
                </>
              )}
            </PrettyBox>
          }
        >
          <Button>
            <img
              className="render big-render no-margin"
              src={this.props.graphics.renders[str].src}
            ></img>
          </Button>
        </IdeaTooltip>
      );
    }*/
    return <Stack spacing={1}>{buttonList}</Stack>;
  }

  render() {
    return <Box>{this.renderOrders()}</Box>;
  }
}

export default OrderPanel;
