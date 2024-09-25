import React from 'react';
import graphblue from  "../assets/graph-blue.png";
import graphgreen from  "../assets/graph-green.png";
import graphyellow from  "../assets/graph-yellow.png";
import graphred from  "../assets/graph-red.png";
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

import {Card} from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import callsvc from '../utils/Services';
import userProfile from '../utils/Userprofile';
import {ADMIN_ERROR} from '../utils/Constants';
import DashboardOrders from '../components/DashboardOrders';
import DashboardFeedback from '../components/DashboardFeedback';



class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            salesData:{},
            
            stDt:'',
            endDt:'',
            userobj:userProfile.getUserObj(),contactusList:[], feedSpinner:false,
            salesData: {}, newCustData: {},todayreadysale:'',thisweeksale:'',thismonthsale:'',todaysubmittedsale:''
        }
    }

    componentDidMount(){
        let a = new Date();
        let b = new Date(Date.now() - ( 7*3600 * 1000 * 24))
        this.setState({stDt:b,endDt:a},()=>{this.graphlist()});
        this.currentsales();
        
        
    }

    currentsales = () => {
        this.setState({ showSpinner: true })
        callsvc({orgid:this.state.userobj.orgid, empid:this.state.userobj.empid}, 'currentsales', false)
            .then((res) => {
                if (res.code == "999") {
                    this.setState({ todayreadysale: res.todayreadysale, thisweeksale: res.thisweeksale, thismonthsale: res.thismonthsale, todaysubmittedsale: res.todaysubmittedsale })
                }
            })
            .catch((error) => {
                this.setState({ showError: true, errorMsg: ADMIN_ERROR })
            })
            .finally(() => {
                this.setState({ showSpinner: false })
            })
    }

    stDtChange = (value) => {

        let b = new Date (value);
        //b.setDate(b.getDate()+7);
        this.setState({ stDt: value }); 
        

    }

    
 



    

    graphlist = () => {
        this.setState({ showSpinner: true })
        
        let a = (this.state.stDt) ? new Date(this.state.stDt): new Date();
        let b = (this.state.stDt) ? new Date(this.state.endDt): new Date(Date.now() - ( 7*3600 * 1000 * 24))
        let end = `${a.getFullYear()}-${a.getMonth()+1}-${a.getDate()}`;
        let start = `${b.getFullYear()}-${b.getMonth()+1}-${b.getDate()}`;
        let inpobj = {
            orgid: this.state.userobj.orgid, stdt: start, enddt: end,empid:this.state.userobj.empid
        }
        
        callsvc(inpobj, "graphlist", false)
            .then((res) => {
                console.log(res)
                if (res.code == "999") {
                    let salesdata = []
                    let custdata = []
                    let newCustData = {
                        labels: [],
                        datasets: [
                            {
                                label: "New Customers",
                                backgroundColor: "#9CCC65",
                                borderColor: '#9CCC65',
                                data: [],
                                fill: false
                            }
                        ]
                    }
                    let salesData = {
                        labels: [],
                        datasets: [
                            {
                                label: "Sales",
                                backgroundColor: "#42A5F5",
                                borderColor: '#42A5F5',
                                data: [],
                                fill: false
                            }
                        ]
                    }

                    for (let i = 0; i < res.graphlist.length; i++) {
                        newCustData["labels"].push(res.graphlist[i].day)
                        salesData["labels"].push(res.graphlist[i].day)
                        salesdata.push(res.graphlist[i].sales)
                        custdata.push(res.graphlist[i].newcustomers)
                    }
                    salesData["datasets"][0]["data"] = salesdata
                    newCustData["datasets"][0]["data"] = custdata
                    this.setState({ newCustData: newCustData, salesData: salesData })
                    console.log(this.state.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                this.setState({ showSpinner: false })
            })
    }


    endDtChange = (value) => {
        this.setState({ endDt: value }, () => {
            this.graphlist()
        })
    }

    render (){
        let today = new Date();
        return (
            <div style={{backgroundColor:'#EEF2F6',padding:'8px'}}>
            
            <div className="p-grid">
                <div className="p-col-12 p-md-3">
                    <div className="overview-box overview-box-1" style={{position:'relative',margin:'12px 24px',height:90,padding:12}}>
                        <h1 style={{fontSize:'12px',color:'#fff',margin:0}}>Submitted Orders</h1>
                            <div style={{fontSize:'12px',color:'#fff',fontWeight:'700'}}>Rs {this.state.todaysubmittedsale}</div>
                        <img src={graphblue} style={{position:'absolute',bottom:0,width:'100%',left:0,right:0}}/> 
                    </div>

                </div>
                <div className="p-col-12 p-md-3">
                <div className="overview-box overview-box-2" style={{position:'relative',margin:'12px 24px',height:90,padding:12}}>
                        <h1 style={{fontSize:'12px',color:'#fff',margin:0}}>Ready Orders</h1>
                        <div style={{fontSize:'12px',color:'#fff',fontWeight:'700'}}>Rs {this.state.todayreadysale}</div>
                        <img src={graphgreen} style={{position:'absolute',bottom:0,width:'100%',left:0,right:0}}/> 
                    </div>
                </div>
                <div className="p-col-12 p-md-3">
                <div className="overview-box overview-box-3" style={{position:'relative',margin:'12px 24px',height:90,padding:12}}>
                        <h1 style={{fontSize:'12px',color:'#fff',margin:0}}>Current Week</h1>
                            <div style={{fontSize:'12px',color:'#fff',fontWeight:'700'}}>Rs {this.state.thisweeksale}</div>
                        <img src={graphyellow} style={{position:'absolute',bottom:0,width:'100%',left:0,right:0}}/> 
                    </div>
                </div>
                <div className="p-col-12 p-md-3">
                <div className="overview-box overview-box-4" style={{position:'relative',padding:'12px' ,height:90,margin:'12px 24px'}}>
                        <h1 style={{fontSize:'12px',color:'#fff',margin:0}}>Current Month</h1>
                        <div style={{fontSize:'12px',color:'#fff',fontWeight:'700'}}>Rs {this.state.thismonthsale}</div>
                        <img src={graphred} style={{position:'absolute',bottom:0,width:'100%',left:0,right:0}}/> 
                    </div>
                </div>
            
            </div>
            <div className = "p-grid">
                
                <div className="p-col-12 p-md-6">
                    <DashboardOrders />
                    <DashboardFeedback />

                </div>
                <div className="p-col-12 p-md-6">
                    <Card style={{margin:'8px'}}>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6"  style={{ display: "flex",justifyContent:'center',alignItems:'center'}}>
                            <h4 variant="h5" component="h5" style={{ margin: 10, color: "#787878", fontWeight: 600 }}>Start Date :</h4>
                            <div style={{ margin: 10 }}>
                                <div>
                                    <Calendar value={this.state.stDt} style={{ width: "150%" }} maxDate={today} onChange={(e) => this.stDtChange(e.target.value)} readOnlyInput={true} showIcon={true} />
                                </div>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6" style={{ display: "flex", justifyContent:'center',alignItems:'center' }}>
                            <h4 gutterBottom variant="h5" component="h5" style={{ margin: 10, color: "#787878", fontWeight: 600 }}>End Date :</h4>
                            <div style={{ margin: 10 }}>
                                <Calendar value={this.state.endDt} style={{ width: "150%" }} maxDate={today} minDate={this.state.stDt} onChange={(e) => this.endDtChange(e.target.value)} readOnlyInput={true} showIcon={true} />
                            </div>
                        </div>
                    </div>
                    </Card>
                    <Card style={{margin:'8px'}}>
                    <Chart type="line" data={this.state.salesData} />
                    </Card>
                    <Card style={{margin:'8px'}}>
                    <Chart type="line" data={this.state.newCustData} />
                    </Card>
                </div>
            </div>
            </div>
            
            )
    }

    
}

export default Dashboard;