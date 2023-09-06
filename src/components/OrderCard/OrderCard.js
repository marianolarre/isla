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

  render() {
    //const civ = this.props.worldData.civilizations[this.props.civilization];

    return (
      <PrettyBox className="pretty-box-container-white">
        <Box className="card-header">
          <Typography className="description">
            {this.props.order.description}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <PrettyButton onClick={() => this.props.onMove(this.props.pointer)}>
            Mover
          </PrettyButton>
          <PrettyButton
            onClick={() => this.props.onDuplicate(this.props.pointer)}
          >
            Duplicar
          </PrettyButton>
          <PrettyButton onClick={() => this.props.onDelete(this.props.pointer)}>
            Borrar
          </PrettyButton>
        </Stack>
      </PrettyBox>
    );
  }
}

export default OrderCard;
