import React, { Component } from "react";
import {
  colorPalette,
  IslandPIXI,
  teamColorGradient,
} from "../../classes/IslandPIXI";
import * as PIXI from "pixi.js";
import $ from "jquery";
import ColorPalette from "../Editor/ColorPalette/ColorPalette";
import PartPalette from "../Editor/PartPalette/PartPalette";
import SliderWithInput from "../Editor/SliderWithInput";
import MyToggle from "../Editor/MyToggle";
import {
  Grid,
  Button,
  CircularProgress,
  Stack,
  Box,
  Tooltip,
  Link,
  Typography,
} from "@mui/material";
import "./GraphicsEditor.css";
import {
  AddCircle,
  Delete,
  FileCopy,
  FlipToBack,
  FlipToFront,
  InsertLink,
  LinkOff,
} from "@mui/icons-material";

var clicking = false;
var startMousePos = { x: 0, y: 0 };
var startPartPos = { x: 0, y: 0 };

class GraphicsEditor extends Component {
  constructor(props) {
    super(props);
    this.lastValue = "";
    this.graphicData = this.props.graphics.pixi.deserializeFullString(
      this.props.value
    );
    this.state = {
      graphicString: this.props.value,
      currentImage: 0,
      linkedScale: true,
    };
  }

  componentDidMount() {
    if (this.props.graphics.pixi == null) {
      this.pixi = new IslandPIXI(this.props.options);
    } else {
      this.pixi = this.props.graphics.pixi;
    }
    this.preview = new PIXI.Container();
    if (this.props.scale != null) {
      this.pixi.app.stage.scale.set(this.props.scale, this.props.scale);
    }
    const background = new PIXI.Graphics();
    background.beginFill(0x86d369);
    background.drawRect(0, 0, 256, 256);
    background.endFill();
    background.lineStyle(1, 0x000000, 0.2);
    background.moveTo(128, 0);
    background.lineTo(128, 256);
    background.moveTo(0, 128);
    background.lineTo(256, 128);
    this.pixi.app.stage.addChild(background);
    this.preview.sortableChildren = true;
    this.pixi.app.stage.addChild(this.preview);

    this.pixi.app.loader.load((loader, resources) => {
      this.renderString(this.pixi.serializeSprite(this.props.value));
      this.graphicData = [];
      this.addNewPart();
      $(() => {
        console.log("Mounting");
        $("#" + this.props.containerId).append(this.pixi.app.view);
      });
    });

    background.interactive = true;
    background.on("mousedown", (e) => {
      this.mouseDownHandler(e);
    });
    background.on("mousemove", (e) => {
      this.mouseMoveHandler(e);
    });
    background.on("mouseup", (e) => {
      this.mouseUpHandler(e);
    });
    background.on("mouseupoutside", (e) => {
      this.mouseUpHandler(e);
    });
    /*$(document).on("wheel", (e) => {
      this.mouseWheelHandler(e);
    });*/
  }

  componentWillUnmount() {
    //$(document).off();
  }

  componentDidUpdate() {
    // After updating props.value, graphicData must also be updated.
    // We do this only if props.value changed, to prevent infinite loops
    if (this.newValue != this.props.value) {
      this.graphicData = this.pixi.deserializeFullString(this.props.value);
      this.newValue = this.props.value;
      this.forceUpdate();
      this.updateGraphic();
      if (this.state.currentImage >= this.graphicData.length) {
        this.setState({ currentImage: 0 });
      }
    }
    if (this.primaryColor != this.props.primaryColor) {
      this.primaryColor = this.props.primaryColor;
      this.updateGraphic();
    }
  }

  renderString(string) {
    const transformImgString = this.pixi.transformImgString(string, {
      primary_color: this.props.primaryColor,
    });
    this.preview.removeChildren();
    const container = this.pixi.imgStringToContainer(transformImgString);
    this.preview.addChild(container);
  }

  selectPart(index) {
    this.setState({ currentImage: index }, this.selectAnimation);
  }

  selectAnimation() {
    clearTimeout();
    this.flashColor(22);
    setTimeout(() => this.flashColor(42), 150);
    setTimeout(() => this.flashColor(22), 300);
    setTimeout(() => this.flashColor(42), 450);
    setTimeout(() => this.renderString(this.props.value), 600);
  }

  flashColor(colorId) {
    let previousColor = this.graphicData[this.state.currentImage].colorId;
    this.graphicData[this.state.currentImage].colorId = colorId;
    let animationString = this.pixi.serializeSprite(this.graphicData);
    this.renderString(animationString);
    this.graphicData[this.state.currentImage].colorId = previousColor;
  }

  addNewPart() {
    let parts = [...this.graphicData];
    parts.push({
      imageId: 0,
      colorId: this.props.disableSpecialColors ? 22 : 0,
      xPos: 32,
      yPos: 32,
      xScale: 16,
      yScale: 16,
      rotation: 0,
    });
    this.uploadNewPartList(parts, parts.length - 1);
  }

  duplicatePart() {
    let parts = [...this.graphicData];
    parts.push({ ...this.graphicData[this.state.currentImage] });
    this.uploadNewPartList(parts, parts.length - 1);
  }

