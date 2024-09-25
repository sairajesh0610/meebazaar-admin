import React from 'react';


class Notifications extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log(this.props)
    }

    render (){
        return (
        
            
            <div>
            Notifications
            </div>
            )
    }

    
}

export default Notifications;