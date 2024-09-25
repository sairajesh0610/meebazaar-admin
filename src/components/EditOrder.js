import React,{Component} from 'react';
import { Dialog } from 'primereact/dialog';
import Orderitlist from './Orderitlist';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import {Button} from 'primereact/button';
import {appTheme} from '../utils/Constants';
import userProfile from '../utils/Userprofile'; 
import AppSpinner from '../components/AppSpinner';
import {Growl} from 'primereact/growl'; 
import {getObjData,getObjFlds} from '../utils/ServiceCalls';

class EditOrder extends React.Component {

 constructor(props){
    super(props);
    this.state = {
        objtype:'ORDER_IT_LIST',
        dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
        userobj:userProfile.getUserObj(), cartpanel:false
    }
 }

 componentDidMount(){
    getObjData({objtype:this.state.objtype,parid:this.props.ordobj.ordid},this.setData,this.growl,'getorderitdata')

 }

 componentDidUpdate(prevProps){
    if(this.props.ordobj.ordid != prevProps.ordobj.ordid){
        if(this.props.parid)
            getObjData({objtype:this.state.objtype,parid:this.props.ordobj.ordid},this.setData,this.growl,'getorderitdata')
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

 submitOrder = () => {
     console.log(this.props.ordobj)
 }

 renderFooter(name) {
        
  if (name == 'editOrderDialog'){
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.props.setData({editOrderDialog:false})} className="p-button-danger" />
                <Button label="Submit" icon="pi pi-trash" onClick={() => this.submitOrder()} className="p-button-secondary"/>
            </div>
        )
    }
    



}

 render (){
     
    return (
    <>
    {this.state.showSpinner && <AppSpinner/>}
    <Growl ref={(el) => this.growl = el} sticky={true}/>
    <Dialog  footer={this.renderFooter('editOrderDialog')} visible={this.props.editOrderDialog} 
    style={{width:window.innerWidth,height:window.innerHeight,verticalAlign:'middle'}}  blockScroll 
    onHide = {()=> this.props.setData({editOrderDialog:false})} position="center"
    header={<label style={{color:appTheme.primaryColor}}>Editing the Order: {this.props.ordobj.ordercd}</label>}>     
    <div className="p-grid" style={{margin:4}}>
        <div className="p-col-12 p-md-3"> 
            <Panel toggleable collapsed={this.state.cartpanel} onToggle={(e) => this.setState({cartpanel: e.value})} header={this.state.data.length > 0 ? `Total Cart Items: ${this.state.data.length}`:'Cart'} style={{height:window.innerHeight-100, overflow: 'scroll'}}>

                { this.state.data.length == 0 ? <div style={{witdh:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                  No Items In Cart</div>:
                  <div style={{display:'flex',flexDirection:'column'}}>
                    {this.state.data.map((it)=>(
                      <div className="p-grid" style={{borderBottom:'1px solid #c8c8c8'}} key={it.orditid}>
                        <div className="p-col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>{<img src={it.prdimg} style={{height:60,width:60,marginLeft:12}}/>} </div>
                        <div className="p-col-8" style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'flex-start'}}>
                          <div style={{fontSize:12,fontWeight:'bold'}}>{it.prdname} </div>
                          {it.onpromo ? <div style={{fontSize:12,fontWeight:'bold'}}> Rs {it.promoprice} <span style={{textDecoration: 'line-through',opacity:0.6,fontSize:12,fontWeight:'bold'}}>Rs {it.price}</span> </div> : <div style={{fontSize:12,fontWeight:'bold'}}>Rs {it.price}</div>}
                          <div style={{fontSize:12,fontWeight:'bold'}}>GrossPrice: {it.orditamt}</div>
                          <div style={{fontSize:12,fontWeight:'bold'}}>Savings: {it.orditdscnt}</div>
                          
                          <div style={{fontSize:12,fontWeight:'bold'}}>Tax: {it.ordittax}</div>
                          <div style={{fontSize:12,fontWeight:'bold'}}>Total: {it.ordittot}</div>
                          <div style ={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
                          <Button icon="pi pi-minus-circle"  onClick={()=>{this.quanUpd(it,false)}} />
                          {/* <div style={{width:'40px',backgroundColor:appTheme.primaryColor,borderRadius:'10%',display:'flex',justifyContent:'center',alignItems:'center',fontSize:'28',color:'#fff'}} onClick={()=>{this.quanUpd(it,false)}}>-</div> */}
                            <div style={{width:'40px',borderRadius:'10%',display:'flex',justifyContent:'center',alignItems:'center',fontSize:'24',color:'#333'}}>{it.prdquan}</div>
                        <Button icon="pi pi-plus-circle"  onClick={()=>{this.quanUpd(it,true)}} />
                            {/* <div style={{width:'40px',backgroundColor:appTheme.primaryColor,borderRadius:'10%',display:'flex',justifyContent:'center',alignItems:'center',fontSize:'28',color:'#fff'}} onClick={()=>{this.quanUpd(it,true)}}>+</div> */}
                            
                          </div>


                          </div>

                      </div>
                    ))}

                    

                   
                    
                    
                    
                </div>}

            </Panel>
        </div>

        <div className="p-col-12 p-md-6" style={{height:window.innerHeight-100, overflow: 'scroll',border:'1px solid #c8c8c8'}} >

        </div>
        <div className="p-col-12 p-md-3" style={{height:window.innerHeight-100, overflow: 'scroll',border:'1px solid #c8c8c8'}} >
            <Panel toggleable collapsed={this.state.custpanel} onToggle={(e) => this.setState({custpanel: e.value})} header={'Customer Details'} style={{height:window.innerHeight-100, overflow: 'scroll'}}>
            <InputText id={'custname'} type="text" size={30} value={this.props.ordobj.custname} disabled={true}
                        onChange={(e)=>{
                           
                        }} tooltip={'Customer Name'} placeholder = 'Customer Name'
                        tooltipOptions={{position: 'top'}} style={{marginBottom:4}}/>
            <InputText id={'accid'} type="text" size={30} value={this.props.ordobj.accid} disabled={true}
                        onChange={(e)=>{
                           
                        }} tooltip={'Customer Phone'} placeholder = 'Customer Phone'
                        tooltipOptions={{position: 'top'}} style={{marginBottom:4}}/>

                        
            </Panel>
            
        </div>


    </div>

    </Dialog>
    </>
    )

 }


}
export default EditOrder;