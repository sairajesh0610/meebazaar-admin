import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import {getObjData,getObjFlds} from '../utils/ServiceCalls';
import {appTheme} from '../utils/Constants';

import { DataTable } from 'primereact/datatable';

import {Toolbar} from 'primereact/toolbar';

import ExcelExport from '../components/ExcelExport';
import { Card } from 'primereact/card';




  


class Orderitlist extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            objtype:'ORDER_IT_LIST',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        console.log(this.props)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody)
        if(this.props.parid)
        getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getorderitdata')
        else
        this.setState({data:[],selectedRow:{}})
    }

    componentDidUpdate(prevProps){
        if(this.props.parid != prevProps.parid){
            if(this.props.parid)
                getObjData({objtype:this.state.objtype,parid:this.props.parid},this.setData,this.growl,'getorderitdata')
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
    
    
    
    
   
    render () {
        return (
         
            <Card className="left-align-table">
             {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
            <Growl ref={(el) => this.growl = el} sticky={true}/>
            <Toolbar>
            <div className="p-toolbar-group-left">
                <div style={{display:'flex'}}>
                    {/* <i className={props.screenopt.icon} style={{marginRight:'24px',alignSelf:'center'}} /> */}
                    <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>Order Details</p>
                </div>
                
            </div>
            {/* <div className="p-toolbar-group-right">
                <InputText type="search" style = {{verticalAlign:'middle',marginRight:'.25em'}} onInput={(e) =>props.gFilterval(e.target.value)} placeholder="Global Search" size="50" />
                {props.dataValue.length > 0 && props.screenopt.export  && <ExcelExport data={props.dataValue}  collist={props.exportData} name={props.screenopt.name} />}
                <Button icon="pi pi-plus"  style={{marginRight:'.25em'}}  tooltip="New Record" tooltipOptions={{position: 'top'}} onClick={()=>{ props.addModal('ADD')}} disabled={!props.screenopt.addopt}/>
                <Button  icon="pi pi-pencil" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Update Record" tooltipOptions={{position: 'top'}} onClick={()=>{ props.addModal('EDIT')}} disabled={!props.screenopt.editopt}/> 
                <Button  icon="pi pi-trash" className="p-button-danger" onClick={()=>props.deleteModal()} tooltip="Delete Record" tooltipOptions={{position: 'top'}} disabled={!props.screenopt.delopt}/>
            </div>
             */}
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
                
             >
                {this.state.dynamicColumns}
        
            </DataTable> 
               
            </Card>
        
     )
  }  
        
    }




export default Orderitlist;