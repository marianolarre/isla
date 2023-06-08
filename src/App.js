import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./components/AdminMenus/EditorMenu/Editor";
import { createTheme, ThemeProvider } from "@mui/material";
import GamePanel from "./components/GameScreen/GamePanel";
import MainMenu from "./components/MainMenu";
import Draw from "./components/Draw/Draw";

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
            <Route path="/play" element={<GamePanel></GamePanel>}></Route>
            <Route path="/editor" element={<Editor></Editor>}></Route>
            <Route path="/draw" element={<Draw></Draw>}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
