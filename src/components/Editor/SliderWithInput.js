import React, { Component } from "react";
import {
  Grid,
  Typography,
  Slider,
  Input,
  Box,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

class SliderWithInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temporaryValue: null,
    };
  }

  handleSliderChange = (event, newValue) => {
    this.props.onChange(newValue);
  };

  handleInputChange = (event) => {
    if (event.target.value != "") {
      let number = Number(event.target.value);
      if (number <= this.props.max && number >= this.props.min) {
        this.setState({ temporaryValue: null });
        this.props.onChange(number);
      } else {
        this.setState({ temporaryValue: number });
      }
    }
  };

  handleIncrement = (change) => {
    this.props.onChange(this.props.value + change);
  };

  handleBlur = (event) => {
    if (event.target.value != "") {
      let number = Number(event.target.value);
      if (number > this.props.max) {
        number = this.props.max;
      }
      if (number < this.props.min) {
        number = this.props.min;
      }
      this.setState({ temporaryValue: null });
      this.props.onChange(number);
    }
  };

  render() {
    return (
      <Stack direction="row">
        <Typography
          id="input-slider"
          gutterBottom
          align="right"
          style={{ width: "100px" }}
        >
          {this.props.label}
        </Typography>
        <Slider
          flex={1}
          marks={this.props.marks}
          style={{ margin: "0 15px", maxWidth: "500px" }}
          value={typeof this.props.value === "number" ? this.props.value : 0}
          color="secondary"
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          onChange={this.handleSliderChange}
          aria-labelledby="input-slider"
        />
        <Input
          value={this.state.temporaryValue || this.props.value}
          size="small"
          onChange={this.handleInputChange}
          onBlur={this.handleBlur}
          inputProps={{
            step: this.props.step,
            min: this.props.min,
            max: this.props.max,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
          endAdornment={this.props.unit}
        />
        <IconButton
          style={{ width: "30px" }}
          onClick={() => this.handleIncrement(-1)}
        >
          <Remove></Remove>
        </IconButton>
        <IconButton
          style={{ width: "30px" }}
          onClick={() => this.handleIncrement(1)}
        >
          <Add></Add>
        </IconButton>
      </Stack>
    );
  }
}

export default SliderWithInput;
