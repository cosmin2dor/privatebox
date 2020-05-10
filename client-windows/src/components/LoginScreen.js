import React from "react";
import './Login.css';

const { ipcRenderer } = window.require('electron');

class LoginScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            "valid": true
        }

        this.handleClickSignIn = this.handleClickSignIn.bind(this)
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
        
        this.setState(() => {
            return {
                "valid": this.validate(value)
            }
        })
    }

    // TODO Maybe we should improve this validation
    validate(value) {
        if (value.length == 10) {
            return true
        } else {
            return false
        }
    }

    render() {
        return (
            <div className="container">
                <h1>Unique Code:</h1>
                <input className={this.state.valid ? "valid" : "invalid"} placeholder="0000-0000-0000-0000" onChange={(e) => this.handleUniqueCodeChange(e.target.value)}></input>
                <button onClick={this.handleClickSignIn}>Sign In</button>
            </div>
        )
    }
}

export default LoginScreen