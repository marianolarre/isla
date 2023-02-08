import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import "./ResourceRow.css";

function Delta(value) {
  if (value == 0) return <Typography display="inline">-</Typography>;
  if (value > 0)
    return (
      <>
        <Typography className="resource-positive">{value}</Typography>
        <Typography className="resource-positive">▲</Typography>
      </>
    );
  return (
    <>
      <Typography className="resource-negative">{value}</Typography>
      <Typography className="resource-negative">▼</Typography>
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
            <Tooltip
              title={<Typography>{resource.name}</Typography>}
              placement="left"
            >
              <img
                className="render small-render no-margin"
                src={this.props.graphics.renders[str].src}
              ></img>
            </Tooltip>
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
                    <Typography fontSize={"1.5rem"}>{resource.name}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Current:</Typography>
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
