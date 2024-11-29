import React from "react";
import "./App.css";
import ImageGenerator from "./ImageGenerator";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ImageGenerator />
      </header>
    </div>
  );
};

export default App;
