import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,delDataRow,setScrOptions} from '../utils/ServiceCalls';
import callsvc from '../utils/Services';
import { Dialog } from 'primereact/dialog';
import {Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import Dropzone from 'react-dropzone';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
import Subcatlist from './Subcatlist';
import {APP_ID} from '../utils/Constants';

class Alertlist extends React.Component {
    
    constructor(props){ 
        super(props);
        this.state = {
            objtype:'ORG_ALERTS_FLDS_LIST',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        
        setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype},this.setData,this.growl,'orgalerts');
        if(APP_ID !== "SMARTNIRMAL"){
        this.getTagList();
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

    getTagList = () => {
        
        callsvc({objtype:'ORG_TAGS_FLDS_LIST'},'getobjdata')
        .then((res)=>{
            if(res.code == '999'){
                //console.log(res)
                let tagArr = []
                let alertArr = [{
                    id : 1,
                    name : "SMS"
                },
                {
                    id : 2,
                    name : "PUSH"
                }
            ]
            for(let i=0; i<res.data.length;i++){
                let a = {name:res.data[i].name,active:res.data[i].active,groupid:res.data[i].groupid};
                if(res.data[i].active){
                    tagArr.push(a);
                }
            }
            console.log(tagArr)
                this.setState({tagList:tagArr,alertList:alertArr});

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
    
    onChangeDropdown = (val,it) => {
        for(let i=0;i<this.state.opArr.length;i++){
            if(this.state.opArr[i].field == it.field){
                this.state.opArr[i].val = val;
            }
        }
        this.setState({opArr:this.state.opArr})

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

                if(APP_ID!=="SMARTNIRMAL"){
                if(a.field=="alerttag"){
                    for(let i=0;i<this.state.tagList.length;i++){
                        if(a.val==this.state.tagList[i].name){
                            a.val = this.state.tagList[i];
                            break;
                        }
                    }
                }
            }
                if(a.field=='pushtype'){
                    for(let i=0;i<this.state.alertList.length;i++){
                        if(a.val==this.state.alertList[i].name){
                            a.val = this.state.alertList[i];
                            break;
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
    saveRow = ()=>{
        let isFldMissing = checkReq(this.state.opArr,{orgid:this.state.userobj.orgid,empid:this.state.empid},this.setData)
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${isFldMissing} seems to be missing! Please check`,life:6000});
            return;
        }
        let a ={objtype:this.state.objtype};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = encodeURIComponent(this.state.opArr[i]['val']);
        }
        
        this.setState({editDialog:false});

        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'publishalert');
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
    renderFooter = () => {
   
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>{this.setState({editDialog:false})}} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>this.saveRow()} className="p-button-primary" />
                
            </div>
        );
    }
    render () {
            return (
             <>
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
                        
                        
                    />

                

                    <DeleteDialog  
                        title       =  {this.state.selectedRow ? this.state.selectedRow['name-eng']:''} 
                        visible     =  {this.state.deleteDialog} 
                        hideDialog  =  {()=>{this.setState({deleteDialog:false})}}
                        deleteBtn   =  {this.deleteRow}
                    />
                    <Dialog footer={this.renderFooter()} header={'Add/edit Desc'} 
        visible={this.state.editDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  
        blockScroll onHide = {()=>{this.setState({editDialog:false})}} position="center">
            <div className="p-grid" style={{width:'100%',padding:'40px'}}>
                {this.state.opArr.map((it)=>{
                    //console.log(it);
                    if(it.formshow){
                        if(it.type == 'text'){
                            return (
                            <div className="p-col-12 p-md-6 p-lg-4" key={it.field}>
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
                                    <InputTextarea id={it.field}  style = {Object.assign({width:'233px',maxHeight:'50px'},it.style)} rows={3} value={it.val} 
                                    onChange={(e) => {this.setInpVal(e.target.value,it)}} tooltip={it.tooltip} tooltipOptions={{position: 'top'}} 
                                    placeholder={it.tblheader} disabled={it.disabled} />
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
                                        <Dropdown id={it.field}  value={it.val} style = {Object.assign({minWidth:'233px'},it.inpstyle)} options={it.field == 'alerttag' ? this.state.tagList:this.state.alertList} 
                                        ariaLabel={it.tblheader} onChange={(e) => {this.onChangeDropdown(e.target.value,it)}} 
                                        optionLabel={"name"} tooltip={it.tooltip} tooltipOptions={{position: 'top'}} placeholder={it.tblheader} 
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
            <div>
            {this.state.opArr.map((it)=>{
                if(it.type == 'img' && it.formshow){
                    return ( <Dropzone onDrop={(files) => this.myUploader(files)} key={it.seq}>
         {({ getRootProps, getInputProps, acceptedFiles }) => (
             <section className="p-grid">
                 <div className="p-col-12 p-md-6"style={styleDrag} {...getRootProps({ className: 'dropzone' })}>
                     <input {...getInputProps()} />
                     <p>Drag 'n' Drop category image here, or click to select files</p>
                     <p>Please Upload one Image</p>
                 </div>
                 <div className="p-col-12 p-md-6">
                 <h4 style={{textAlign:'center'}}>Uploaded Files (required)</h4>
                 <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '100%' }}>
                     {it.val && <div style={{
                         padding: '10px',
                         backgroundColor: '#f9f9f9',
                         margin: '6px',
                         position: 'relative'
                     }}>
                         <i className="pi pi-times"
                         style={{
                             position: 'absolute',
                             top: '2px',
                             right: '4px',
                             fontSize: '20px'
                         }} onClick={(e) => {this.inpValue('',it)}} />
                         <img src={it.val}
                             style={{
                                 width: '160px',
                                 height: '160px',
                             }}
                         />
                     </div>
                     }
                 </div>
                 </div>
             </section>
         )}
     </Dropzone>)
     
    
                 }
            })}
    
        </div>
        </Dialog>
                     
            </div>
            
            </>
            
         )
      }  
        
    }




export default Alertlist;