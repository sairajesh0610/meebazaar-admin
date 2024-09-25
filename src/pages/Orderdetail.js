import React from 'react';

class Orderdetail extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log(this.props.navProps.history.location.state)
    }

    render (){
        return (
        <React.Fragment>
            
            <div onClick={()=>{this.props.navProps.history.goBack()}}>
            Orderdetail
            </div>
            </React.Fragment>)
    }

    
}

export default Orderdetail;