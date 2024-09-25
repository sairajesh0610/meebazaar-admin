import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,delDataRow} from '../utils/ServiceCalls';
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

class ArticleDesc extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'ARTICLE_DESC_FLDS',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'', selectedProd:null, placeholder: 'Search for Produts',
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }
    myUploader = (event) => {
        uploadImg(event,this.state.opArr,this.setData,this.growl);
       
    }

    componentDidMount(){
        console.log(this.props)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody)
        if(this.props.articleid)
        getObjData({objtype:this.state.objtype,articleid:this.props.articleid},this.setData,this.growl)
        else
        this.setState({data:[],selectedRow:{}})
        this.getTypeList();
        this.getPrdData();
        
    }

    componentDidUpdate(prevProps){
        if(this.props.articleid != prevProps.articleid){
            if(this.props.articleid)
                getObjData({objtype:this.state.objtype,articleid:this.props.articleid},this.setData,this.growl)
            else
                this.setState({data:[],selectedRow:{}})
            this.getheadingList()
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
    onChangeDropdown = (val,it) => {
        //console.log(this.state.opArr)
        //console.log(it)
        for(let i=0;i<this.state.opArr.length;i++){
            if(this.state.opArr[i].field == it.field){
                console.log("2")
                this.state.opArr[i].val = val;
            }
            //console.log(this.state.opArr[i].val);
        }
        if(it.field == 'type'){
            this.editTypelist(val.listid);
            //console.log(val.listid);
            // for(let i=0;i<this.state.opArr.length;i++){
            //     if(this.state.opArr[i].field == 'subcatname'){
                    
            //         this.state.opArr[i].val = {};
            //     }
            // }

        }
        this.setState({opArr:this.state.opArr})

    }
    getTypeList = () => {
        
        callsvc({objtype:'LIST_FLDS'},'getobjdata')
        .then((res)=>{
            if(res.code == '999'){
                let typeArr = []

                for(let i=0; i<res.data.length;i++){
                    if(res.data[i].atype=="ARTICLE_DESC_TYPE"){
                    let a = {type:res.data[i].atype,val:res.data[i].val,listid:res.data[i].listid};
                    if(res.data[i].val){
                        typeArr.push(a);
                    }
                }
            }
            console.log(typeArr)
                this.setState({typeList:typeArr});

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
    editTypelist = (listid) => {
        let typeListArr = [];
        for(let i=0;i<this.state.typeList.length; i++){
            if(this.state.typeList[i]['listid'] == listid){
                typeListArr.push(this.state.typeList[i]);
                console.log("pushed")
            }
        }
        this.setState({selTypeList:typeListArr});
    }
    getheadingList(){
        callsvc({articleid:this.props.articleid},'getheadings',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({headingList:res.data})
            }

        })
        .catch((err)=>{console.log(err)})
        .finally(()=>{})
    }
    getPrdData = () => {
        callsvc({ordid:this.state.userobj.orgid,empid:this.state.userobj.empid},'getproductsdata',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({prdData:res.data})
            }

        })
        .catch((err)=>{console.log(err)})
        .finally(()=>{})
    }
    showEditModal = (op)=>{
        this.getheadingList();
        let opArr = this.state.fldArr.map((it)=>{
                let a =  Object.assign({},it,{val:(op == 'EDIT') ? this.state.selectedRow[it.field] : it.val});
                a.val = (a.val == 'NULL' || a.val == null)? '':a.val;
                a.val = (a.type == 'num') ? Number(a.val) :a.val;
                //console.log(it)
                if(a.field == 'type'){
                    for(let i=0; i<this.state.typeList.length;i++){
                        //console.log(a.val)
                        if(a.val == this.state.typeList[i]['val']){
                            a.val = this.state.typeList[i];
                            this.editTypelist(this.state.typeList[i].listid)
                            //console.log("a",a);
                            break;
                        }
                    }
                }
                if(a.field == 'prdname'){
                    for(let i=0;i<this.state.prdData.length;i++){
                        if(a.val == this.state.prdData[i]['prditid']){
                            console.log(this.state.prdData[i])
                            this.setState({placeholder:this.state.prdData[i]['name']})
                        }
                    }
                }
                if(a.field == 'parent'){
                    for(let i=0;i<this.state.headingList.length;i++){
                        if(a.val == this.state.headingList[i]['parid']){
                            console.log(this.state.headingList[i])
                            a.val = this.state.headingList[i];
                        }
                    }
                }
                
                return a;
            
        })
        //console.log(opArr)
        //console.log("opArray",opArr)
        //console.log(this.state.fldArr,this.state.selectedRow,opArr)
        
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
        let isFldMissing = checkReq(this.state.opArr,{orgid:this.state.userobj.orgid,empid:this.state.empid,articleid:this.props.articleid},this.setData)
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${isFldMissing} seems to be missing! Please check`,life:6000});
            return;
        }
        let a ={objtype:this.state.objtype};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val']
        }
        
        
        a['articleid'] = this.props.articleid;
        a['appid'] = "MEEBAZAAR";
        a.type = a.type.val
        if(a.type == "Text_heading"){
            a['parent']="";
        }else{
            a['parent'] = a['parent']['parid'];
        }
        if(this.state.selectedProd){
        a['prdname'] = this.state.selectedProd.prditid;
        }
        console.log(a)
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
    prodListTemplate = (item) => {
        return (<div className="p-grid" key={item.prditid}>
                    <div className="p-col-4">
                        <img src={item.image} style={{height:'60px',width:'60px'}} />
                    </div>
                    <div className="p-col-8"> 
                        <div>{item.name} </div>
                        <div>{item.size} </div>
                        
                    </div>
    
    
                </div>
        )
        }
    selectedProdTemplate = (item, props) =>{
        if (item) {
            return (<div className="p-grid">
            <div className="p-col-4">
                <img src={item.image} style={{height:'60px',width:'60px'}} />
            </div>
            <div className="p-col-8"> 
                <div>{item.name} - {item.size} </div>
                
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
          this.setState({selectedProd:e.value},()=>console.log(e.value))
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
                        screenopt        =  {Object.assign({},this.props.scrOptions,{name:`Descrption for ${this.props.parname}`})} 
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
                        title       =  {this.state.selectedRow ? this.state.selectedRow['city-eng']:''} 
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
                                        <Dropdown id={it.field}  value={it.val} style = {{minWidth:'233px'}} options={it.field == 'type' ? this.state.typeList:this.state.headingList} 
                                        ariaLabel={it.tblheader} onChange={(e) => {this.onChangeDropdown(e.target.value,it)}} 
                                        optionLabel={it.field=='type' ? "val" : "name_eng"} tooltip={it.tooltip} tooltipOptions={{position: 'top'}} placeholder={it.tblheader} 
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
                <div className="p-col-6">
                        <Dropdown   appendTo={document.body} value={this.state.selectedProd} options={this.state.prdData} onChange={this.onProdSelect}  filter showClear 
                        filterBy="name" optionLabel="name" placeholder={this.state.placeholder} style ={{width:'100%'}}
                        valueTemplate={this.selectedProdTemplate} itemTemplate={this.prodListTemplate} dataKey="prditid"  />
                        </div>
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
                         }} onClick={(e) => {this.setInpVal('',it)}} />
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




export default ArticleDesc;