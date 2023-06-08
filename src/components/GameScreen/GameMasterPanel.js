import { Save } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
} from "@mui/material";
import React, { Component } from "react";

class GameMasterPanel extends Component {
  state = {};

  renderCivButtons() {
    let list = [];
    this.props.worldData.civilizations.map((value, index) =>
      list.push(
        <BottomNavigationAction
          key={index}
          onClick={() => this.props.onCivChange(index)}
          icon={
            <img
              src={this.props.graphics.renders[value.img].src}
              style={{ margin: 0 }}
            ></img>
          }
          label={value.name}
        ></BottomNavigationAction>
      )
    );
    return list;
  }

  downloadWorldData() {
    this.downloadObjectAsJson(this.props.worldData, "testWorldData");
  }

  downloadObjectAsJson(exportObj, exportName) {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  render() {
    return (
      <Box>
        <Button onClick={() => this.downloadWorldData()}>
          <Save></Save>
        </Button>
        <BottomNavigation value={this.props.civilization}>
          {this.renderCivButtons()}
        </BottomNavigation>
        <Button>Editor</Button>
      </Box>
    );
  }
}

export default GameMasterPanel;
