import React from "react";
import logo from '../logo.svg';
import { Redirect } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');
const log = window.require("electron-log");

class LoginScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            "valid": true,
            "loggedIn": false,
        }

        this.handleClickSignIn = this.handleClickSignIn.bind(this)
    }

    componentDidMount() {
        ipcRenderer.on('loginResult', (event, result) => {
            log.debug("Got the result: " + result)

            if (result === 'ok') {
                this.setState((prevState) => {
                    return {
                        "valid": prevState.valid,
                        "loggedIn": true
                    }
                })
            }
        })
    }

    handleClickSignIn() {
        if (this.state.valid) {
            ipcRenderer.send('login', this.uniqueCode)
        } else {
            console.log("Couldn't send, no valid value.")
        }
    }

    handleUniqueCodeChange(value) {
        this.uniqueCode = value
        
        this.setState((prevState) => {
            return {
                "valid": this.validate(value),
                "loggedIn": prevState.loggedIn
            }
        })
    }

    // TODO Maybe we should improve this validation
    validate(value) {
        if (value.length == 16) {
            return true
        } else {
            return false
        }
    }

    render() {
        if (this.state.loggedIn) {
            return <Redirect to='/main' />
        }

        return (
            <div className="container-login">
                <img src={logo} className="logo" />
                <h1>Unique Code:</h1>
                <input className={this.state.valid ? "valid" : "invalid"} onChange={(e) => this.handleUniqueCodeChange(e.target.value)}></input>
                <button className="button-1" onClick={this.handleClickSignIn}>Sign In</button>
            </div>
        )
    }
}

export default LoginScreen