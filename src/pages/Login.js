import React from 'react';

import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';

import {appStore} from '../App';


import cloxlogo from  "../assets/cloxanlogo.png";
import globallogo from  "../assets/marvijlogo.png";

import AppSpinner from '../components/AppSpinner';

import {createNavItems} from '../utils/Generics';
import userProfile from '../utils/Userprofile';
import callsvc from '../utils/Services';
import {appTheme,ADMIN_ERROR,GLOBAL_ERROR,APP_ID} from '../utils/Constants';

class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            accid:'',
            accpwd:'',
            dummy:'',
            showError:false,
            reqError:'',
            showSpinner:false

        }
    }

    componentDidMount(){
        console.log(this.props)
    }

    onChange = (e,inp) => {
        this.state[inp] = e.target.value
        this.setState({dummy:''},()=>console.log(this.state[inp]))
      }

      userLogin = () => {
        let reqError='';
        if(!this.state.accid){
            reqError+='Username ,';
        }
        if(!this.state.accpwd){
            reqError+='Password ,';
        }
        if(reqError){
            reqError =  reqError.substr(0,reqError.length-1)+ ' seems to be missing!'
            this.growl.show({severity: 'warn', summary: 'Fields Missing', detail: reqError,sticky:true});
            return;
        
        }
        this.userLoginSvc();
        
      }

      userLoginSvc = () => {
        let inpobj = {accid:this.state.accid,accpwd:this.state.accpwd}
        this.setState({showSpinner:true})
        callsvc(inpobj,'emplogin')
            .then((res)=>{
                //console.log(res);
                if(res.code == '999'){
                    
                    if(Array.isArray(res.roleoptions) && res.roleoptions.length > 0){

                        let navItems = createNavItems(res.roleoptions);
                        res.roleoptions = navItems;
                        userProfile.setUserObj(res);

                        //appStore.dispatch({type:'ADD_USER',user:res});
                        this.setState({showSpinner:false});
                        console.log(navItems);
                        let k=0;
                        let path = "";
                        for(k=0;k<navItems.length;k++){
                            if(navItems[k]['navpath']){
                                path = navItems[k]['navpath']
                                break;
                            }else if(navItems[k].items[0]['navpath']){
                                path = navItems[k].items[0]['navpath']
                                break;
                            }
                        }
                        console.log(path)
                        this.props.navProps.history.replace(path);

                        //this.props.setCurrScreen()
                        //res.roleoptions = navItems;
                        //userProfile.setUserObj(res);
                        // this.setState({showSpinner:false},()=>{
                        //     this.props.setUserRoleOptions(navItems[0]['navpath']);
                        //     this.props.navProps.history.replace(navItems[0]['navpath']);
                        // })
                        
                    } else {
                        this.growl.show({severity: 'warn', summary: 'Admin Error', detail: GLOBAL_ERROR,life:6000});
                        this.setState({showSpinner:false});
                       
                        }
                }else if(res.code == '9991' || res.code == '9992' || res.code == '9993' || res.code == '9994' || res.code == '9995' ) {
                    
                    this.growl.show({severity: 'warn', summary: 'Login Error', detail: res.message ,life:6000});
                    this.setState({showSpinner:false});
                    
                    
                }else if(res.code == '555' || res.code == '666' || res.code == '777') {
                    
                    this.growl.show({severity: 'warn', summary: 'Admin Error', detail: GLOBAL_ERROR,life:6000});
                    this.setState({showSpinner:false});
                    
                    
                } else {
                    
                    this.growl.show({severity: 'warn', summary: 'Admin Error', detail: GLOBAL_ERROR,life:6000});
                    this.setState({showSpinner:false});
                }
            })
            .catch((error)=>{
                    console.log(error);
                    this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
                    this.setState({showSpinner:false});
            })
            .finally(()=>{
                
            })
}

    render(){
    return(
        <div style={{position:'relative',backgroundColor:appTheme.primaryColor,height:window.screen.height}}>
        
        {this.state.showSpinner && <AppSpinner spinColor="dark" showText={true} scrHeight={window.screen.height}/>}
        <Growl ref={(el) => this.growl = el} sticky={true}/>
        
            
            
             
          
            <div className="p-grid" style={{alignItems:'center',justifyContent:'center',alignItems:'center',height:'100%'}} >
                <div className="p-col-12 p-md-4">
                </div>
                <div className="p-col-12 p-md-4" style={{padding:'40px'}}>

                <div style={{display:'flex',justifyContent:'center',width:'100%'}} >
                <img src={APP_ID == 'CLOX' ? cloxlogo : globallogo} height="40%" width="45%"/>  
                </div>
                
                <h1 style={{color:appTheme.secondaryColor,textAlign:'center',fontSize:'42px'}}>Admin Panel</h1>
                    
                    
                    <div style={{width:'100%',padding:20}} >

                 
                       <span className="p-float-label">
                           <InputText style={{width:'100%'}} id="accid" value={this.state.accid} onChange={(e) => this.setState({accid: e.target.value})} onFocus={()=>{this.growl.clear()}}/>
                           <label htmlFor="accid">Username</label>
                      </span>   
                      <br/>
                        <span className="p-float-label">
                            <Password style={{width:'100%'}} feedback={false} value={this.state.accpwd} onChange={(e) => this.setState({accpwd: e.target.value})} onFocus={()=>{this.growl.clear()}} />
                            <label htmlFor="accpwd">Password</label>
                       </span>
                       <br/><br/>
                       <div style={{position:'relative',justifyContent:'center',display:'flex'}}>
                          <Button  style={{backgroundColor:appTheme.secondaryColor,borderColor:appTheme.secondaryColor}}  label="Login" onClick={this.userLogin}/>
                          
                        </div>
                        { (this.state.showError) && <p style={{textAlign:'center',color:'red'}}>{this.state.reqError}</p>}
                    </div>
                </div>
                <div className="p-col-12 p-md-4"></div>
            </div>

        </div>

    )
}

    
}

export default Login;