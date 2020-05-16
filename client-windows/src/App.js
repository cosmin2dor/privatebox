import React from 'react';
import logo from './logo.svg';
import CountryManager from './components/CountryManager';
import LoginScreen from './components/LoginScreen';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { Window, TitleBar, Text } from 'react-desktop/macOs';

const { ipcRenderer } = window.require('electron');

function closeHandler() {
  ipcRenderer.send('tray')
}

function App() {
  return (
    <div>
      <TitleBar title="SimpleVPN Client" controls onCloseClick={() => closeHandler()}/>
      <div className="App">
        <Router>
          <Route path="/login" component={LoginScreen} />
          <Route path="/main" component={CountryManager} />
        </Router>
      </div>
    </div>
  );
}

export default App;
