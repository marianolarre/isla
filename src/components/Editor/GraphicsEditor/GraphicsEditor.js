import React, { Component } from "react";
import { colorPalette, IslandPIXI } from "../../../classes/IslandPIXI";
import * as PIXI from "pixi.js";
import $ from "jquery";
import ColorPalette from "../ColorPalette/ColorPalette";
import PartPalette from "../PartPalette/PartPalette";
import SliderWithInput from "../SliderWithInput";
import { Grid, Button, Typography } from "@mui/material";
import "./GraphicsEditor.css";

var clicking = false;
var previousMousePos = { x: 0, y: 0 };

class GraphicsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphicData: [],
      graphicString: "",
      currentImage: 0,
    };
  }

  componentDidMount() {
    this.pixi = new IslandPIXI(this.props.options);

    this.preview = new PIXI.Container();
    this.preview.sortableChildren = true;
    this.pixi.app.stage.addChild(this.preview);
    $("#" + this.props.containerId).append(this.pixi.app.view);
    this.pixi.app.loader.load((loader, resources) => {
      this.renderString(this.pixi.serializeSprite(this.state.graphicString));
      this.forceUpdate();
    });

    document.addEventListener(
      "mousewheel",
      (e) => {
        this.mouseWheelHandler(e);
      },
      false
    );
    document.addEventListener(
      "mousedown",
      (e) => {
        this.mouseDownHandler(e);
      },
      false
    );
    document.addEventListener(
      "mouseup",
      (e) => {
        this.mouseUpHandler(e);
      },
      false
    );
    document.addEventListener(
      "mousemove",
      (e) => {
        this.mouseMoveHandler(e);
      },
      false
    );
  }

  renderString(string) {
    this.preview.removeChildren();
    const container = this.pixi.imgStringToContainer(string);
    this.preview.addChild(container);
  }

  selectPart(index) {
    this.setState({ currentImage: index });
  }

  addNewPart() {
    let parts = [...this.state.graphicData];
    parts.push({
      imageId: 0,
      colorId: 5,
      xPos: 32,
      yPos: 32,
      xScale: 32,
      yScale: 32,
      rotation: 0,
      flags: 0,
    });
    this.uploadNewPartList(parts, parts.length - 1);
  }

  duplicatePart() {
    let parts = [...this.state.graphicData];
    parts.push({ ...this.state.graphicData[this.state.currentImage] });
    this.uploadNewPartList(parts, parts.length - 1);
  }

  deletePart() {
    let parts = [...this.state.graphicData];
    parts.splice(this.state.currentImage, 1);
    this.uploadNewPartList(parts, this.state.currentImage);
  }

  moveBack() {
    let parts = [...this.state.graphicData];
    if (this.state.currentImage == 0) return;
    let temp = parts[this.state.currentImage];
    parts[this.state.currentImage] = parts[this.state.currentImage - 1];
    parts[this.state.currentImage - 1] = temp;
    this.uploadNewPartList(parts, this.state.currentImage - 1);
  }

  moveForward() {
    let parts = [...this.state.graphicData];
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
    this.setState(
      {
        graphicData: parts,
        graphicString: this.pixi.serializeSprite(parts),
        currentImage: newSelected,
      },
      this.updateGraphic
    );
  }

  updateGraphic() {
    this.renderString(this.state.graphicString);
  }

  mouseInsidePlayArea(x, y) {
    const rect = this.pixi.app.view.getBoundingClientRect();
    return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
  }

  mouseWheelHandler(event) {
    if (this.mouseInsidePlayArea(event.clientX, event.clientY)) {
      const newGraphicData = [...this.state.graphicData];
      let part = newGraphicData[this.state.currentImage];
      part.xScale -= Math.round(event.deltaY / 100);
      if (part.xScale < 0) part.xScale = 0;
      if (part.xScale > 63) part.xScale = 63;
      part.yScale -= Math.round(event.deltaY / 100);
      if (part.yScale < 0) part.yScale = 0;
      if (part.yScale > 63) part.yScale = 63;

      this.setState(
        {
          graphicData: newGraphicData,
          graphicString: this.pixi.serializeSprite(newGraphicData),
        },
        this.updateGraphic
      );
    }
  }

  mouseDownHandler(event) {
    if (this.mouseInsidePlayArea(event.clientX, event.clientY)) {
      clicking = true;
      previousMousePos = { x: event.clientX, y: event.clientY };
    }
  }

  mouseUpHandler(event) {
    clicking = false;

    const newGraphicData = [...this.state.graphicData];
    let part = newGraphicData[this.state.currentImage];
    if (part == null) return;
    part.xPos = Math.floor(part.xPos);
    part.yPos = Math.floor(part.yPos);

    this.setState(
      {
        graphicData: newGraphicData,
        graphicString: this.pixi.serializeSprite(newGraphicData),
      },
      this.updateGraphic
    );
  }

  mouseMoveHandler(event) {
    const { gameView } = this;
    if (clicking) {
      let deltaX = event.clientX - previousMousePos.x;
      let deltaY = event.clientY - previousMousePos.y;
      previousMousePos = { x: event.clientX, y: event.clientY };

      const newGraphicData = [...this.state.graphicData];
      let part = newGraphicData[this.state.currentImage];
      part.xPos += deltaX / 4;
      if (part.xPos < 0) part.xPos = 0;
      if (part.xPos > 63) part.xPos = 63;
      part.yPos += deltaY / 4;
      if (part.yPos < 0) part.yPos = 0;
      if (part.yPos > 63) part.yPos = 63;

      this.setState(
        {
          graphicData: newGraphicData,
          graphicString: this.pixi.serializeSprite(newGraphicData),
        },
        this.updateGraphic
      );
    }
  }

  handleCodeChange(event) {
    let string = event.target.value;
    this.setState(
      {
        graphicString: string,
        graphicData: this.pixi.deserializeFullString(string),
      },
      this.updateGraphic
    );
  }

  handleChange(newValue, variable) {
    const newGraphicData = [...this.state.graphicData];
    newGraphicData[this.state.currentImage][variable] = newValue;
    this.setState(
      {
        graphicData: newGraphicData,
        graphicString: this.pixi.serializeSprite(newGraphicData),
      },
      this.updateGraphic
    );
  }

  render() {
    if (this.pixi == null) {
      return <></>;
    }
    return (
      <>
        <br></br>
        <Typography>Parts</Typography>
        <br></br>
        <input
          className="string-display"
          value={this.state.graphicString}
          onChange={(e) => this.handleCodeChange(e)}
        />
        <Grid container>
          <Grid item xs={12}>
            <Button onClick={() => this.addNewPart()} fullWidth>
              +
            </Button>
          </Grid>
          {this.pixi != null &&
            this.state.graphicData.map((value, index) => (
              <button
                key={index}
                className="part-selection-button"
                onClick={() => this.selectPart(index)}
                style={{
                  backgroundColor:
                    "#" + colorPalette[this.state.graphicData[index].colorId],
                  borderColor:
                    index == this.state.currentImage ? "#FFFFFF" : "#000000",
                }}
              >
                <img
                  src={
                    this.pixi.spriteRenders[
                      this.state.graphicData[index].imageId
                    ].src
                  }
                ></img>
              </button>
            ))}
        </Grid>

        {this.state.graphicData.length > 0 && (
          <div>
            <h2>Part settings</h2>
            <br></br>
            <Button onClick={() => this.moveBack()}>Move Back</Button>
            <Button onClick={() => this.moveForward()}>Move Forward</Button>
            <Button onClick={() => this.duplicatePart()}>Duplicate</Button>
            <Button
              onClick={() => this.deletePart()}
              color="secondary"
              style={{ float: "right" }}
            >
              Delete
            </Button>
            <br></br>
            <PartPalette
              images={this.pixi.spriteRenders}
              value={this.state.graphicData[this.state.currentImage].imageId}
              onChange={(e) => this.handleChange(e, "imageId")}
            ></PartPalette>
            <ColorPalette
              value={this.state.graphicData[this.state.currentImage].colorId}
              onChange={(e) => this.handleChange(e, "colorId")}
            ></ColorPalette>
            <SliderWithInput
              label="X Pos"
              value={this.state.graphicData[this.state.currentImage].xPos}
              onChange={(e) => this.handleChange(e, "xPos")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>
            <SliderWithInput
              label="Y Pos"
              value={this.state.graphicData[this.state.currentImage].yPos}
              onChange={(e) => this.handleChange(e, "yPos")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>
            <SliderWithInput
              label="X Scale"
              value={this.state.graphicData[this.state.currentImage].xScale}
              onChange={(e) => this.handleChange(e, "xScale")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>
            <SliderWithInput
              label="Y Scale"
              value={this.state.graphicData[this.state.currentImage].yScale}
              onChange={(e) => this.handleChange(e, "yScale")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>
            <SliderWithInput
              label="Rotation"
              value={this.state.graphicData[this.state.currentImage].rotation}
              onChange={(e) => this.handleChange(e, "rotation")}
              min={0}
              max={63}
              step={1}
            ></SliderWithInput>
          </div>
        )}
      </>
    );
  }
}

export default GraphicsEditor;
