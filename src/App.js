import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./components/Editor/Editor";
import { createTheme, ThemeProvider } from "@mui/material";
import GamePanel from "./components/GamePanel/GamePanel";

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
            <Route path="/" element={<GamePanel></GamePanel>}></Route>
            <Route path="/editor" element={<Editor></Editor>}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
