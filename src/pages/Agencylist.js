import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import {TabView,TabPanel} from 'primereact/tabview';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import Locationstores from './Locationstores'
import { Dialog } from 'primereact/dialog';
import {Button} from 'primereact/button';
import callsvc from '../utils/Services';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import {Dropdown} from 'primereact/dropdown';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';

class Agencylist extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            objtype:'AGENCY_LIST_FLDS',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),addlist:[],dynamicColumns2:[],
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            searchProdData:[],searchInp:'',prdData:[],agency:'',brand:'',tranDate:'',
            tranTypeList:[{label:'DEBIT',value:'DEBIT',id:1},{label:'CREDIT',value:'CREDIT',id:2}],
            selectedTranType:'DEBIT',updateDialog:false,agencyProds:[],globalFilter:null, globalFilter2:null,
            transDialog:false,prditemDialog:false, agencyItems:[],orgid:'',empid:'',
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        
        setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype},this.setData,this.growl);
        this.setState({orgid:this.state.userobj.orgid,empid:this.state.userobj.empid},()=>{console.log(this.state.orgid)})
        
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
    gFilterVal2 = (value) => {
        this.setState({ globalFilter2: value })
    }
    showEditModal = (op)=>{
        
        let opArr = this.state.fldArr.map((it)=>{
                let a =  Object.assign({},it,{val:(op == 'EDIT') ? this.state.selectedRow[it.field] : it.val});
                a.val = (a.val == 'NULL' || a.val == null)? '':a.val;
                a.val = (a.type == 'num') ? Number(a.val) :a.val;
                return a;
        })

        console.log(this.state.fldArr,this.state.selectedRow,opArr)
        
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

    setaddListValue = (val,obj)=>{
        let a = this.state.addlist.map((it)=>{
            if(it.prditid==obj.prditid){
                it.ordquan = val; return it;
            }else{
                return it;
            }
        })
        this.setState({addlist:a})
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
        
        a['appid'] = "MEEBAZAAR";
        console.log(a);
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'insobjdata');
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

    getAgencyItem = () =>{
        this.setState({agencyItems:[],tranDate:''});
        let inpobj = {orgid:this.state.orgid,empid:this.state.empid,agencyid:this.state.selectedRow.agencyid};
        
        callsvc(inpobj,'getagencytranitems',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({agencyItems:res.data,transDialog:true})
            
            }else{
                this.setState({transDialog:true})
            }
        })
        .catch((err=>{
            console.log(err)
        }))
        
    }



    transFooter(type){
        if(type=='tran'){
            return(
                <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>this.setState({transDialog:false,addlist:[]})} className="p-button-secondary"/>
                <Button label="Create" icon="pi pi-check" onClick={() =>this.createTxn()} className="p-button-primary" />
                
            </div>
            )
        }else if(type=='upd'){
            return(
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>this.setState({updateDialog:false})} className="p-button-secondary"/>
                <Button label="Update" icon="pi pi-check" onClick={() =>this.priceUpdate()} className="p-button-primary" />
                
            </div>
            )
        }else{
            return(
                <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>this.setState({prditemDialog:false})} className="p-button-secondary"/>
                <Button label="Add Items" icon="pi pi-check" onClick={() =>this.addprdItem()} className="p-button-primary" />
                
                </div>
            )
        }
    }

    createTxn = ()=>{
        if(this.state.tranDate.length<2){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `Date Field seems to be missing! Please check`,life:6000});
            return
        }
        let items = this.state.agencyItems
        for(let i=0;i<items.length;i++){
            items[i]['prdname'] = encodeURIComponent(items[i]['prdname']);
        }
        items = JSON.stringify(items)
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,items:items,tnstype:this.state.selectedTranType,tnsdate:this.state.tranDate,agencyid:this.state.selectedRow.agencyid}
        callsvc(inpobj,'addagencytrasaction',false)
        .then((res)=>{
            if(res.code == '999'){
                this.growl.show({severity: 'success', summary: '', detail: 'Transaction Created Successfully',life:6000});
                this.setState({agencyItems:[],transDialog:false})
            }else{

                this.setState({transDialog:true})
            }
        })
        .catch((err=>{
            console.log(err)
        }))

    }
    addprdItem =()=>{
        
        let a = this.state.addlist;
        let b = this.state.agencyItems;
        let alength = a.length;
        let blength = b.length;
        let flag = false;
        for(let i=0;i<alength;i++){
            for(let j=0;j<blength;j++){
                if(b[j].prditid==a[i]['prditid']){
                    b[j]['ordquan'] = parseInt(a[i]['ordquan']) + parseInt(b[j]['ordquan'])
                    flag = true;
                    break;
                }
            }
            if(!flag){
                b.push(a[i]);
            }
        }
        this.setState({agencyItems:b,prditemDialog:false,addlist:[]});
    }
    setInpValue = (val,obj) =>{
        let a = this.state.agencyItems.map((it)=>{
            if(it.prdname == obj.prdname && it.size == obj.size){
                it.ordquan = val; return it;
            }else {
                return it;
            }
        })
        this.setState({agencyItems:a})
    }
    
    doProductSearch = (val) => {
        val = val.toLowerCase();
        this.setState({ searchInp: val })
        if (val.length > 2) {
            this.state.searchProdData = this.state.prdData.filter((it) => {
                return (
                    it.name.toLowerCase().indexOf(val) > -1


                );
            })
        } else {
            this.state.searchProdData = []
        }
        this.setState({ searchProdData: this.state.searchProdData })


    }
    addAgencyItem = (it) => {
        //console.log(it);
        let a = {
            'agency' : it.agency,
            'brand' : it.brand,
            'prditid':it.prditid,
            'prdname':it.name,
            'purchase':it.purchase,
            'size':it.size,
            'ordquan':1,
        }
        let flag = true
        let b = this.state.addlist;
        for(let i=0;i<b.length;i++){
            if(b[i]['prditid'] == it.prditid){
                b[i]['ordquan'] = parseInt(b[i]['ordquan']) + 1
                flag = false;
                break;
            }
        }
        if(flag) b.push(a);
        this.setState({addlist:b});
    }
    getPrdData = () => {
        callsvc({ ordid: this.state.userobj.orgid, empid: this.state.userobj.empid,agencyid:this.state.selectedRow.agencyid}, 'getagencyproditems', false)
            .then((res) => {
                if (res.code == '999') {
                    let prdData = res.data.map((it)=>{
                        it.barcodes =it.barcodes.split(",");
                        return it;
                    })
                    this.setState({ prdData: prdData,prditemDialog:true})
                }

            })
            .catch((err) => { console.log(err) })
            .finally(() => { })
    }
    priceUpdate = () =>{
        let prods = this.state.agencyProds;
        for(let i=0;i<prods.length;i++){
            prods[i]['prdname'] = encodeURIComponent(prods[i]['prdname']);
        }

        callsvc({ ordid: this.state.userobj.orgid, empid: this.state.userobj.empid,agencyid:this.state.selectedRow.agencyid,prods:JSON.stringify(prods)}, 'updateagencyprices', false)
            .then((res) => {
                if (res.code == '999') {
                    this.growl.show({severity: 'success', summary: 'Updated', detail: 'Price Updated Successfully',life:6000});
                    this.setState({updateDialog:false})
                }else{
                    this.growl.show({severity: 'warn', summary: 'Something went wrong', detail: 'Something went wrong, please check input fields',life:6000});

                }

            })
            .catch((err) => { console.log(err) })
            .finally(() => { })
        
    }
    onCellEditComplete= (e)=>{
        let { rowData, newValue, field, originalEvent: event } = e;
        if (this.isPositiveInteger(newValue)){
            rowData[field] = newValue;
        }else{
            event.preventDefault();
        }
    }
    isPositiveInteger(val) {
        let str = String(val);
        str = str.trim();
        if (!str) {
            return false;
        }
        str = str.replace(/^0+/, "") || "0";
        let n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    }

    updatePrices = () =>{
        callsvc({ ordid: this.state.userobj.orgid, empid: this.state.userobj.empid,agencyid:this.state.selectedRow.agencyid}, 'getagencyprods', false)
            .then((res) => {
                if (res.code == '999') {
                    let colArr = []
                    let data = res.data
                    Object.keys(data[0]).map((key)=>{
                        if(key=='prditid'){}
                        else{
                        let a = {header:`${key}`,value:`${key}`}
                        colArr.push(a);
                        }
                    })
                    console.log(colArr);
                    let dynamicColumns = [];
                    for(let i=0; i<colArr.length;i++){
                        if(colArr[i]['header']=='price' || colArr[i]['header']=='promoprice'|| colArr[i]['header']=='purchase' || colArr[i]['header']=='stock'){
                            dynamicColumns.push(<Column editor={this.textEditor} editorValidator={this.requiredValidator}  style={{width:'120px',color:'blue'}} key={colArr[i]['header']} field={colArr[i]['value']} header={colArr[i]['header']} sortable={false}  />);
                        }else{
                            dynamicColumns.push(<Column  style={{width:'120px'}} key={colArr[i]['header']} field={colArr[i]['value']} header={colArr[i]['header']} sortable={true}  />);
                        }
                    }
                    this.setState({ agencyProds: res.data,updateDialog:true,dynamicColumns2:dynamicColumns})
                }

            })
            .catch((err) => { console.log(err) })
            .finally(() => { })
    }
    requiredValidator = (props)=> {
        //console.log("in");
        let value = props.rowData[props.field];
        return this.isPositiveInteger(value);
    }
    onEditorValueChange( props, value) {
        let updatedProducts = [...props.value];
        updatedProducts[props.rowIndex][props.field] = value;
        this.setState({ agencyProds: updatedProducts });
    }

    
    inputField(props,field,it){
        return(
            <InputText id={it.prdname} type="text" size={10} value={props.rowData[field]} 
            onChange={(e)=>{this.setProdValue(e.target.value,it,field,props)}} tooltip={field} 
            tooltipOptions={{position: 'top'}}  disabled={false}
            style={{width:'50px',margin:'auto'}}/>
        )
    }

    
    inputTextEditor = function(props, field){
        return <InputText type="text" size={10} value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    textEditor =(props) => {
        return this.inputTextEditor(props,props.field);
    }

    

    render () {
        const header = (
            <div style={{'textAlign':'left'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter2: e.target.value})} placeholder="Global Search" size="50"/>
            </div>
        );
            return (
             
            <div style={{position:'relative'}}> 
             {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                <Growl ref={(el) => this.growl = el} sticky={true}/>
            
                    <TableData 
                        screenopt        =  {this.state.scrOptions} 
                        dataValue        =  {this.state.data} 
                        rowSelected      =  {this.state.selectedRow} 
                        rowSelectUpdate  =  {this.rowsSelect} 
                        dynamicColumns   =  {this.state.dynamicColumns}
                        gFilter          =  {this.state.globalFilter2}
                        gFilterval       =  {this.gFilterVal}
                        exportData       =  {this.state.exportFldArr}
                        addModal         =  {this.showEditModal}
                        deleteModal      =  {()=>{this.setState({deleteDialog:true})}}
                        tabletype = "agency"
                        addTran = {this.getAgencyItem}
                        priceupdate = 'Y'
                        updatePrice = {this.updatePrices}
                        
                    />
                    <Dialog header='Update Prices' footer={this.transFooter('upd')} visible={this.state.updateDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide = {()=>this.setState({updateDialog:false})} position="center" >
                    <Button icon="pi pi-undo" label="Clear" tooltip="Clear Search" className="p-button-primary"  style={{marginRight:'0.25em'}} onClick={()=>{this.setState({globalFilter2:null})}} ></Button>
                    <DataTable
                    value = {this.state.agencyProds}
                    header ={header}
                    globalFilter={this.state.globalFilter2}
                    onSelectionChange = {(e)=>{this.setState({globalFilter2:null},()=>{console.log("set")})}}
                    >
                    {this.state.dynamicColumns2}
                    </DataTable>
                    </Dialog>
                    <Dialog header='Add Transaction' footer={this.transFooter('tran')} visible={this.state.transDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide = {()=>this.setState({transDialog:false})} position="center" >
                    <div>
                    <Button icon="pi pi-plus" label="ADD" tooltip="Add Items" className="p-button-primary"  style={{marginRight:'0.25em'}} onClick={()=>this.getPrdData()} ></Button>
                    <Dropdown required  size={30}appendTo={document.body} style = {{width:'100px',marginRight:'0.25em'}} value={this.state.selectedTranType} options={this.state.tranTypeList} onChange={(e) => {console.log(e);this.setState({selectedTranType: e.value})}} placeholder="Select" optionLabel="label" tooltip="Transaction Type"/>
                    <InputText required id={'date'} type="date" value={this.state.tranDate} 
                    onChange={(e)=>{this.setState({tranDate:e.target.value},()=>{console.log(this.state.tranDate)})}} tooltip={'Trasaction Date'} 
                    tooltipOptions={{position: 'top'}}
                    style={{marginRight:'0.25em',marginTop:'3px'}}/>
                    <br/>
                    <hr/>
                    <div>
                    <table>
                    <tr>
                    <th style={{textAlign:"left"}}>Agency</th>
                    <th style={{textAlign:"left"}}>Brand</th>
                    <th style={{width:"30%",textAlign:"left"}}>Product Name</th>
                    <th style={{textAlign:"left"}}>Size</th>
                    <th style={{textAlign:"left"}}>Purchase</th>
                    <th style={{textAlign:"left"}}>Quantity</th>
                    </tr>
                    {this.state.agencyItems.map((it)=>{
                        return(
                            <tr>
                            <td><span>{it.agency}</span></td>
                            <td><span style={{marginRight:'1em'}}>{it.brand}</span></td>
                            <td><span style={{marginRight:'1em'}}>{it.prdname}</span></td>
                            <td><span style={{marginRight:'1em'}}>{it.size}</span></td>
                            <td><span style={{marginRight:'1em'}}>{it.purchase}</span></td>
                            <td><span style={{marginRight:'1em'}} >
                                    <InputText id={it.prdname} type="text" size={10} value={it.ordquan} 
                                    onChange={(e)=>{this.setInpValue(e.target.value,it)}} tooltip={"Order Quantity"} 
                                    tooltipOptions={{position: 'top'}}  disabled={false}
                                    style={{width:'50px',margin:'auto'}}/>
                            </span></td>
                            </tr>
                        )
                    })}
                    </table>
                    </div>
                    </div>
                    </Dialog>
                    <Dialog header='Add Item' footer={this.transFooter('item')} visible={this.state.prditemDialog} style={{width:'70%',height:"70%",verticalAlign:'middle'}}  blockScroll onHide = {()=>this.setState({prditemDialog:false})} position="center" >
                    <div>
                    <div style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f4f4f4', border: '1px solid #c8c8c8', color: '##333333' }}>
                        <div style={{ position: 'relative', padding: '4px' }}>
                            <InputText size={60} style={{ width: '50%' }} value={this.state.searchInp} type="text"
                                onChange={(e) => { this.doProductSearch(e.target.value) }}
                                placeholder="Search for Products" />
                            {this.state.searchInp.length > 0 && <i className="pi pi-times" style={{ position: 'absolute', right: 12, top: '40%', color: '#a9a9a9', fontSize: 12 }} onClick={() => { this.doProductSearch('') }} />}
                        </div>

                    </div>
                    <div>
                        <div>
                        <div style={{height: window.innerHeight - 140, display:'inline-block', overflow: 'scroll', width:'40%' }}>
                            {this.state.searchProdData.map((it) =>
                                <div key={it.prditid} style={{ display: 'flex', position: 'relative', flexDirection: 'row', margin: 1, border: '1px solid #c8c8c8', alignItems: 'center' }}>

                                    <img src={it.image} style={{ height: 60, width: 60, marginLeft: 12 }} />


                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 12 }}>
                                        <div>{it.name}-{it.size}</div>
                                        {it.onpromo ? <div> Rs {it.promoprice} <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Rs {it.price}</span> </div> : <div>Rs {it.price}</div>}
                                    </div>
                                    <div>
                                        <Button label="Add" style={{ position: 'absolute', right: 10, top: '40%' }} onClick={(e) => { this.addAgencyItem(it) }} />
                                    </div>

                                </div>
                            )}
                            </div>
                            <div style={{float:'left',maxWidth:'50%'}}>
                            <table>
                            <tr>
                            <th style={{textAlign:"left"}}>Agency</th>
                            <th style={{textAlign:"left"}}>Brand</th>
                            <th style={{width:"30%",textAlign:"left"}}>Product Name</th>
                            <th style={{textAlign:"left"}}>Size</th>
                            <th style={{textAlign:"left"}}>Purchase</th>
                            <th style={{textAlign:"left"}}>Quantity</th>
                            </tr>
                            {this.state.addlist.map((it)=>{
                                return(
                                    <tr>
                                    <td><span>{it.agency}</span></td>
                                    <td><span style={{marginRight:'1em'}}>{it.brand}</span></td>
                                    <td><span style={{marginRight:'1em'}}>{it.prdname}</span></td>
                                    <td><span style={{marginRight:'1em'}}>{it.size}</span></td>
                                    <td><span style={{marginRight:'1em'}}>{it.purchase}</span></td>
                                    <td><span style={{marginRight:'1em'}} >
                                            <InputText id={it.prdname} type="text" size={10} value={it.ordquan} 
                                            onChange={(e)=>{this.setaddListValue(e.target.value,it)}} tooltip={"Order Quantity"} 
                                            tooltipOptions={{position: 'top'}}  disabled={false}
                                            style={{width:'50px',margin:'auto'}}/>
                                    </span></td>
                                    </tr>
                                )
                            })}
                            </table>
                        </div>
                        </div>
                    </div>

                
                </div>
                    </Dialog>
                   

                    <DeleteDialog  
                    title       =  {this.state.selectedRow ? this.state.selectedRow['name']:''} 
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
                     
            </div>
           
         )
      }
}

export default Agencylist