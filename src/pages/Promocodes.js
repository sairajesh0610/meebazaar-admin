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
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReqForObj,setScrOptions,delDataRow} from '../utils/ServiceCalls';
import callsvc from '../utils/Services';
import { ADMIN_ERROR } from '../utils/Constants';

class Promocodes extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'ORG_PROMO_FLDS_LIST',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false},
            catlist:[],subcatlist:[], selSubList:[],
            addpromoobj : {promoid:'',orgid:'',name:'',code:'',type:'',multiuse:false,price:'',
            percent:'',condprice:'',conduptoprice:'',stdt:'',enddt:'',catid:''},
            promotypes :[]
        }
    }

    componentDidMount(){
        
        setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody);
        getObjData({objtype:this.state.objtype},this.setData,this.growl,'getpromolist');
        this.getCatList();
        this.getPromotypes();
        
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
        callsvc({},'subcatbyname',false)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({subcatlist:res.data});

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

    getPromotypes(){
        callsvc({objtype:'LIST_FLDS'},'getobjdata')
        .then((res)=>{
            if(res.code == '999'){
                let promoArr = []
                for(let i=0; i<res.data.length;i++){
                    if(res.data[i].atype=="PROMO_FLDS"){
                    let a = {type:res.data[i].atype,val:res.data[i].val,listid:res.data[i].listid};
                    if(res.data[i].val){
                        promoArr.push(a.val);
                    }
                    
                }
            }
                console.log(promoArr);
                this.setState({promotypes:promoArr});

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
            if(op === 'EDIT'){
                this.state.addpromoobj = Object.assign({},this.state.addpromoobj,this.state.selectedRow);
            }else if(op === 'ADD'){
                this.state.addpromoobj = Object.assign({}, {promoid:'',orgid:'',name:'',code:'',type:'',multiuse:false,price:'',
                percent:'',condprice:'',conduptoprice:'',stdt:'',enddt:'',catid:''});
            }else{
                return;
            }
         
        this.setState({addpromoobj:this.state.addpromoobj,editDialog:true})
        

    }
   
    saveRow = ()=>{
        this.state.addpromoobj.orgid = this.state.userobj.orgid;
        this.state.addpromoobj.empid = this.state.userobj.empid;  
        let {name,code,type,stdt,enddt} = this.state.addpromoobj;
        if(!name){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `name seems to be missing! Please check`,life:6000});
            return;
        }else if(!code){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `code seems to be missing! Please check`,life:6000});
            return;
        }else if(!type){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `type seems to be missing! Please check`,life:6000});
            return;
        }else if(!stdt){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `start date seems to be missing! Please check`,life:6000});
            return;
        }else if(!enddt){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `end date seems to be missing! Please check`,life:6000});
            return;
        }else{
            saveDataRow(this.state.addpromoobj,this.state.data,this.setData,this.growl,this.state.idfld,'addorgpromo');
        }
       
        
        
    }
    myUploader = (event) => {
        uploadImg(event,this.state.opArr,this.setData,this.growl);
       
    }

    deleteRow = ()=>{
        this.setState({deleteDialog:false})
        let a = {objtype : this.state.objtype};
        a[this.state.idfld] = this.state.selectedRow[this.state.idfld];
        delDataRow(a,this.state.data,this.state.idfld,this.setData,this.growl,'deleteorgpromo')
       
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
        this.setState({opArr:this.state.opArr})

    }
    render () {
          
           let dialogHeader = this.state.addpromoobj.name || 'Please enter Promo Name';
           dialogHeader = (this.state.addpromoobj.type == 'AMOUNT_OFF' && this.state.addpromoobj.price) ? `${this.state.addpromoobj.name} : ${this.state.addpromoobj.price} OFF ON ANY PURCHASE` : dialogHeader;
           dialogHeader = (this.state.addpromoobj.type == 'PERCENT_OFF' && this.state.addpromoobj.percent) ? `${this.state.addpromoobj.name} : ${this.state.addpromoobj.percent}% OFF ON ANY PURCHASE` : dialogHeader;
           dialogHeader = (this.state.addpromoobj.type == 'AMOUNT_OFF_ON_CERTAIN_PURCHASE' && this.state.addpromoobj.price) ? `${this.state.addpromoobj.name} : ${this.state.addpromoobj.price} OFF WHEN PURCHASE IS MORE THAN ${this.state.addpromoobj.condprice}` : dialogHeader;
           dialogHeader = (this.state.addpromoobj.type == 'PERCENT_OFF_ON_CERTAIN_PURCHASE' && this.state.addpromoobj.percent) ? `${this.state.addpromoobj.name} : ${this.state.addpromoobj.percent}% OFF WHEN PURCHASE IS MORE THAN ${this.state.addpromoobj.condprice}` : dialogHeader;
           dialogHeader = (this.state.addpromoobj.type == 'PERCENT_OFF_ON_CERTAIN_PURCHASE_UPTOCONDITION' && this.state.addpromoobj.percent) ? `${this.state.addpromoobj.name} : ${this.state.addpromoobj.percent}% OFF UPTO FIRST ${this.state.addpromoobj.conduptoprice}  WHEN PURCHASE IS MORE THAN ${this.state.addpromoobj.condprice}` : dialogHeader;
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

                

                    <DeleteDialog  
                        title       =  {this.state.selectedRow ? this.state.selectedRow['name']:''} 
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

        <Dialog footer={this.renderFooter()} header={dialogHeader} 
        visible={this.state.editDialog} style={{width:'100%',height:'100%',verticalAlign:'middle',padding:'20px'}}  
        blockScroll onHide = {()=>{this.setState({editDialog:false})}} position="center">
            <div className="p-grid" style={{width:'100%',padding:'40px'}}>

                <div className="p-col-12 p-md-6 p-lg-4">
                    
                                <span className="p-float-label">
                                    <InputText id={'promoname'} type="text" style={{width:'300px'}} value={this.state.addpromoobj.name} 
                                    onChange={(e)=>{
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{name:e.target.value})})
                                    }} tooltip={'Promo Name'} 
                                    tooltipOptions={{position: 'top'}}
                                    />
                                    <label htmlFor={'promoname'}>Promo Name</label>
                                </span> 
                    
                </div>
                {this.state.addpromoobj.name && <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputText id={'code'} type="text" style={{width:'300px'}} value={this.state.addpromoobj.code} 
                                    onChange={(e)=>{
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{code:e.target.value})})
                                    }} tooltip={'Promo Code'} 
                                    tooltipOptions={{position: 'top'}}
                                    />
                                    <label htmlFor={'code'}>Promo Code</label>
                                </span> 
                </div>}
                {this.state.addpromoobj.code && <div className="p-col-12 p-md-6 p-lg-4"> 
                <span className="p-float-label">
                        <Dropdown id={'type'} appendTo={document.body}  value={this.state.addpromoobj.type}  options={this.state.promotypes} size={40} style={{width:'300px'}}
                                        ariaLabel={'Promo Type'} onChange={(e) => {
                                            this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{type:e.target.value,price:0,percent:0,condprice:0,conduptoprice:0,catname:''})})
                                            
                                        }} 
                                        optionLabel="" tooltip={'Promo Type'} tooltipOptions={{position: 'top'}} placeholder={'Promo Type'} 
                                        />
                        {this.state.addpromoobj.type && <label htmlFor={'type'}>{'Promo Type'}</label>}
                </span>
                                        
                </div>}
                {this.state.addpromoobj.type && <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputText id={'stdt'} type="date" style={{width:'300px'}} value={this.state.addpromoobj.stdt}
                                    onChange={(e) => {
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{stdt:e.target.value})})
                                        
                                    }} 
                                    
                                    tooltip={'Promo Start Date'} 
                                    tooltipOptions={{position: 'top'}}  
                                    />
                                    {this.state.addpromoobj.stdt && <label htmlFor={'stdt'}>{'Promo Start Date'}</label>}
                                </span> 
                            </div>}
            
                            {this.state.addpromoobj.type &&  <div className="p-col-12 p-md-6 p-lg-4">
                                <span className="p-float-label">
                                    <InputText id={'enddt'} type="date" style={{width:'300px'}} value={this.state.addpromoobj.enddt}
                                    onChange={(e) => {
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{enddt:e.target.value})})
                                        
                                    }} 
                                    
                                    tooltip={'Promo End Date'} 
                                    tooltipOptions={{position: 'top'}}  
                                    />
                                    {this.state.addpromoobj.enddt && <label htmlFor={'stdt'}>{'Promo End Date'}</label>}
                                </span> 
                    </div>}
                    {(['AMOUNT_OFF','AMOUNT_OFF_ON_CERTAIN_PURCHASE'].includes(this.state.addpromoobj.type)) && <div className="p-col-12 p-md-6 p-lg-4">
                    
                                <span className="p-float-label">
                                    <InputNumber id={'price'}  style={{width:'300px'}} value={this.state.addpromoobj.price} 
                                    onChange={(e)=>{
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{price:e.target.value})})
                                    }} tooltip={'Promo Price when type is amount Off'} 
                                    tooltipOptions={{position: 'top'}}
                                    />
                                    <label htmlFor={'price'}>Promo Price</label>
                                </span> 
                    
                   </div>}
                   {(['PERCENT_OFF','CODE_FOR_CATEGORY','PERCENT_OFF_ON_CERTAIN_PURCHASE','PERCENT_OFF_ON_CERTAIN_PURCHASE_UPTOCONDITION'].includes(this.state.addpromoobj.type)) &&<div className="p-col-12 p-md-6 p-lg-4">
                    
                                <span className="p-float-label">
                                    <InputNumber id={'percent'}  style={{width:'300px'}} value={this.state.addpromoobj.percent} 
                                    onChange={(e)=>{
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{percent:e.target.value})})
                                    }} tooltip={'Promo Price when type is Percent Off'} 
                                    tooltipOptions={{position: 'top'}}
                                    />
                                    <label htmlFor={'percent'}>Promo percent</label>
                                </span> 
                    
                </div>}
                
                {(['AMOUNT_OFF_ON_CERTAIN_PURCHASE','PERCENT_OFF_ON_CERTAIN_PURCHASE','PERCENT_OFF_ON_CERTAIN_PURCHASE_UPTOCONDITION'].includes(this.state.addpromoobj.type)) && <div className="p-col-12 p-md-6 p-lg-4">
                    
                                <span className="p-float-label">
                                    <InputNumber id={'condprice'}  style={{width:'300px'}} value={this.state.addpromoobj.condprice} 
                                    onChange={(e)=>{
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{condprice:e.target.value})})
                                    }} tooltip={'Promo Price when type is Amount/percent Off on certain purchase'} 
                                    tooltipOptions={{position: 'top'}}
                                    />
                                    <label htmlFor={'condprice'}>Promo Conditional Price</label>
                                </span> 
                    
                </div>}
                
                {(['PERCENT_OFF_ON_CERTAIN_PURCHASE_UPTOCONDITION'].includes(this.state.addpromoobj.type)) &&<div className="p-col-12 p-md-6 p-lg-4">
                    
                                <span className="p-float-label">
                                    <InputNumber id={'conduptoprice'}  style={{width:'300px'}} value={this.state.addpromoobj.conduptoprice} 
                                    onChange={(e)=>{
                                        this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{conduptoprice:e.target.value})})
                                    }} tooltip={'Promo Price when type is Amount/percent Off on certain purchase upto '} 
                                    tooltipOptions={{position: 'top'}}
                                    />
                                    <label htmlFor={'conduptoprice'}>Conditional Upto Price</label>
                                </span> 
                    
                </div>}
                { (['CODE_FOR_CATEGORY'].includes(this.state.addpromoobj.type)) && <div className="p-col-12 p-md-6 p-lg-4">
                        <span className="p-float-label">
                        <Dropdown id={'catname'} appendTo={document.body}  value={this.state.addpromoobj.catname}  options={this.state.subcatlist} size={40} style={{width:'300px'}}
                                        ariaLabel={'SubCat Name'} onChange={(e) => {
                                            this.setState({addpromoobj: Object.assign(this.state.addpromoobj,{catname:e.target.value})})
                                            
                                        }} 
                                        optionLabel="" tooltip={'Promo Type'} tooltipOptions={{position: 'top'}}  
                                        />
                                    <label htmlFor={'catname'}>{'Sub Category'}</label>
                                </span> 
                                        
                </div>}
            </div>
            
        </Dialog>
                     
            </div>
            
            
         )
      }  
        
    }




export default Promocodes;