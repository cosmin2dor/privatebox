import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

class ConnectButton extends React.Component {
    
    render() {
        return (
            <button className={"connection-button " + ((this.props.active) ? 'active' : 'inactive')}>
                <FontAwesomeIcon icon={faPowerOff} style={{color: '#a5e9e1'}} />
            </button>
        )
    }
  }

  export default ConnectButton