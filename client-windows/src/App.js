import React from 'react';
import logo from './logo.svg';
import CountryManager from './components/CountryManager';
import LoginScreen from './components/LoginScreen';

const { ipcRenderer } = window.require('electron');


function App() {
  return (
    <div className="App">
      <LoginScreen />
    </div>
  );
}

export default App;
