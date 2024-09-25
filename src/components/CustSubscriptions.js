import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';

import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import {ADMIN_ERROR, appTheme,APP_URL} from '../utils/Constants';

import { DataTable } from 'primereact/datatable';

import {Toolbar} from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import ExcelExport from '../components/ExcelExport';


import {Button} from 'primereact/button';
import callsvc, { callmobilesvc } from "../utils/Services";
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';

import {InputNumber} from 'primereact/inputnumber';




class CustSubscriptions extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'ORG_CUST_SUBS', 
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false},
            orderStatusArr: [{label:'ORDER_READY',value:'ORDER_READY',id:2},
            {label:'DELIVERED',value:'DELIVERED',id:3},{label:'CANCELLED',value:'CANCELLED',id:4}],
            delboyList:[],
            delboyDialog:false,
            selectedStat:'',
            selectedDelBoy:'',deladdr:'',
            prdData:[],substdt:'',subenddt:'',quantity:0, freq:'', selectedProd:null,
            freqList:[{label:'EVERYDAY',value:'EVERYDAY',id:2},
            {label:'WEEKDAYS',value:'WEEKDAYS',id:3},{label:'WEEKENDS',value:'WEEKENDS',id:4}],
            delslot:'', slotlist: [{label:'MORNING',value:'MORNING',id:2},{label:'EVENING',value:'EVENING',id:3}]

            
            
        }
    }

    componentDidMount(){
        
        
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getsubproducts');
        this.getPrdData();
       
    }

    componentDidUpdate(prevProps){
        if(this.props.parid != prevProps.parid){
            if(this.props.parid)
                getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getsubproducts')
            else
                this.setState({data:[],selectedRow:{}})
        }
    }

   
    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            this.setState({
                [`${key}`]: inpobj[key]
            });
        })
    }

    getPrdData = () => {
        callsvc({ordid:this.state.userobj.orgid,empid:this.state.userobj.empid},'subproductlist',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({prdData:res.data})
            }

        })
        .catch((err)=>{console.log(err)})
        .finally(()=>{})
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
        //this.setState({editDialog:true});
        //this.props.navProps.history.push( "/orderdetail",{orderdetail:this.state.selectedRow})
    }

    createSubscription = () => {
        const {substdt,subenddt,quantity,freq,delslot,selectedProd,deladdr} = this.state
       let missingFlds = '';
       if(!substdt)
       missingFlds+= 'Start Date ,';
       if(!subenddt)
       missingFlds+= 'End Date ,';
       if(!quantity)
       missingFlds+= 'Quantity ,';
       if(!freq)
       missingFlds+= 'Frequency ,';
       if(!delslot)
       missingFlds+= 'Delivery Slot ,';
       if(!selectedProd)
       missingFlds+= 'Product ,';
       if(!deladdr)
       missingFlds+= 'Address ,';

       if(missingFlds.length > 2){
        missingFlds = missingFlds.substr(0,missingFlds.length-1) + ' are Required !'
        this.growl.show({severity: 'warn', summary: 'Fields Missing', detail:missingFlds,life:6000});
        return;
       }
       let inpobj = {custid:this.props.parid,orgid:this.state.userobj.orgid,slottm:delslot,itemquan:quantity,
        prdid:selectedProd.prdid,prditid:selectedProd.prditid,repfreq:freq,startdt:substdt,enddt:subenddt,
        onlinepaid:false,txnamount:0,txnid:'',deladdr:deladdr,langpref:'English',txnid:'ADMIN'};

        callmobilesvc(inpobj,'addsubproduct',false) 
        .then((res)=>{
            if(res.code == '999'){
                this.growl.show({severity: 'success', summary: res.message, detail:res.message,life:6000}); 
                getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getsubproducts');
                this.setState({editDialog:false})
            
            }else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000}); 
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err)})
        .finally(()=>{})
       





       

    }

    openEditDialog = () => {
        this.setState({selectedProd:null,substdt:'',subenddt:'',quantity:0,freq:'',delslot:'',editDialog:true,deladdr:''})
    }

    cancelSubProduct = () => {
        let inpobj = {custid:this.props.parid,orgid:this.state.userobj.orgid,
            prdid:this.state.selectedRow.prdid,prditid:this.state.selectedRow.prditid,
            langpref:'English'};
    
            callmobilesvc(inpobj,'cancelsubitem',false) 
            .then((res)=>{
                if(res.code == '999'){
                    this.growl.show({severity: 'success', summary: res.message, detail:res.message,life:6000}); 
                    getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getsubproducts');
                    this.setState({deleteDialog:false})
                
                }else{
                    this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000}); 
                }
            })
            .catch((err)=>{
                this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
                console.log(err)})
            .finally(()=>{})
           
    }
    
    
    
    renderFooter(name) {
        
            
                if(name == 'editDialog'){
                    return (
                        <div>
                            <Button label="No" icon="pi pi-times" onClick={() => this.setState({editDialog:false})} className="p-button-danger" />
                            <Button label="Create" icon="pi pi-check" onClick={() => this.createSubscription()} className="p-button-secondary"/>
                        </div>
                    )
                }else if (name == 'deleteDialog'){
                    return (
                        <div>
                            <Button label="No" icon="pi pi-times" onClick={() => this.setState({deleteDialog:false})} className="p-button-danger" />
                            <Button label="Yes" icon="pi pi-trash" onClick={() => this.cancelSubProduct()} className="p-button-secondary"/>
                        </div>
                    )
                }
                
            
        
        
    }

    prodListTemplate = (item) => {
    return (<div className="p-grid">
                <div className="p-col-4">
                    <img src={item.prdimg} style={{height:'60px',width:'60px'}} />
                </div>
                <div className="p-col-8"> 
                    <div>{item.prdname} </div>
                    <div>{item.price} </div>
                </div>


            </div>
    )
    }

    selectedProdTemplate = (item, props) =>{
        if (item) {
            return (<div className="p-grid">
            <div className="p-col-4">
                <img src={item.prdimg} style={{height:'60px',width:'60px'}} />
            </div>
            <div className="p-col-8"> 
                <div>{item.prdname} </div>
                
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

    onProdSelect = (e) => {
          console.log(e.value);
          this.setState({selectedProd:e.value})
    }

    render () {
          

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
                    <Button disabled={!this.props.ismem } icon="pi pi-plus"  style={{marginRight:'.25em'}}  tooltip="Add Subscription" tooltipOptions={{position: 'top'}} onClick={()=>{ this.openEditDialog() }}/>
                    {/* <Button  icon="pi pi-eye" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Edit Subscription" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({editDialog:true})}}/>  */}
                    <Button icon="pi pi-trash"  className="p-button-danger" style={{marginRight:'.25em'}}  tooltip="Delete Subscription" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({deleteDialog:true}) }}/>
                    
                    
                    
                </div>
                
                </Toolbar>
                <DataTable
                    value             =  {this.state.data}
                    scrollable        =  {true}
                    screenopt         =  {this.props.scrOptions}
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

                
                    {this.state.editDialog && <Dialog footer={this.renderFooter('editDialog')} header={'Add Subscription'} visible={this.state.editDialog} 
                    style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll 
                    onHide = {()=>this.setState({editDialog:false})} position="center"> 
                    <div className="p-grid"  >
                        <div className="p-col-6">
                        <Dropdown appendTo={document.body} value={this.state.selectedProd} options={this.state.prdData} onChange={this.onProdSelect} optionLabel="prdname" filter showClear 
                        filterBy="prdname" placeholder="Select a Product" style ={{width:'100%'}}
                        valueTemplate={this.selectedProdTemplate} itemTemplate={this.prodListTemplate} />
                        </div>
                        <div className="p-col-6">
                        <span className="p-float-label">
                            <InputText id={'substdt'} type="date" style ={{width:'100%'}} value={this.state.substdt} 
                            onChange={(e)=>{this.setState({substdt:e.target.value})}} tooltip={'Choose Subscription Start Date'} 
                            tooltipOptions={{position: 'top'}} placeholder={'Start Date'} 
                            />
                            
                        </span> 
                        
                        </div>
                        <div className="p-col-6">
                        <span className="p-float-label">
                            <InputText id={'subenddt'} type="date" style ={{width:'100%'}} value={this.state.subenddt} 
                            onChange={(e)=>{this.setState({subenddt:e.target.value})}} tooltip={'Choose Subscription End Date'} 
                            tooltipOptions={{position: 'top'}} placeholder={'End Date'} 
                            />
                            
                        </span> 
                        
                        </div>
                        <div className="p-col-6">
                        <span className="p-float-label">
                            <InputNumber id={'quantity'}  style ={{width:'100%'}} value={this.state.quantity} onChange={(e) => {this.setState({quantity:e.target.value})}} 
                            tooltip={'Quantity'} tooltipOptions={{position: 'top'}}   />
                            <label htmlFor={'quantity'}>{'Quantity'}</label>
                        </span> 
                        
                        </div>
                        <div className="p-col-6">
                        <Dropdown appendTo={document.body} style = {{width:'100%',margin:'auto'}} value={this.state.freq} options={this.state.freqList} onChange={(e) => {console.log(e);this.setState({freq: e.value})}} placeholder="Choose the frequency"/>
                        
                        </div>
                        <div className="p-col-6">
                        <Dropdown appendTo={document.body} style = {{width:'100%',margin:'auto'}} value={this.state.delslot} options={this.state.slotlist} onChange={(e) => {console.log(e);this.setState({delslot: e.value})}} placeholder="Choose the delivery Slot"/>
                        
                        </div>
                        <div className="p-col-6">
                        <span className="p-float-label">
                            <InputText id={'deladdr'} type="text" style ={{width:'100%'}} value={this.state.deladdr} 
                            onChange={(e)=>{this.setState({deladdr:e.target.value})}} tooltip={'Choose Delivery Address'} 
                            tooltipOptions={{position: 'top'}} 
                            />
                            <label htmlFor={'deladdr'}>{'Delivery Address'}</label>
                        </span> 
                        
                        </div>
                    </div>
                    
                    </Dialog>}
                
                <Dialog   style={{width: '50%',padding:'12px',height:'50%'}}  footer={this.renderFooter('delboyDialog')} header={<label style={{color:appTheme.primaryColor}}>Assign Order</label>} visible={this.state.delboyDialog}  blockScroll onHide={() => this.setState({ delboyDialog: false })} position="center">
                     
                    {this.state.showError && <div style={{color:'red',fontWeight:'bold',maxWidth:'300px',textAlign:'center',marginBottom:'12px'}}>{this.state.errorMsg}</div>}
                    <Dropdown appendTo={document.body} style = {{width:'90%',margin:'auto'}} value={this.state.selectedStat} options={this.state.orderStatusArr} onChange={(e) => {console.log(e);this.setState({selectedStat: e.value})}} placeholder="Select Order Status"/>
                    
                    <Dropdown appendTo={document.body} style = {{width:'90%',margin:'auto',marginTop:'12px'}} value={this.state.selectedDelBoy} options={this.state.delboyList} onChange={(e) => {console.log(e);this.setState({selectedDelBoy: e.value})}} placeholder="Select Delivery Boy" optionLabel="accid"/>
                
                        
                </Dialog>
                <Dialog footer={this.renderFooter('deleteDialog')} visible={this.state.deleteDialog} onHide = {()=>{this.setState({deleteDialog:false})}} header={<label style={{color:appTheme.primaryColor}}>oops... Cancelling the Subscription!</label>}   blockScroll  position="topright">
                    <div>
                        <p> You are about to Cancel the Subscription orders! <span style={{ fontWeight: 'bold', color: appTheme.primaryColor }}>{this.state.selectedRow.prdname}</span>  </p>
                        
                    </div>
                
            </Dialog>
                   
                </div>
            
         )
      }  
        
    }





export default CustSubscriptions;