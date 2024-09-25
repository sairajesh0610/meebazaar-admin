import React,{Component} from 'react';
import {appTheme} from '../utils/Constants';
import {Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Toolbar} from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import ExcelExport from '../components/ExcelExport';
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';


export default function TableData  (props){
 
 return (
     <Card className="left-align-table">
    <Toolbar>
    <div className="p-toolbar-group-left">
        <div style={{display:'flex'}}>
            {/* <i className={props.screenopt.icon} style={{marginRight:'24px',alignSelf:'center'}} /> */}
            <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>{props.screenopt.name}</p>
        </div>
        
    </div>
    <div className="p-toolbar-group-right">
        <InputText type="search" style = {{verticalAlign:'middle',marginRight:'.25em'}} onInput={(e) =>props.gFilterval(e.target.value)} placeholder="Global Search" size="50" />
        {props.dataValue.length > 0 && props.screenopt.export  && <ExcelExport data={props.dataValue}  collist={props.exportData} name={props.screenopt.name} />}
        <Button icon="pi pi-plus"  style={{marginRight:'.25em'}}  tooltip="New Record" tooltipOptions={{position: 'top'}} onClick={()=>{ props.addModal('ADD')}} disabled={!props.screenopt.addopt}/>
        {props.tabletype=='agency' &&<Button style={{marginRight:'.25em'}} icon="pi pi-money-bill" className="p-button-success" onClick={()=>props.addTran()} tooltip="Add Transaction" tooltipOptions={{position: 'top'}} disabled={!props.screenopt.delopt}/>}
        {props.priceupdate=='Y' && <Button style={{marginRight:'.25em'}} icon="pi pi-tags" className="p-button-primary" onClick={()=>props.updatePrice()} tooltip="Price Update" tooltipOptions={{position: 'top'}} disabled={!props.screenopt.delopt}/> }
        <Button  icon="pi pi-pencil" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Update Record" tooltipOptions={{position: 'top'}} onClick={()=>{ props.addModal('EDIT')}} disabled={!props.screenopt.editopt}/> 
        <Button  icon="pi pi-trash" className="p-button-danger" onClick={()=>props.deleteModal()} tooltip="Delete Record" tooltipOptions={{position: 'top'}} disabled={!props.screenopt.delopt}/>
    </div>
    
    </Toolbar>
    <DataTable
        value             =  {props.dataValue}
        scrollable        =  {true}
        scrollHeight      =  {window.screen.height-400 + 'px'}
        selection         =  {props.rowSelected}
        onSelectionChange =  {(e) =>props.rowSelectUpdate(e.value)} 
        selectionMode     =  'single'
        emptyMessage      =  "No records found..."
        globalFilter      =  {props.gFilter}
        onRowDoubleClick = {()=>{ props.addModal('EDIT')}}
        paginator={props.paginator} 
        rows={props.rows}
        style={{backgroundColor:'#5b616b'}}
     >
        {props.dynamicColumns}

    </DataTable> 
       
    </Card> 
 )
}
 