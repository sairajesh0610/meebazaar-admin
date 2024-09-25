import React from 'react';
import { Dialog } from 'primereact/dialog';
import {Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import Dropzone from 'react-dropzone';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
import callsvc from '../utils/Services';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from './DeleteDialog';
import userProfile from '../utils/Userprofile';

class Franoptions extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            objtype:'',
            userobj:userProfile.getUserObj(),
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            deleteDialog:false,editDialog:false,idfld:'', viewQuanDialog:false,barcodeArr:[],
            addQuanDialog: false, code: '', qty: '', expdt: '', mrp: '', saleprice: '', purchase: '',
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false,
            orgname:'',orgdesc:'',phone:'',city:'',address:'',franzip:'',emailrec:'',mindel:1,isdelprice:false,
            delprice:0,gst:'',foodlicense:'',franactive:true,onlinepayment:false,storepickup:true,
            stateeng:'',statetel:'',loceng:'',loctel:'',cityeng:'',citytel:'',locactive:true,locseq:10, loczip:'',
            emp_fname:'',emp_lname:'',emp_phone:'',emp_email:'',emp_accid:'',emp_pass:'',emp_active:true,isdel:true,
            addhome:true,addagency:true,addslots:true,addhsn:true,addcats:false,addprods:false,
            showSpinner:false,option:'',
        
        }
        }
    }
    componentDidMount(){
        console.log(this.props.parent);
        console.log(this.state.userobj)
        this.setState(this.props.parent);
    }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }

    addFran = (type)=>{
        this.setState({showSpinner:true});
        const a = {};
        a['forgid'] = this.state.forgid;
        a['upd'] = true;
        a[`${type}`] = true;
        callsvc(a,'addautofranchise')
        .then((res)=>{
            if(res.code == '999'){
                switch(type){
                    case 'addhome': this.setState({autohome:true});break;
                    case 'addslots': this.setState({autoslots:true});break;
                    case 'addhsn': this.setState({autohsn:true});break;
                    case 'addprods': this.setState({autoprods:true});break;
                    case 'addcats': this.setState({autocats:true});break;
                }
                this.setState({showSpinner:false});
                this.growl.show({severity: 'success', summary: `Successfully Added`, detail:`${type} Created`,life:6000});
            } else{
                this.setState({showSpinner:false});
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.setState({showSpinner:false});
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})
        this.setState({showSpinner:false});
    }
    deleteOption = (type) =>{
        this.setState({delDialog:true,option:type},()=>console.log(this.state.delDialog));
    }

    deleteFran = ()=>{
        const a = {};
        a['forgid'] = this.state.forgid;
        a['type'] = this.state.option;
        a['istest'] = this.state.istest;
        a['orgid'] = this.state.userobj.orgid;
        a['empid'] = this.state.userobj.empid;
        a['langpref'] = "English";
        callsvc(a,'deletefran')
        .then((res)=>{
            if(res.code == '999'){
                this.growl.show({severity: 'success', summary: `Successfully Deleted`, detail:res.message,life:6000});
                this.setState({delDialog:false})

            } else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})
    }
    updFran = () => {
        this.setState({showSpinner:true})
        const a = {};
        a['forgid'] = this.state.forgid;
        a['type'] = this.state.type;
        a['name'] = this.state.name;
        a['descpt'] = this.state.descpt; a['phone'] = this.state.phone;
        a['city'] = this.state.city; a['address'] = this.state.address; a['zip'] = this.state.zip;
        a['smsrec'] = this.state.smsrec;a['emailrec'] = this.state.emailrec; a['mindel'] = this.state.mindel;
        a['isdelprice'] = this.state.isdelprice; a['delprice'] = this.state.delprice; a['gst'] = this.state.gst;
        a['foodlicense'] = this.state.foodlicense; a['active'] = this.state.active; a['onlinepayment'] = this.state.onlinepayment;
        a['storepickup'] = this.state.storepickup;
        console.log(a);
        callsvc(a,'updatefranchise')
        .then((res)=>{
            if(res.code == '999'){
                this.setState({showSpinner:false});
                this.growl.show({severity: 'success', summary: `Successfully Updated`, detail:`Franchise Details Updated!`,life:6000});
                this.props.hideFran();
            } else{
                this.setState({showSpinner:false});
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.setState({showSpinner:false});
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})
        this.setState({showSpinner:false});

    }

    options = (type,action)=>{
        switch (type){
            case 'home':
                action == 'ADD' ? this.addFran('addhome') : this.deleteOption('home');
                break;
            case 'slots':
                action == 'ADD' ? this.addFran('addslots') : this.deleteOption('slots');
                break;
            case 'hsn':
                action == 'ADD' ? this.addFran('addhsn') : this.deleteOption('hsn');
                break;
            case 'cats':
                action == 'ADD' ? this.addFran('addcats') : this.deleteOption('cats');
                break;
            case 'prods':
                action == 'ADD' ? this.addFran('addprods') : this.deleteOption('prods');
                break;
            case 'employee':
                this.deleteOption('employee');
                break;
            case 'loc':
                this.deleteOption('loc');
                break;

        }
    }

    renderFooter2 = () => {
   
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={this.props.hideFran} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>this.updFran()} className="p-button-primary" />
                
            </div>
        );
    }
    
    

    render(){
        return(
            <Dialog footer={this.renderFooter2()} header={"Franchise Options"} visible={this.props.franDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide = {this.props.hideFran} position="center">
            {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
            <Growl ref={(el) => this.growl = el} sticky={true}/>
            <DeleteDialog 
            hideDialog={()=>{this.setState({delDialog:false})}}
            deleteBtn={this.deleteFran}
            visible={this.state.delDialog}
            title='...'
             />
    <div className="p-grid" style={{width:'100%',padding:'20px'}}>
        <hr/>
        <p style={{fontWeight:'bold',fontSize:'14px'}}>Organization Details</p>
        <hr/>
        <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='orgname' type="text" size={20} value={this.state.name} 
                onChange={(e)=>{this.setState({name:e.target.value})}} tooltip={"Franchise Name"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'300px'}}/>
                <label htmlFor={'orgname'}>{'FranchiseName'}</label>
            </span> 
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='orgdesc' type="text" size={20} value={this.state.descpt} 
                onChange={(e)=>{this.setState({descpt:e.target.value})}} tooltip={"Franchise Description"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'300px'}}/>
                <label htmlFor={'orgdesc'}>{'FranchiseDesc'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='phone' type="number" size={20} value={this.state.phone} 
                onChange={(e)=>{this.setState({phone:e.target.value})}} tooltip={"Franchise Support PhoneNumber"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'orgdesc'}>{'PhoneNumber'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='city' type="text" size={20} value={this.state.city} 
                onChange={(e)=>{this.setState({city:e.target.value})}} tooltip={"City"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'100px'}}/>
                <label htmlFor={'city'}>{'City'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='address' type="text" size={20} value={this.state.address} 
                onChange={(e)=>{this.setState({address:e.target.value})}} tooltip={"Franchise Address"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'300px'}}/>
                <label htmlFor={'address'}>{'Address'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='franzip' type="text" size={20} value={this.state.zip} 
                onChange={(e)=>{this.setState({zip:e.target.value})}} tooltip={"Pin Code"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'100px'}}/>
                <label htmlFor={'franzip'}>{'PinCode'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='smsrec' type="text" size={20} value={this.state.smsrec} 
                onChange={(e)=>{this.setState({smsrec:e.target.value})}} tooltip={"PhoneNumbers to Send SMS"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'200px'}}/>
                <label htmlFor={'smsrec'}>{'SMSPhones'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='emailrec' type="text" size={20} value={this.state.emailrec} 
                onChange={(e)=>{this.setState({emailrec:e.target.value})}} tooltip={"Emails For Update"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'200px'}}/>
                <label htmlFor={'emailrec'}>{'Emails'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'isdelprice'} value={this.state.isdelprice} onChange = {(e) => {this.setState({isdelprice:!this.state.isdelprice})}} checked={this.state.isdelprice} 
            tooltip={"Delivery Price Needed?"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'isdelprice'} className="check-label p-checkbox-label">{'IsDelPrice'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText type='number'  id='mindel' size={20} value={this.state.mindel} 
                onChange={(e)=>{this.setState({mindel:e.target.value})}} tooltip={"Minimum Delivery Amount"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'200px'}}/>
                <label htmlFor={'mindel'}>{'MinimumDelivery'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputNumber  id='delprice' size={20} value={this.state.delprice} 
                onChange={(e)=>{this.setState({delprice:e.target.value})}} tooltip={"Delivery Price"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'50px'}}/>
                <label htmlFor={'delprice'}>{'DeliveryPrice'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='gst' type='text' size={20} value={this.state.gst} 
                onChange={(e)=>{this.setState({gst:e.target.value})}} tooltip={"GST Number"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'gst'}>{'GSTIN'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='foodlicense' type='text' size={20} value={this.state.foodlicense} 
                onChange={(e)=>{this.setState({foodlicense:e.target.value})}} tooltip={"FoodLicense Number"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'foodlicense'}>{'FoodLicense'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'franactive'} value={this.state.active} onChange = {(e) => {this.setState({active:e.checked})}} checked={this.state.active} 
            tooltip={"Franchise Active"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'franactive'} className="check-label p-checkbox-label">{'FranchiseActive'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'onlinepayment'} value={this.state.onlinepayment} onChange = {(e) => {this.setState({onlinepayment:!this.state.onlinepayment})}} checked={this.state.onlinepayment} 
            tooltip={"Online Payment Option"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'onlinepayment'} className="check-label p-checkbox-label">{'OnlinePayment'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'storepickup'} value={this.state.storepickup} onChange = {(e) => {this.setState({storepickup:!this.state.storepickup})}} checked={this.state.storepickup} 
            tooltip={"Store Pickup Option"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'storepickup'} className="check-label p-checkbox-label">{'StorePickup'}</label>
            </span>
    </div>
    </div>


    
    <div style={{width:'100%',padding:'20px'}}>
    <hr/>
    <p style={{fontWeight:'800',fontSize:'17px',background:'-webkit-linear-gradient(#2c3e50, #3498db)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}> Additional Features</p>
    <hr/>
    <div >
            <span className="p-float-label">
            <span style={{fontWeight:'bold',fontSize:'15px',marginLeft:'1em',background:'-webkit-linear-gradient(#f46b45, #eea849)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>HOME:</span> 
            <Button label="ADD"  disabled ={this.state.autohome} style={{marginTop:'0.5em',marginLeft:'6em',position:'relative',width:'100px'}} icon="pi pi-plus-circle" onClick={() =>this.options('home','ADD')} className="p-button-success" />
            <Button label="DELETE" disabled = {!this.state.autohome} style={{marginTop:'0.5em',marginLeft:'2em',position:'relative',width:'100px'}} icon="pi pi-minus-circle" onClick={() =>this.options('home','DELETE')} className="p-button-danger" />
            </span>
    </div>
    <div >
            <span className="p-float-label">
            <span style={{fontWeight:'bold',fontSize:'15px',marginLeft:'1em',background:'-webkit-linear-gradient(#f46b45, #eea849)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>SLOTS:</span> 
            <Button label="ADD"  disabled ={this.state.autoslots} style={{marginTop:'0.5em',marginLeft:'6em',position:'relative',width:'100px'}} icon="pi pi-plus-circle" onClick={() =>this.options('slots','ADD')} className="p-button-success" />
            <Button label="DELETE" disabled = {!this.state.autoslots} style={{marginTop:'0.5em',marginLeft:'2em',position:'relative',width:'100px'}} icon="pi pi-minus-circle" onClick={() =>this.options('slots','DELETE')} className="p-button-danger" />
            </span>
    </div>
    <div >
            <span className="p-float-label">
            <span style={{fontWeight:'bold',fontSize:'15px',marginLeft:'1em',background:'-webkit-linear-gradient(#f46b45, #eea849)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>HSN:</span> 
            <Button label="ADD"  disabled ={this.state.autohsn} style={{marginTop:'0.5em',marginLeft:'6.9em',position:'relative',width:'100px'}} icon="pi pi-plus-circle" onClick={() =>this.options('hsn','ADD')} className="p-button-success" />
            <Button label="DELETE" disabled = {!this.state.autohsn} style={{marginTop:'0.5em',marginLeft:'2em',position:'relative',width:'100px'}} icon="pi pi-minus-circle" onClick={() =>this.options('hsn','DELETE')} className="p-button-danger" />
            </span>
    </div>
    <div >
            <span className="p-float-label">
            <span style={{fontWeight:'bold',fontSize:'15px',marginLeft:'1em',background:'-webkit-linear-gradient(#f46b45, #eea849)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>PRODUCTS:</span> 
            <Button label="ADD"  disabled ={this.state.autoprods} style={{marginTop:'0.5em',marginLeft:'3.5em',position:'relative',width:'100px'}} icon="pi pi-plus-circle" onClick={() =>this.options('prods','ADD')} className="p-button-success" />
            <Button label="DELETE" disabled = {!this.state.autoprods} style={{marginTop:'0.5em',marginLeft:'2em',position:'relative',width:'100px'}} icon="pi pi-minus-circle" onClick={() =>this.options('prods','DELETE')} className="p-button-danger" />
            </span>
    </div>
    <div >
            <span className="p-float-label">
            <span style={{fontWeight:'bold',fontSize:'15px',marginLeft:'1em',background:'-webkit-linear-gradient(#f46b45, #eea849)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>CATEGORIES:</span> 
            <Button label="ADD"  disabled ={this.state.autocats} style={{marginTop:'0.5em',marginLeft:'2.7em',position:'relative',width:'100px'}} icon="pi pi-plus-circle" onClick={() =>this.options('cats','ADD')} className="p-button-success" />
            <Button label="DELETE" disabled = {!this.state.autohsn} style={{marginTop:'0.5em',marginLeft:'2em',position:'relative',width:'100px'}} icon="pi pi-minus-circle" onClick={() =>this.options('cats','DELETE')} className="p-button-danger" />
            </span>
    </div>
    <div >
            <span className="p-float-label">
            <span style={{fontWeight:'bold',fontSize:'15px',marginLeft:'1em',background:'-webkit-linear-gradient(#f46b45, #eea849)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>EMPLOYEE:</span> 
            <Button label="DELETE" disabled = {!this.state.autoemp} style={{marginTop:'0.5em',marginLeft:'3.6em',position:'relative',width:'100px'}} icon="pi pi-minus-circle" onClick={() =>this.options('employee','DELETE')} className="p-button-danger" />
            </span>
    </div>
    <div >
            <span className="p-float-label">
            <span style={{fontWeight:'bold',fontSize:'15px',marginLeft:'1em',background:'-webkit-linear-gradient(#f46b45, #eea849)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>LOCATIONS:</span> 
            <Button label="DELETE" disabled = {!this.state.autoloc} style={{marginTop:'0.5em',marginLeft:'3.2em',position:'relative',width:'100px'}} icon="pi pi-minus-circle" onClick={() =>this.options('loc','DELETE')} className="p-button-danger" />
            </span>
    </div>

    </div>
                </Dialog>
        )
    }

}



export default Franoptions;
