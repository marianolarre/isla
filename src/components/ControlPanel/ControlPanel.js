import React, { Component } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import "./ControlPanel.css";
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

  renderEntities(civ) {
    let imgList = [];
    for (let i in this.props.graphics.renders) {
      imgList.push(
        <img
          className="render"
          src={this.props.graphics.renders[i].src}
          style={{ width: "64px", height: "auto", textShadow: "0 0 4px white" }}
        ></img>
      );
    }
    return <>{imgList}</>;
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
            <img
              className="render"
              src={
                this.props.graphics.renders[civ.flag_img] == null
                  ? ""
                  : this.props.graphics.renders[civ.flag_img].src
              }
              alt=""
            ></img>
            <h1>{civ.name}</h1>
          </AccordionSummary>
          <AccordionDetails>
            <div className="block">
              <h2>{civ.state.title}</h2>
              <div className="scroller">
                <p>{civ.state.desc}</p>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <img src="./../../../img/icons/income.png" alt=""></img>
            <h1>Ingresos</h1>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
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
          <AccordionDetails></AccordionDetails>
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
