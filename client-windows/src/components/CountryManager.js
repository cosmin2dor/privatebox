import React from 'react';
import CountryTab from './CountryTab';
import ConnectButton from './ConnectButton';
import AutoTab from './AutoTab';

class CountryManager extends React.Component {
    constructor() {
        super();
        this.supportedCountires = [
            'NLD',
            'USA',
            'AUS',
            'JPN',
        ]
        this.state = {
            tabSelected: -1,
            buttonActive: false,
        }
        this.clickHandler = this.clickHandler.bind(this)
    }

    clickHandler(index) {
        this.setState(() => {
            return {
                tabSelected: index,
                buttonActive: true,
            };
        })
    }

    render() {
        const countries = []

        for (const [index, value] of this.supportedCountires.entries()) {
            const selected = (index === this.state.tabSelected) ? true : false
            countries.push(<CountryTab key={index} index={index} name={value} selected={selected} clickHandler={this.clickHandler} />)
        }

        return (
            <div>
                {countries}
                <AutoTab index={countries.length} clickHandler={this.clickHandler} />
                <ConnectButton active={this.state.buttonActive} />
            </div>
        )
    }
}

export default CountryManager