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

class Addfranchise extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            objtype:'',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            deleteDialog:false,editDialog:false,idfld:'', viewQuanDialog:false,barcodeArr:[],
            addQuanDialog: false, code: '', qty: '', expdt: '', mrp: '', saleprice: '', purchase: '',
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false,
            orgname:'',orgdesc:'',phone:'',city:'',address:'',franzip:'',emailrec:'',mindel:1,isdelprice:false,
            delprice:0,gst:'',foodlicense:'',franactive:true,onlinepayment:false,storepickup:true,
            stateeng:'',statetel:'',loceng:'',loctel:'',cityeng:'',citytel:'',locactive:true,locseq:10, loczip:'',
            emp_fname:'',emp_lname:'',emp_phone:'',emp_email:'',emp_accid:'',emp_pass:'',emp_active:true,isdel:true,
            addhome:true,addagency:true,addslots:true,addhsn:true,addcats:false,addprods:false,
            showSpinner:false,istest:false,
        
        }
        }
    }

    renderFooter = () => {
   
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>this.props.hideDialog()} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>this.addFran()} className="p-button-primary" />
                
            </div>
        );
    }

    addFran = ()=>{
        const a = {};
        a['orgname'] = this.state.orgname; a['orgdesc'] = this.state.orgdesc; a['phone'] = this.state.phone;
        a['city'] = this.state.city; a['address'] = this.state.address; a['franzip'] = this.state.franzip;
        a['smsrec'] = this.state.smsrec;a['emailrec'] = this.state.emailrec; a['mindel'] = this.state.mindel;
        a['isdelprice'] = this.state.isdelprice; a['delprice'] = this.state.delprice; a['gst'] = this.state.gst;
        a['foodlicense'] = this.state.foodlicense; a['franactive'] = this.state.franactive; a['onlinepayment'] = this.state.onlinepayment;
        a['storepickup'] = this.state.storepickup;
        a['loceng'] = this.state.loceng; a['loctel'] = this.state.loctel; a['city-eng'] = this.state.cityeng;
        a['city-tel'] = this.state.citytel; a['state-eng'] = this.state.stateeng; a['state-tel'] = this.state.statetel;
        a['locactive'] = this.state.locactive; a['locseq'] = this.state.locseq; a['loczip'] = this.state.loczip;
        a['emp_fname'] = this.state.emp_fname; a['emp_lname'] = this.state.emp_lname; a['emp_phone'] = this.state.emp_phone;
        a['emp_accid'] = this.state.emp_accid; a['emp_pass'] = this.state.emp_pass; a['emp_active'] = this.state.emp_active;
        a['isdel'] = this.state.isdel;
        a['addhome'] = this.state.addhome; a['addagency'] = this.state.addagency;
        a['addslots'] = this.state.addslots; a['addhsn'] = this.state.addhsn;
        a['addcats'] = this.state.addcats; a['addprods'] = this.state.addprods;
        a['upd'] = false;
        a['istest'] = this.state.istest;
        let b = [];
        Object.keys(a).map((key)=>{
            if(a[`${key}`]==undefined){
                b.push(`${key}`)
            }
        })
        let str = 'Please Check These Mandatory Fields: '
        if(b.length>0){
            for(let i=0;i<b.length;i++){
                str = str.concat(b[i].concat(', '));
            }
            this.growl.show({severity: 'warn', summary: 'Missing Field', detail:str,life:6000});
            return;
        }
        this.setState({showSpinner:true});
        callsvc(a,'addautofranchise')
        .then((res)=>{
            if(res.code == '999'){
                this.props.hideDialog();
                this.growl.show({severity: 'success', summary: 'Franchise Created', detail:"Frachise Created Successfully, Please re-check if any errors found please contact your administrator!",life:6000});

            } else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})
        this.setState({showSpinner:false});
    }
    

    render(){
        return(
            <div>
            {this.state.showSpinner && <AppSpinner spinColor="light" showText={true} scrHeight={window.screen.height-210}/>}
            <Growl ref={(el) => this.growl = el} sticky={true}/>
    <Dialog footer={this.renderFooter()} header={"Add Franchise"} visible={this.props.visible} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide = {()=>this.props.hideDialog()} position="center">
    <div className="p-grid" style={{width:'100%',padding:'20px'}}>
        <hr/>
        <p style={{fontWeight:'bold',fontSize:'14px'}}>Organization Details</p>
        <hr/>
        <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='orgname' type="text" size={20} value={this.state.orgname} 
                onChange={(e)=>{this.setState({orgname:e.target.value})}} tooltip={"Franchise Name"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'300px'}}/>
                <label htmlFor={'orgname'}>{'FranchiseName'}</label>
            </span> 
        </div>
        <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='orgdesc' type="text" size={20} value={this.state.orgdesc} 
                onChange={(e)=>{this.setState({orgdesc:e.target.value})}} tooltip={"Franchise Description"} 
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
                <InputText  id='franzip' type="text" size={20} value={this.state.franzip} 
                onChange={(e)=>{this.setState({franzip:e.target.value})}} tooltip={"Pin Code"} 
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
            <Checkbox inputId={'franactive'} value={this.state.franactive} onChange = {(e) => {this.setState({franactive:e.checked})}} checked={this.state.franactive} 
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


    <div className="p-grid" style={{width:'100%',padding:'20px'}}>
    <hr/>
    <p style={{fontWeight:'bold',fontSize:'14px'}}>Location Details</p>
    <hr/>

    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='loceng' type='text' size={20} value={this.state.loceng} 
                onChange={(e)=>{this.setState({loceng:e.target.value})}} tooltip={"Location Name English"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'200px'}}/>
                <label htmlFor={'loceng'}>{'LocationEng'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='loctel' type='text' size={20} value={this.state.loctel} 
                onChange={(e)=>{this.setState({loctel:e.target.value})}} tooltip={"Location Name Telugu"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'200px'}}/>
                <label htmlFor={'loctel'}>{'LocationTel'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='cityeng' type='text' size={20} value={this.state.cityeng} 
                onChange={(e)=>{this.setState({cityeng:e.target.value})}} tooltip={"City Name English"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'cityeng'}>{'CityEng'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='citytel' type='text' size={20} value={this.state.citytel} 
                onChange={(e)=>{this.setState({citytel:e.target.value})}} tooltip={"City Name Telugu"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'citytel'}>{'CityTel'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='stateeng' type='text' size={20} value={this.state.stateeng} 
                onChange={(e)=>{this.setState({stateeng:e.target.value})}} tooltip={"State English"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'70px'}}/>
                <label htmlFor={'stateeng'}>{'StateEng'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='statetel' type='text' size={20} value={this.state.statetel} 
                onChange={(e)=>{this.setState({statetel:e.target.value})}} tooltip={"State Telugu"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'70px'}}/>
                <label htmlFor={'statetel'}>{'StateTel'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='loczip' type="text" size={20} value={this.state.loczip} 
                onChange={(e)=>{this.setState({loczip:e.target.value})}} tooltip={"Location Pincode"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'100px'}}/>
                <label htmlFor={'loczip'}>{'ZIPCode'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  type='number' id='locseq' size={20} value={this.state.locseq} 
                onChange={(e)=>{this.setState({locseq:e.target.value})}} tooltip={"Seq of Location"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'100px'}}/>
                <label htmlFor={'locseq'}>{'LocationSeq'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'locactive'} value={this.state.locactive} onChange = {(e) => {this.setState({locactive:!this.state.locactive})}} checked={this.state.locactive} 
            tooltip={"Location Active"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'locactive'} className="check-label p-checkbox-label">{'LocationActive'}</label>
            </span>
    </div>
    </div>

    <div className="p-grid" style={{width:'100%',padding:'20px'}}>
    <hr/>
    <p style={{fontWeight:'bold',fontSize:'14px'}}>Employee Details</p>
    <hr/>

    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='emp_fname' type='text' size={20} value={this.state.emp_fname} 
                onChange={(e)=>{this.setState({emp_fname:e.target.value})}} tooltip={"Employee First Name"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'emp_fname'}>{'FirstName'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='emp_lname' type='text' size={20} value={this.state.emp_lname} 
                onChange={(e)=>{this.setState({emp_lname:e.target.value})}} tooltip={"Employee Last Name"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'emp_lname'}>{'LastName'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='emp_phone' type='number' size={20} value={this.state.emp_phone} 
                onChange={(e)=>{this.setState({emp_phone:e.target.value})}} tooltip={"Employee Phone Number"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150x'}}/>
                <label htmlFor={'emp_phone'}>{'PhoneNumber'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='emp_email' type='text' size={20} value={this.state.emp_email} 
                onChange={(e)=>{this.setState({emp_email:e.target.value})}} tooltip={"Employee Email"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'emp_email'}>{'Email'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='emp_accid' type='text' size={20} value={this.state.emp_accid} 
                onChange={(e)=>{this.setState({emp_accid:e.target.value})}} tooltip={"Employee Accid"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'emp_accid'}>{'AccID'}</label>
            </span> 
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
                <InputText  id='emp_pass' type='text' size={20} value={this.state.emp_pass} 
                onChange={(e)=>{this.setState({emp_pass:e.target.value})}} tooltip={"Employee Password"} 
                tooltipOptions={{position: 'top'}}  disabled={this.state.disabled}
                style={{width:'150px'}}/>
                <label htmlFor={'emp_pas'}>{'Password'}</label>
            </span> 
    </div>

    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'emp_active'} value={this.state.emp_active} onChange = {(e) => {this.setState({emp_active:!this.state.emp_active})}} checked={this.state.emp_active} 
            tooltip={"Employee Active"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'emp_active'} className="check-label p-checkbox-label">{'EmployeeActive'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'isdel'} value={this.state.locactive} onChange = {(e) => {this.setState({isdel:!this.state.isdel})}} checked={this.state.isdel} 
            tooltip={"Is Delivery Access?"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'isdel'} className="check-label p-checkbox-label">{'IsDel'}</label>
            </span>
    </div>
    </div>

    <div className="p-grid" style={{width:'100%',padding:'20px'}}>
    <hr/>
    <p style={{fontWeight:'bold',fontSize:'14px'}}> Additional Features</p>
    <hr/>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'addhome'} value={this.state.addhome} onChange = {(e) => {this.setState({addhome:!this.state.addhome})}} checked={this.state.addhome} 
            tooltip={"Add App Home"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'addhome'} className="check-label p-checkbox-label">{'AddHome'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'addagency'} value={this.state.addagency} onChange = {(e) => {this.setState({addagency:!this.state.addagency})}} checked={this.state.addagency} 
            tooltip={"Add Defualt Agency"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'addagency'} className="check-label p-checkbox-label">{'AddAgency'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'addslots'} value={this.state.addslots} onChange = {(e) => {this.setState({addslots:!this.state.addslots})}} checked={this.state.addslots} 
            tooltip={"Add Slots"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'addslots'} className="check-label p-checkbox-label">{'AddSlots'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'addhsn'} value={this.state.addhsn} onChange = {(e) => {this.setState({addhsn:!this.state.addhsn})}} checked={this.state.addhsn} 
            tooltip={"Add Tax Codes"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'addhsn'} className="check-label p-checkbox-label">{'AddHSN'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'addcats'} value={this.state.addcats} onChange = {(e) => {this.setState({addcats:!this.state.addcats})}} checked={this.state.addcats} 
            tooltip={"Add Categories"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'addcats'} className="check-label p-checkbox-label">{'AddCategories'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'addprods'} value={this.state.addprods} onChange = {(e) => {this.setState({addprods:!this.state.addprods})}} checked={this.state.addprods} 
            tooltip={"Add Products"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'addprods'} className="check-label p-checkbox-label">{'AddProducts'}</label>
            </span>
    </div>
    <div className="p-col-12 p-md-6 p-lg-4">
            <span className="p-float-label">
            <Checkbox inputId={'istest'} value={this.state.istest} onChange = {(e) => {this.setState({istest:!this.state.istest})}} checked={this.state.istest} 
            tooltip={"is It a Test?"} tooltipOptions={{position: 'top'}} disabled={this.state.disabled}></Checkbox>
            <label style={{marginLeft:'8px'}} htmlFor={'addprods'} className="check-label p-checkbox-label">{'IsTest'}</label>
            </span>
    </div>


    </div>
    </Dialog>
            </div>
        )
    }
}



export default Addfranchise;
