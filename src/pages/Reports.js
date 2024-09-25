import React from 'react';

class Reports extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log(this.props)
    }

    render (){
        return (
        <React.Fragment>
            
            <div>
            Reports
            </div>
            </React.Fragment>)
    }

    
}

export default Reports;