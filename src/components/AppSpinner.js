import React from 'react';
import {appTheme} from '../utils/Constants'

const lightStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: appTheme.primaryColor,
    opacity: '0.9',
    position: 'absolute',
    top: 0,
    left: 0,
}

const darkStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: appTheme.secondaryColor,
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
}

 class AppSpinner extends React.Component {
     constructor(props){
         super(props);
     }
     render () {
        return (
            <div style={{height:window.innerHeight,width:window.innerWidth,position:'absolute',top:0,left:0,backgroundColor:'#333',opacity:'0.6',position:"absolute",zIndex:98}}> 
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:this.props.scrHeight,width:window.screen.width}}>
            <div className="spinner" style={{position:'absolute',zIndex:99,width:'40px',height:'40px'}}>
                <div className="double-bounce1" style={this.props.spinColor  == "light" ? lightStyle:darkStyle}></div>
                <div className="double-bounce2"></div>
            </div>
            {this.props.showText && <div style={{ fontSize:'14px',position:'absolute',top:'55%',textAlign:'center',zIndex:99,color:this.props.spinColor  == "light" ? appTheme.primaryColor:appTheme.secondaryColor,fontWeight:900,width:'100%'}}>Loading Please Wait...</div>}
            

            </div>
            </div>
        )
     }
}



export default AppSpinner;