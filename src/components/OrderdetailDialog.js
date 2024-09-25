import React,{Component} from 'react';
import { Dialog } from 'primereact/dialog';
import Orderitlist from './Orderitlist';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';

class OrderdetailDialog extends React.Component {

 constructor(props){
    super(props);
 }

 componentDidMount(){

 }

 render (){
     
    return (
    <>
    <Dialog  visible={this.props.editDialog} style={{width:window.innerWidth,height:window.innerHeight,verticalAlign:'middle'}}  blockScroll onHide = {()=> this.props.setData({editDialog:false})} position="center">        
    <div className="p-grid"  >
        
        <div className="p-col-9">
        <Panel header="Order Summary" toggleable>
        <div className="p-grid"  >
            <div className="p-col-6" >
                    <div className="p-grid" style={{marginBottom:'8px'}}>
                        <div className="p-col-4">Order #:</div>
                        <InputText className="p-col-8" type="text" size={16} value={this.props.ordobj.ordercd} 
                             disabled={true} style={{marginLeft:8}}
                            />
                        
                    </div>
                    <div className="p-grid" style={{marginBottom:'8px'}}>
                        <div className="p-col-4">Customer:</div>
                        <InputText className="p-col-8" type="text" size={16} value={this.props.ordobj.custname} 
                             disabled={true} style={{marginLeft:8}}
                            />
                        
                    </div>
                    <div className="p-grid" style={{marginBottom:'8px'}}>
                        <div className="p-col-4">Phone:</div>
                        <InputText className="p-col-8" type="text" size={16} value={this.props.ordobj.accid} 
                             disabled={true} style={{marginLeft:8}}
                            />
                        
                    </div>
                   
            </div>
            <div className="p-col-6">
                    <div className="p-grid" style={{marginBottom:'8px'}}>
                        <div className="p-col-4">Delivery Type:</div>
                        <InputText className="p-col-8" type="text" size={16} value={this.props.ordobj.delmethod} 
                             disabled={true} style={{marginLeft:8}}
                            />
                        
                    </div>
                    <div className="p-grid" style={{marginBottom:'8px'}}>
                        <div className="p-col-4">Delivery Address:</div>
                        <InputText className="p-col-8" type="text" size={16} value={this.props.ordobj.deladdr} 
                             disabled={true} style={{marginLeft:8}}
                            />
                        
                    </div>
                    <div className="p-grid" style={{marginBottom:'8px'}}>
                        <div className="p-col-4">Delivery Slot:</div>
                        <InputText className="p-col-8" type="text" size={16} value={this.props.ordobj.delslot} 
                             disabled={true} style={{marginLeft:8}}
                            />
                        
                    </div>
                    
                
                
            </div>
            

        </div>
                

        </Panel>
            <Orderitlist parid={this.props.ordobj.ordid}/>
        </div>
        <div className="p-col">
        <Panel header="Payment Summary" toggleable>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>Sub Total:</p>
                    <p>{this.props.ordobj.ordamt}</p>
                </div>
                
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>(-) Order Discount:</p>
                    <p>{this.props.ordobj.orddscnt}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>(-) Promo Discount:</p>
                    <p>{this.props.ordobj.promodscnt}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>(+) Tax</p>
                    <p>{this.props.ordobj.ordtax}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>(+) Delivery</p>
                    <p>{this.props.ordobj.delprice}</p>
                </div>
                <hr />
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>Total</p>
                    <p>{this.props.ordobj.ordtot}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p> (-) Online Paid</p>
                    <p>{this.props.ordobj.onlineamount}</p>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p> (-) Paid from wallet</p>
                    <p>{this.props.ordobj.walamount}</p>
                </div>
                <hr />
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p>Balance (To be paid)</p>
                    <p>{this.props.ordobj.balanceamt}</p>
                </div>
        </Panel>
            <div>
            

           
            </div>

        </div>
        
    </div>        
    </Dialog>
    </>
    )

 }


}
export default OrderdetailDialog;