import React from 'react';


class Screenlist extends React.Component {

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
            Screenlist 
            </div>
            </React.Fragment>)
    }

    
}

export default Screenlist;