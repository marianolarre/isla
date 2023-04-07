import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./components/AdminMenus/EditorMenu/Editor";
import { createTheme, ThemeProvider } from "@mui/material";
import GamePanel from "./components/GameScreen/GamePanel";
import worldData from "./data/worldData.json";
import MainMenu from "./components/MainMenu";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

class App extends Component {
  handleWorldDataChange(newValue) {
    worldData = newValue;
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="" element={<MainMenu></MainMenu>}></Route>
            <Route
              path="/play"
              element={
                <GamePanel
                  worldData={worldData}
                  onChange={(e) => this.handleWorldDataChange(e)}
                ></GamePanel>
              }
            ></Route>
            <Route
              path="/editor"
              element={
                <Editor
                  worldData={worldData}
                  onChange={(e) => this.handleWorldDataChange(e)}
                ></Editor>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
