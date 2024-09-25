import React from 'react';

import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import {getObjData} from '../utils/ServiceCalls';
import {appTheme,APP_URL,ADMIN_ERROR} from '../utils/Constants';
import callsvc from "../utils/Services";



import {Dialog} from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import {Toolbar} from 'primereact/toolbar';

import { PickList } from 'primereact/picklist';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputTextarea } from 'primereact/inputtextarea';



class Orderbag extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            objtype:'ORDER_LIST', 
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            source:[],
            target:[],
            delboyList:[],
            delboyDialog:false,
            selectedStat:'',
            selectedDelBoy:'',
            searchInp:'',searchInp2:'',
            showSpinner:true,
            prdData:[],searchProdData:[],addlist:[],
            selordid:'',selordcd:'',selectedRow:{},prdData:[],
            
        }
    }

    componentDidMount(){
        
        getObjData({objtype:this.state.objtype},this.setData,this.growl,'getpickorders');
        this.getdbList();
        this.getPrdData();
        
    }
    


    getOrderDetail = (item) => {
    this.setState({showOrderItSpinner:true})
    callsvc({objtype:'ORDER_IT_LIST',parid:item.ordid},'getorderitdata',false)
    .then((res)=>{
          
         if(res.code == '999' || res.code == '9991' ){
            let data = res.data;
            for(let i=0;i<data.length;i++){
                data[i]['actquan'] = data[i]['ordquan'];
            }
            this.setState({
                source:(res.code == '999')? data:[],
                showOrderItSpinner:false},()=>console.log(this.state.source));
           
         }else{
            console.log(res.code)
            this.setState({source:[],showOrderItSpinner:false})
            this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
         }
    })
    .catch((err)=>{
        console.log(err);
        this.setState({source:[],showOrderItSpinner:false})
        this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
    })
    .finally(()=>{
        
    });
    }
    getdbList= () =>{
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid};
        callsvc(inpobj,'getdelboylist',false)
        .then((res)=>{
            this.setState({delboyList:res.data})
        })
        .catch((err=>{
            console.log(err)
        }))
    }

    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            if(key == 'data'){
                this.setState({actData:inpobj[key]})
            }
            this.setState({
                [`${key}`]: inpobj[key]
            });
        })
    }

    
    assignOrder = () => { 
        
        if(!this.state.selectedDelBoy.empid){
            this.growl.show({severity: 'warn', summary: 'Cannot assign Order', detail: 'Please choose both fields!',life:6000});
            return;
        }
        console.log(this.state.selectedDelBoy, this.state.selectedStat);
        let target = this.state.target
        for(let i=0;i<target.length;i++){
            target[i]["prdname"] = encodeURIComponent(target[i]['prdname']);

        }
        let inpobj = {orgid:this.state.userobj.orgid,orderitems:JSON.stringify(target),empid:this.state.userobj.empid,ordid:this.state.selRow.ordid,ordstat:'ORDER_READY',assigned:this.state.selectedDelBoy.empid}
        callsvc(inpobj,'changeorder',false)
        .then((res)=>{
            if(res.code == '999'){
                
                // for(let i=0;i<this.state.data.length;i++){
                //     if(this.state.data[i]['ordid'] == inpobj['ordid']){
                //         this.state.data.splice(i,1);
                        
                //         break;
                //     }
                // }
                this.setState({source:[],target:[]});
                this.setState({delboyDialog:false,selectedDelBoy:'',data:this.state.data,selRow:{},source:[],target:[]});

            }else {
                this.setState({delboyDialog:false,selectedStat:'',selectedDelBoy:''})
            }
        })
        .catch((err=>{
            console.log(err)
        }))

    }
    setQVal(val,obj){
        let a = this.state.source.map((it)=>{
            if(it.orditid == obj.orditid){
                it.actquan = val;
                return it;
            }else{
                return it;  
            }
        })
        this.setState({source:a})
    }

    searchOrders = (inpval) => {
        this.setState({searchInp:inpval});
        let text =inpval.toLowerCase();
        let resultitems = [];
        if(text){
             resultitems = this.state.data.filter((obj)=>{
                return (
                        obj.ordercd.toLowerCase().indexOf(text) > -1 ||
                        obj.custname.toLowerCase().indexOf(text) > -1 
                        
                        
                        );
             })
         }else {
             resultitems = this.state.actData;
         }
         this.setState({data:resultitems});
    }

    selectRow = (item) => {
        this.setState({selRow:item})
        this.getOrderDetail(item)
        this.setState({target:[]})
        console.log(item)
    }
    
    moveAllItems(type){
        if(type==="source"){
          let a = this.state.source
          if(this.state.target.length>0){
              for(let i=0;i<this.state.target.length;i++){
                  a.push(this.state.target[i])
              }
          }
          this.setState({target:a,source:[]})  
        }else{
            let a = this.state.target
            if(this.state.source.length>0){
                for(let i=0;i<this.state.source.length;i++){
                    a.push(this.state.source[i])
                }
            }
            this.setState({source:a,target:[]})
        }
    }

    updateSource(obj){
        let b = [];
        let d = [];
        let a = this.state.target.filter((it)=>{
            if(it.orditid==obj.orditid){
                d=it;
                return true;
            }else{
                b.push(it);
            }
        })
        let c = this.state.source;
        c.unshift(d)
        this.setState({source:c,target:b})
    }
    
    updateTarget(obj){
        let b = [];
        let d = [];
        let a = this.state.source.filter((it)=>{
            if(it.orditid==obj.orditid){
                d=it;
                return true;
            }else{
                b.push(it);
            }
        })
        let c = this.state.target;
        c.unshift(d)
        
        this.setState({source:b,target:c})
    }
    

    cancelOrder = () => {
        let inpobj = {ordid:this.state.selRow.ordid,custid:this.state.selRow.custid,orgid:this.state.userobj.orgid,empid:this.state.userobj.empid}
        callsvc(inpobj,'cancelorder',false)
        .then((res)=>{
            if(res.code == '999'){
                let selRow = {}
                for(let i=0;i<this.state.data.length;i++){
                    if(this.state.data[i]['ordid'] == inpobj['ordid']){
                        this.state.data.splice(i,1);
                        if(this.state.data.length > 0){
                            selRow = this.state.data[i];
                        }
                        break;
                    }
                }
                this.setState({deleteDialog:false,data:this.state.data,selRow:{},source:[],target:[]});

            }else {
                this.setState({deleteDialog:false})
            }
        })
        .catch((err=>{
            console.log(err)
        }))

    }

    ordTemplate(it) {
        console.log(it)
        return (
            <div key={it.orditid} style={{ textAlign: "center", backgroundColor: '#f2f2f2', padding:8,
            display:'flex',justifyContent:'flex-start',alignItems:'center' }} className="p-clearfix">
                <img src={it.image} style={{ display: 'inline-block', margin: '2px 0 2px 2px', width: 48 }} />
                
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',marginLeft:8}}>
                <div style={{ fontSize: '14px', float: 'right', marginBottom:'4px',color:'#333' }}>{it.prdname}</div>
                <div style={{ fontSize: '14px', float: 'right', marginBottom:'4px',color:'#333' }}>Quantity: {it.ordquan}</div>
                <div style={{ fontSize: '14px',color:'#333' }}>price-{it.price}--off price-{it.promoprice}</div>


                </div>
                
            </div>
        )
    }

    bagItem = (event) => {
        this.setState({
            source: event.source,
            target: event.target
        });
    }

    renderFooter(name) {
        
            
        if(name == 'delboyDialog'){
            return (
                <div>
                    <Button label="No" icon="pi pi-times" onClick={() => this.setState({delboyDialog:false})} className="p-button-danger" />
                    <Button label="Update" icon="pi pi-check" onClick={() => this.assignOrder()} className="p-button-secondary"/>
                </div>
            )
        }else if (name == 'deleteDialog'){
            return (
                <div>
                    <Button label="No" icon="pi pi-times" onClick={() => this.setState({deleteDialog:false})} className="p-button-danger" />
                    <Button label="Yes" icon="pi pi-trash" onClick={() => this.cancelOrder()} className="p-button-secondary"/>
                </div>
            )
        }else if(name == 'add'){
            return (
                <div>
                    <Button label="No" icon="pi pi-times" onClick={() => this.setState({addItemDialog:false})} className="p-button-danger" />
                    <Button label="Yes" icon="pi pi-trash" onClick={() => this.addItemsToBag()} className="p-button-secondary"/>
                </div>
            )
        }
    }
    getPrdData = () => {
        callsvc({ ordid: this.state.userobj.orgid, empid: this.state.userobj.empid }, 'getproductsdata', false)
            .then((res) => {
                if (res.code == '999') {
                    let prdData = res.data.map((it)=>{
                        it.barcodes =it.barcodes.split(",");
                        return it;
                    })
                    this.setState({ prdData: prdData }, ()=>{console.log(this.state.prdData)})
                }

            })
            .catch((err) => { console.log(err) })
            .finally(() => { })
    }
    
    doBarcodeSearch = (val) => {
                
        this.setState({barcodeInp:val});

        if(val.length > 11) {
            let searchProdData = this.state.source.filter((it) => {
                return (it.barcodes.includes(val));
            })
            console.log(searchProdData);
            


        }
    }
    
    
    render (){
        return (

            <div style={{width:window.innerWidth,height:(window.innerHeight-100),backgroundColor:'#E0E0E0',margin:'auto'}}>
                <div  style={{padding:'12px',display:'flex',flexDirection:'row',width:'100%'}}>
                    <div style={{width:'25%'}}>
                        <Panel header="Submitted Orders" style={{ backgroundColor:'#fff',marginRight:'4px',padding:'4px',height:window.innerHeight-100, overflow: 'scroll' }}>
                        
                        
                        <div style={{position:'relative',padding:'4px'}}>
                        <InputText style={{ width:'100%',paddingLeft:'30px'}} value={this.state.searchInp} onChange={(e) => this.searchOrders(e.target.value)} placeholder="Search" />
                        <i className="pi pi-search"  style={{position:'absolute',left:12,top:'40%',color:'#a9a9a9',fontSize:12}}/>
                        {this.state.searchInp.length > 0 && <i className="pi pi-times"  style={{position:'absolute',right:12,top:'40%',color:'#a9a9a9',fontSize:12}} onClick={()=>{this.searchOrders('')}}/>}
                        </div> 
                        {this.state.showSpinner && <div style={{width:'100%',display:'flex',justifyContent:'100%',alignItems:'center'}}> <ProgressSpinner /></div>}
                        {this.state.data.map((item, index,) => {
                            return (

                                    
                                    <div onClick={(e) => { this.selectRow(item) }}>

                                    
                                 
                                    <Card style={{border: '0.80px solid', backgroundColor: '#f6f6f6', color: "#333",borderColor: (item.ordid == this.state.selRow.ordid) ? 'red':'#333' }} key={item.ordid} >
                                        
                                        <div style={{ fontSize: "14px", marginBottom:'4px' }}><span style={{fontWeight:'bold'}}>Order #:&nbsp;</span>
                                        <span style={{fontSize:12}}>{item.ordercd}</span>&nbsp;
                                        {item.orderstatus=='INCOMPLETE' &&<span style={{fontSize:13,fontWeight:'italic',color:'white',backgroundColor:'red',width:'100px'}}>{item.orderstatus}</span>}
                                        {item.orderstatus=='PICKUP' &&<span style={{fontSize:13,fontWeight:'italic',color:'white',backgroundColor:'#5cb85c',width:'100px'}}>{item.orderstatus}</span>}
                                        </div>
                                        <div style={{ fontSize: "14px",marginBottom:'4px'}}><span style={{fontWeight:'bold'}}>OrderDt:&nbsp;</span><span style={{fontSize:12}}>{item.orddt}</span></div>
                                        <div style={{fontSize: "14px",marginBottom:'4px'}}> <span style={{fontWeight:'bold'}}>Name: &nbsp;</span><span style={{fontSize:12}}>{item.custname}</span></div>
                                        <div style={{fontSize: "14px",marginBottom:'4px'}}> <span style={{fontWeight:'bold'}}>Addr:&nbsp;</span><span style={{fontSize:12}}>{item.deladdr}</span></div>
                                        <div style={{fontSize: "14px",marginBottom:'4px'}}> <span style={{fontWeight:'bold'}}>Slot:&nbsp;</span> <span style={{fontSize:12}}>{item.delslot}</span></div>
                                        <div style={{ fontSize: "14px",fontWeight: 'bold', fontSize: 14 }}>Total: Rs &nbsp;{item.ordtot}</div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button style={{ fontWeight: "bold", focus: 'box-shadow: inset 0 0 0 0.2em red', }} label="More Info" onClick={(e) => { this.selectRow(item) }} /></div>
                                    </Card>
                                    </div>
                                
                            )
                        })}
                            
                        </Panel>

                    </div>
                    <div style={{backgroundColor:'#fff',width:'75%'}}>
                    {this.state.showOrderItSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
                        <Growl ref={(el) => this.growl = el} sticky={true}/>
                    <Toolbar>
                        <div className="p-toolbar-group-left">
                            <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>{this.state.selRow.ordid ? `Order Detail for # : ${this.state.selRow.ordercd}`:'Order Detail'}</p>
                        </div>
                        <div className="p-toolbar-group-right">
                       

                            <Button disabled={this.state.source.length<1}  icon="pi pi-trash" label="Cancel Order" className="p-button-danger" style={{marginRight:'.25em'}} onClick={()=>this.setState({deleteDialog:true})} />
                            <Button disabled={this.state.target.length<1} icon="pi pi-pencil" label="Assign Order" className="p-button-warning" style={{marginRight:'.25em'}} onClick={()=>{ this.setState({delboyDialog:true})}} /> 
                        </div>
                        
                    </Toolbar>
                     
                     <div style={{marginTop:12,display:'flex',alignItems:'center'}}>
                     <Panel header="Customer Order" style={{ backgroundColor:'#fff',marginRight:'4px',padding:'4px',height:window.innerHeight-200, overflow: 'scroll', width:'50%' }}>
                     <Button icon="pi pi-forward" label="move all" className="p-button-danger"  style={{marginRight:'5%','position':'absolute'}} onClick={()=>this.moveAllItems('source')} disabled={this.state.source.length==0}></Button>
                        {this.state.source.map((it)=>
                            
                            <div style={{border: '0.80px solid', display:'flex', flexDirection:'row',backgroundColor: '#f6f6f6', color: "#333"}} key={it.orditid} >
                            <div style ={{flex:1,padding:'10px'}}>
                            <img src={it.prdimg} style={{width:'100px',height:'100px'}}/>
                            </div>
                            <div style ={{flex:3,padding:'10px'}}>
                            <div style={{ fontSize: "14px", marginBottom:'4px' }}>
                            <span>{it.prdname}</span><div><Button icon='pi pi-caret-right' label="move" className="p-button-success" style={{marginRight:'.25em'}} onClick={() => this.updateTarget(it)}></Button>
                            </div>
                            </div>
                            
                            <div style={{ fontSize: "14px",marginBottom:'4px'}}>
                            <span>Qty:{it.ordquan}</span>&nbsp;
                            <InputText style={{width:'40px',height:'20px'}} value={it.actquan} onChange={(e)=>{this.setQVal(e.target.value,it)}}/> 
                            </div>
                            <div style={{ fontSize: "14px",marginBottom:'4px',textDecoration:it.onpromo? 'line-through':'none'}}>{it.price}</div>
                            {it.onpromo && <div style={{ fontSize: "14px",marginBottom:'4px'}}>{it.promoprice}</div>}
                            </div>
                            </div>
                        )}
                     </Panel>
                     <div style={{flex:1}}></div>
                     <Panel header="Customer Bag" style={{ backgroundColor:'#fff',marginRight:'4px',padding:'4px',height:window.innerHeight-200, width:'50%',overflow: 'scroll' }}>
                     <Button icon="pi pi-backward" label="move all" className="p-button-danger"  style={{marginRight:'5%','position':'absolute'}} onClick={()=>this.moveAllItems('target')} disabled={this.state.target.length==0}></Button>
                     {this.state.target.map((it)=>
                        <div style={{border: '0.80px solid', display:'flex', flexDirection:'row',backgroundColor: '#f6f6f6', color: "#333"}} key={it.orditid} >
                            <div style ={{flex:1,padding:'10px'}}>
                            <img src={it.prdimg} style={{width:'100px',height:'100px'}}/>
                            </div>
                            <div style ={{flex:3,padding:'10px'}}>
                            <div style={{ fontSize: "14px", marginBottom:'4px' }}>
                            <span>{it.prdname}</span>
                            <div><Button icon='pi pi-caret-left' label="move" className="p-button-success" style={{marginRight:'.25em'}} onClick={() => this.updateSource(it)}></Button>
                            </div>
                            </div>                            
                            <div style={{ fontSize: "14px",marginBottom:'4px'}}>Qty:{it.actquan}</div>
                            <div style={{ fontSize: "14px",marginBottom:'4px',textDecoration:it.onpromo? 'line-through':'none'}}>{it.price}</div>
                            {it.onpromo && <div style={{ fontSize: "14px",marginBottom:'4px'}}>{it.promoprice}</div>}
                            </div>
                            </div>
                        )}
                     </Panel>

                    </div>

                    </div>


                </div>
                
                
                <Dialog   style={{width: '50%',padding:'12px',height:'50%'}}  footer={this.renderFooter('delboyDialog')} header={<label style={{color:appTheme.primaryColor}}>Assign Order</label>} visible={this.state.delboyDialog}  blockScroll onHide={() => this.setState({ delboyDialog: false })} position="center">
                     
                    {this.state.showError && <div style={{color:'red',fontWeight:'bold',maxWidth:'300px',textAlign:'center',marginBottom:'12px'}}>{this.state.errorMsg}</div>}
                   
                    
                    <Dropdown appendTo={document.body} style = {{width:'90%',margin:'auto',marginTop:'12px'}} value={this.state.selectedDelBoy} options={this.state.delboyList} onChange={(e) => {console.log(e);this.setState({selectedDelBoy: e.value})}} placeholder="Select Delivery Boy" optionLabel="name"/>
                
                        
                </Dialog>
                <Dialog footer={this.renderFooter('deleteDialog')} visible={this.state.deleteDialog} onHide = {()=>{this.setState({deleteDialog:false})}} header={<label style={{color:appTheme.primaryColor}}>oops... Cancelling the Order!</label>}   blockScroll  position="topright">
                    <div>
                        <p> You are about to Cancel the Order!. Order # <span style={{ fontWeight: 'bold', color: appTheme.primaryColor }}>{this.state.selRow.ordercd}</span>  </p>
                        
                    </div>
                
            </Dialog>
            

            </div>
        
            
            )
    }

    
}

export default Orderbag;