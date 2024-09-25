import React from 'react';
import logo from  "../assets/marvijlogo.png";
import {Menubar} from 'primereact/menubar';
import {connect} from 'react-redux';
import { appTheme } from '../utils/Constants';
import {appStore} from '../App';
import userProfile from '../utils/Userprofile';
import { Tooltip } from 'primereact/tooltip';
import {Button} from 'primereact/button';


class Navbar extends React.Component {
 

  constructor(props){
      super(props);
      this.state = {
        selScreen:'/',
        navItems: []
        
      }
  }

  componentDidUpdate(prev){ 
    if( this.props.navProps.location.pathname != this.state.selScreen)
    this.getNav();
    }

  componentDidMount(){
      this.getNav();
      this.setState({fname:this.props.userProfileRX.fstname})
      //console.log(this.props.userProfileRX.fstname);
  }

  getNav = () => {
    let locPath = this.props.navProps.location.pathname;
      if(this.props.userProfileRX && this.props.userProfileRX.roleoptions){
        let navItems = this.props.userProfileRX.roleoptions;
        for(let i=0; i<navItems.length;i++){
           if(navItems[i].items && navItems[i].items.length > 0){
             let selectedScr=false;
             for (let j=0;j<navItems[i].items.length;j++){
              navItems[i].items[j]['command'] = (e)=> {this.handleNav(e)}
              if (locPath == navItems[i].items[j].navpath) {
                selectedScr = true;
              }
              
             }
             navItems[i]['className'] = (selectedScr) ? "selected-nav" : "un-selected-nav";
           }else {
            navItems[i]['command'] = (e)=> {this.handleNav(e)}
            navItems[i]['className'] = (locPath == navItems[i].navpath) ? "selected-nav" : "un-selected-nav";
           }
        }
        this.setState({navItems:navItems});
      }
      //console.log(this.props);
      this.setState({selScreen:locPath})
  }

  getStyle = e => {
    let locPath = this.props.navProps.location.pathname;
    return (locPath == e.item.navpath) ? {color:'red'} : {color:'blue'};
    
   

  }
  handleNav = e => {
    //console.log('handleNav');
    //console.log(e);
    this.props.navProps.history.push(e.item.navpath);
    
    
  };
  logAppOut =  () => {
    
    userProfile.setUserObj(null);
    this.props.navProps.history.replace('/login');
  }

  render() {
    //console.log(this.props);
    const items = this.state.navItems;
    //console.log("Navitems");
    //console.log(items);
    return (
      <React.Fragment>
        <div
                         style={{
                              display: 'flex',
                              flexDirection: 'row',
                              padding: 10,
                              fontSize: '20px',
                              alignItems: 'center',
                              backgroundColor:appTheme.primaryColor,
                              height: '56px'
                         }}
                    >
                         <img src={this.props.userProfileRX.orglogo || logo} height="40px" width="120px" />
                         <div style={{ marginLeft: '20px',color:"#CAD5E2",fontSize:20  }}>{this.state.fname}</div>
                         <div style={{ flex: 1 }}></div>
                         
                         <div>
                              <Button type="button"  onClick={()=>{ this.props.navProps.history.push('/createorder')}} className="navbar-icon" icon="pi pi-shopping-cart" tooltip="Create New Order" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '8px',color:"white",fontSize:16  }}/>
                              <Button type="button"  onClick={()=>{  }} className="navbar-icon" icon="pi pi-bell" tooltip="Notifications" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '8px',color:"white",fontSize:16  }}/>
                              <Button type="button"  onClick={()=>{ this.props.navProps.history.push('/settings') }} className="navbar-icon" icon="pi pi-cog" tooltip="Settings" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '8px',color:"white",fontSize:16  }}/>
                              <Button type="button"  onClick={this.logAppOut} className="navbar-icon" icon="pi pi-sign-out" tooltip="Signout" tooltipOptions={{ position: 'bottom' }} style={{ marginRight: '8px',color:"white",fontSize:16  }}/>
                              
                         </div>
                    </div>
        {items.length>0 && <Menubar model={items}/>}
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {userProfileRX:state.userProfile}
}
export default connect(mapStateToProps)(Navbar)