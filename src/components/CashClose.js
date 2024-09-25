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

class CashClose extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            objtype:'CASH_CLOSE_FLDS',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),addlist:[],dynamicColumns2:[],
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            searchProdData:[],searchInp:'',prdData:[],agency:'',brand:'',tranDate:'',
            tranTypeList:[{label:'DEBIT',value:'DEBIT',id:1},{label:'CREDIT',value:'CREDIT',id:2}],
            selectedTranType:'DEBIT',updateDialog:false,agencyProds:[],desiredAmt:0,expenses:0,
            transDialog:false,prditemDialog:false, agencyItems:[],orgid:'',empid:'',totalCredit:0,totalDebit:0,
            remarks:'',fullyPaid:true,orderAmt:0,orderId:'', credit:0,debit:0,rem:0,closeAmtDialog:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        
        //setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype,orgid:this.state.userobj.orgid},this.setData,this.growl);
        this.setState({orgid:this.state.userobj.orgid,empid:this.state.userobj.empid},()=>{console.log(this.state.orgid)})
        this.setState({expenses:this.props.expenses,desiredAmt:this.props.counterCash})

    }
    componentDidUpdate(prevProps){
        if(prevProps.expenses!=this.props.expenses){
            this.setState({expenses:this.props.expenses,desiredAmt:this.props.counterCash})
        }
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

    
    
    getCash = () =>{
        let inpobj = {orgid:this.state.userobj.orgid}
        let credit = 0;
        let debit = 0;
        return;
        //console.log(this.state.data.length)
        for(let i=0;i<this.state.data.length;i++){
            if(this.state.data[i].tnstype=='CREDIT'){
                //console.log('Im in');
                credit += Number(this.state.data[i].ordamt);
            }else if(this.state.data[i].tnstype=='DEBIT'){
                //console.log('Im in debit')
                debit += Number(this.state.data[i].ordamt);
            }
        }
        //console.log(credit)
        this.setState({credit:credit,debit:debit,rem:credit-debit})
    }

    renderFooter(){
        return(
            <div>
            <Button label="Cancel" icon="pi pi-times" onClick={()=>this.setState({closeAmtDialog:false})} className="p-button-secondary"/>
            <Button label="Save" icon="pi pi-check" onClick={() =>this.createTxn()} className="p-button-primary" />
            
        </div>
        )
    }

    createTxn = ()=>{

        let a = {closeid:"",tnsdate:'',objtype:this.state.objtype,idfld:'close',orgid:this.state.userobj.orgid,closingamt:this.state.orderAmt,expenses:this.props.expenses,desiredamt:this.props.counterCash,remarks:this.state.remarks};
        //console.log(a);
        //console.log(this.state.orderId.length);
        if(this.state.orderAmt.length<1 || this.state.remarks.length<1){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: "Please Fill All the Fileds",life:6000});
            //console.log('Im in!')
            return
        }
        if(isNaN(Number(this.state.orderAmt))){
            this.growl.show({severity: 'warn', summary: 'Invalid Entry', detail: "Please Enter Valid Amount",life:6000});
            return
        }
        let date = new Date();
        a['tnsdate'] = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
        console.log(a);
        
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'insobjdata');
        this.setState({closeAmtDialog:false})
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
                <div>
                <div  style={{marginLeft:'45%',marginTop:'0.5em',width:'100px',backgroundColor:'red',borderRadius:'2px',textAlign:'center',fontSize:'100%',color:'white',top:0}}>Cash Account</div>
                <div style={{marginBottom:'0.5em'}}>
                <Button label="Close Account" style={{borderRadius:'5px'}}  icon="pi pi-times-circle" onClick={()=>this.setState({closeAmtDialog:true})} className="p-button-warning" />
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
                <Dialog header='Close Account' footer={this.renderFooter()} visible={this.state.closeAmtDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide = {()=>this.setState({closeAmtDialog:false})} position="center" >
                    <InputText value={'Expenses: '+this.props.expenses} disabled={true} placeholder="Expeses" style={{'marginRight':'0.5em'}} tooltip="Enter Order Amount" />
                    <InputText value={'Desired Amount: '+this.props.counterCash} disabled={true} placeholder="Desired Amount" style={{'marginRight':'0.5em'}} tooltip="Amount that was collected from store" />
                    <InputText  style={{'marginRight':'0.5em'}} tooltip="Enter Cash in the Counter" placeholder="Enter Cash" onInput={(e)=>this.setState({orderAmt:e.target.value})}/>
                    <InputText placeholder="Enter Remarks" style={{'marginRight':'0.5em'}} tooltip="Enter Remarks" onInput={(e)=>this.setState({remarks:e.target.value})}/>

                </Dialog>
                
                                        
            </div>
           
         )
      }
}

export default CashClose;