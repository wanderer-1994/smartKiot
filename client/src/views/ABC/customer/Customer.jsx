import React from "react";
import { connect } from "react-redux";

class Customer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render = () => {
        return (
            <div>Customer</div>
        )
    }
}

function mapStateToProps(state){
    return {
        
    }
}

export default connect(mapStateToProps)(Customer);