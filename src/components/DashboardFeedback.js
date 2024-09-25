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
import {Growl} from 'primereact/growl';

export default class DashboardFeedback extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            contactusList:[],
            feedSpinner:false,
            userobj:userProfile.getUserObj(),
            editDialog:false,selectedRow:{}
        }
        
    }
    componentDidMount(){
        this.feedback();
    }
    feedback = () => {
        
        this.setState({feedSpinner:true});
            let inpobj = {
                orgid: this.state.userobj.orgid,
                objtype:'TODAYS_FEED'
            }
            
            callsvc(inpobj, 'getobjdata', false).then((res) => {
                
                if (res.code == '999') {
                    this.setState({ contactusList: res.data,selectedRow:res.data[0] })
                    
                }
            })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    this.setState({feedSpinner:false});

                })
        
    }


    markCompleted = () => {
        
        this.setState({feedSpinner:true});
            let inpobj = {
                orgid: this.state.userobj.orgid,
                empid: this.state.userobj.empid,
                feedid: this.state.selectedRow.feedid
            }
            
            callsvc(inpobj, 'markfeedback', false).then((res) => {
                let selRow={}
                if (res.code == '999') {
                    this.growl.show({severity: 'warn', summary: 'Feedback', detail:'Marked as Completed !',life:6000});
                    for(let i=0; i<this.state.contactusList.length;i++){
                        if(inpobj.feedid == this.state.contactusList[i]['feedid'] ){
                            this.state.contactusList[i]['completed'] = true;
                            selRow = this.state.contactusList[i];
                            break;
                        }
                    }
                    this.setState({ contactusList: this.state.contactusList,selectedRow:selRow })
                    
                }
            })
                .catch((err) => {
                    console.log(err)
                    this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
                })
                .finally(() => {
                    this.setState({feedSpinner:false});

                })
        
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

    render(){
        return (
            
            <Card style={{margin:'8px'}}>
                    <Growl ref={(el) => this.growl = el} sticky={true}/>
                    {this.state.orderSpinner && <div style = {{height:200,position:'relative',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"/>
                    </div>}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <h5 style={{ margin: 10, color: "#787878", fontWeight: 600 }}> Today's Feedback 
                        <span style={{marginLeft:8,backgroundColor:'#33A1F4',padding:"2px 6px",borderRadius:4,color:'#fff'}}>{this.state.contactusList.length}</span></h5>
                        <Button  label="Mark Done"  className="p-button-success" style={{marginRight:'.25em'}} tooltip="Mark the feedback as completed" tooltipOptions={{position: 'top'}} onClick={()=>{ this.markCompleted()}} disabled={!this.state.selectedRow && !this.state.selectedRow.feedid && this.state.selectedRow.completed}/> 
                      </div>
                      
                        <DataTable  
                        selection =  {this.state.selectedRow} 
                        onSelectionChange =  {(e) =>{this.setState({ selectedRow: e.value })}} 
                        selectionMode = 'single'
                        onRowDoubleClick = {(e)=>{this.setState({ selectedRow: e.data },()=>{this.setState({editDialog:true})})}}
                        value={this.state.contactusList} 
                        emptyMessage="No feedback as of now for today"  
                        scrollable={true} scrollHeight="300px" >
                            <Column field='fstname' header='Name' sortable={false} style={{ width: '120px', textAlign: 'left' }} />
                            <Column field='accid' header='Phone Number' sortable={false} style={{ width: '120px', textAlign: 'left' }} />
                            <Column field='completed' body={this.customBody} header='Done??' sortable={false} style={{ width: '80px', textAlign: 'left' }} />
                            <Column field='descpt' header='Description' sortable={false} style={{ width: '250px', textAlign: 'left' }} />
                            
                        </DataTable>
                        

            </Card>
        )
    }
}