import React, { Component } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import "./ControlPanel.css";
import ResourceList from "../ResourceList/ResourceList";
import Entity from "../Entity/Entity";
import Event from "../Event/Event";
/*
const THEME = createMuiTheme({
  palette: {
    type: "dark",
  },
});
*/
class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      menu: "state",
      civData: props.game.worldData.civilizations[props.currentCiv],
    };
    this.props.graphics.pixi.app.loader.load((loader, resources) => {
      console.log("Loaded");
      this.setState({ loaded: true });
    });
  }

  renderPersistentIncomes(civ) {
    const incomes = this.props.game.calculatePersistentIncome(civ);
    return (
      <ResourceList
        worldData={this.props.game.worldData}
        list={incomes}
        type={"big"}
        delta={true}
      />
    );
  }

  renderIncomes(civ) {
    const incomes = this.props.game.calculateIncome(civ);
    return (
      <ResourceList
        worldData={this.props.game.worldData}
        list={incomes}
        type={"big"}
        delta={true}
      />
    );
  }

  renderIncomeBreakdown(civ) {
    let itemList = [];
    const list = civ.state.instances;
    for (var i in list) {
      const income = this.props.game.calculateInstanceIncome(
        civ,
        list[i],
        true
      );
      if (Object.keys(income).length > 0) {
        itemList.push(
          <Entity
            key={i}
            civ={civ}
            instance={list[i]}
            worldData={this.props.game.worldData}
            income={income}
            delta={true}
          />
        );
      }
    }

    return itemList;
  }

  renderEntities(civ) {
    let imgList = [];
    for (let i in this.props.graphics.entityRenders) {
      imgList.push(<img src={this.props.graphics.entityRenders[i].src}></img>);
    }
    return <>{imgList}</>;
  }

  renderEvents(civ) {
    let itemList = [];
    const list = civ.state.events;
    for (var i in list) {
      itemList.push(
        <Event
          key={i}
          civ={civ}
          event={list[i]}
          worldData={this.props.game.worldData}
          delta={true}
        />
      );
    }

    return itemList;
  }

  onGraphicsFinished() {
    console.log("Control panel will now load");
    this.setState({ loaded: true });
  }

  render() {
    const civ = this.state.civData;

    if (!this.state.loaded) {
      return <></>;
    }

    return (
      <div id="control-panel">
        {/*<MuiThemeProvider theme={THEME}>*/}
        <Accordion>
          <AccordionSummary>
            <img src={civ.simbol} alt=""></img>
            <h1>{civ.name}</h1>
          </AccordionSummary>
          <AccordionDetails>
            <div className="block">
              <h2>{civ.state.title}</h2>
              <div className="scroller">
                <p>{civ.state.desc}</p>
              </div>
            </div>
            <ResourceList
              worldData={this.props.game.worldData}
              list={civ.state.resources}
              type={"big"}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <img src="./../../../img/icons/income.png" alt=""></img>
            <h1>Ingresos</h1>
          </AccordionSummary>
          <AccordionDetails>
            {this.renderPersistentIncomes(this.state.civData)}
            {this.renderIncomeBreakdown(this.state.civData)}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <img src="./../../../img/icons/events.png" alt=""></img>
            <h1>Entidades</h1>
          </AccordionSummary>
          <AccordionDetails>
            <div className="block">
              <div className="scroller">
                {this.renderEntities(this.state.civData)}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <img src="./../../../img/icons/events.png" alt=""></img>
            <h1>Eventos</h1>
          </AccordionSummary>
          <AccordionDetails>
            {this.renderEvents(this.state.civData)}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <img src="./../../../img/icons/orders.png" alt=""></img>
            <h1>Ordenes</h1>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        {/*</MuiThemeProvider>*/}
      </div>
    );
  }
}

export default ControlPanel;
