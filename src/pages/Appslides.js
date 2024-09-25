import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import callsvc from '../utils/Services';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
import { Dialog } from 'primereact/dialog';
import {Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import Dropzone from 'react-dropzone';

class Appslides extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'ORG_SLIDE_FLDS_LIST',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(), itemList:[], placeholder:"Select Product",
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({homelistid:this.props.parid,objtype:this.state.objtype},this.setData,this.growl);
        this.getList();
        this.getPrdData();
    }

    componentDidUpdate(prevProps){
        console.log(this.props.parid);
        if(this.props.parid != prevProps.parid){
            if(this.props.parid)
                getObjData({homelistid:this.props.parid,objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl)
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
        callsvc({ordid:this.state.userobj.orgid,empid:this.state.userobj.empid},'getproductsdata',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({prdData:res.data})
            }

        })
        .catch((err)=>{console.log(err)})
        .finally(()=>{})
    }

    customBody(rowData,column){
        //console.log(column)
        if(column.header == 'image'){
            return <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <img src={rowData.image} style = {{width: '40px', height:'40px'}}/>
                </div>
        }else {
            return <i className={rowData[column.field] ? "pi pi-check" : "pi pi-times"} 
        style={rowData[column.field] ? {fontSize:'14px',color:'green'}: {fontSize:'14px',color:'red'}} /> 
        }
    }

    getList = () => {
        callsvc({table:'mb_pdl'},'catlistall',false)
        .then((res)=>{
            if(res.code == '999'){
                let catArr = [], subCatArr=[];

                for(let i=0; i<res.data.length;i++){
                    let a = {name:res.data[i].name,itid:res.data[i].pdlid,parid:res.data[i].parid};
                    if(!res.data[i].parid){
                        catArr.push(a);
                    }else{
                        subCatArr.push(a);
                    }
                }
                this.setState({catlist:catArr,subcatlist:subCatArr});
                //console.log("cats",catArr);
                //console.log("subCats",subCatArr);
            } else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})

        callsvc({},'bannerprodlist',false)
        .then((res)=>{
            if(res.code == '999'){
                let prodArr = [];

                for(let i=0; i<res.data.length;i++){
                    let a = {name:res.data[i].pname,itid:res.data[i].itid,orgid:res.data[i].orgid};
                    prodArr.push(a);
                }
                this.setState({prodlist:prodArr});
            } else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})

        callsvc({objtype:'LIST_FLDS'},'getobjdata')
        .then((res)=>{
            if(res.code == '999'){
                //let slideLocArr = []
                let slideTypeArr = []
                for(let i=0; i<res.data.length;i++){
                if(res.data[i].atype=="SLIDE_TYPE_FLDS"){
                    let a = {type:res.data[i].atype,val:res.data[i].val,listid:res.data[i].listid};
                    if(res.data[i].val && res.data[i].val!="Product"){
                        slideTypeArr.push(a);
                    }
                    
                }
            }
                //this.setState({slideLocList:slideLocArr});
                this.setState({slideTypeList:slideTypeArr});

            } else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})
        
        callsvc({objtype:'ARTICLE_FLDS'},'getobjdata')
        .then((res)=>{
            if(res.code == '999'){
                let articleArr = []
                for(let i=0; i<res.data.length;i++){
                    let a = {itid:res.data[i].articleid,name:res.data[i]["header-eng"],orgid:res.data[i].orgid};
                    if(res.data[i].articleid){
                        articleArr.push(a);
                    }
            }
                console.log("articleArr",articleArr);
                this.setState({articlelist:articleArr});

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
    

    getItemList(obj){
        //console.log(obj)
        let type = "";

        this.state.articlelist.map((li) =>{
            if(li.name == obj.val){
                type = "Article";
            }
        })
        this.state.prodlist.map((li)=>{
            if(li.name == obj.val){
                type = "Product";
            }
        })
        this.state.subcatlist.map((li)=>{
            if(li.name == obj.val){
                type = "Category"
            }
        })
        //console.log(type);
        if(type == "Category"){
            return this.state.subcatlist
        }else if (type == "Article"){
            return this.state.articlelist
        }else if(type == "Product"){
            return this.state.prodlist
        }

    }

    showEditModal = (op)=>{
        
        let opArr = this.state.fldArr.map((it)=>{
                let a =  Object.assign({},it,{val:(op == 'EDIT') ? this.state.selectedRow[it.field] : it.val});
                a.val = (a.val == 'NULL' || a.val == null)? '':a.val;
                a.val = (a.type == 'num') ? Number(a.val) :a.val;
                //console.log(it)
                if(a.field == 'slideloc'){
                    for(let i=0; i<this.state.slideLocList.length;i++){
                        if(a.val == this.state.slideLocList[i]['val']){
                            a.val = this.state.slideLocList[i]
                            break;
                        }
                    }
                }else if (a.field == "slidetype"){
                    for(let i=0;i<this.state.slideTypeList.length;i++){
                        if(a.val == this.state.slideTypeList[i]['val']){
                            a.val = this.state.slideTypeList[i];
                            break;
                        }
                    }
                }else if (a.field == "slideitemname" && a.val.length>2 && a.val!="undefined"){
                    const listarr = this.getItemList(a);
                    if(!listarr){
                        console.log("unable to update state")
                    }else{
                    for(let i=0;i<listarr.length;i++){
                        if(a.val == listarr[i]['name']){
                            a.val = listarr[i];
                            break;
                        }
                    }
                }
                }else if(a.field == "prdname"){
                    for(let i=0;i<this.state.prdData.length;i++){
                        if(a.val == this.state.prdData[i]['name']){
                            //console.log(this.state.prdData[i])
                            this.setState({placeholder:this.state.prdData[i]['name']},()=>console.log(this.state.placeholder))
                        }
                    }
                }

               
                return a;
            
        })

        this.setState({opArr:opArr,editDialog:true},()=>console.log("opArr",this.state.opArr))

    }


    rowsSelect = (value) =>{
        this.setState({ selectedRow: value })
    }
    gFilterVal = (value) => {
        this.setState({ globalFilter: value })
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
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val']
        }
        //console.log("fir",a);
        a.slideitemid = (a.slideitemname && a.slideitemname.itid) ? a.slideitemname.itid:'';
        a.slideitemname = (a.slideitemname && a.slideitemname.name) ? a.slideitemname.name:'';
        a.slidetype = (a.slidetype && a.slidetype.val) ? a.slidetype.val:'';
        if(this.state.selectedProd && this.state.selectedProd.prditid){
        a.slideitemid = (this.state.selectedProd && this.state.selectedProd.prditid) ? this.state.selectedProd.prditid : "";
        a.slidetype = (this.state.selectedProd && this.state.selectedProd.prditid) ? "Product" : "";
        a.prdname = (this.state.selectedProd && this.state.selectedProd.name) ? this.state.selectedProd.name: "";
        }
        console.log("a",a)
        a['homelistid'] = this.props.parid;
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
    renderFooter = () => {
   
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>{this.setState({editDialog:false})}} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>this.saveRow()} className="p-button-primary" />
                
            </div>
        );
    }
    onChangeDropdown = (val,it) => {
        
        for(let i=0;i<this.state.opArr.length;i++){
            
            if(this.state.opArr[i].field == it.field){
                this.state.opArr[i].val = val;
            }
            //console.log(this.state.opArr[i].val);
        }
            if(val.val == "Category"){
                this.setState({itemList:this.state.subcatlist})
            }else if (val.val == "Article"){
                this.setState({itemList:this.state.articlelist})
            }else if(val.val == "Product"){
                this.setState({itemList:this.state.prodlist})
            }
        this.setState({opArr:this.state.opArr})

    }
    onProdSelect = (e) => {
        console.log(e.value);
        this.setState({selectedProd:e.value},()=>console.log(e.value))
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
    
    render () {
            return (
             
            <div style={{position:'relative'}}> 
             {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                <Growl ref={(el) => this.growl = el} sticky={true}/>
            
                    <TableData 
                        screenopt        =  {Object.assign({},this.props.scrOptions,{name:`Appslides for ${this.props.parname}`})} 
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
                                                    <Dropdown id={it.field}  value={it.val} style = {{minWidth:'233px'}} options={it.field == 'slideloc' ? this.state.slideLocList : it.field == "slidetype" ? this.state.slideTypeList: it.field == "slideitemname" ? this.state.itemList: ""} 
                                                    ariaLabel={it.tblheader} onChange={(e) => {this.onChangeDropdown(e.target.value,it)}} 
                                                    optionLabel={it.field == 'slideloc' || it.field == 'slidetype' ? "val":"name"} tooltip={it.tooltip} tooltipOptions={{position: 'top'}} placeholder={it.tblheader} 
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
            
            
         )
      }  
        
    }




export default Appslides;