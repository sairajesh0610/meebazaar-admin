import React from 'react';
import callsvc from '../utils/Services';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
import AppSpinner from '../components/AppSpinner';
import {Toolbar} from 'primereact/toolbar';
import {Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';




class Orgobjects extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            
            userobj:userProfile.getUserObj(),
            showSpinner:false,
            pageData:[],idFld:'',
            selectedRow: [],
            deleteDialog:false,editDialog:false,dynamicColumns:[],opArr:[],fldArr:[],
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false},
        
            
        }
       

    }

    componentDidMount(){
        console.log(this.props.selorgid)
      this.getFieldList();
      this.getDataList();
      

    }

    componentDidUpdate(prev){ 
        if( this.props.selorgid && prev.selorgid != this.props.selorgid)
        this.getDataList();
    }

    getFieldList = () => {
        
        callsvc({objtype:'ORG_OBJ_FIELDS',selorgid:this.props.selorgid},'getobjflds')
        .then((res)=>{
            
            let dynamicColumns = [];
            
            for(let i = 0; i<res.fldlist.length;i++){
                 if(res.fldlist[i]['spl'] == 'IDGEN'){
                    this.state.idFld = res.fldlist[i]['field'];
                 }
                 let col = res.fldlist[i];
                if(col.tableshow){
                    
                    let a = (col.type == 'check')  ? 
                    <Column  style={col.style} key={col.field} field={col.field} header={col.tblheader} sortable={col.sortable} body={this.customCheckBody}  /> 
                    :<Column  style={col.style} key={col.field} field={col.field} header={col.tblheader} sortable={col.sortable}  />;
                    dynamicColumns.push(a);
                }
                
            }

              
              this.setState({dynamicColumns:dynamicColumns,fldArr:res.fldlist,idFld:this.state.idFld})
        })
        .catch((err)=>{
            console.log(err)
        })
        .finally(()=>{});
       
        
    }

    customCheckBody = (rowData, column) => {
        
        return <i className={rowData[column.field] ? "pi pi-check" : "pi pi-times"} 
        style={rowData[column.field] ? {fontSize:'14px',color:'green'}: {fontSize:'14px',color:'red'}} /> 
    }
            



    getDataList = ()=>{
        this.setState({showSpinner:true});
        callsvc({objtype:'ORG_OBJ_FIELDS',selorgid:this.props.selorgid},'getobjdata')
        .then((res)=>{
             if(res.code == '999'){
                 this.setState({pageData:res.data,selectedRow:res.data[0]})
             }else{
                this.setState({pageData:[],selectedRow:[]})
                //this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
             }
        })
        .catch((err)=>{
            console.log(err);
            this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
        })
        .finally(()=>{
            this.setState({showSpinner:false});
        });
    }

    deleteRow = ()=>{
        this.setState({deleteDialog:false})
        let a = {selorgid:this.state.selectedRow.selorgid,objtype : 'ORG_OBJ_FIELDS'};
        a[this.state.idFld] = this.state.selectedRow[this.state.idFld];
        callsvc(a,'delobjdata')
        .then((res)=>{
            if(res.code == '999'){
                this.growl.show({severity: 'warn', summary: 'Delete Record', detail: 'Record deleted succesfully!',life:6000});
                
                for(let i=0;i<this.state.pageData.length;i++){
                    if(this.state.pageData[i][this.state.idFld] == this.state.selectedRow[this.state.idFld]){
                        this.state.pageData.splice(i,1);
                        if(this.state.pageData.length > 0){
                            this.state.selectedRow = this.state.pageData[i];
                        }
                        break;
                    }
                }
                
                this.setState({deleteDialog:false,pageData:this.state.pageData,selectedRow:this.state.selectedRow});
                //this.getOrgList();
            }else{
                this.growl.show({severity: 'warn', summary: 'Error', detail: ADMIN_ERROR,life:6000});
                this.setState({deleteDialog:false});
            }
        })
        .catch((err)=>{
            console.log(err);
            this.growl.show({severity: 'warn', summary: 'Error', detail: ADMIN_ERROR,life:6000});
                this.setState({deleteDialog:false});
            
        })
        .finally(()=>{})

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
        let isFldMissing=false;
        let opArr = this.state.opArr.map((it)=>{
            if(it.req && it.val.length == 0){
                isFldMissing = true;
                it.inpstyle = {border:'1px solid red'}
            }else{
                it.inpstyle = {border:'1px solid #a6a6a6'}
            }
            return it;
        })
        this.setState({opArr:opArr})
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: 'Looks like you missing some fields! Please check',life:6000});
            return;
        }

        let a ={};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val']
        }
        this.setState({showSpinner:true});
        a.objtype = 'ORG_OBJ_FIELDS';
        a.selorgid = a.selorgid ? a.selorgid : this.props.selorgid
        callsvc(a,'insobjdata')
        .then((res)=>{
            if(res.code == '999'){
                // get id field
               
                if(this.state.idFld){
                    let op = 'INS';
                    for(let i=0;i<this.state.pageData.length;i++){

                        if(this.state.pageData[i][this.state.idFld] == res.datarow[this.state.idFld]){
                            this.state.pageData.splice(i,1,res.datarow);
                            this.state.selectedRow = this.state.pageData[i];
                            op = 'UPD';
                            break;
                        }
                    }
                    if(op == 'INS'){
                        this.state.pageData.splice(0,0,res.datarow);
                        this.state.selectedRow = this.state.pageData[0];
                    }
                    this.setState({pageData:this.state.pageData,selectedRow:this.state.selectedRow});
                }
                this.setState({editDialog:false});
                
            }else{
                this.growl.show({severity: 'warn', summary: 'Admin Error', detail: res.message,life:6000});
            }
        })
        .catch((err)=>{
            console.log(err);
             this.growl.show({severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR,life:6000});
        })
        .finally(()=>{
            this.setState({showSpinner:false});
        })

        

    }

    renderFooter(name) {
        if(name == 'deleteDialog'){
            return (
                <div>
                    <Button label="Yes" icon="pi pi-check" onClick={() => this.deleteRow()} className="p-button-danger" />
                    <Button label="No" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-secondary"/>
                </div>
            );
        } else if (name == 'editDialog'){
            return (
                <div>
                    <Button label="Cancel" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-secondary"/>
                    <Button label="Save" icon="pi pi-check" onClick={() => this.saveRow()} className="p-button-primary" />
                    
                </div>
            );
        }
        
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

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    render (){
        
        return (
            <div style={{position:'relative'}}> 
                {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                <Growl ref={(el) => this.growl = el} sticky={true}/>
                <Toolbar>
                <div className="p-toolbar-group-left">
                    <div style={{display:'flex'}}>
                        {/* <i className={this.state.scrOptions.icon} style={{marginRight:'24px',alignSelf:'center'}} /> */}
                        <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>Org Objects</p>
                    </div>
                    
                </div>
                <div className="p-toolbar-group-right">
                    <InputText type="search" style = {{verticalAlign:'middle',marginRight:'.25em'}} onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" size="50" />
                   
                    <Button icon="pi pi-plus"  style={{marginRight:'.25em'}}  tooltip="New Record" tooltipOptions={{position: 'top'}} onClick={()=>{ this.showEditModal('ADD')}} />
                    <Button disabled={this.state.selectedRow.length == 0 ? true : false} icon="pi pi-pencil" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Update Record" tooltipOptions={{position: 'top'}} onClick={()=>{ this.showEditModal('EDIT')}} /> 
                    <Button disabled={this.state.selectedRow.length == 0 ? true : false} icon="pi pi-trash" className="p-button-danger" onClick={()=>{ this.setState({deleteDialog:true})}} tooltip="Delete Record" tooltipOptions={{position: 'top'}} />
                </div>
                
                </Toolbar>
                <DataTable

                value={this.state.pageData}
                scrollable={true}
                scrollHeight='500px'
                style={{width: window.screen.width + 'px',maxHeight:'400px'}}
                selection={this.state.selectedRow}
                onSelectionChange={(e) => { this.setState({ selectedRow: e.value }) }}
                selectionMode='single'
                
                emptyMessage="No records found..."
                globalFilter={this.state.globalFilter}

                >
                {this.state.dynamicColumns}
                </DataTable> 

                
                <Dialog footer={this.renderFooter('deleteDialog')} header={<label style={{color:appTheme.primaryColor}}>oops... Deleting Record!</label>} visible={this.state.deleteDialog}  blockScroll onHide={() => this.setState({ deleteDialog: false })} position="topright">
                            <div>
                            <p> You are about to delete <span style={{ fontWeight: 'bold', color: appTheme.primaryColor }}> this.state.modalTitle</span>  </p>
                            <p>Deleting Orgnization  would delete all the associated products, images. you may consider editing it to inactive</p>
                            <p> still would you like to continue deleting this record ??</p>

                            </div>
                            
                </Dialog>
                <Dialog footer={this.renderFooter('editDialog')} header={this.state.modalTitle} visible={this.state.editDialog} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide={() => this.setState({editDialog: false})} position="center">
                    <>
                    <div className="p-grid" style={{width:'100%',padding:'40px'}}>
                        
                        {this.state.opArr.map((it)=>{
                            if(it.formshow){
                                if(it.type == 'text'){
                                    return (
                                    <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                                        <span className="p-float-label">
                                            <InputText id={it.field} type="text" size={30} value={it.val} 
                                            onChange={(e)=>{this.setInpVal(e.target.value,it)}} tooltip={it.tooltip} 
                                            tooltipOptions={{position: 'top'}} placeholder={it.tblheader} disabled={it.disabled}
                                            style={it.inpstyle}/>
                                            {/* <label htmlFor={it.field}>{it.tblheader}</label> */}
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
                                              <span className="p-float-label">
                                                <Dropdown id={it.field} value={it.val} style={{width:'233px'}} options={this.state.parcatlist} 
                                                ariaLabel={it.tblheader} onChange={(e) => {this.setInpVal(e.target.value,it)}} 
                                                optionLabel="field" tooltip={it.tooltip} tooltipOptions={{position: 'top'}} placeholder={it.tblheader} 
                                                disabled={it.disabled} style={it.inpstyle}/>
                                                
                                             </span>
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
                    
                     </>
                    </Dialog>


                </div>
                 
        )// end render and above div is parent div
    }

    
}

export default Orgobjects;