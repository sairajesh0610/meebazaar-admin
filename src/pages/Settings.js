import React from 'react';
import { InputText } from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {InputNumber} from 'primereact/inputnumber';
import {Checkbox} from 'primereact/checkbox';
import {Button} from 'primereact/button';
import {Growl} from 'primereact/growl';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import callsvc,{callsvcforupload} from '../utils/Services';
import {ADMIN_ERROR} from '../utils/Constants';
import userProfile from '../utils/Userprofile'; 



class Settings extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            objtype : 'SETTINGS_FLDS_LIST', scrDisabled:true, btnTitle:'Edit',
            fldArr:[],
            userobj:userProfile.getUserObj(),
            
        }
    }

    componentDidMount(){
        
        this.getObjFlds({objtype:this.state.objtype}); 
    }

     getObjFlds = (inpobj,svcname='getobjflds')=>{
        callsvc(inpobj,svcname)
        .then((res)=>{
            
            if(res.code == '999'){
             this.setState({fldArr:res.fldlist})
             this.getobjData();
            
              
        } else {
            this.growl.show({severity: 'warn', summary: 'Code Error', detail: res.message,life:6000});
        }
        })
        .catch((err)=>{
            console.log(err)
            this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
        })
        .finally(()=>{});
    
    }

    getobjData = () => {
        callsvc({objtype:this.state.objtype},'getobjdata')
        .then((res)=>{
            
            if(res.code == '999'){
            let data = res.data[0];
            for(let i=0;i<this.state.fldArr.length;i++){
                this.state.fldArr[i]['val'] = data[this.state.fldArr[i]['field']]
            }
            this.setState({fldArr:this.state.fldArr})
            
            
              
        } else {
            this.growl.show({severity: 'warn', summary: 'Code Error', detail: res.message,life:6000});
        }
        })
        .catch((err)=>{
            console.log(err)
            this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
        })
        .finally(()=>{});
    }
    
    editBtn = () => {
        if(this.state.btnTitle == 'Edit'){
            this.setState({scrDisabled:false,btnTitle:'Save'});
        }else{
            // let isFldMissing = checkReq(this.state.opArr,{orgid:this.state.userobj.orgid,empid:this.state.empid},this.setData)
            // if(isFldMissing){
            //     this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${isFldMissing} seems to be missing! Please check`,life:6000});
            //     return;
            // }
            let a ={objtype:this.state.objtype};
            for(let i=0;i<this.state.fldArr.length;i++){
                a[this.state.fldArr[i]['field']] = this.state.fldArr[i]['val']
            }
            console.log(a);
            callsvc(a,"insobjdata")
        .then((res)=>{
            if(res.code == '999'){
                this.growl.show({severity: 'warn', summary: 'Save Record', detail: 'Record Save succesful',life:6000});

                
            }else{
                this.growl.show({severity: 'warn', summary: 'Save Record', detail: 'Record Save failed!',life:6000});

            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR,life:6000});
        })
       
            this.setState({scrDisabled:true,btnTitle:'Edit'});
        }
    }

    fieldUpd = (val,it) => { 
        //console.log(it,val);
        for(let i=0;i<this.state.fldArr.length;i++){
            if(this.state.fldArr[i].field == it.field){
                this.state.fldArr[i].val = val;
                break;
            }
        }
        this.setState({fldArr:this.state.fldArr})
    }


    
    render (){
        const scrDisabled = this.state.scrDisabled;
        return (
        <div>
            <Growl ref={(el) => this.growl = el} sticky={true}/>
            <div style={{display:'flex',justifyContent:"flex-end",marginTop:24}}>
            <Button  label={this.state.btnTitle}  className="p-button-warning" 
            style={{marginRight:'24px'}}  onClick = { ()=>this.editBtn()}
            /> 

            </div>
            <div className="p-grid" style={{width:'90%',margin:'auto'}}>
                {this.state.fldArr.map((it) =>{
                if(it.type == 'text'){
                  return (
                    <div className="p-col-12 p-md-6" key={it.field}>
                
                    <label htmlFor={it.field} className="p-d-block">{it.tblheader}</label>
                    <InputText disabled={scrDisabled||it.disabled} id={it.field} value={it.val} className="p-d-block"  style={{width:'100%'}} onChange={(e)=>{this.fieldUpd(e.target.value,it);}}/>
    
                    </div>
                  )
                }else if(it.type == 'textarea'){
                    return (
                        <div className="p-col-12 p-md-6" key={it.field}>
                    
                        <label htmlFor={it.field} className="p-d-block">{it.tblheader}</label>
                        <InputTextarea disabled={scrDisabled||it.disabled} id={it.field} value={it.val} className="p-d-block"  style={{width:'100%'}}/>
        
                        </div>
                      )
                } else if(it.type == 'num'){
                    return (
                        <div className="p-col-12 p-md-6" key={it.field}>
                    
                        <label htmlFor={it.field} className="p-d-block">{it.tblheader}</label>
                        <InputNumber disabled={scrDisabled||it.disabled} id={it.field} value={it.val} className="p-d-block"  style={{width:'100%'}}/>
        
                        </div>
                      )

                }else if(it.type == 'check'){
                    return (
                        <div className="p-col-12 p-md-6" key={it.seq}>
                              <label htmlFor={it.field} className="p-d-block">{it.tblheader}</label>
                              <Checkbox inputId={it.field} value={it.field} onChange = {(e) => {this.inpValue(!it.val,it)}} checked={it.val} 
                               disabled={scrDisabled||it.disabled}></Checkbox>
                                
                             
                        </div>)

                }
           
                })}
               
            </div>
            
        </div>
        )
    }

    
}

export default Settings;