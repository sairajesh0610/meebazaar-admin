import React from 'react';
import userProfile from '../utils/Userprofile';
import AppSpinner from '../components/AppSpinner';
import {getObjData} from '../utils/ServiceCalls';
import {Growl} from 'primereact/growl';
import {Button} from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Panel } from 'primereact/panel';



class Orderprint extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ordobj:{},
            objtype:'ORDER_IT_LIST',
            data:null,
            userobj:userProfile.getUserObj(),
            showprintbtn:true

        }
    }

    componentDidMount(){
        let ordObj = userProfile.getOrdprintItObj();
        this.setState({ordobj:ordObj});
        getObjData({objtype:this.state.objtype,parid:ordObj.ordid},this.setData,this.growl,'getorderitdata')

        
    }

    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            this.setState({
                [`${key}`]: inpobj[key]
            });
        })
    }

    printOrder = () => {
        this.setState({showprintbtn:false},()=>{
            
            window.print();
            this.setState({showprintbtn:true})
        
        
        });

        
        
        
        
    }

    render (){
        let orderdt = '';
        if(this.state.ordobj.orddt){
            orderdt = this.state.ordobj.orddt.split(" ")[0]
        }
        console.log(this.state.data)
        return (
        
            
            <div style={{backgroundColor:'#aaaaaa'}}>
            {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
            <Growl ref={(el) => this.growl = el} sticky={true}/>
            {this.state.showprintbtn && <Button label="Print" className='field' style={{marginLeft:'85%',marginTop:'10px'}} onClick={(e) => this.printOrder()} />}
                <div style={{backgroundColor:'#fff',marginTop:'50px',width:'800px',margin:'auto',padding:'24px'}}>
         
                    <img src={this.state.userobj.orglogo} height="40px" width="120px" />
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:'12px'}}>
                             <div>
                                
                                <div style={{fontSize:'18px',fontWeight:'600',color:'#333'}}>{this.state.userobj.orgname}</div>
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <i className="pi pi-envelope" style={{'fontSize': '12px',color:'#333',alignSelf:'center'}}></i>
                                    <div style={{marginLeft:'12px'}}>{this.state.userobj.orgemail}</div>

                                 </div>
                                 <div style={{display:'flex',alignItems:'center'}}>
                                    <i className="pi pi-mobile" style={{'fontSize': '12px',color:'#333',alignSelf:'center'}}></i>
                                    <div style={{marginLeft:'12px'}}>{this.state.userobj.orgphnum}</div>

                                 </div>

                             </div>
                            
                             <div style={{marginRight:'12px',alignSelf:'center'}}>
                                 <div style={{fontSize:'16px',fontWeight:'600',color:'#333'}}>Invoice</div>
                                 <div style={{fontSize:'14px',fontWeight:'400',color:'#333'}}>Date:&nbsp;{orderdt}</div>
                                 <div style={{fontSize:'14px',fontWeight:'400',color:'#333'}}>Order#:&nbsp;{this.state.ordobj.ordercd}</div>

                             </div>

                        
                        
                
                    </div>
                      <div style={{marginTop:'20px'}}>
                        
                      <div style={{fontSize:'16px',fontWeight:'600',color:'#333'}}>Bill To,</div>
                      <div style={{fontSize:'14px',fontWeight:'400',color:'#333'}}>{this.state.ordobj.custname}</div>
                      <div style={{fontSize:'12px',fontWeight:'400',color:'#333'}}>{this.state.ordobj.deladdr}</div>
                      <div style={{fontSize:'12px',fontWeight:'400',color:'#333'}}>Slot: {this.state.ordobj.delslot}</div>
                      <div style={{fontSize:'12px',fontWeight:'400',color:'#333'}}>Mobile#: {this.state.ordobj.accid}</div>
                      </div>
                      <DataTable style={{width:"100%", marginTop:'12px'}} value={this.state.data} >
                            <Column field="prdname" header="Name"  style={{textAlign:'center',width:'25%'}} />
                            <Column field="ordquan" header="Qty" style={{textAlign:'center'}}/>
                            <Column field="price" header="MRP"  style={{textAlign:'center'}}/>
                            <Column field="promoprice" header="SalePrice" style={{textAlign: 'center' }} />
                            <Column field="dscnt" header="Savings" style={{textAlign: 'center' }} />
                            <Column field="ordittot" header="Total" style={{textAlign: 'center' }} />
                        </DataTable>

                      <div style={{marginTop:'36px',display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                      <Panel header="Payment Summary" style={{width:'300px',marginRight:'12px'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>Sub Total:</div>
                    <div>{this.state.ordobj.ordamt}</div>
                </div>
                
                {parseInt(this.state.ordobj.orddscnt) > 0 && <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>(-) Order Discount:</div>
                    <div>{this.state.ordobj.orddscnt}</div>
                </div>}
                {parseInt(this.state.ordobj.promodscnt) > 0 && <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>(-) Promo Discount:</div>
                    <div>{this.state.ordobj.promodscnt}</div>
                </div>}
                {parseInt(this.state.ordobj.ordtax) > 0 && <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>Included Tax</div>
                    <div>{this.state.ordobj.ordtax}</div>
                </div>}
                 <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>(+) Delivery</div>
                    <div>{this.state.ordobj.delprice}</div>
                </div>
                <hr />
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>Total</div>
                    <div>{this.state.ordobj.ordtot}</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div> (-) Online Paid</div>
                    <div>{this.state.ordobj.onlineamount}</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div> (-) Paid from wallet</div>
                    <div>{this.state.ordobj.walamount}</div>
                </div>
                <hr />
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>Balance (To be paid)</p>
                    <p>{this.state.ordobj.balanceamt}</p>
                </div>
        </Panel>
        

                      </div>
                </div>
            </div>
            )
    }

    
}

export default Orderprint;