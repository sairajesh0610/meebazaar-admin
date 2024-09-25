import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import {TabView,TabPanel} from 'primereact/tabview';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import { Dialog } from 'primereact/dialog';
import {Button} from 'primereact/button';
import callsvc from '../utils/Services';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import {Dropdown} from 'primereact/dropdown';
import {Column} from 'primereact/column';
import {Checkbox} from 'primereact/checkbox'
import {DataTable} from 'primereact/datatable';
import {ADMIN_ERROR} from '../utils/Constants';
import { InputTextarea } from 'primereact/inputtextarea';
import OnlineTxns from '../components/OnlineTxns';
import Expenses from '../components/Expenses';

class Volunteer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            objtype:'CASH_TNS_FLDS',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),addlist:[],dynamicColumns2:[],
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            searchProdData:[],searchInp:'',prdData:[],agency:'',brand:'',tranDate:'',
            tranTypeList:[{label:'DEBIT',value:'DEBIT',id:1},{label:'CREDIT',value:'CREDIT',id:2}],
            selectedTranType:'DEBIT',updateDialog:false,agencyProds:[],
            transDialog:false,prditemDialog:false, agencyItems:[],orgid:'',empid:'',totalCredit:0,totalDebit:0,
            remarks:'',fullyPaid:true,orderAmt:0,orderId:'', credit:0,debit:0,rem:0,onlineMenu:true,storeMenu:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        
        //setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
        //getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        //getObjData({objtype:this.state.objtype,orgid:this.state.userobj.orgid,method:'CASH'},this.setData,this.growl);
        this.getEmp();
        
    }

    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            if(key=='data'){
                this.setState({
                    [`${key}`]: inpobj[key]
                },()=>this.getCash()); 
            }else{
                this.setState({
                    [`${key}`]: inpobj[key]
                });
            }
            
        })
    }

    customBody(rowData,column){
        if(column.header == 'image'){
            return <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <img src={rowData.image} style = {{width: '40px', height:'40px'}}/>
                </div>
        }else {
            return <i className={rowData[column.field] ? "pi pi-check" : "pi pi-times"} 
        style={rowData[column.field] ? {fontSize:'14px',color:'green'}: {fontSize:'14px',color:'red'}} /> 
        }
    }

    saveRow = () =>{
        let a = {tnsid:"",tnsdate:'',objtype:this.state.objtype,idfld:'tnsid',orgid:this.state.userobj.orgid,tnstype:this.state.selectedTranType,ordcd:this.state.orderId,ordamt:this.state.orderAmt,remarks:this.state.remarks,fullypaid:this.state.fullyPaid};
        //console.log(a);
        //console.log(this.state.orderId.length);
        if(this.state.orderId.length<5 || this.state.orderAmt.length<1 || this.state.remarks.length<1){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: "Please Fill All the Fileds",life:6000});
            //console.log('Im in!')
            return
        }
        if(isNaN(Number(this.state.orderAmt))){
            this.growl.show({severity: 'warn', summary: 'Invalid Entry', detail: "Please Enter Valid Amount",life:6000});
            return
        }else if(isNaN(Number(this.state.orderId))){
            this.growl.show({severity: 'warn', summary: 'Invalid Entry', detail: "Please Enter Valid Order Id",life:6000});
            return
        }
        let date = new Date();
        a['tnsdate'] = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
        a['method'] = 'CASH';
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'insobjdata');
        
    }
    empListTemplate = (item) => {
        return (<div className="p-grid" key={item.locid}>
                    <div className="p-col-8"> 
                        <div>{item.name} </div>
                        <div>{item.loc} </div>
                        
                    </div>
                </div>
        )
        }
    
    selectedEmpTemplate = (item, props) =>{
            if (item) {
                return (<div className="p-grid">
                <div className="p-col-8"> 
                    <div>{item.name} - {item.loc} </div>  
                </div>
            </div>
                )
            }
            return (
                <span>
                    {props.placeholder}
                </span>
            );
        }
        onEmpSelect = (e) => {
            console.log(e.value);
            this.setState({selectedEmp:e.value},()=>console.log(e.value))
        }

    getEmp = () =>{
        
    }
    
    render () {
        const header = (
            <div style={{'textAlign':'left'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Global Search" size="50"/>
            </div>
        );
            return (
             
            <div style={{position:'relative'}}> 
            <div>
                <Dropdown   appendTo={document.body} value={this.state.selectedEmp} options={this.state.empData} onChange={this.onEmpSelect}  filter showClear 
                    filterBy="name" optionLabel="name" placeholder={"Select Employee"} style ={{width:'100%'}}
                    valueTemplate={this.selectedEmpTemplate} itemTemplate={this.empListTemplate} dataKey="locid"
                />
            
            </div>               
            </div>
           
         )
      }
}

export default Volunteer;