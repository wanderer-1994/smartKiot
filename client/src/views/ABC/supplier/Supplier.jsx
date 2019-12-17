import React from "react";
import { connect } from "react-redux";

class Supplier extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render = () => {
        return (
            <div>Supplier</div>
        )
    }
}

function mapStateToProps(state){
    return {
        
    }
}

export default connect(mapStateToProps)(Supplier);