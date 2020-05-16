import React from 'react';
import Lottie from 'react-lottie';

import * as loadingAnimation from '../assets/animations/7546-loading.json'
import * as lockAnimation from '../assets/animations/lf30_editor_cJrV04.json'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

const { ipcRenderer } = window.require('electron');


class ConnectButton extends React.Component {

    constructor() {
        super();

        this.state = {
            waiting: false,
        }

        this.clickHandler = this.clickHandler.bind(this)
    }

    stopWaiting() {
        this.setState(() => {
            return {
                waiting: false
            }
        })
    }

    componentDidMount() {
        ipcRenderer.on('connected', () => this.stopWaiting())
        ipcRenderer.on('disconnected', () => this.stopWaiting())
        ipcRenderer.on('connection_error', () => this.stopWaiting())
    }

    clickHandler() {
        if (!this.props.active) {
            return
        }

        this.setState(() => {
            return {
                waiting: true
            }
        })

        this.props.clickHandler()
    }
    
    render() {

        const loadingOptions = {
            loop: true,
            autoplay: true,
            animationData: loadingAnimation.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
        };

        const lockOptions = {
            loop: false,
            autoplay: true,
            animationData: lockAnimation.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
        };

        let icon;

        if (this.state.waiting) {
            icon = <Lottie options={loadingOptions} height={75} width={75} />
        } else if (this.props.connected) {
            icon = <Lottie options={lockOptions} height={100} width={100} speed={2} />
        } else {
            icon = <Lottie options={lockOptions} height={100} width={100} direction={-1} />
        }

        return (
            <button onClick={() => this.clickHandler()} className={"connection-button " +
                                    ((this.props.active) ? 'active ' : 'inactive ') +
                                    ((this.props.connected) ? 'connected' : 'disconnected')}>
                {icon}                
            </button>
        )
    }
  }

  export default ConnectButton