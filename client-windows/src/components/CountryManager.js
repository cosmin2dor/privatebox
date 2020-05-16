import React from 'react';
import CountryTab from './CountryTab';
import ConnectButton from './ConnectButton';
import AutoTab from './AutoTab';

const { ipcRenderer } = window.require('electron');

class CountryManager extends React.Component {
    constructor() {
        super();

        this.state = {
            tabSelected: -1,
            buttonActive: false,
            connected: false,
            countries: []
        }

        this.clickHandler = this.clickHandler.bind(this)
        this.connectButtonHandler = this.connectButtonHandler.bind(this)
    }

    async componentDidMount() {
        ipcRenderer.on('get_locations_result', (event, result) => {
            if (result != 'failed') {
                this.setState({countries: result})
            }
        })

        ipcRenderer.on('connected', () => {
            this.setState(() => {
                return {
                    connected: true,
                    buttonActive: true
                }
            })
        })

        ipcRenderer.on('connection_error', () => {
            this.setState(() => {
                return {
                    connected: false,
                    buttonActive: true
                }
            })
        })

        ipcRenderer.on('disconnected', () => {
            this.setState(() => {
                return {
                    connected: false,
                    buttonActive: true
                }
            })
        })

        ipcRenderer.send('get_locations_request')
    }

    clickHandler(index) {
        this.setState(() => {
            return {
                tabSelected: index,
                buttonActive: true,
            };
        })
    }

    connectButtonHandler() {
        if (!this.state.buttonActive) {
            return
        }

        if (!this.state.connected) {
            let selected_country = this.state.countries[this.state.tabSelected]
            console.log(selected_country)

            ipcRenderer.send('connect', selected_country)
        } else {
            ipcRenderer.send('disconnect')
        }

        this.setState(() => {
            return {
                buttonActive: false,
            };
        })
    }

    render() {
        const countries = []

        for (const [index, value] of this.state.countries.entries()) {
            const selected = (index === this.state.tabSelected) ? true : false
            countries.push(<CountryTab key={index} index={index} name={value} selected={selected} clickHandler={this.clickHandler} />)
        }

        return (
            <div className="container-main">
                {countries}
                {/* <AutoTab index={countries.length} clickHandler={this.clickHandler} /> */}
                <ConnectButton connected={this.state.connected} active={this.state.buttonActive} clickHandler={this.connectButtonHandler} />
            </div>
        )
    }
}

export default CountryManager