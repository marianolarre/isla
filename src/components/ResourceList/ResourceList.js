import React, { Component } from "react";
import Resource from "./../Resource/Resource.js";
import "./ResourceList.css";

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderList(worldData, list, type) {
    let listItems = [];
    for (var i in list) {
      listItems.push(
        <li key={i} className="inline">
          <Resource
            resource={worldData.resources[i]}
            amount={list[i]}
            type={type}
            delta={this.props.delta}
          />
        </li>
      );
    }
    return listItems;
  }

  render() {
    return (
      <ul className="resourcelist">
        {this.renderList(
          this.props.worldData,
          this.props.list,
          this.props.style,
          this.props.delta
        )}
      </ul>
    );
  }
}

export default ResourceList;
