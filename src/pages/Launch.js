import React from 'react';

import Navbar from '../components/Navbar';
import AppSpinner from '../components/AppSpinner';

import Alertlist from './Alertlist';
import Banners from './Banners';
import Catlist from './Catlist';
import Createorder from './Createorder';
import Customerlist from './Customerlist';
import Damageditems from './Damageditems';
import Dashboard from './Dashboard';
import Deals from './Deals';
import Employees from './Employees';
import Feedback from './Feedback';
import Login from './Login';
import Tags from './Tags';
import Lowstock from './Lowstock';
import Notifications from './Notifications';
import Orderbag from './Orderbag';
import Orderlist from './Orderlist';
import Prodsizes from './Prodsizes';
import Productlist from './Productlist';
import Promocodes from './Promocodes';
import Reports from './Reports';
import Settings from './Settings';
import Subcatlist from './Subcatlist';
import Taxcodes from './Taxcodes';
import Imports from './Imports';
import Orglist from './Orglist';
import Screenlist from './Screenlist';
import Orderdetail from './Orderdetail';
import Orderprint from '../components/Orderprint';
import Terms from './Terms'
import {appStore} from '../App';
import userProfile from '../utils/Userprofile';
import callsvc from '../utils/Services';
import Importdata from './Importdata';
import FranchiseList from './Franchiselist';
import Orgobjects from './Orgobjects';
import TempScreen from './Tempscreen';
import Articles from './Articles';
import Locations from './Locations';
import Roles from './Roles';
import Storecats from "./Storecats";
import Storeproducts from './Storeproducts'
import Locationtypes from './Locationtypes'
import Benfitlocations from './Benfitlocations'
import Benemployee from './Benemployee'
import {appTheme} from '../utils/Constants';
import { Growl } from 'primereact/growl';
import Slotlist from './Slotlist';
import Bensubscribers from './Bensubscribers';
import Smartbanners from './Smartbanners'
import Sampleeditor from './Sampleeditor';
import Exportdata from './Exportdata';
import Apphome from './Apphome';
import Appslides from './Appslides';
import Agenecylist from './Agencylist'
import Agencytransactions from './Agencytransactions'
import Sample from './Sample';
import Transactions from './Transactions'
import Voulunteer from './Volunteer'
import Volunteer from './Volunteer';

class Launch extends React.Component {
  

  constructor(props){
      super(props);
      

      let userObj = userProfile.getUserObj();
      if(userObj && userObj.empid && userObj.sessid && userObj.orgid){
        appStore.dispatch({type:'ADD_USER',user:userObj});
      }
      
      this.state = {
        currScreen:'/',
      //   showNav:false,
      //   currPath:'',
         pathArr: ['/','/login','/dashboard','/ordlist','/custlist','/productlist','/productitems','/categories','/alerts','/bannerlist', '/tempscreen',
         '/promolist','/slotlist','/poslist','/reports','/oderreassign', '/orderdetail','/printorder', '/importdata','/createorder','/settings', '/franchiselist', '/orgobjects',
        '/employee','/tags','/hsncode','/deals','/feedback','/lowstock','/import','/orglist','/screenlist','/terms','/ppolicy','/aboutus','/faqs','/covid','/articles','/locationlist',
        '/roles','/storecats','/storeproducts','/maincats','/benlocations','/benroles','/benemployee','/bensubscribers','/smartbannerlist','/exportdata',
      '/apphome','/appslides','/agencylist','/agencytxns','/sample','/cashtns',
      '/volunteer'],
        userRoleOptions:[],
        userObj:userObj

      
    }
  }

  setUserRoleOptions = (inpArr)=>{
    this.setState({userRoleOptions:inpArr});
    console.log(inpArr);
  }
  setCurrScreen = (scr)=>{
    this.setState({currScreen:scr,showNav: (scr=='/login') ? false:true })
  }

  componentDidUpdate(prev){ 
    
    if( this.props.location.pathname != this.state.currScreen)
    this.launchScr();
    
    }

  componentDidMount(){
    console.log('componentDidMount');
    this.launchScr();
    
      
  }

