import React from "react";
import { connect } from "react-redux";

class Staff extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render = () => {
        return (
            <div>Staff</div>
        )
    }
}

function mapStateToProps(state){
    return {
        
    }
}

export default connect(mapStateToProps)(Staff);