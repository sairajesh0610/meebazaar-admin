import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';

import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import {appTheme,APP_URL} from '../utils/Constants';

import { DataTable } from 'primereact/datatable';

import {Toolbar} from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import ExcelExport from '../components/ExcelExport';

import OrderdetailDialog from '../components/OrderdetailDialog';
import {Button} from 'primereact/button';
import callsvc from "../utils/Services";
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';



class Suborders extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'ORDER_LIST', 
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false},
            orderStatusArr: [{label:'ORDER_READY',value:'ORDER_READY',id:2},
            {label:'DELIVERED',value:'DELIVERED',id:3},{label:'CANCELLED',value:'CANCELLED',id:4}],
            delboyList:[],
            delboyDialog:false,
            selectedStat:'',
            selectedDelBoy:'',
        }
    }

    componentDidMount(){
        
        
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype,type:this.props.ordstat},this.setData,this.growl,'getsuborderdata');
        this.getdbList();
    }

    getdbList= () =>{
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid};
        callsvc(inpobj,'getdelboylist',false)
        .then((res)=>{
            this.setState({delboyList:res.data})
        })
        .catch((err=>{
            console.log(err)
        }))
    }

    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            this.setState({
                [`${key}`]: inpobj[key]
            });
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

    

    
    
    rowsSelect = (value) =>{
        this.setState({ selectedRow: value })
    }
    gFilterVal = (value) => {
        this.setState({ globalFilter: value })
    }
    showEditModal = (op)=>{
        
        let opArr = this.state.fldArr.map((it)=>{
                let a =  Object.assign({},it,{val:(op == 'EDIT') ? this.state.selectedRow[it.field] : it.val});
                a.val = (a.val == 'NULL' || a.val == null)? '':a.val;
                a.val = (a.type == 'num') ? Number(a.val) :a.val;
                return a;
        })
        
        this.setState({opArr:opArr,editDialog:true})

    }
    setInpVal = (val,obj)=>{
            
        let a = this.state.opArr.map((it)=>{
            if(it.field == obj.field){
                it.val = val; return it;
            }else {
                return it;
            }
        })
        this.setState({opArr:a})
    }
    
    rowDblClick = (e)=> {
        console.log(this.props);
        this.setState({editDialog:true});
        //this.props.navProps.history.push( "/orderdetail",{orderdetail:this.state.selectedRow})
    }
    printOrder = () => {
        console.log(this.props)
        
     userProfile.setordprintObj(this.state.selectedRow)
     let url = APP_URL + 'printorder';
      window.open(url);

    }
    assignOrder = () => { 
        if(!this.state.selectedStat){
            this.growl.show({severity: 'warn', summary: 'Cannot assign Order', detail: 'Please choose both fields!',life:6000});
            return;
        }
        if(!this.state.selectedDelBoy.empid){
            this.growl.show({severity: 'warn', summary: 'Cannot assign Order', detail: 'Please choose both fields!',life:6000});
            return;
        }
        console.log(this.state.selectedDelBoy, this.state.selectedStat);
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,ordid:this.state.selectedRow.ordid,ordstat:this.state.selectedStat,assigned:this.state.selectedDelBoy.empid}
        callsvc(inpobj,'assignorder',false)
        .then((res)=>{
            if(res.code == '999'){
                let selectedRow = {}
                for(let i=0;i<this.state.data.length;i++){
                    if(this.state.data[i]['ordid'] == inpobj['ordid']){
                        this.state.data.splice(i,1);
                        if(this.state.data.length > 0){
                            selectedRow = this.state.data[i];
                        }
                        break;
                    }
                }
                this.setState({delboyDialog:false,selectedStat:'',selectedDelBoy:'',data:this.state.data,selectedRow:selectedRow});

            }else {
                this.setState({delboyDialog:false,selectedStat:'',selectedDelBoy:''})
            }
        })
        .catch((err=>{
            console.log(err)
        }))

    }

    cancelOrder = () => {
        let inpobj = {ordid:this.state.selectedRow.ordid,orgid:this.state.userobj.orgid,empid:this.state.userobj.empid}
        callsvc(inpobj,'ordstatcancel',false)
        .then((res)=>{
            if(res.code == '999'){
                let selectedRow = {}
                for(let i=0;i<this.state.data.length;i++){
                    if(this.state.data[i]['ordid'] == inpobj['ordid']){
                        this.state.data.splice(i,1);
                        if(this.state.data.length > 0){
                            selectedRow = this.state.data[i];
                        }
                        break;
                    }
                }
                this.setState({deleteDialog:false,data:this.state.data,selectedRow:selectedRow});

            }else {
                this.setState({deleteDialog:false})
            }
        })
        .catch((err=>{
            console.log(err)
        }))

    }

    renderFooter(name) {
        
            
                if(name == 'delboyDialog'){
                    return (
                        <div>
                            <Button label="No" icon="pi pi-times" onClick={() => this.setState({delboyDialog:false})} className="p-button-danger" />
                            <Button label="Update" icon="pi pi-check" onClick={() => this.assignOrder()} className="p-button-secondary"/>
                        </div>
                    )
                }else if (name == 'deleteDialog'){
                    return (
                        <div>
                            <Button label="No" icon="pi pi-times" onClick={() => this.setState({deleteDialog:false})} className="p-button-danger" />
                            <Button label="Yes" icon="pi pi-trash" onClick={() => this.cancelOrder()} className="p-button-secondary"/>
                        </div>
                    )
                }
                
            
        
        
    }
    render () {
            const renderCancel = true;

            return (
             
                <div className="left-align-table">
                 {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                <Growl ref={(el) => this.growl = el} sticky={true}/>
                <Toolbar>
                <div className="p-toolbar-group-left">
                    <div style={{display:'flex'}}>
                        {/* <i className={props.screenopt.icon} style={{marginRight:'24px',alignSelf:'center'}} /> */}
                        <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>{this.props.name}</p>
                    </div>
                    
                </div>
                <div className="p-toolbar-group-right">
                    <InputText type="search" style = {{verticalAlign:'middle',marginRight:'.25em'}} onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="50" />
                    {renderCancel && <Button icon="pi pi-trash"  className="p-button-danger" style={{marginRight:'.25em'}}  tooltip="Cancel Order" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({deleteDialog:true}) }}/>}
                    {renderCancel && <Button icon="pi pi-user"  style={{marginRight:'.25em'}}  tooltip="Assign Order" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({delboyDialog:true,selectedStat:'',selectedDelBoy:''}) }}/>}
                    <Button  icon="pi pi-eye" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="View Order" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({editDialog:true})}}/> 
                    <Button  icon="pi pi-print" className="p-button-danger" onClick={()=>this.printOrder()} tooltip="Print Order" tooltipOptions={{position: 'top'}} />
                </div>
                
                </Toolbar>
                <DataTable
                    value             =  {this.state.data}
                    scrollable        =  {true}
                    scrollHeight      =  {window.screen.height-400 + 'px'}
                    selection         =  {this.state.selectedRow}
                    onSelectionChange =  {(e) =>{this.rowsSelect(e.value)}} 
                    selectionMode     =  'single'
                    emptyMessage      =  "No records found..."
                    globalFilter      =  {this.state.globalFilter}
                    onRowDoubleClick = {()=>{ this.rowDblClick()}}
                    paginator={true} 
                    rows={20}
                 >
                    {this.state.dynamicColumns}
            
                </DataTable> 

                
                    {this.state.editDialog && <OrderdetailDialog ordobj={this.state.selectedRow} setData = {this.setData} editDialog={this.state.editDialog}/>}
                
                <Dialog   style={{width: '50%',padding:'12px',height:'50%'}}  footer={this.renderFooter('delboyDialog')} header={<label style={{color:appTheme.primaryColor}}>Assign Order</label>} visible={this.state.delboyDialog}  blockScroll onHide={() => this.setState({ delboyDialog: false })} position="center">
                     
                    {this.state.showError && <div style={{color:'red',fontWeight:'bold',maxWidth:'300px',textAlign:'center',marginBottom:'12px'}}>{this.state.errorMsg}</div>}
                    <Dropdown appendTo={document.body} style = {{width:'90%',margin:'auto'}} value={this.state.selectedStat} options={this.state.orderStatusArr} onChange={(e) => {console.log(e);this.setState({selectedStat: e.value})}} placeholder="Select Order Status"/>
                    
                    <Dropdown appendTo={document.body} style = {{width:'90%',margin:'auto',marginTop:'12px'}} value={this.state.selectedDelBoy} options={this.state.delboyList} onChange={(e) => {console.log(e);this.setState({selectedDelBoy: e.value})}} placeholder="Select Delivery Boy" optionLabel="accid"/>
                
                        
                </Dialog>
                <Dialog footer={this.renderFooter('deleteDialog')} visible={this.state.deleteDialog} onHide = {()=>{this.setState({deleteDialog:false})}} header={<label style={{color:appTheme.primaryColor}}>oops... Cancelling the Order!</label>}   blockScroll  position="topright">
                    <div>
                        <p> You are about to Cancel the Order!. Order # <span style={{ fontWeight: 'bold', color: appTheme.primaryColor }}>{this.state.selectedRow.ordercd}</span>  </p>
                        
                    </div>
                
            </Dialog>
                   
                </div>
            
         )
      }  
        
    }





export default Suborders;