  launchScr = () =>{
    

    
    let currScr = this.props.location.pathname;
    if(currScr == '/'){
      this.props.history.replace('/login');
      return;
    }

    if(currScr == '/login')
    {
      this.setState({showNav:false,currScreen:'/login'});
      return;
    }
    let a = this.state.pathArr.filter((it)=>it==currScr);
    if(a.length == 1){
    let userObj = userProfile.getUserObj();
    if(userObj && userObj.empid && userObj.sessid) {

      callsvc({empid:userObj.empid,orgid:userObj.orgid,sessid:userObj.sessid},'isvalidsess')
      .then((res)=>{
        if(res.code == '999'){
          
            if(currScr == '/printorder'){
              this.setState({showNav:false,currScreen:currScr});
            }else{
              this.setState({showNav:true,currScreen:currScr});
            }
            
            
           
        }else{
          this.props.history.replace('/login');
        }
      })
      .catch((err)=>{
          this.props.history.replace('/login');
      })
      .finally(()=>{})
 

    }else{
      //this.setState({showNav:false,currScreen:'/login'});
      this.props.history.replace('/login');
      return;
    }
      
    }else{
      this.props.history.replace('/login');
      return;
    }
  }

 

  
  render() {
       const {currScreen,showNav} = this.state
    return  (
      <React.Fragment>
        <div>
        {(currScreen == 'Launch') && <div style={{display:'flex',height:window.innerHeight,width:window.innerWidth,backgroundColor:appTheme.primaryColor,justifyContent:'center',alignItems:'center'}}>
        <AppSpinner />
        <Growl ref={(el) => this.growl = el} sticky={true}/>
        </div>}
        {showNav && <Navbar navProps={this.props} />}
        {(currScreen == '/dashboard') && <Dashboard navProps={this.props} />}
        {(currScreen == '/ordlist') && <Orderlist  navProps={this.props} />}
        {(currScreen == '/custlist') && <Customerlist  navProps={this.props} />}
        {(currScreen == '/categories') && <Catlist  navProps={this.props}/>}
        {(currScreen == '/subcatlist') && <Subcatlist  navProps={this.props} />}
        {(currScreen == '/productlist') && <Productlist navProps={this.props} />}
        {(currScreen == '/productitems') && <Prodsizes navProps={this.props} />}
        {(currScreen == '/lowstock') && <Lowstock navProps={this.props} />}
        {(currScreen == '/alerts') && <Alertlist navProps={this.props} />}
        {(currScreen == '/reports') && <Reports navProps={this.props} />}
        {(currScreen == '/feedback') && <Feedback navProps={this.props} />}
        {(currScreen == '/promolist') && <Promocodes navProps={this.props} />}
        {(currScreen == '/settings') && <Settings navProps={this.props} />}
        {(currScreen == '/bannerlist') && <Banners navProps={this.props} />}
        {(currScreen == '/hsncode') && <Taxcodes navProps={this.props} />}
        {(currScreen == '/employee') && <Employees navProps={this.props} />}
        {(currScreen == '/tags') && <Tags navProps={this.props} />}
        {(currScreen == '/deals') && <Deals navProps={this.props} />}
        {(currScreen == '/poslist') && <Orderbag navProps={this.props} />}
        {(currScreen == '/createorder') && <Createorder navProps={this.props} />}
        {(currScreen == '/import') && <Imports navProps={this.props} />}
        {(currScreen == '/orglist') && <Orglist navProps={this.props} />}
        {(currScreen == '/screenlist') && <Screenlist navProps={this.props} />}
        {(currScreen == '/terms') && <Terms navProps={this.props} />}
        {(currScreen == '/ppolicy') && <Terms navProps={this.props} />}
        {(currScreen == '/faqs') && <Terms navProps={this.props} />}
        {(currScreen == '/covid') && <Terms navProps={this.props} />} 
        {(currScreen == '/aboutus') && <Terms navProps={this.props} />} 
        {(currScreen == '/orderdetail') && <Orderdetail navProps={this.props} />} 
        {(currScreen == '/printorder') && <Orderprint navProps={this.props} />} 
        {(currScreen == '/importdata') && <Importdata navProps={this.props} />} 
        {(currScreen == '/slotlist') && <Slotlist navProps={this.props} />} 
        {(currScreen == '/franchiselist') && <FranchiseList navProps={this.props} />} 
        {(currScreen == '/orgobjects') && <Orgobjects navProps={this.props} />} 
        {(currScreen == '/tempscreen') && <TempScreen navProps={this.props} />} 
        {(currScreen == '/articles') && <Articles navProps={this.props} />}
        {(currScreen == '/locationlist') && <Locations navProps={this.props} />}
        {(currScreen == '/roles') && <Roles navProps={this.props} />}
        {(currScreen == '/storecats') && <Storecats navProps={this.props} />}
        {(currScreen == '/storeproducts') && <Storeproducts navProps={this.props} />}
        {(currScreen == '/maincats') && <Locationtypes navProps={this.props} />}
        {(currScreen == '/benlocations') && <Benfitlocations navProps={this.props} />}
        {(currScreen == '/benroles') && <Roles navProps={this.props} />}
        {(currScreen == '/benemployee') && <Benemployee navProps={this.props} />}
        {(currScreen == '/bensubscribers') && <Bensubscribers navProps={this.props} />}
        {(currScreen == '/smartbannerlist') && <Smartbanners navProps={this.props} />}
        {(currScreen == '/exportdata') && <Exportdata navProps={this.props} />}
        {(currScreen == '/apphome') && <Apphome navProps={this.props} />}
        {(currScreen == '/appslides') && <Appslides navProps={this.props} />}
        {(currScreen == '/agencylist') && <Agenecylist navProps={this.props} />}
        {(currScreen == '/agencytxns') && <Agencytransactions navProps={this.props} />}
        {(currScreen == '/cashtns') && <Transactions navProps={this.props} />}
        {(currScreen == '/volunteer') && <Volunteer navProps={this.props} />}



        
        

        
        
        
        
        
        {(currScreen == '/login') && <Login navProps={this.props}  setUserRoleOptions = {this.setUserRoleOptions} setCurrScreen={this.setCurrScreen}/>}
      

        </div>
       </React.Fragment>
    )
    
  }
}
export default Launch