import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { partPages } from "../../../classes/IslandPIXI";
import React, { Component } from "react";
import "./PartPalette.css";
import { Extension } from "@mui/icons-material";

class PartPalette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  renderPartPage(page) {
    let imgList = [];
    for (let i = page * 64; i < page * 64 + 64; i++) {
      if (this.props.images[i] != null) {
        imgList.push(
          <button
            key={i}
            onClick={() => this.props.onChange(i)}
            className="part-button"
            style={{
              borderColor: i == this.props.value ? "#FFFFFF" : "#000000",
            }}
          >
            <img src={this.props.images[i].src}></img>
          </button>
        );
      }
    }
    return imgList;
  }

  handlePageChange(newPage) {
    this.setState({ page: newPage });
  }

  render() {
    let pageList = [];
    for (let i in partPages) {
      pageList.push(
        <BottomNavigationAction
          key={i}
          icon={partPages[i].icon}
          label={partPages[i].name}
        ></BottomNavigationAction>
      );
    }

    return (
      <>
        <BottomNavigation
          value={this.state.page}
          onChange={(e, newValue) => this.handlePageChange(newValue)}
        >
          {pageList}
        </BottomNavigation>
        {this.renderPartPage(this.state.page)}
      </>
    );
  }
}

export default PartPalette;
