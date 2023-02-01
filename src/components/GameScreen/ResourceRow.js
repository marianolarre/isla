import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { Component } from "react";

function Delta(value) {
  if (value == 0) return <Typography display="inline">-</Typography>;
  if (value > 0)
    return (
      <>
        <Typography display="inline" color={"#8f8"}>
          {value}
        </Typography>
        <Typography display="inline" color={"#8f8"}>
          ▲
        </Typography>
      </>
    );
  return (
    <>
      <Typography display="inline" color={"#f86"}>
        {value}
      </Typography>
      <Typography display="inline" color={"#f86"}>
        ▼
      </Typography>
    </>
  );
}

class ResourceRow extends Component {
  state = {
    open: false,
  };
  render() {
    const resource = this.props.worldData.resources[this.props.resource];
    const str = this.props.graphics.pixi.transformImgString(resource.img);
    return (
      <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => this.setState({ open: !this.state.open })}
            >
              {this.state.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="center">
            <img
              className="render small-render no-margin"
              src={this.props.graphics.renders[str].src}
            ></img>
            <Typography
              display="inline"
              style={{ marginLeft: "5px", position: "relative", bottom: "7px" }}
            >
              {resource.name}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Collapse in={!this.state.open}>
              <Typography>{this.props.stored}</Typography>
            </Collapse>
          </TableCell>
          <TableCell align="center">
            <Collapse in={!this.state.open}>
              {Delta(this.props.production)}
            </Collapse>
          </TableCell>
          <TableCell align="center">
            <Collapse in={!this.state.open}>
              {Delta(-this.props.consumption)}
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={this.state.open}>
              <Table size="small">
                <TableRow>
                  <TableCell>
                    <Typography>Stored:</Typography>
                  </TableCell>
                  <TableCell>{this.props.stored}</TableCell>
                </TableRow>
                {this.props.production > 0 && (
                  <TableRow>
                    <TableCell>
                      <Typography>Last turn's production:</Typography>
                    </TableCell>
                    <TableCell>{Delta(this.props.production)}</TableCell>
                  </TableRow>
                )}
                {this.props.consumption > 0 && (
                  <TableRow>
                    <TableCell>
                      <Typography>Last turn's consumption:</Typography>
                    </TableCell>
                    <TableCell>{Delta(-this.props.consumption)}</TableCell>
                  </TableRow>
                )}
                {this.props.production > 0 && this.props.consumption > 0 && (
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">
                        Last turn's total change:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {Delta(this.props.production - this.props.consumption)}
                    </TableCell>
                  </TableRow>
                )}
              </Table>
              <br></br>
              <Typography>Current producers:</Typography>
              <br></br>
              <Typography>Current consumers:</Typography>
              <br></br>
              <Typography>Potential producers:</Typography>
              <br></br>
              <Typography>Potential consumers:</Typography>
              <br></br>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}

export default ResourceRow;
