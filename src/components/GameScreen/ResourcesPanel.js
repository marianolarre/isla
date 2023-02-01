import {
  IconButton,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { Component } from "react";
import ResourceRow from "./ResourceRow";
import "./ResourcesPanel.css";

// Receives worldData and currentCiv
class ResourcesPanel extends Component {
  state = {};

  renderRows(res) {
    let rowElements = [];
    for (let i in res) {
      rowElements.push(
        <ResourceRow
          key={i}
          resource={i}
          stored={res[i][0]}
          production={res[i][1]}
          consumption={res[i][2]}
          worldData={this.props.worldData}
          civilization={this.props.civilization}
          graphics={this.props.graphics}
        ></ResourceRow>
      );
    }
    return rowElements;
  }

  render() {
    const civ = this.props.worldData.civilizations[this.props.civilization];
    return (
      <Table size="small">
        <TableRow>
          <TableCell></TableCell>
          <TableCell align="center">
            <Typography>Resource</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography>Stored</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography>Prod.</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography>Cons.</Typography>
          </TableCell>
        </TableRow>
        {this.renderRows(civ.state.resources)}
      </Table>
    );
  }
}

export default ResourcesPanel;
