import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import {InputNumber} from 'primereact/inputnumber';

import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,delDataRow} from '../utils/ServiceCalls';
import {appTheme} from '../utils/Constants';
import {Button} from 'primereact/button';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import {Toolbar} from 'primereact/toolbar';


import { Card } from 'primereact/card';
import callsvc from '../utils/Services';
import { ADMIN_ERROR } from '../utils/Constants';





  


class Productitems extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'PRODUCT_ITEMS',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'', viewQuanDialog:false,barcodeArr:[],
            addQuanDialog: false, code: '', qty: '', expdt: '', mrp: '', saleprice: '', purchase: '',
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        console.log(this.props)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody)
        if(this.props.parid)
        getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getprditdata')
        else
        this.setState({data:[],selectedRow:{}})
    }

    componentDidUpdate(prevProps){
        if(this.props.parid != prevProps.parid){
            if(this.props.parid)
                getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getprditdata')
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
    saveRow = ()=>{
        let isFldMissing = checkReq(this.state.opArr,{orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,parid:this.props.parid},this.setData)
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${isFldMissing} seems to be missing! Please check`,life:6000});
            return;
        }
        let a ={objtype:this.state.objtype};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val']
        }
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'saveprditem');
    }
    
    myUploader = (event) => {
        uploadImg(event,this.state.opArr,this.setData,this.growl);
       
    }
    deleteRow = ()=>{
        this.setState({deleteDialog:false})
        let a = {objtype : this.state.objtype};
        a[this.state.idfld] = this.state.selectedRow[this.state.idfld];
        delDataRow(a,this.state.data,this.state.idfld,this.setData,this.growl,'delobjdata')
       
    }


    
    viewQuan = () => {
        
        callsvc({prditid:this.state.selectedRow.prditid},'barcodelist',false)
        .then((res)=>{
            if(res.code == '999'){
               if(res.data.length > 0){
                   this.setState({barcodeArr:res.data,viewQuanDialog:true})

               }else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:'oops... no barcodes exist for this product',life:6000});
               }

            } else if (res.code == '9991'){
                this.growl.show({severity: 'warn', summary: 'Error', detail:'oops... no barcodes exist for this product',life:6000});
            } else {
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})
        
    }

    submitQuan = () => {
        let reqFlds='';
        reqFlds = !this.state.code ? 'Barcode' : reqFlds;
        reqFlds += !this.state.mrp ? ',MRP' : reqFlds;
        reqFlds += !this.state.qty ? ',Quantity' : reqFlds;
        reqFlds += !this.state.expdt ? ',Expiration Date' : reqFlds;
        reqFlds += !this.state.saleprice ? ',Sale Price' : reqFlds;
        reqFlds += !this.state.purchase ? ',Purchase Price' : reqFlds;
        if(reqFlds){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${reqFlds} seems to be missing! Please check`,life:6000});
            return;
        }
        let inpobj = {prditid:this.state.selectedRow.prditid,
            code:this.state.code,
            mrp:this.state.mrp,
            qty:this.state.qty,
            expdt:this.state.expdt,
            saleprice:this.state.saleprice,
            purchase:this.state.purchase
        }

        callsvc(inpobj,'addbarcode',false)
        .then((res)=>{
            if(res.code == '999'){
                this.state.selectedRow.qtyin = parseInt(this.state.selectedRow.qtyin) + inpobj.qty;
                this.growl.show({severity: 'success', summary: 'Success', detail:'Barcode added successfully',life:6000});
                this.setState({addQuanDialog:false,code:'',mrp:0,qty:0,expdt:'',saleprice:0,purchase:0});


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

    addQuan = () => {

        this.setState({ addQuanDialog: true })
    }

    renderFooter() {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.setState({ addQuanDialog: false })} className="p-button-danger" />
                <Button label="Submit" icon="pi pi-check" onClick={() => this.submitQuan()} className="p-button-secondary" />
            </div>
        )

    }
    render () {
            return (
             <>
            <div style={{position:'relative'}}> 
             {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                <Growl ref={(el) => this.growl = el} sticky={true}/>

                <Card className="left-align-table">
            <Toolbar>
            <div className="p-toolbar-group-left">
                <div style={{display:'flex'}}>
                    {/* <i className={props.screenopt.icon} style={{marginRight:'24px',alignSelf:'center'}} /> */}
                    <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>{this.props.parname} </p>
                </div>
                
            </div>
            <div className="p-toolbar-group-right">
                <InputText type="search" style = {{verticalAlign:'middle',marginRight:'.25em'}} onInput={(e) =>this.gFilterVal(e.target.value)} placeholder="Global Search" size="50" />
               
                <Button  label="Barcodes"  className="p-button-warning" style={{marginRight:'.25em'}} tooltip="View Barcodes" tooltipOptions={{position: 'top'}} onClick={()=>{ this.viewQuan()}} disabled={!this.state.selectedRow}/> 
                <Button  label="Add Quantity"  className="p-button-success" style={{marginRight:'.25em'}} tooltip="Add Quantity" tooltipOptions={{position: 'top'}} onClick={()=>{ this.addQuan()}} disabled={!this.state.selectedRow}/> 
                <Button icon="pi pi-plus"  style={{marginRight:'.25em'}}  tooltip="New Record" tooltipOptions={{position: 'top'}} onClick={()=>{ this.showEditModal('ADD')}} disabled={!this.props.scrOptions.addopt}/>
                <Button  icon="pi pi-pencil" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Update Record" tooltipOptions={{position: 'top'}} onClick={()=>{ this.showEditModal('EDIT')}} disabled={!this.props.scrOptions.editopt}/> 
                <Button  icon="pi pi-trash" className="p-button-danger" onClick={()=>{this.setState({deleteDialog:true})}} tooltip="Delete Record" tooltipOptions={{position: 'top'}} disabled={!this.props.scrOptions.delopt}/>
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
                onRowDoubleClick = {()=>{ this.showEditModal('EDIT')}}
                style={{backgroundColor:'#5b616b'}}
             >
                {this.state.dynamicColumns}
        
            </DataTable> 
               
            </Card>
            
                    {/* <TableData 
                        screenopt        =  {Object.assign({},this.props.scrOptions,{name:`${this.props.parname}`})} 
                        dataValue        =  {this.state.data} 
                        rowSelected      =  {this.state.selectedRow} 
                        rowSelectUpdate  =  {this.rowsSelect} 
                        dynamicColumns   =  {this.state.dynamicColumns}
                        gFilter          =  {this.state.globalFilter}
                        gFilterval       =  {this.gFilterVal}
                        exportData       =  {this.state.exportFldArr}
                        addModal         =  {this.showEditModal}
                        deleteModal      =  {()=>{this.setState({deleteDialog:true})}}
                        
                    /> */}

                    <DeleteDialog  
                        title       =  {this.state.selectedRow ? `${this.state.selectedRow['name']} ${this.state.selectedRow['size']}` : 'Record'}
                        visible     =  {this.state.deleteDialog} 
                        hideDialog  =  {()=>{this.setState({deleteDialog:false})}}
                        deleteBtn   =  {this.deleteRow}
                    />
                    <AddDialog
                       dataArr      =  {this.state.opArr}
                       title        =  "Add/Edit Modal"
                       hideDialog   =  {()=>{this.setState({editDialog:false})}}
                       inpValue     =  {this.setInpVal}
                       visible      =  {this.state.editDialog}
                       saveBtn      =  {this.saveRow}
                       fileUpload   =   {this.myUploader}
                    />
                    <Dialog style={{width:'100%',height:'100%',verticalAlign:'middle',padding:'20px'}}   header={<label style={{ color: appTheme.primaryColor }}>Barcode List</label>} visible={this.state.viewQuanDialog} blockScroll onHide={() => this.setState({ viewQuanDialog: false })} position="center">
                    <div>
                        <div  className="left-align-table">
                            <DataTable value={this.state.barcodeArr}> 
                                
                                <Column field="code" header="Barcode"></Column>
                                <Column field="qty" header="Quantity"></Column>
                                <Column field="expdt" header="Expiry"></Column>
                                <Column field="mrp" header="Mrp"></Column>
                                <Column field="saleprice" header="Sale Price"></Column>
                                <Column field="purchase" header="Purchase Price"></Column>
                                
                            </DataTable>
                        </div>
                    </div>
                    </Dialog>
                    <Dialog style={{width:'100%',height:'100%',verticalAlign:'middle',padding:'20px'}}   footer={this.renderFooter()} header={<label style={{ color: appTheme.primaryColor }}>Add Quantity</label>} visible={this.state.addQuanDialog} blockScroll onHide={() => this.setState({ addQuanDialog: false })} position="center">
                    <div className="p-grid" style={{width:'100%',padding:'40px'}}>
                            {/* <InputText type="text" style={{ verticalAlign: 'middle', marginRight: '.25em',width:'300px' }} onInput={(e) => this.setState({ code: e.target.value })} placeholder="Please enter Barcode" size="50" /> */}
                            <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputText id={'code'} type="text" style={{ width: '300px' ,marginTop:'12px'}}
                                        value={this.state.code}
                                        onChange={(e) => { this.setState({ code: e.target.value }) }} tooltip={'Promo Code'}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <label htmlFor={'code'}>BarCode</label>
                                </span>
                            </div>
                            <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputNumber id={'qty'} style={{ width: '300px' ,marginTop:'12px'}}
                                      value={this.state.qty} 
                                        onChange={(e) => { this.setState({ qty: e.target.value }) }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <label htmlFor={'qty'}>Quantity</label>
                                </span>
                            </div>
                            <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputText type="date" id={'expdt'} style={{ width: '300px',marginTop:'12px' }}
                                        onChange={(e) => { this.setState({ expdt: e.target.value }) }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <label htmlFor={'expdt'}>Expiry Date</label>
                                </span>
                            </div>
                            {/* <div>
                                Expiry Date: <InputText type="date" style={{ verticalAlign: 'middle', marginRight: '.25em', marginTop: '12px' }} onInput={(e) => this.setState({ expdt: e.target.value })} placeholder=" Expiry Date" size="50" />
                            </div> */}

                            <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputNumber id={'mrp'} style={{ width: '300px',marginTop:'12px' }}
                                    value={this.state.mrp}
                                        onChange={(e) => { this.setState({ mrp: e.target.value }) }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <label htmlFor={'mrp'}>MRP price</label>
                                </span>
                            </div>

                            <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputNumber id={'saleprice'} style={{ width: '300px',marginTop:'12px' }}
                                    value={this.state.saleprice}
                                        onChange={(e) => { this.setState({ saleprice: e.target.value }) }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <label htmlFor={'saleprice'}>Sale price</label>
                                </span>
                            </div>

                            <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputNumber id={'purchase'} style={{ width: '300px',marginTop:'12px' }}
                                    value={this.state.purchase}
                                        onChange={(e) => { this.setState({ purchase: e.target.value }) }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                    <label htmlFor={'purchase'}>purchase price</label>
                                </span>
                            </div>
                        </div>
                    </Dialog>
                     
            </div>
           
            </>
         )
      }  
        
    }




export default Productitems;