import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

import {Card} from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import callsvc from '../utils/Services';
import userProfile from '../utils/Userprofile';
import {ADMIN_ERROR} from '../utils/Constants';
import OrderdetailDialog from '../components/OrderdetailDialog';
import {Button} from 'primereact/button';

export default class DashboardOrders extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            orderList:[],
            orderSpinner:false,
            userobj:userProfile.getUserObj(),
            editDialog:false,selectedRow:{}
        }
        
    }
    componentDidMount(){
        this.getOrders();
    }
    getOrders = () => {
        
        this.setState({orderSpinner:true});
        let inpobj = {
            orgid: this.state.userobj.orgid,
            empid: this.state.userobj.orgid
            
        }
        
        callsvc(inpobj, 'homepageorders', false).then((res) => {
            
            if (res.code == '999') {
                this.setState({ orderList: res.data,selectedRow:res.data[0] })
                
            }
        })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                this.setState({orderSpinner:false});

            })
    
    }

    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            this.setState({
                [`${key}`]: inpobj[key]
            });
        })
    }

    render(){
        return (
            <Card style={{margin:'8px'}}>
                    {this.state.orderSpinner && <div style = {{height:200,position:'relative',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"/>
                    </div>}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <h5 style={{ margin: 10, color: "#787878", fontWeight: 600 }}> Today's Orders 
                        <span style={{marginLeft:8,backgroundColor:'#33A1F4',padding:"2px 6px",borderRadius:4,color:'#fff'}}>{this.state.orderList.length}</span></h5>
                        <Button  label="View Order"  className="p-button-success" style={{marginRight:'.25em'}} tooltip="View Record" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({editDialog:true})}} disabled={!this.state.selectedRow && !this.state.selectedRow.ordid}/> 
                      </div>
                      
                        <DataTable  
                        selection =  {this.state.selectedRow} 
                        onSelectionChange =  {(e) =>{this.setState({ selectedRow: e.value })}} 
                        selectionMode = 'single'
                        onRowDoubleClick = {(e)=>{this.setState({ selectedRow: e.data },()=>{this.setState({editDialog:true})})}}
                        value={this.state.orderList}
                        style={{backgroundColor:'#5b616b'}}
                        emptyMessage="No orders as of now for today"  
                        scrollable={true} scrollHeight="300px" >
                            <Column field='custname' header='Name' sortable={false} style={{ width: '120px', textAlign: 'left' }} />
                            <Column field='ordtot' header='OrdTotal' sortable={false} style={{ width: '80px', textAlign: 'left' }} />
                            <Column field='orderstatus' header='Status' sortable={false} style={{ width: '120px', textAlign: 'left' }} />
                            <Column field='deladdr' header='Address' sortable={false} style={{ width: '250px', textAlign: 'left' }} />
                            
                        </DataTable>
                        {this.state.editDialog && <OrderdetailDialog ordobj={this.state.selectedRow} setData = {this.setData} editDialog={this.state.editDialog}/>}

            </Card>
        )
    }
}