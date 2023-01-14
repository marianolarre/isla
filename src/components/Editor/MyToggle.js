import React, { Component } from "react";
import { FormControlLabel, Switch, Icon } from "@mui/material";
import { blue } from "@mui/material/colors";

class MyToggle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormControlLabel
        label={this.props.label}
        labelPlacement="start"
        control={
          <>
            <Switch
              size="large"
              checked={this.props.checked}
              onChange={this.props.onChange}
            />
            {this.props.icon != null && (
              <Icon sx={{ margin: "10px" }}>{this.props.icon}</Icon>
            )}
          </>
        }
      ></FormControlLabel>
    );
  }
}

export default MyToggle;
