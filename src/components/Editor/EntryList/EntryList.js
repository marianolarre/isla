import { AddCircle, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Component } from "react";

/*
Required props:

entries: key pairs of objects to render on the list. These objects must have 'name' and 'img'
pixi: to use for processing the images
renders: to display the images
entryTemplate: object to be created when adding a new one
onSelect: when a key is pressed
onChange: when adding or removing an entry
civilization: the current civilization data
*/

class EntryList extends Component {
  state = {};

  renderEntryList() {
    let entityList = [];
    for (let i in this.props.entries) {
      const base = this.props.entries[i];
      const str = this.props.graphics.pixi.transformImgString(base.img, {
        primary_color: this.props.primaryColor,
      });
      const render = this.props.graphics.renders[str];
      const selected = this.props.value == i;
      entityList.push(
        <TableRow
          key={i}
          onClick={() => this.props.onSelect(i)}
          sx={selected ? { backgroundColor: "#555" } : {}}
        >
          <TableCell>
            <img
              className="render"
              src={render != null ? render.src : ""}
            ></img>
          </TableCell>
          <TableCell>
            <Typography>{"[" + i + "]"}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{base.name}</Typography>
          </TableCell>
          <TableCell>
            <IconButton color="error" onClick={() => this.props.onRemove(i)}>
              <Delete></Delete>
            </IconButton>
          </TableCell>
        </TableRow>
      );
    }
    return <>{entityList}</>;
  }

  render() {
    return (
      <Table size="small">
        <TableBody>
          {this.renderEntryList()}
          <TableRow>
            <TableCell colSpan={4}>
              <Tooltip title="Create new entry">
                <Button onClick={() => this.props.onAdd()} fullWidth>
                  <AddCircle></AddCircle>
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default EntryList;
