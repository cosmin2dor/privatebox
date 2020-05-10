import React from 'react';
import flags from '../flags';
import countries from './countries';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBolt } from '@fortawesome/free-solid-svg-icons';

class AutoTab extends React.Component {

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
        return (
            <div className="auto-tab" onClick={() => {this.props.clickHandler(this.props.index)}}>
                <div className="flag">
                    <FontAwesomeIcon icon={faBolt}/>
                </div>
                <div className="name">
                    Fastest
                </div>
                <div className={ this.props.selected ? "check" : "check hidden"}>
                    <FontAwesomeIcon icon={faCheck}/>
                </div>
            </div>
        )
    }    
}

export default AutoTab