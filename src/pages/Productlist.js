import React from 'react';
import { Dialog } from 'primereact/dialog';

import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import {Button } from 'primereact/button';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import Productitems from './Productitems';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import callsvc from '../utils/Services';
import { ADMIN_ERROR, APP_ID } from '../utils/Constants';

class Productlist extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'PROD_FLDS_LIST',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false},
            catlist:[],subcatlist:[], selSubList:[],agencylist:[]
        }
    }

    componentDidMount(){
        
        setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype},this.setData,this.growl,'productlist');
        this.getCatList();
        this.getAllAgencies();
        
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

    getCatList = () => {
        callsvc({table:'mb_pdl'},'catlistall',false)
        .then((res)=>{
            if(res.code == '999'){
                let catArr = [], subCatArr=[];

                for(let i=0; i<res.data.length;i++){
                    let a = {name:res.data[i].name,pdlid:res.data[i].pdlid,parid:res.data[i].parid};
                    if(!res.data[i].parid){
                        catArr.push(a);
                    }else{
                        subCatArr.push(a);
                    }
                }
                this.setState({catlist:catArr,subcatlist:subCatArr});

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

    getAllAgencies = ()=>{
        if(APP_ID=='MEEBAZAAR'){
            callsvc({orgid:this.state.userobj.orgid,empid:this.state.userobj.empid},'getallagencies',false)
            .then((res)=>{
                if(res.code == '999'){
                    this.setState({agencylist:res.data});
    
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
    }
    
    
    rowsSelect = (value) =>{
        this.setState({ selectedRow: value })
    }
    gFilterVal = (value) => {
        this.setState({ globalFilter: value })
    }

    editSubCatList = (pdlid) => {
        let subCatArr = [];
        for(let i=0;i<this.state.subcatlist.length; i++){
            if(this.state.subcatlist[i]['parid'] == pdlid){
                subCatArr.push(this.state.subcatlist[i]);
            }
        }
        this.setState({selSubList:subCatArr});
    }
    showEditModal = (op)=>{
        
        let opArr = this.state.fldArr.map((it)=>{
                let a =  Object.assign({},it,{val:(op == 'EDIT') ? this.state.selectedRow[it.field] : it.val});
                if(a.type == 'check'){
                    a.val = (a.val === 'true') ? true:a.val;
                    a.val = (a.val === 'false') ? false:a.val;
                }
                a.val = (a.val == 'NULL' || a.val == null)? '':a.val;
                a.val = (a.type == 'num') ? Number(a.val) :a.val;
                
                if(a.field == 'catname'){
                    for(let i=0; i<this.state.catlist.length;i++){
                        if(a.val == this.state.catlist[i]['name']){
                            a.val = this.state.catlist[i];
                            this.editSubCatList(this.state.catlist[i].pdlid)
                            break;
                        }
                    }
                }
                if(a.field == 'subcatname'){
                    for(let i=0; i<this.state.subcatlist.length;i++){
                        if(a.val == this.state.subcatlist[i]['name']){
                            a.val = this.state.subcatlist[i];
                            break;
                        }
                    }
                }
                if(a.field == 'agency'){
                    for(let i=0;i<this.state.agencylist.length;i++){
                        if(a.val==this.state.agencylist[i]['name']){
                            a.val = this.state.agencylist[i];
                            break;
                        }
                    }
                }
                return a;
        })
        console.log(opArr);
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
        
        let catid = '', subcatid ='';
        for(let i=0; i<this.state.opArr.length;i++){
            
            if(this.state.opArr[i]['field'] == 'catname'){
                if(this.state.opArr[i].val && this.state.opArr[i].val.pdlid){
                    catid = this.state.opArr[i].val.pdlid;
                }
                    else{
                        this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `Category seems to be missing! Please check`,life:6000});
                        return;
                    }
            }
            
            if(this.state.opArr[i]['field'] == 'subcatname'){
                if(this.state.opArr[i].val && this.state.opArr[i].val.pdlid){
                    subcatid = this.state.opArr[i].val.pdlid;
                }else{
                    this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `SubCategory seems to be missing! Please check`,life:6000});
                    return;
                }

            }
        }

        for(let i=0; i<this.state.opArr.length;i++){
            if(this.state.opArr[i]['field'] == 'pdlid'){
                this.state.opArr[i]['val'] = catid;
            }
            if(this.state.opArr[i]['field'] == 'subcatid'){
                this.state.opArr[i]['val'] = subcatid;
            }
        }
        
        
        let isFldMissing = checkReq(this.state.opArr,{orgid:this.state.userobj.orgid,empid:this.state.empid},this.setData)
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${isFldMissing} seems to be missing! Please check`,life:6000});
            return;
        }
        let a ={objtype:this.state.objtype};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val'];
            if(this.state.opArr[i]['field'] == 'catname' || this.state.opArr[i]['field'] == 'subcatname'){
                a[this.state.opArr[i]['field']] = (this.state.opArr[i]['val']['name'])
            }
            
            
        }
        a['descpt-eng'] = encodeURIComponent(a['descpt-eng']);
        a['name-eng'] = encodeURIComponent(a['name-eng']);
        
        a['catname'] = encodeURIComponent(a['catname']);
        a['subcatname'] = encodeURIComponent(a['subcatname']);
        if(APP_ID=='MEEBAZAAR'){
        a.agencyid = a.agency.agencyid;
        a.agency = a.agency.name;
        }
        
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'insobjdata');
    }
    myUploader = (event) => {
        uploadImg(event,this.state.opArr,this.setData,this.growl);
       
    }
    deleteRow = ()=>{
        this.setState({deleteDialog:false})
        let a = {objtype : this.state.objtype};
        a[this.state.idfld] = this.state.selectedRow[this.state.idfld];
        delDataRow(a,this.state.data,this.state.idfld,this.setData,this.growl,'deleteprd')
       
    }

     renderFooter = () => {
   
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>{this.setState({editDialog:false})}} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>this.saveRow()} className="p-button-primary" />
                
            </div>
        );
    }

    onChangeDropdown = (val,it) => {
        console.log(val,it)
        for(let i=0;i<this.state.opArr.length;i++){
            if(this.state.opArr[i].field == it.field){
                this.state.opArr[i].val = val;
            }
        }
        if(it.field == 'catname'){
            this.editSubCatList(val.pdlid);
            for(let i=0;i<this.state.opArr.length;i++){
                if(this.state.opArr[i].field == 'subcatname'){
                    
                    this.state.opArr[i].val = {};
                }
            }

        }
        this.setState({opArr:this.state.opArr})

    }
    render () {
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
                        gFilter          =  {this.state.globalFilter}
                        gFilterval       =  {this.gFilterVal}
                        exportData       =  {this.state.exportFldArr}
                        addModal         =  {this.showEditModal}
                        deleteModal      =  {()=>{this.setState({deleteDialog:true})}}
                        paginator={true} 
                        rows={20}
                        
                    />

                {(this.state.data.length > 0) &&
                <Productitems 
                parid={this.state.selectedRow['prdid'] || ''} 
                parname='Product Items'
                scrOptions = {this.state.scrOptions}
                
                 />
                }

                    <DeleteDialog  
                        title       =  {this.state.selectedRow ? this.state.selectedRow['name-eng']:''} 
                        visible     =  {this.state.deleteDialog} 
                        hideDialog  =  {()=>{this.setState({deleteDialog:false})}}
                        deleteBtn   =  {this.deleteRow}
                    />
                    {/* <AddDialog
                       dataArr      =  {this.state.opArr}
                       title        =  "Add/Edit Modal"
                       hideDialog   =  {()=>{this.setState({editDialog:false})}}
                       inpValue     =  {this.setInpVal}
                       visible      =  {this.state.editDialog}
                       saveBtn      =  {this.saveRow}
                       fileUpload   =   {this.myUploader}
                    /> */}

        <Dialog footer={this.renderFooter()} header={this.state.selectedRow ? this.state.selectedRow['name-eng']:'Add Product'} 
        visible={this.state.editDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  
        blockScroll onHide = {()=>{this.setState({editDialog:false})}} position="center">
            <div className="p-grid" style={{width:'100%',padding:'40px'}}>
                {this.state.opArr.map((it)=>{
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
                                      
                                        <Dropdown id={it.field}  value={it.val} style = {{minWidth:'233px'}} options={it.field == 'catname' ? this.state.catlist: it.field == 'subcatname' ? this.state.selSubList: this.state.agencylist} 
                                        ariaLabel={it.tblheader} onChange={(e) => {this.onChangeDropdown(e.target.value,it)}} 
                                        optionLabel="name" tooltip={it.tooltip} tooltipOptions={{position: 'top'}} placeholder={it.tblheader} 
                                        disabled={it.disabled} />
                                        
                                     
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




export default Productlist;