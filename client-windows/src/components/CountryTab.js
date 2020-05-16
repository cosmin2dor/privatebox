import React from 'react';
import flags from '../flags';
import countries from './countries';
import Lottie from 'react-lottie';

import * as animationData from '../assets/animations/433-checked-done.json'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons';

class CountryTab extends React.Component {

    constructor() {
        super()
        this.state = {
            selected: false
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState((prevState) => {
            return {
                selected: !prevState.selected
            }
        })
    }
    
    render() {
        let countryData = countries[this.props.name]
        const defaultOptions = {
            loop: false,
            autoplay: false,
            animationData: animationData.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
        };
    
        return (
            <div className="tab" onClick={() => {this.props.clickHandler(this.props.index)}}>
                <div className="flag">
                    <img src={flags[countryData.flag]} alt="flag"/>
                </div>
                <div className="name">
                    {countryData.name}
                </div>
                <div className={ this.props.selected ? "check" : "check hidden"}>
                    {/* <FontAwesomeIcon icon={faCheck}/> */}
                    <Lottie isStopped={!this.props.selected} options={defaultOptions} speed={1.5} height={75} width={75} />
                </div>
            </div>
        )
    }    
}

export default CountryTab