import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';

import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import {appTheme,APP_ID,APP_URL} from '../utils/Constants';

import { DataTable } from 'primereact/datatable';

import {Toolbar} from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import ExcelExport from '../components/ExcelExport';

import OrderdetailDialog from '../components/OrderdetailDialog';
import EditOrder from './EditOrder';
import {Button} from 'primereact/button';
import callsvc from "../utils/Services";
import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';



class Neworders extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'ORDER_LIST', 
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,editOrderDialog:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false},
            orderStatusArr: [{label:'ORDER_READY',value:'ORDER_READY',id:2},
            {label:'DELIVERED',value:'DELIVERED',id:3},{label:'PROCESSED',value:'PROCESSED',id:4},{label:'INCOMPLETE',value:'INCOMPLETE',id:5}],
            delboyList:[],
            delboyDialog:false,
            selectedStat:'',
            selectedDelBoy:'',
            orderCancelReason:'',
            blockordbtn:true,
            orderUpdateDialog:false,
            updateordbtn:false,
        }
    }

    componentDidMount(){
        
        
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype,type:this.props.ordstat},this.setData,this.growl,'getorderdata');
        this.getdbList();
        this.checkBlockStatus();
        this.getBlockedOrders();
        this.getOrgData();
    }

    getOrgData = ()=>{
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.empid}
        callsvc(inpobj,'getorgdata',false)
        .then((res)=>{
            this.setState({orgdata:res.data})
        })
        .catch((err=>{
            console.log(err)
        }))
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

    splitblockorders(){
        console.log(this.state.opArr)
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,ordstatus:this.props.ordstat,quantlist:JSON.stringify(this.state.opArr)};
        //let a ={objtype:this.state.objtype};
        callsvc(inpobj,'splitblockorders',false)
        .then((res)=>{
            if(res.code == '999'){
                this.growl.show({severity: 'success', summary: 'Orders Splitted!', detail: 'Orders Splitted!, Please Check Pickup and Incomplete Orders',life:6000});
                this.setState({orderUpdateDialog:false})
            }else{
                this.growl.show({severity: 'warn', summary: 'something went wrong!', detail: 'Please contact your administrator..',life:6000});
            }
        })
        .catch((err=>{
            console.log(err)
        }))
    }

    getBlockedOrders(){
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,ordstatus:this.props.ordstat};
        callsvc(inpobj,'getblockedorders',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({opArr:res.data})
            }else{
                this.setState({updateordbtn:true})
            }
        })
        .catch((err=>{
            console.log(err)
        }))
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
        if(!this.state.orderCancelReason){
            this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Please specify the order cancel reason!',life:6000});
            return;
        }
        let inpobj = {ordid:this.state.selectedRow.ordid,custid:this.state.selectedRow.custid, 
            orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,cancelreason:this.state.orderCancelReason}
        callsvc(inpobj,'cancelorder',false)
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
    checkBlockStatus(){
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid};
        callsvc(inpobj,'checkblockstatus',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({blockordbtn:true})
            }else if(res.code=='9991') {
                this.setState({blockordbtn:false})
            }else{
                this.setState({blockordbtn:true})
            }
        })
        .catch((err=>{
            console.log(err)
        }))
    }
    blockOrder = ()=> {
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid};
        callsvc(inpobj,'blockorders',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({blockordbtn:true})
                this.setState({supdateordbtn:false})
                this.growl.show({severity: 'success', summary: 'Orders Blocked', detail: 'Orders Block!, Please check, if any errors',life:6000});
            }else {
                this.setState({blockordbtn:true})
                this.setState({updateordbtn:true})
                this.growl.show({severity: 'warn', summary: 'Error', detail: 'Something went wrong! Please check',life:6000});
            }
        })
        .catch((err=>{
            console.log(err)
        }))
    }

    editOrder = ()=> {
        this.setState({editOrderDialog:true})
        console.log(this.state.selectedRow);
    }

    submitOrder = () => {
        console.log(this.state.selectedRow);
    }

    getorderitdata = () =>{
        let inpobj = {objtye:'ORDER_IT_LIST',parid:this.state.selectedRow.ordid,orgid:this.state.userobj.orgid,empid:this.state.userobj.empid};
        callsvc(inpobj,'getorderitdata',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({orditlist:res.data})
                this.printElem();
            }else {
                this.growl.show({severity: 'warn', summary: 'Error', detail: 'Something went wrong! Please check',life:6000});
            }
        })
        .catch((err=>{
            console.log(err)
        }))

    }
    

    printElem = () => {
        let currDt = new Date().toLocaleString();
       let htmlStr = `
       <div style="width:250px; max-width:250px; display:flex; flex-direction:column; align-items:center; padding:4px">
           <div style="text-align:center;font-size:20px;">${this.state.orgdata.orgname} <div>
           <div style="text-align:center;font-size:16px;"> Online Super market</div>
           <div style="text-align:center;font-size:14px;"><small>${this.state.orgdata.address} - ${this.state.orgdata.phone}</small></div> 
           <div style="text-align:center;font-size:14px;">${this.state.orgdata.city}. ${this.state.orgdata.state}</div>
           <div style="text-align:center;font-size:14px;"> GSTIN NO :${this.state.orgdata.gst} </div>
           <hr/>
           <div style="text-align:center;font-size:14px;"> Tax Invoice</div>
           <div style="text-align:center;font-size:12px;">Bill No: ${this.state.selectedRow.ordercd}</div>
           <div style="text-align:center;font-size:12px;">Date: ${currDt}</div>
           <span style="font-size:12px;">Name: ${this.state.selectedRow.custname}</span>
           <span style="font-size:12px; margin-left:2px;">Phone: ${this.state.selectedRow.accid}</span>
           <div style="font-size:12px; margin-left:2px; margin-bottom:8px">Address: ${this.state.selectedRow.deladdr}</div>
           <hr/>
           
           
           
           <table style="width:100%;justify-content:center">
               <tr>
                   <th style="font-size:10px;maxwidth:7%;">SlNo</th>
                   <th style="font-size:12px;maxwidth:40%;" >Item</th>
                   <th style="font-size:12px;maxwidth:15%;" >Qty</th>
                   <th style="font-size:12px;maxwidth:15%;" >MRP</th>
                   <th style="font-size:12px;maxwidth:15%;" >Price</th>
                   <th style="font-size:12px;maxwidth:15%;" >Amount</th>
                </tr>
                <tr>
                   <th style="font-size:12px;maxwidth:15%;" ></th>
                   <th style="font-size:12px;maxwidth:15%;" >HSN</th>
                   <th style="font-size:12px;maxwidth:15%;marginLeft:'2em'" >GST%</th>
                   <th style="font-size:12px;maxwidth:15%;" >GSTAmount</th>
               </tr>
               </table>
               <table style="width:100%;justify-content:center">
               `
              
               for(let i=0;i<this.state.orditlist.length;i++){
                   let it = this.state.orditlist[i];
                   htmlStr += `
                   <tr>
                       <td style="font-size:12px;maxwidth:7%">${i+1}.</td>
                       <td style="font-size:12px;maxwidth:40%;">${it.prdname}</td>
                       <td style="font-size:12px;maxwidth:15%;">${it.prdquan}</td>
                       <td style="font-size:12px;maxwidth:15%;">${it.mrp}</td>
                       <td style="font-size:12px;maxwidth:15%;">${Number(it.ordittot/it.prdquan).toFixed(2)}</td>
                       <td style="font-size:12px;maxwidth:15%;">${it.ordittot}</td>
                   </tr>
                   <tr>
                      <td style="font-size:12px;maxwidth:15%;"></td>
                       <td style="font-size:12px;maxwidth:15%;">${it.hsn}</td>
                       <td style="font-size:12px;maxwidth:15%;">${Number(it.taxrate1)+Number(it.taxrate2)}</td>
                       <td style="font-size:12px;maxwidth:15%;">${Number(it.ordittax1)+Number(it.ordittax2)}</td>
                   </tr>
                   `
               }

               htmlStr += `

               </table>
           <hr/>
           <div style="display:flex; justify-content:space-between">
               <div style="text-align:center;font-size:14px;">Taxble Amount</div>
               <div style="text-align:center;font-size:14px;">${Number(parseFloat(this.state.selectedRow.ordamt)+parseFloat(this.state.selectedRow.ordtax)).toFixed(2)}</div>
           </div>
           
           <div style="display:flex; justify-content:space-between">
               <div style="text-align:center;font-size:14px;">Discount on Taxable Amt</div>
               <div style="text-align:center;font-size:14px;">${this.state.selectedRow.orddscnt}</div>
           </div>
           <div style="display:flex; justify-content:space-between">
               <div style="text-align:center;font-size:14px;">Wallet</div>
               <div style="text-align:center;font-size:14px;">${this.state.selectedRow.walamount}</div>
           </div>
           
           <div style="display:flex; justify-content:space-between">
               <div style="text-align:center;font-size:14px;">Total</div>
               <div style="text-align:center;font-size:14px;">${this.state.selectedRow.ordtot-this.state.selectedRow.walamount}</div>
           </div>
               <hr/>
               <div style="text-align:center;font-size:18px;">NET AMOUNT ₹ ${this.state.selectedRow.ordtot-this.state.selectedRow.walamount} <div> 
               <hr/>
               <div style="text-align:center;font-size:14px;"> YOU HAVE SAVED RUPEES ${this.state.selectedRow.orddscnt}</div>
               <hr/>`
               if(this.state.selectedRow.pmmethod == 'COD'){
               htmlStr += `
               <div style="display:flex; justify-content:space-between">
                   <div style="text-align:center;font-size:12px;">TENDER AMT: ${this.state.selectedRow.ordtot-this.state.selectedRow.walamount}</div>
                   <div style="text-align:center;font-size:12px;">CHANGE: ${0}</div>
               </div> `
               } else {
                   htmlStr += `
                   <div style="display:flex; justify-content:space-between">
                       <div style="text-align:center;font-size:12px;">Payment method:${this.state.selectedRow.pmmethod} </div>
                       <div style="text-align:center;font-size:12px;">Transaction ID: ${this.state.selectedRow.txnid.slice(4)}</div>
                   </div> `

               }
               
               htmlStr += `
               <hr/>
            <div style= "text-align: center;align-content: center; font-size:12px;margin-top:8px">Thanks for your purchase!</div>
           <div style= "text-align: center;align-content: center; font-size:12px"> <small>Refer Meebazaar Online to Earn Cash Points </small> </div>
           <div style= "text-align: center;align-content: center; font-size:12px"> <small>www.meebazaar.com </small> </div>
       
       </div>
  

       `;

       let htmlHdr = `
       <html>
       <head>
       <title>' + document.title  + '</title>
       
       
       </head> <body style="font-size: 12px; font-family: 'Times New Roman';">
       `
       var mywindow = window.open('', 'PRINT', 'height=400,width=600');

       mywindow.document.write(htmlHdr);
       mywindow.document.write(htmlStr);
       mywindow.document.write('</body></html>');
       
       mywindow.onload=function(){ // necessary if the div contain images
          console.log('loaded');
           mywindow.focus(); // necessary for IE >= 10
           mywindow.print();
           mywindow.close();
       };
   
       return true;
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
                }else if (name == 'editOrderDialog'){
                    return (
                        <div>
                            <Button label="Cancel" icon="pi pi-times" onClick={() => this.setState({editOrderDialog:false})} className="p-button-danger" />
                            <Button label="Submit" icon="pi pi-trash" onClick={() => this.submitOrder()} className="p-button-secondary"/>
                        </div>
                    )
                }else if(name == 'orderUpdateDialog'){
                    return (
                        <div>
                            <Button label="Cancel" icon="pi pi-times" onClick={() => this.setState({orderUpdateDialog:false})} className="p-button-danger" />
                            <Button label="Submit" icon="pi pi-trash" onClick={() => this.splitblockorders()} className="p-button-secondary"/>
                        </div>
                    )
                }
                
            
        
        
    }
    setInpValue = (val,obj)=>{
            
        let a = this.state.opArr.map((it)=>{
            if(it.prdname == obj.prdname && it.size == obj.size){
                it.val = val; return it;
            }else {
                return it;
            }
        })
        this.setState({opArr:a})
    }


    render () {
            let renderCancel = ['SUBMITTED','ORDER_READY'].includes(this.props.ordstat);
            if (APP_ID=="MEEBAZAAR"){
                renderCancel = ['SUBMITTED','ORDER_READY','PROCESSED','INCOMPLETE','PICKUP'].includes(this.props.ordstat);
            }
            let ordstatus = this.props.ordstat
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
                    {renderCancel && <Button icon="pi pi-trash"  className="p-button-danger" style={{marginRight:'.25em'}}  tooltip="Cancel Order" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({deleteDialog:true,orderCancelReason:''}) }}/>}
                    {renderCancel && <Button icon="pi pi-user"  style={{marginRight:'.25em'}}  tooltip="Assign Order" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({delboyDialog:true,selectedStat:'',selectedDelBoy:''}) }}/>}
                    {APP_ID == "MEEBAZAAR" && ordstatus == "SUBMITTED" && <Button  icon="pi pi-ban" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Block Orders" tooltipOptions={{position: 'top'}} onClick={()=>{ this.blockOrder()}} disabled={this.state.blockordbtn} /> }
                    {APP_ID == "MEEBAZAAR" && (ordstatus == "PROCESSED" || ordstatus =="INCOMPLETE") && <Button  icon="pi pi-align-center" className="p-button-success" style={{marginRight:'.25em'}} tooltip="Split Orders" tooltipOptions={{position: 'top'}} onClick={()=>this.setState({orderUpdateDialog:true})} disabled={this.state.orderUpdateDialog} /> }
                    <Button  icon="pi pi-eye" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="View Order" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({editDialog:true})}}/> 
                    <Button  icon="pi pi-pencil" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Edit Order" tooltipOptions={{position: 'top'}} onClick={()=>{ this.editOrder()}} />
                    {APP_ID == "MEEBAZAAR" && <Button  icon="pi pi-print" className="p-button-danger" style={{marginRight:'.25em'}} onClick={()=>this.getorderitdata()} tooltip="Print Order" tooltipOptions={{position: 'top'}} />}
                    <Button  icon="pi pi-file-o" className="p-button-success" onClick={()=>this.printOrder()} tooltip="Print Invoice" tooltipOptions={{position: 'top'}} />
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
                    style={{backgroundColor:'#5b616b'}}
                 >
                    {this.state.dynamicColumns}
            
                </DataTable> 

                
                    {this.state.editDialog && <OrderdetailDialog ordobj={this.state.selectedRow} setData = {this.setData} editDialog={this.state.editDialog}/>}
                
                <Dialog   style={{width: '50%',padding:'12px',height:'50%'}}  footer={this.renderFooter('delboyDialog')} header={<label style={{color:appTheme.primaryColor}}>Assign Order</label>} visible={this.state.delboyDialog}  blockScroll onHide={() => this.setState({ delboyDialog: false })} position="center">
                     
                    {this.state.showError && <div style={{color:'red',fontWeight:'bold',maxWidth:'300px',textAlign:'center',marginBottom:'12px'}}>{this.state.errorMsg}</div>}
                    <Dropdown appendTo={document.body} style = {{width:'90%',margin:'auto'}} value={this.state.selectedStat} options={this.state.orderStatusArr} onChange={(e) => {console.log(e);this.setState({selectedStat: e.value})}} placeholder="Select Order Status"/>
                    
                    <Dropdown appendTo={document.body} style = {{width:'90%',margin:'auto',marginTop:'12px'}} value={this.state.selectedDelBoy} options={this.state.delboyList} onChange={(e) => {console.log(e);this.setState({selectedDelBoy: e.value})}} placeholder="Select Delivery Boy" optionLabel="name"/>
                
                        
                </Dialog>
            <Dialog footer={this.renderFooter('deleteDialog')} visible={this.state.deleteDialog} onHide = {()=>{this.setState({deleteDialog:false})}} header={<label style={{color:appTheme.primaryColor}}>Cancelling the Order: {this.state.selectedRow.ordercd}</label>}   blockScroll  position="center">
                    <div>
                        
                        <InputText type="text" style = {{verticalAlign:'middle',marginRight:'.25em'}} onInput={(e) => this.setState({ orderCancelReason: e.target.value })} placeholder="Please specify the cancel reason" size="50" />
                        
                    </div>
            </Dialog>
            {APP_ID=="MEEBAZAAR" && <Dialog footer={this.renderFooter('orderUpdateDialog')} header={'Update Orders'} visible={this.state.orderUpdateDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide = {()=>this.setState({orderUpdateDialog:false})} position="center">
            <div>
            <table>
            <tr>
            <th style={{textAlign:"left"}}>Agency</th>
            <th style={{textAlign:"left"}}>Brand</th>
            <th style={{width:"30%",textAlign:"left"}}>Product Name</th>
            <th style={{textAlign:"left"}}>Size</th>
            <th style={{textAlign:"left"}}>OrderQ</th>
            {this.props.ordstat=="INCOMPLETE" && <th style={{textAlign:"left"}}>RequiredQ</th> }
            <th style={{textAlign:"left"}}>UpdateQ</th>
            </tr>
            {this.state.opArr.map((it)=>{
                return(
                    <tr>
                    <td><span>{it.agency}</span></td>
                    <td><span style={{marginRight:'1em'}}>{it.brand}</span></td>
                    <td><span style={{marginRight:'1em'}}>{it.prdname}</span></td>
                    <td><span style={{marginRight:'1em'}}>{it.size}</span></td>
                    <td><span style={{marginRight:'1em'}}>{it.ordquan}</span></td>
                    {this.props.ordstat=="INCOMPLETE" && <td><span style={{marginRight:'1em'}}>{it.remquan}</span></td> }
                    <td><span style={{marginRight:'1em'}} >
                            <InputText id={it.prdname} type="text" size={10} value={it.val} 
                            onChange={(e)=>{this.setInpValue(e.target.value,it)}} tooltip={"Actual Quantity"} 
                            tooltipOptions={{position: 'top'}}  disabled={false}
                            style={{width:'50px',margin:'auto'}}/>
                    </span></td>
                    </tr>
                )
            })}
            </table>
            </div>
            
        </Dialog> }
            {this.state.editOrderDialog && <EditOrder ordobj={this.state.selectedRow} setData = {this.setData} editOrderDialog={this.state.editOrderDialog}/>}

            
                   
                </div>
            
         )
      }  
        
    }





export default Neworders;