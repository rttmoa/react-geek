import React from 'react'
import Logo from './Home.png'

class index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{margin:'auto', padding: '120px'}}>
                <img src={Logo} alt=''/>
            </div>
        );
    }
}

export default index;