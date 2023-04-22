import { Forward } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { isEmptyObject } from "jquery";
import React, { Component } from "react";
import PrettyBox from "../Containers/PrettyBox";
import PrettyButton from "../Containers/PrettyButton";
import ResourceDisplay from "../ResourceDisplay/ResourceDisplay";
import "./OrderCard.css";

class OrderCard extends Component {
  state = {};

  renderBuildOrder() {
    return (
      <>
        <Box className="card-header">
          <Typography className="card-title">
            {"Build " +
              this.props.worldData.bases[this.props.order.data.entity].name}
          </Typography>
        </Box>
        <Stack direction="row" spacing={4}>
          <Stack className="vertical-center">
            <Box sx={{ maxWidth: "200px" }}>
              <Typography className="description">
                {this.props.order.data.notes}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </>
    );
  }

  render() {
    //const civ = this.props.worldData.civilizations[this.props.civilization];

    return (
      <PrettyBox>
        {this.props.order.data.type == "build" && this.renderBuildOrder()}
      </PrettyBox>
    );
  }
}

export default OrderCard;
