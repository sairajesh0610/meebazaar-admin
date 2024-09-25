import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';

import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import {appTheme,APP_URL} from '../utils/Constants';
import {ADMIN_ERROR,styleDrag} from '../utils/Constants';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import {Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import {Toolbar} from 'primereact/toolbar';

import ExcelExport from '../components/ExcelExport';

import OrderdetailDialog from '../components/OrderdetailDialog';

import callsvc from "../utils/Services";


import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import DeleteDialog from '../components/DeleteDialog';



class Custwallet extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'WALLET_CUST_TXN_FLDS', 
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
        getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getobjdata');
        this.getList();
       
    }

    componentDidUpdate(prevProps){
        if(this.props.parid != prevProps.parid){
            if(this.props.parid)
                getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getobjdata')
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

    getList(){
        callsvc({type:'WALLET_ADD_LIST'},'getlists')
        .then((res)=>{
            if(res.code == '999'){
                let walletidArr = []
                for(let i=0; i<res.data.length;i++){
                    let a = {listid:res.data[i].listid,val:res.data[i]["val"],descpt:res.data[i].descpt};
                    if(res.data[i].listid){
                        walletidArr.push(a);
                    }
            }
                console.log("walletidArr",walletidArr);
                this.setState({walletidlist:walletidArr});

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

                if(a.field=="tnsid"){
                    for(let i=0;i<this.state.walletidlist.length;i++){
                        if(a.val==this.state.walletidlist[i]['val']){
                            a.val = this.state.walletidlist[i];
                        }
                    }
                }

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
    deleteRow = ()=>{
        this.setState({deleteDialog:false})
        let a = {objtype : this.state.objtype};
        a[this.state.idfld] = this.state.selectedRow[this.state.idfld];
        delDataRow(a,this.state.data,this.state.idfld,this.setData,this.growl,'delobjdata')
       
    }
    renderFooter = () => {
   
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>{this.setState({editDialog:false})}} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>this.saveRow()} className="p-button-primary" />
                
            </div>
        );
    }
    saveRow = ()=>{
        let isFldMissing = checkReq(this.state.opArr,{orgid:this.state.userobj.orgid,empid:this.state.empid},this.setData)
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${isFldMissing} seems to be missing! Please check`,life:6000});
            return;
        }
        let a ={objtype:this.state.objtype};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val']
        }
        //console.log("fir",a);
        a.tnsid = a.tnsid.val;
        a.custid = this.props.parid;
        console.log("a",a);
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'inswallet');
    }
    onChangeDropdown = (val,it) => {
        for(let i=0;i<this.state.opArr.length;i++){
            
            if(this.state.opArr[i].field == it.field){
                this.state.opArr[i].val = val;
            }
            //console.log(this.state.opArr[i].val);
        }
        this.setState({opArr:this.state.opArr})

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
          

        return (
             
            <div style={{position:'relative'}}> 
             {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                <Growl ref={(el) => this.growl = el} sticky={true}/>
            
                    <TableData 
                        screenopt        =  {this.props.screenopt} 
                        dataValue        =  {this.state.data} 
                        rowSelected      =  {this.state.selectedRow} 
                        rowSelectUpdate  =  {this.rowsSelect} 
                        dynamicColumns   =  {this.state.dynamicColumns}
                        gFilter          =  {this.state.globalFilter}
                        gFilterval       =  {this.gFilterVal}
                        exportData       =  {this.state.exportFldArr}
                        addModal         =  {this.showEditModal}
                        deleteModal      =  {()=>{this.setState({deleteDialog:true})}}
                        
                        
                    />

                

                    <DeleteDialog  
                        title       =  {this.state.selectedRow ? this.state.selectedRow['name']:''} 
                        visible     =  {this.state.deleteDialog} 
                        hideDialog  =  {()=>{this.setState({deleteDialog:false})}}
                        deleteBtn   =  {this.deleteRow}
                    />
                    
                    <Dialog footer={this.renderFooter()} header={'Add/edit'} 
                    visible={this.state.editDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  
                    blockScroll onHide = {()=>{this.setState({editDialog:false})}} position="center">
                        <div className="p-grid" style={{width:'100%',padding:'40px'}}>
                            {this.state.opArr.map((it)=>{
                                //console.log(it);
                                if(it.formshow){
                                    if(it.type == 'text'){
                                        return (
                                        <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                            <span className="p-float-label">
                                                <InputText id={it.field} type="text" size={30} value={it.val} 
                                                onChange={(e)=>{this.setInpVal(e.target.value,it)}} tooltip={it.tooltip} 
                                                tooltipOptions={{position: 'top'}}  disabled={it.disabled}
                                                style={it.inpstyle}/>
                                                <label htmlFor={it.field}>{it.tblheader}</label>
                                            </span> 
                                        </div>)
                    
                    
                                    }else if(it.type == 'time'){
                                        return (
                                        <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                            <span className="p-float-label">
                                                <InputText id={it.field} type="time" size={30} value={it.val} 
                                                onChange={(e)=>{this.setInpVal(e.target.value,it)}} tooltip={it.tooltip} 
                                                tooltipOptions={{position: 'top'}}  disabled={it.disabled}
                                                style={it.inpstyle}/>
                                                <label htmlFor={it.field}>{it.tblheader}</label>
                                            </span> 
                                        </div>)
                    
                    
                                    }else if(it.type == 'date'){
                                        return (
                                        <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                            <span className="p-float-label">
                                                <InputText id={it.field} type="date" size={30} value={it.val} 
                                                onChange={(e)=>{this.setInpVal(e.target.value,it)}} tooltip={it.tooltip} 
                                                tooltipOptions={{position: 'top'}}  disabled={it.disabled}
                                                style={it.inpstyle}/>
                                                <label htmlFor={it.field}>{it.tblheader}</label>
                                            </span> 
                                        </div>)
                    
                    
                                    }else if(it.type == 'textarea'){
                                        return (
                                        <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                            <span className="p-float-label">
                                                <InputTextarea id={it.field}  style = {{width:'233px',maxHeight:'50px'}} rows={3} value={it.val} 
                                                onChange={(e) => {this.setInpVal(e.target.value,it)}} tooltip={it.tooltip} tooltipOptions={{position: 'top'}} 
                                                placeholder={it.tblheader} disabled={it.disabled} style={it.inpstyle} />
                                                {/* <label htmlFor={it.field}>{it.tblheader}</label> */}
                                            </span> 
                                        </div>)
                                        
                    
                                    }else if(it.type == 'num'){
                                        return (
                                        <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                            <span className="p-float-label">
                                                <InputNumber id={it.field}  size={30} value={it.val} onChange={(e) => {this.setInpVal(e.target.value,it)}} 
                                                tooltip={it.tooltip} tooltipOptions={{position: 'top'}} disabled={it.disabled} style={it.inpstyle} />
                                                <label htmlFor={it.field}>{it.tblheader}</label>
                                            </span> 
                                        </div>)
                                        
                    
                                    }else if(it.type == 'list'){
                                        return (
                                            <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                                    <Dropdown id={it.field}  value={it.val} style = {{minWidth:'233px'}} options={it.field == 'tnsid' ? this.state.walletidlist : ""} 
                                                    ariaLabel={it.tblheader} onChange={(e) => {this.onChangeDropdown(e.target.value,it)}} 
                                                    optionLabel={"val"} tooltip={it.tooltip} tooltipOptions={{position: 'top'}} placeholder={it.tblheader} 
                                                    disabled={it.disabled} style={it.inpstyle}/>   
                                                 
                                            </div>)
                    
                                      
                    
                                    }else if(it.type == 'check'){
                                        return (
                                            <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                                  <span className="p-float-label">
                                                  <Checkbox inputId={it.field} value={it.field} onChange = {(e) => {this.setInpVal(!it.val,it)}} checked={it.val} 
                                                  tooltip={it.tooltip} tooltipOptions={{position: 'top'}} disabled={it.disabled}></Checkbox>
                                                    <label style={{marginLeft:'8px'}} htmlFor={it.field} className="check-label p-checkbox-label">{it.field}</label>
                                                 </span>
                                            </div>)
                                    }
                                }
                            })}
                        </div>
                    </Dialog>
            </div>
            
            
         )
      }  
        
    }





export default Custwallet;