  deletePart() {
    if (this.graphicData.length == 1) return;
    let parts = [...this.graphicData];
    parts.splice(this.state.currentImage, 1);
    this.uploadNewPartList(parts, this.state.currentImage);
  }

  moveBack() {
    if (this.state.currentImage == 0) return;
    let parts = [...this.graphicData];
    let temp = parts[this.state.currentImage];
    parts[this.state.currentImage] = parts[this.state.currentImage - 1];
    parts[this.state.currentImage - 1] = temp;
    this.uploadNewPartList(parts, this.state.currentImage - 1);
  }

  moveForward() {
    let parts = [...this.graphicData];
    if (this.state.currentImage == parts.length - 1) return;
    let temp = parts[this.state.currentImage];
    parts[this.state.currentImage] = parts[this.state.currentImage + 1];
    parts[this.state.currentImage + 1] = temp;
    this.uploadNewPartList(parts, this.state.currentImage + 1);
  }

  uploadNewPartList(parts, newSelected) {
    if (newSelected >= parts.length) {
      newSelected = parts.length - 1;
    }
    if (newSelected < 0) {
      newSelected = 0;
    }
    this.graphicData = parts;
    const newString = this.pixi.serializeSprite(parts);
    this.props.onChange(newString);
    this.setState({
      currentImage: newSelected,
    });
  }

  updateGraphic() {
    this.renderString(this.props.value);
  }

  mouseInsidePlayArea(x, y) {
    const rect = this.pixi.app.view.getBoundingClientRect();
    return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
  }

  mouseWheelHandler(event) {
    if (this.mouseInsidePlayArea(event.clientX, event.clientY)) {
      let part = this.graphicData[this.state.currentImage];
      const deltaY = event.originalEvent.deltaY / 100;
      part.xScale -= Math.round(deltaY);
      if (part.xScale < 0) part.xScale = 0;
      if (part.xScale > 63) part.xScale = 63;
      part.yScale -= Math.round(deltaY);
      if (part.yScale < 0) part.yScale = 0;
      if (part.yScale > 63) part.yScale = 63;

      this.props.onChange(this.pixi.serializeSprite(this.graphicData));
    }
  }

  mouseDownHandler(event) {
    clicking = true;
    startMousePos = {
      x: event.data.global.x,
      y: event.data.global.y,
    };
    const part = this.graphicData[this.state.currentImage];
    startPartPos = {
      x: part.xPos,
      y: part.yPos,
    };
  }

  mouseUpHandler(event) {
    clicking = false;

    let part = this.graphicData[this.state.currentPart];
    if (part == null) return;
    part.xPos = Math.floor(part.xPos);
    part.yPos = Math.floor(part.yPos);

    this.props.onChange(this.pixi.serializeSprite(this.graphicData));
  }

  mouseMoveHandler(event) {
    if (clicking) {
      let deltaX = event.data.global.x - startMousePos.x;
      let deltaY = event.data.global.y - startMousePos.y;

      let part = this.graphicData[this.state.currentImage];
      part.xPos = startPartPos.x + deltaX / 4 / this.props.scale;
      if (part.xPos < 0) part.xPos = 0;
      if (part.xPos > 63) part.xPos = 63;
      part.yPos = startPartPos.y + deltaY / 4 / this.props.scale;
      if (part.yPos < 0) part.yPos = 0;
      if (part.yPos > 63) part.yPos = 63;

      this.props.onChange(this.pixi.serializeSprite(this.graphicData));
    }
  }

  handleCodeChange(event) {
    let string = event.target.value;
    this.props.onChange(string);
  }

  handleToggle(variable) {
    this.graphicData[this.state.currentImage][variable] =
      !this.graphicData[this.state.currentImage][variable];
    this.props.onChange(this.pixi.serializeSprite(this.graphicData));
  }

  handleChange(newValue, variable) {
    this.graphicData[this.state.currentImage][variable] = newValue;
    this.props.onChange(this.pixi.serializeSprite(this.graphicData));
  }

  handleScaleChange(newValue, variable) {
    const limit = (value) => {
      const max = 63;
      const min = 0;
      return Math.max(Math.min(value, max), min);
    };
    const otherVariable = variable == "xScale" ? "yScale" : "xScale";
    if (this.state.linkedScale) {
      const delta =
        newValue - this.graphicData[this.state.currentImage][variable];
      this.graphicData[this.state.currentImage][variable] = limit(
        this.graphicData[this.state.currentImage][variable] + delta
      );
      this.graphicData[this.state.currentImage][otherVariable] = limit(
        this.graphicData[this.state.currentImage][otherVariable] + delta
      );
    } else {
      this.graphicData[this.state.currentImage][variable] = newValue;
    }
    this.props.onChange(this.pixi.serializeSprite(this.graphicData));
  }

