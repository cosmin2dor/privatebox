import React from 'react';
import logo from './logo.svg';
import './App.css';
import CountryManager from './components/CountryManager';

const { ipcRenderer } = window.require('electron');


function quit() {
  ipcRenderer.send('quit');
}


function App2() {
  return (
    <div className="App">
      <div className="container">
        <img src={logo} className="App-logo" alt="logo" />
        <CountryManager />
      </div>
    </div>
  );
}

export default App2;
