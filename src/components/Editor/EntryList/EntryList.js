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
      const str = this.props.pixi.transformImgString(base.img, {
        primary_color: this.props.primaryColor,
      });
      const render = this.props.renders[str];
      const selected = this.props.value == i;
      entityList.push(
        <ListItem
          key={i}
          secondaryAction={
            <IconButton color="error" onClick={() => this.props.onRemove(i)}>
              <Delete></Delete>
            </IconButton>
          }
        >
          <ListItemIcon></ListItemIcon>
          <ListItemButton
            selected={selected}
            disabled={selected}
            onClick={() => this.props.onSelect(i)}
            flex={1}
          >
            <img src={render != null ? render.src : ""}></img>
            <Typography>{"[" + i + "] " + base.name}</Typography>
          </ListItemButton>
        </ListItem>
      );
    }
    return <List dense={true}>{entityList}</List>;
  }

  render() {
    return (
      <Box>
        {this.renderEntryList()}
        <Tooltip title="Create new entry">
          <Button onClick={() => this.props.onAdd()}>
            <AddCircle></AddCircle>
          </Button>
        </Tooltip>
      </Box>
    );
  }
}

export default EntryList;