  renderPartButtons() {
    let partList = [];
    this.graphicData.map((value, index) => {
      const src =
        this.pixi.spriteRenders[this.graphicData[index].imageId] != null
          ? this.pixi.spriteRenders[this.graphicData[index].imageId].src
          : "";
      partList.push(
        <button
          key={index}
          className="part-selection-button"
          onClick={() => this.selectPart(index)}
          style={{
            borderColor:
              index == this.state.currentImage ? "#FFFFFF" : "#000000",
          }}
        >
          <img src={src} className="part-selection-outline" />
          <div
            className="part-selection-image"
            style={{
              background: this.getColorFromID(this.graphicData[index].colorId),
              WebkitMaskImage: "url(" + src + ")",
              maskImage: "url(" + src + ")",
            }}
          />
        </button>
      );
    });
    partList.push(
      <Tooltip title="Create new part" key={-1}>
        <Button onClick={() => this.addNewPart()}>
          <AddCircle></AddCircle>
        </Button>
      </Tooltip>
    );
    return partList;
  }

  getColorFromID(colorId) {
    if (colorId > 0) {
      return "#" + colorPalette[colorId];
    } else {
      return teamColorGradient;
    }
  }

  toggleLinkedScale() {
    this.setState({ linkedScale: !this.state.linkedScale });
  }

  render() {
    if (this.pixi == null) {
      return <CircularProgress />;
    }
    if (this.graphicData[this.state.currentImage] == null) {
      return <CircularProgress />;
    }
    return (
      <Box>
        <Box display="flex" flex={1} padding={2}>
          <label style={{ marginRight: "10px" }}>Code:</label>
          <input
            label="String"
            className="string-display"
            value={this.props.value}
            onChange={(e) => this.handleCodeChange(e)}
            style={{ flex: 1 }}
          />
        </Box>

        <Stack direction="row">
          <Box flex={1}>
            <Grid container>
              {this.pixi != null && this.renderPartButtons()}
            </Grid>
            <Tooltip title="Move back">
              <Button onClick={() => this.moveBack()}>
                <FlipToBack></FlipToBack>
              </Button>
            </Tooltip>
            <Tooltip title="Move forward">
              <Button onClick={() => this.moveForward()}>
                <FlipToFront></FlipToFront>
              </Button>
            </Tooltip>
            <Tooltip title="Duplicate">
              <Button onClick={() => this.duplicatePart()}>
                <FileCopy></FileCopy>
              </Button>
            </Tooltip>
            <Tooltip title="Delete part">
              <span>
                <Button
                  onClick={() => this.deletePart()}
                  disabled={this.graphicData.length <= 1}
                  color="error"
                  style={{ float: "right" }}
                >
                  <Delete></Delete>
                </Button>
              </span>
            </Tooltip>
            <br></br>
            <Box style={{ display: "flex", justifyContent: "left" }}>
              <MyToggle
                label="Mirrored"
                value={this.graphicData[this.state.currentImage].mirrored}
                onChange={() => this.handleToggle("mirrored")}
              ></MyToggle>
            </Box>
            <SliderWithInput
              label="X Pos"
              value={this.graphicData[this.state.currentImage].xPos}
              onChange={(e) => this.handleChange(e, "xPos")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>

            <SliderWithInput
              label="Y Pos"
              value={this.graphicData[this.state.currentImage].yPos}
              onChange={(e) => this.handleChange(e, "yPos")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>
            <SliderWithInput
              label="Rotation"
              value={this.graphicData[this.state.currentImage].rotation}
              onChange={(e) => this.handleChange(e, "rotation")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>
            <Stack direction="row">
              <Box flex={1}>
                <SliderWithInput
                  label="X Scale"
                  value={this.graphicData[this.state.currentImage].xScale}
                  onChange={(e) => this.handleScaleChange(e, "xScale")}
                  min={0}
                  max={63}
                  step={1}
                ></SliderWithInput>
                <SliderWithInput
                  label="Y Scale"
                  value={this.graphicData[this.state.currentImage].yScale}
                  onChange={(e) => this.handleScaleChange(e, "yScale")}
                  min={0}
                  max={63}
                  step={1}
                ></SliderWithInput>
              </Box>
              <Box style={{ display: "flex", textAlign: "left" }}>
                <Tooltip
                  title={
                    "Linked scaling " + (this.state.linkedScale ? "on" : "off")
                  }
                >
                  <Button onClick={() => this.toggleLinkedScale()}>
                    {(this.state.linkedScale && <InsertLink></InsertLink>) || (
                      <LinkOff></LinkOff>
                    )}
                  </Button>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Box id={this.props.containerId}></Box>
            <Typography>Click and drag to move part</Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <Box flex={2}>
            <PartPalette
              images={this.pixi.spriteRenders}
              value={this.graphicData[this.state.currentImage].imageId}
              onChange={(e) => this.handleChange(e, "imageId")}
            ></PartPalette>
          </Box>
          <Box flex={1}>
            <ColorPalette
              value={this.graphicData[this.state.currentImage].colorId}
              onChange={(e) => this.handleChange(e, "colorId")}
              disableSpecialColors={this.props.disableSpecialColors}
            ></ColorPalette>
          </Box>
        </Stack>
      </Box>
    );
  }
}

export default GraphicsEditor;
