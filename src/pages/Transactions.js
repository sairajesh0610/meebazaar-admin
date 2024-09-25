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

class Transactions extends React.Component{

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
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype,orgid:this.state.userobj.orgid,method:'CASH'},this.setData,this.growl);
        this.getCash();
        this.setState({orgid:this.state.userobj.orgid,empid:this.state.userobj.empid},()=>{console.log(this.state.orgid)})
        
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
    
    getCash = () =>{
        let inpobj = {orgid:this.state.userobj.orgid}
        let credit = 0;
        let debit = 0;
        for(let i=0;i<this.state.data.length;i++){
            if(this.state.data[i].tnstype=='CREDIT'){
                credit += Number(this.state.data[i].ordamt);
            }else if(this.state.data[i].tnstype=='DEBIT'){
                debit += Number(this.state.data[i].ordamt);
            }
        }
        this.setState({credit:credit,debit:debit,rem:credit-debit})
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
             {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                <Growl ref={(el) => this.growl = el} sticky={true}/>
                <div style={{flexDirection:'row',marginTop:'0.25em'}}>
                <Button label="Online" style={{borderRadius:'5px',width:'100px',marginLeft:'0.25em',marginRight:'0.5em'}} onClick={()=>{this.setState({onlineMenu:true,storeMenu:false})}}/>
                <Button label="Store" style={{borderRadius:'5px',backgroundColor:'#a83240',borderColor:'#a83240',width:'100px'}} onClick={()=>{this.setState({onlineMenu:false,storeMenu:true})}}/>
                </div>
                {this.state.onlineMenu && <div>
                <div>
                <div  style={{marginLeft:'45%',marginBottom:'0.5em',width:'50px',backgroundColor:'#34A835',borderRadius:'2px',textAlign:'center',fontSize:'100%',color:'white',top:0}}>COD</div>
                <div style={{marginTop:'0em'}}>
                <p style={{marginLeft:'1em'}}><span  style={{marginRight:'1em'}}>Total Credit: {this.state.credit}</span> <span style={{marginRight:'1em'}}>Total Debit:  {this.state.debit}</span>
                <span style={{marginRight:'1em'}}>Remaining:  {this.state.rem}</span>
                </p>
                </div>
                <div style={{marginBottom:'0.5em'}}>
                <Dropdown required  size={30}appendTo={document.body} style = {{width:'100px',marginLeft:'0.5em',marginRight:'0.25em'}} value={this.state.selectedTranType} options={this.state.tranTypeList} onChange={(e) => {console.log(e);this.setState({selectedTranType: e.value})}} placeholder="Select" optionLabel="label" tooltip="Transaction Type"/>
                <InputText placeholder="Enter Order ID" style={{'marginRight':'0.5em'}} tooltip="Enter Order Id" placehoder="Order ID" onInput={(e)=>this.setState({orderId:e.target.value})}/>
                <InputText placeholder="Enter Order Amount" style={{'marginRight':'0.5em'}} tooltip="Enter Order Amount" placehoder="Order Amount" onInput={(e)=>this.setState({orderAmt:e.target.value})}/>
                <InputText placeholder="Enter Remarks" style={{'marginRight':'0.5em'}} tooltip="Enter Remarks" placehoder="Remars" onInput={(e)=>this.setState({remarks:e.target.value})}/>
                <Checkbox style={{'marginRight':'0.5em'}} value={this.state.fullyPaid} onChange = {(e) => {this.setState({fullyPaid:e.checked})}}
                              tooltip={"Amount Fully Paid or Not"} checked={this.state.fullyPaid} tooltipOptions={{position: 'top'}}></Checkbox>
                <Button label="Create" style={{borderRadius:'5px'}}  icon="pi pi-check" onClick={this.saveRow} className="p-button-warning" />
                              </div>
                </div>
                    
                    <DataTable
                    value             =  {this.state.data}
                    scrollable        =  {true}
                    scrollHeight      =  {window.screen.height-400 + 'px'}
                    selectionMode     =  'single'
                    emptyMessage      =  "No records found..."
                    globalFilter      =  {this.state.globalFilter}
                    paginator={true} 
                    rows={5}
                    style={{backgroundColor:'#5b616b'}}
                 >
                    {this.state.dynamicColumns}
            
                </DataTable>
                
                <OnlineTxns/>
            </div>}
            {this.state.storeMenu &&
                <div>
                <Expenses/>
                </div>
            }
                                        
            </div>
           
         )
      }
}

export default Transactions;