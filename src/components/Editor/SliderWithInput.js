import React, { Component } from "react";
import { Grid, Typography, Slider, Input, Box } from "@mui/material";

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
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <Typography id="input-slider" gutterBottom align="right">
              {this.props.label}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Slider
              marks={this.props.marks}
              value={
                typeof this.props.value === "number" ? this.props.value : 0
              }
              color="secondary"
              step={this.props.step}
              min={this.props.min}
              max={this.props.max}
              onChange={this.handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item xs={2}>
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
              sx={{ float: "left", width: "100%" }}
              endAdornment={this.props.unit}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default SliderWithInput;
