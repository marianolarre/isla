import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./components/Editor/Editor";
import { createTheme, ThemeProvider } from "@mui/material";
import GamePanel from "./components/GamePanel/GamePanel";
import worldData from "./data/worldData.json";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<GamePanel worldData={worldData}></GamePanel>}
            ></Route>
            <Route
              path="/editor"
              element={<Editor worldData={worldData}></Editor>}
            ></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
