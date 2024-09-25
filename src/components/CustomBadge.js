import React from 'react';


class CustomBadge extends React.Component {

    constructor(props){
        super(props);
    }

   

    render (){
        
        return (
        
           
            <div style={
                Object.assign({},
                {
                    backgroundColor: this.props.bgColor,
                    opacity:0.5,
                    border: 'none',
                    color: this.props.txtColor,
                    padding: '4px 8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                     borderRadius: '8px'
                  },this.props.style)
            }>{this.props.inpText}</div>
            
            
            )
    }

    
}

export default CustomBadge;