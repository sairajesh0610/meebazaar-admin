import React from 'react';
import {Card} from 'primereact/card';


import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {appTheme,ADMIN_ERROR} from '../utils/Constants';
import callsvc from "../utils/Services";
import {callmobilesvc as callService} from '../utils/Services';
import { RadioButton } from 'primereact/radiobutton';
import {Growl} from 'primereact/growl';
import { Panel } from 'primereact/panel';
import AppSpinner from '../components/AppSpinner';
import userProfile from '../utils/Userprofile'; 


class Createorder extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userobj:userProfile.getUserObj(), prdData:[],searchProdData:[], cartpanel:false, orderpanel:false, customerpanel:false,
            searchInp:'', addrlist:[], delMethods : [],loclist:[],locdata:[],
            ordobj: {custid:'',orgid:'',deladdr:'',ordid:'',date:'',sttime:'',endtime:'',slot:'',slotid:'',loc: '', comments:'',
                     addrid:'',addr1:'',addr2:'',city:'',state:'',zipcode:'',paymethod:'',comments:'',promocode:'',
                     ordtotal:0,delmethod:'',promodscnt:0,delprice:0.00,pmtid:'',pmstatus:'',day:'',pmtamt:0,
                     walamt:0,source:'APP',locid:'',lat:'',lon:'',fstname:'',accid:'', addrdiv:'', fulladdr:'',netpayble:0
                    },
            showdiv: {searchdiv:true,crtcust:false,crtorder:false, chooseaddr:false,crtaddr:false},
            daySlot:[],walletBal:0,availableBal:0,addressDialog:false,
            cartobj:{orditlist:[]},
            addrobj: {addr:'',addr2:'',addrid:'',city:'',state:'',zipcode:'',lat:'',lon:'',defaultaddr:true,addrtag:'Home',loc:''}

        }
    }

    componentDidMount(){
        console.log(this.props)
        this.getPrdData();
        
        

    }

    calcNetPayble = () => {
      // ordertotal - (walbal + delcharges + promodiscnt)
      let orderTotal = parseFloat(this.state.cartobj.ordtotal) + parseFloat(this.state.ordobj.delprice) - parseFloat(this.state.ordobj.promodscnt);
      
      let netpayble = parseFloat(this.state.cartobj.ordtotal) + parseFloat(this.state.ordobj.delprice) - (parseFloat(this.state.ordobj.walamt) + parseFloat(this.state.ordobj.promodscnt))
      if(this.state.ordobj.paymethod == 'CASH-PAID'){
          this.state.ordobj.pmtid = 'CASH-PAID';
          this.state.ordobj.pmtamt = netpayble
      }else{
          this.state.ordobj.pmtid = '';
          this.state.ordobj.pmtamt = 0
      }
      //this.setState({ordobj:Object.assign(this.state.ordobj,{paymethod:'CASH-PAID',pmtid:'CASH-PAID',pmtamt:this.state.ordobj.netpayble})});
      this.setState({ordobj: Object.assign(this.state.ordobj,{netpayble:netpayble})});
     

    }



    getPrdData = () => {
      callsvc({ordid:this.state.userobj.orgid,empid:this.state.userobj.empid},'getproductsdata',false)
      .then((res)=>{
          if(res.code == '999'){
              this.setState({prdData:res.data})
          }

      })
      .catch((err)=>{console.log(err)})
      .finally(()=>{})
  }

    addDelMethods = () => {
      if(this.state.delMethods.length == 0){
      if(this.state.userobj.homedel){
        this.state.delMethods.push({name:'Home Delivery', value:'Home Delivery',selected:false});
      }
      if(this.state.userobj.pickup){
        this.state.delMethods.push({name:'Store Pickup', value:'Store Pickup',selected:false});
      }
      this.setState({delMethods:this.state.delMethods})
    }
    }

    setSearchInp = (e) => {
        if(e.target.value.length < 11){
            let str = e.target.value
            let pattern = /^\d+$/;
            let isNum = pattern.test(str.charAt(str.length-1));
            if(isNum)
            this.state.ordobj.accid = e.target.value
            this.setState({ordobj:this.state.ordobj});
            if(this.state.ordobj.accid.length == 10) {
              this.searchCustomer();
            }
        }


    }


    chooseDiv = (inp)=>{
        Object.keys(this.state.showdiv).map((key)=>{
            this.state.showdiv[key] = (key == inp) ? true: false;
            
        })
        this.setState({showdiv:this.state.showdiv});
        if(inp == 'crtorder'){
            this.getDelSlotList();
            this.getWalletBalance();
            
            if(this.state.ordobj.ordid){
                this.getCart();
            }
        } else if(inp == 'crtaddr'){
            this.getLocList();
        }
     
    }


    goToCartDiv = ()=>{
      if(!this.state.ordobj.addrid){
        this.growl.show({severity: 'warn', summary: 'Address Missing', detail: 'Please choose address',life:6000});
        return;
      }
      this.chooseDiv('crtorder')

    }

    
  getCart = () => {
    
    callsvc({custid: this.state.ordobj.custid,orgid:this.state.ordobj.orgid,langpref:'English'}, 'getnewcart', false)
      .then(res => {
        if (res.code == '999') {
          for(let i=0; i<res.orditlist.length;i++){
            res.orditlist[i]['available'] = (res.orditlist[i]['prdquan'] == 0) ? false:true;
            res.orditlist[i]['showdscnt'] = (parseFloat(res.orditlist[i]['orditdscnt']) > 0) ? true : false
            res.orditlist[i]['itprice'] = parseFloat(res.orditlist[i]['ordittot']) + parseFloat(res.orditlist[i]['orditdscnt']);
            res.orditlist[i]['itdscnttxt'] = 'Rs '+ parseFloat(res.orditlist[i]['orditdscnt']) +' '+ 'Saved now' ;
            res.orditlist[i]['prdquan'] = parseInt(res.orditlist[i]['prdquan']);
            }

          this.setState({cartobj: res},()=>{this.calcNetPayble()});
          
        } 
      })
      .catch(error => {
        console.log(error);
        
      })
      .finally(() => {
        
      });
  };

    
  getWalletBalance = () => {
    callsvc(
      {custid: this.state.ordobj.custid, orgid: this.state.ordobj.orgid},
      'custwalletbal',
      false,
    )
      .then(res => {
        if (res.code == '999') {
          this.setState({walletBal:res.custdetails.walbal,availableBal:res.custdetails.totalbal});
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({showaddrSpinner: false});
      });
  };

    getDelSlotList = () => {
        
            
      callsvc({custid:this.state.ordobj.custid,orgid:this.state.ordobj.orgid}, 'getslotdetails', false)
              .then(res => {
                if (res.code == '999') {
                  console.log(res.slotlist);
                  let slot = res.slotlist;
                  slot.map(item => {
                    item.selected = false;
                    return item;
                  });
                  this.setState({daySlot: slot});
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                
              });
          
    }

    getLocList = () => {
        // getloclist
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,accid:this.state.ordobj.accid};
        callsvc(inpobj,'getadminlocations',false)
        .then((res)=>{
          let locdata = [];
          for(let i=0; i<res.locations.length; i++){
            locdata.push(res.locations[i]['loc']);
          }
          this.setState({loclist:res.locations,locdata:locdata});
          console.log(res)
        })
        .catch((err)=>{

        }).finally(()=>{

        })
    }

    searchCustomer = () => {
        this.setState({showSpinner:true});
        let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,accid:this.state.ordobj.accid};
        callsvc(inpobj,'searchbyaccid',false)
        .then((res)=>{
            if(res.code == '999'){
                this.state.ordobj.custid = res.data.custid;
                this.state.ordobj.orgid = res.data.orgid;
                this.state.ordobj.fstname = res.data.fstname;
                this.state.ordobj.accid = res.data.accid;
                this.addDelMethods();
                this.getCart();
                this.getWalletBalance();
                
                if(res.data.ordexist){
                    this.state.ordobj.ordid = res.data.ordid; 
                }
                if(res.data.addrexist){
                    if(res.data.addrlist.length == 1){
                        this.state.ordobj.addrid = res.data.addrlist[0]['addrid'];
                        this.state.ordobj.addr1 = res.data.addrlist[0]['addr1'];
                        this.state.ordobj.addr2 = res.data.addrlist[0]['addr2'];
                        this.state.ordobj.city = res.data.addrlist[0]['city'];
                        this.state.ordobj.state = res.data.addrlist[0]['state'];
                        this.state.ordobj.zipcode = res.data.addrlist[0]['zipcode'];
                        this.state.ordobj.locid = res.data.addrlist[0]['locid'];
                        this.state.ordobj.lat = res.data.addrlist[0]['lat'];
                        this.state.ordobj.lon = res.data.addrlist[0]['lon'];
                        this.state.ordobj.fulladdr = `${this.state.ordobj.addr1} ${this.state.ordobj.addr2} ${this.state.ordobj.city} ${this.state.ordobj.state} ${this.state.ordobj.zipcode}`;

                        
                        
                  }
                        this.setState({addrlist:res.data.addrlist})
                        
                    
                    
                }else {
                    
                    
                }  

                
               

            }else if(res.code == '9991'){
              this.state.ordobj.custid = '';
              this.state.ordobj.fstname = '';
              this.state.ordobj.ordid = '';
              this.state.ordobj.addr1 = ''
              this.state.ordobj.addr2 = ''
              this.state.ordobj.city = ''
              this.state.ordobj.state = ''
              this.state.ordobj.zipcode = ''
              this.state.ordobj.locid = ''
              this.state.ordobj.lat = ''
              this.state.ordobj.lon = ''
              this.state.ordobj.fulladdr = ''
              this.state.addrlist=[];

                
            }
            
        })
        .catch((err=>{
            console.log(err)
        }))
        .finally(()=>{this.setState({showSpinner:false});})
    }

    setAddr = (seladdrid) => {
      
      console.log(seladdrid);
      for(let i=0;i<this.state.addrlist.length;i++){
        if(this.state.addrlist[i].addrid == seladdrid){
          this.state.ordobj.addrid = this.state.addrlist[i].addrid;
          this.state.ordobj.addr1 = this.state.addrlist[i].addr1;
          this.state.ordobj.addr2 = this.state.addrlist[i].addr2;
          this.state.ordobj.city = this.state.addrlist[i].city;
          this.state.ordobj.state = this.state.addrlist[i].state;
          this.state.ordobj.zipcode = this.state.addrlist[i].zipcode;
          this.state.ordobj.locid = this.state.addrlist[i].locid;
          this.state.ordobj.lat = this.state.addrlist[i].lat;
          this.state.ordobj.lon = this.state.addrlist[i].lon;
          break;

        }
        
      }
      this.setState({ordobj:this.state.ordobj});
    }

    chooseDelMethod = (selectedMethod) => {
      if(selectedMethod == 'Home Delivery')
      this.getDelSlotList();
      else{
        this.state.ordobj.delprice = 0;
        this.state.ordobj.slotid = '';
        
      }
       this.state.ordobj.delmethod = selectedMethod;
       this.setState({ordobj:this.state.ordobj},()=>{this.calcNetPayble()})
    }

    doProductSearch = (val) => {
      val = val.toLowerCase();
       this.setState({searchInp:val})
       if(val.length > 2){
         this.state.searchProdData = this.state.prdData.filter((it)=>{
          return (
            it.name.toLowerCase().indexOf(val) > -1
            
            
            );
         })
       }else{
        this.state.searchProdData =[]
       }
       this.setState({searchProdData:this.state.searchProdData})


    }

    


    addCustomer = () => {
      this.setState({showSpinner:true})
      let inpobj = {orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,accid:this.state.ordobj.accid,fstname:this.state.ordobj.fstname};
      callsvc(inpobj,'addcustomer',false)
      .then ((res)=>{
        if(res.code == '999'){
          this.state.ordobj.custid = res.custid;
          this.addDelMethods();
          //this.getDelSlotList();
                
        }else{
          this.growl.show({severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR,life:6000});

        }

      }).catch((err)=>{
        this.growl.show({severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR,life:6000});

      }).finally(()=>{
        this.setState({showSpinner:false})
      })


    }

    addAddressDialog = () => {
      this.getLocList();
      this.setState({addressDialog:true});

    }

    saveAddressRow = () => {
      let {addr,loc} = this.state.addrobj;
        if(!addr){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `Address1 seems to be missing! Please check`,life:6000});
            return;
        }else if(!loc){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `Location seems to be missing! Please check`,life:6000});
            return;
        }  

        let inpobj = {
          orgid: this.state.userobj.orgid,
          empid: this.state.userobj.empid,
          custid:this.state.ordobj.custid,
          addr : this.state.addrobj.addr,
          addr2 : this.state.addrobj.addr2,
          city : this.state.addrobj.city,
          state : this.state.addrobj.state,
          zipcode : this.state.addrobj.zipcode,
          locid : this.state.addrobj.locid,
          lon : this.state.addrobj.lon,
          addrid: this.state.addrobj.addrid,
          defaultaddr:true,
          addrtag: 'Home'


        }
        callsvc(inpobj,'addcustaddress',false)
        .then((res)=>{
          if(res.code == '999'){
            this.searchCustomer();
            this.setState({addrobj: Object.assign({},{addr:'',addr2:'',addrid:'',city:'',state:'',zipcode:'',lat:'',lon:'',defaultaddr:true,addrtag:'Home'}),addressDialog:false})
          }
          console.log(res)
        })
        .catch((err)=>{console.log(err)})
        .finally(()=>{})
        
        
        //saveDataRow(this.state.addpromoobj,this.state.data,this.setData,this.growl,this.state.idfld,'addorgpromo');
        
      //this.setState({addressDialog:false});
    }

    renderFooter = (inpstr) => {
   
      if(inpstr == 'addressDialog'){
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>{
                  this.setState({editDialog:false})
                  this.setState({[`${inpstr}`]: false});
                  
                  }} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>this.saveAddressRow()} className="p-button-primary" />
                
            </div>
        );
      }
  }

  setDelSot = (slot) => {
    for(let i=0; i<this.state.daySlot.length; i++){
      if(this.state.daySlot[i]['slotid'] == slot){
        let cartTotal = this.state.cartobj.ordtotal ? this.state.cartobj.ordtotal : 0;
        if(parseFloat(this.state.daySlot[i]['delminamt']) > parseFloat(cartTotal)){
          this.state.ordobj.delprice = parseFloat(this.state.daySlot[i]['delprice']);

        }else{
          this.state.ordobj.delprice = 0;
        }
        this.setState({ordobj:Object.assign(this.state.ordobj,{slotid:slot,slot:this.state.daySlot[i]['slot']})},()=>{this.calcNetPayble()});
        break;
      }
    }
    console.log(slot);
  }

  useWalletAmt = (e) => {
    console.log(e);
    if(e.checked) {
    if(parseFloat(this.state.availableBal) > parseFloat(this.state.ordobj.netpayble)){
      
      this.state.ordobj.walamt = this.state.ordobj.netpayble;
      this.state.availableBal = this.state.availableBal - this.state.ordobj.netpayble;
      this.state.ordobj.netpayble = 0;
      this.state.ordobj.paymethod = 'WALLET';

    }else {
      
      this.state.ordobj.walamt = this.state.availableBal;
      

      
    }
    }else{
      this.state.availableBal = parseFloat(this.state.availableBal) + parseFloat(this.state.ordobj.walamt);
      this.state.ordobj.walamt = 0;

    }
    this.setState({ordobj:this.state.ordobj,availableBal:this.state.availableBal})
    
    this.calcNetPayble();

  }

  applyPromo = () => {
    this.setState({showSpinner:true});
    callsvc({orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,custid:this.state.ordobj.custid,promocode:this.state.ordobj.promocode},'applypromo',false)
    .then((res)=>{
      if(res.code == '999'){
        this.growl.show({severity: 'warn', summary: 'Promo Code', detail: res.message,life:6000});
        this.state.ordobj.promodscnt = res.orderdisc;
        this.calcNetPayble();
        

      }else{
        this.growl.show({severity: 'warn', summary: 'Promo Code', detail: res.message,life:6000});

      }
      console.log(res)
    })
    .catch((err)=>{
      this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
      console.log(err)})
    .finally(()=>{
      this.setState({showSpinner:false}); 
    })

  }

  choosePayMethod = (val) => {
    if(val == 'COD'){
      this.setState({ordobj:Object.assign(this.state.ordobj,{paymethod:'COD',pmtid:'',pmtamt:0})});
    }else if(val == 'CASH-PAID'){
      this.setState({ordobj:Object.assign(this.state.ordobj,{paymethod:'CASH-PAID',pmtid:'CASH-PAID',pmtamt:this.state.ordobj.netpayble})});
    }
    console.log(val);
  }

  submitOrder = () => {
    if(!this.state.ordobj.delmethod){
      this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Please choose Delivery Method!',life:6000});
        return;
    }
    if(this.state.ordobj.delmethod == 'Home Delivery'){
      if(!this.state.ordobj.addrid){
        this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Address seems to be missing, Please check!',life:6000});
        return;
      }
      if(!this.state.ordobj.slotid){
        this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Delivery Slot needed for home delivery!',life:6000});
        return;
      }
    }
    if(!this.state.ordobj.paymethod && this.state.ordobj.netpayble > 0){
      this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Please choose the payment method!',life:6000});
        return;
    }
    this.state.ordobj.ordid = this.state.cartobj.ordid;
    this.state.ordobj.ordtotal = parseFloat(this.state.cartobj.ordtotal) + parseFloat(this.state.ordobj.delprice) - parseFloat(this.state.ordobj.promodscnt)
    this.state.ordobj.pmstatus =  this.state.ordobj.paymethod == 'COD' ? 'PAIDATDELIVERY': (this.state.ordobj.netpayble == 0 && this.state.ordobj.walamt > 0) ? 'PAIDFROMWALLET': 'PAYNOW';
    this.state.ordobj.source =  'APP';
    callsvc(this.state.ordobj,'ordersubmit',false) 
    .then((res)=>{
      if(res.code == '999'){
        this.growl.show({severity: 'warn', summary: 'Order Submit', detail: res.message,life:6000});
      }else{
        this.growl.show({severity: 'warn', summary: 'Error', detail: res.message,life:6000});
      }
      console.log(res);
    }).catch((err)=>{
      this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
    }).finally(()=>{

    })
    console.log(this.state.ordobj)
  }
  quanUpd = (it,op) => {
    
    let itemQuan = (op) ? parseInt(it.prdquan) + 1 : parseInt(it.prdquan) - 1;
    this.addItemToCart({prdid:it.prdid,prditid:it.prditid,custid:this.state.ordobj.custid,orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,ordquan:itemQuan},true)

  }

  addItemToCart = (it,cartInc=false) => {
    let inpobj={};
    if(cartInc)
    inpobj = it;
    else       
    inpobj = {prdid:it.parid,prditid:it.prditid,custid:this.state.ordobj.custid,orgid:this.state.userobj.orgid,empid:this.state.userobj.empid,ordquan:1}
    this.setState({showSpinner:true});
    callsvc(inpobj,'addtocartnew',false)
    .then((res)=>{
        if(res.code == '999'){
          this.growl.show({severity: 'warn', summary: 'Item added to Cart', detail: 'Item succesfully added to Cart!',life:6000});
          this.getCart()
        }else{
          this.growl.show({severity: 'warn', summary: 'Code Error', detail: res.message,life:6000});
        }
        
    }).catch((err)=>{
       this.growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
    }).finally(()=>{
      this.setState({showSpinner:false});
    })

    


  }

    render (){
        return ( <>
          <div className="p-grid" style={{margin:4}}>
            {this.state.showSpinner && <AppSpinner/>}
            <Growl ref={(el) => this.growl = el} sticky={true}/>
            
            <div className="p-col-12 p-md-3">
              <Panel toggleable collapsed={this.state.cartpanel} onToggle={(e) => this.setState({cartpanel: e.value})} header={this.state.cartobj.orditlist.length > 0 ? `Total Cart Items: ${this.state.cartobj.cartcount}`:'Cart'} style={{height:window.innerHeight-100, overflow: 'scroll'}}>
                
          
              {!this.state.ordobj.custid && <div style={{witdh:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                  Please find the customer first</div>}

                {this.state.ordobj.custid && this.state.cartobj.orditlist.length == 0 ? <div style={{witdh:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                  No Items In Cart</div>:
                  <div style={{display:'flex',flexDirection:'column'}}>
                    {this.state.cartobj.orditlist.map((it)=>(
                      <div className="p-grid" style={{borderBottom:'1px solid #c8c8c8'}} key={it.orditid}>
                        <div className="p-col-4" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>{<img src={it.prdimg} style={{height:60,width:60,marginLeft:12}}/>} </div>
                        <div className="p-col-8" style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'flex-start'}}>
                          <div style={{fontSize:12,fontWeight:'bold'}}>{it.name} - {it.size} </div>
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
              
            {this.state.cartobj.orditlist.length >0 && <Panel toggleable collapsed={this.state.orderpanel} onToggle={(e) => this.setState({orderpanel: e.value})} header="Order Details" > 
              <div className="p-grid">
              <div className="p-col-6">
              <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid" >
                <div className="p-col-6">Delivery Method:</div> <div className="p-col-6" style={{textAlign:'left'}}>{this.state.ordobj.delmethod}</div> 
                  
              </div>
             <div className="p-col-12" style={{padding:4,display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
               
                <Checkbox inputId="walbaal" value="" onChange={this.useWalletAmt} checked={this.state.ordobj.walamt > 0}></Checkbox>
               
               <div style={{marginLeft:12}}> 
                      {/* <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}}>{`Wallet Balance:Rs. ${this.state.walletBal}`}</div> */}
                      <div style={{fontSize:12,fontWeight:'bold'}}>{`Available Wallet Balance: Rs. ${this.state.availableBal}`}</div>
               </div>
                    
            </div>
            <div className="p-col-12" style={{padding:4,display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
               
            <InputText id={'promocode'} type="text" size={30} value={this.state.ordobj.promocode} 
                        onChange={(e)=>{
                            this.setState({ordobj: Object.assign(this.state.ordobj,{promocode:e.target.value})})
                        }} tooltip={'Promo Codes'} placeholder = 'Promo code'
                        tooltipOptions={{position: 'top'}}
                        />
            <Button label="Apply" onClick={()=>this.applyPromo()} style={{marginLeft:12,alignSelf:'center'}}/>
               
               
                    
            </div>
            <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}}>Payment Method</div>
            <div className="p-col-12" style={{padding:4,display:'flex',flexDirection:'row',  justifyContent:'flex-start'}}>
            
            
            <div className="p-field-radiobutton" key={'cod'}>
                  <RadioButton inputId={'cod'} value={'COD'} onChange={(e) => {this.choosePayMethod(e.value)}} checked={this.state.ordobj.paymethod == 'COD'} />
                  <label htmlFor={'cod'}>Cash On Delivery </label>
                  
            </div>
            <div style={{width:8}}></div>
            <div className="p-field-radiobutton" key={'cod-paid'}>
                  <RadioButton inputId={'cash-paid'} value={'CASH-PAID'} onChange={(e) => {this.choosePayMethod(e.value)}} checked={this.state.ordobj.paymethod == 'CASH-PAID'} />
                  <label htmlFor={'cash-paid'}>Cash Paid </label>
                  
            </div>
                    
            </div>
              
              

              
              
              
              </div>
              <div className="p-col-6">
              <div style={{backgroundColor:'#fff',padding:'8px'}}>
                <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid">
                  <div className="p-col-8">Cart Items:</div> <div className="p-col-4" style={{textAlign:'right'}}>{this.state.cartobj.cartcount}</div> 
                  </div>
                <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid" >
                <div className="p-col-8">SubTotal:</div> <div className="p-col-4" style={{textAlign:'right'}}>{this.state.cartobj.ordsubtotal}</div> 
                  
                  </div>
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid" >
                <div className="p-col-8">(-) Savings:</div> <div className="p-col-4" style={{textAlign:'right'}}>{this.state.cartobj.orddscnt}</div> 
                  
                  </div>
                  {this.state.ordobj.promocode && <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid" >
                <div className="p-col-8">(-) Promo Savings:</div> <div className="p-col-4" style={{textAlign:'right'}}>{this.state.ordobj.promodscnt}</div> 
                  
                  </div> }
                  {this.state.ordobj.walamt > 0 && <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid" >
                <div className="p-col-8">(-) Wallet Pmt:</div> <div className="p-col-4" style={{textAlign:'right'}}>{this.state.ordobj.walamt}</div> 
                  
                  </div> }
                  {this.state.ordobj.delmethod == 'Home Delivery' && this.state.ordobj.delprice > 0 && <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid" >
                <div className="p-col-8">(+) Delivery Price:</div> <div className="p-col-4" style={{textAlign:'right'}}>{this.state.ordobj.delprice}</div> 
                  
                  </div> }
                  <div style={{fontSize:12,fontWeight:'bold',marginBottom:4}} className="p-grid" >
                <div className="p-col-8">Net Payble:</div> <div className="p-col-4" style={{textAlign:'right'}}>{this.state.ordobj.netpayble}</div> 
                  
                  </div>
                  {(this.state.ordobj.custid && this.state.cartobj.ordtotal >0) &&<div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
                    <Button label="Submit Order" onClick = {()=>{this.submitOrder()}} />
                  </div>}
              
                </div>
                </div>
                </div>
              </Panel>}
                <div  style={{display:'flex',alignItems:'center',justifyContent:'space-between',backgroundColor:'#f4f4f4',border:'1px solid #c8c8c8',color:'##333333'}}>
                  <div className="p-m-2">Search for Products</div>
                  <div style={{position:'relative',padding:'4px'}}>
                        <InputText size={40} style={{ width:'100%'}} value={this.state.searchInp}  type="text"
                        onChange={(e) => {this.doProductSearch(e.target.value)}}

                        
                        
                        placeholder="Search for Products" />
                        
                        {this.state.searchInp.length > 0 && <i className="pi pi-times"  style={{position:'absolute',right:12,top:'40%',color:'#a9a9a9',fontSize:12}} onClick={()=>{this.doProductSearch('')}}/>}
                </div>

                </div>
                
                {!this.state.ordobj.custid ? <div style={{height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}> Search or Add Customer First</div> :
                <div>
                {this.state.searchProdData.map((it)=>
                  <div key={it.prditid} style={{display:'flex',position:'relative',flexDirection:'row',margin:1,border:'1px solid #c8c8c8',alignItems:'center'}}>
                    
                      <img src={it.image} style={{height:60,width:60,marginLeft:12}} />

                    
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start',marginLeft:12}}>
                    <div>{it.name} - {it.size}</div>
                {it.onpromo ? <div> Rs {it.promoprice} <span style={{textDecoration: 'line-through',opacity:0.6}}>Rs {it.price}</span> </div> : <div>Rs {it.price}</div>}
                    </div>
                    <div> 
                      <Button label="Add To Cart" style={{position:'absolute',right:10,top:'40%'}} onClick={(e)=>{this.addItemToCart(it)}}/>
                    </div>
                    
                  </div>
                )}</div>}
              
            </div>
            <div className="p-col-12 p-md-3"> 
            
              <Panel toggleable collapsed={this.state.customerpanel} onToggle={(e) => this.setState({customerpanel: e.value})} header="Customer Details" style={{height:window.innerHeight-100, overflow: 'scroll'}}> 
              
              
              
              <InputText size={40} style={{width:'100%',marginBottom:12}} placeholder="Mobile Number" value={this.state.ordobj.accid} onChange={(e) => {this.setSearchInp(e)}} disabled={this.state.cartobj.orditlist.length > 0}/>
              <InputText size={40} style={{width:'100%',marginBottom:12}} placeholder="Customer Name" value={this.state.ordobj.fstname} onChange={(e) => this.setState(Object.assign(this.state.ordobj,{fstname: e.target.value}))}  disabled={this.state.cartobj.orditlist.length > 0}/>
              {(this.state.ordobj.accid.length == 10 && this.state.ordobj.custid.length < 2) && <Button label="Add  Customer" style={{marginBottom:12}} onClick={(e)=>{this.addCustomer()}}/>}
              {this.state.ordobj.custid.length > 2 && <Panel header="Delivery Details">

            
            {this.state.delMethods.map((it)=>(
                <div className="p-field-radiobutton" key={it.name}>
                  <RadioButton inputId={it.name} value={it.value} onChange={(e) => {this.chooseDelMethod(e.value)}} checked={this.state.ordobj.delmethod == it.name} />
                  <label htmlFor={it.name}>{it.name} </label>
                  <br/>
                </div>

              ))}




            </Panel> }
            {this.state.ordobj.delmethod == 'Home Delivery' && <Panel header="Address Details">
            {this.state.addrlist.map((it)=>(
                <div className="p-field-radiobutton" key={it.addrid}>
                  <RadioButton inputId={it.addrid} value={it.addrid} onChange={(e) => {this.setAddr(e.value)}} checked={this.state.ordobj.addrid == it.addrid} />
                  <label htmlFor={it.addrid}>{`${it.addr1},  ${it.addr2}, ${it.city}, ${it.state}, ${it.zipcode}`} </label>
                  <br/>
                </div>

              ))}
              <Button label="Add Address" onClick={()=> this.addAddressDialog()} />
            </Panel>}
            {(this.state.ordobj.delmethod == 'Home Delivery' && this.state.ordobj.addrid) && <Panel header="Delivery Slots">
            {this.state.daySlot.map((it)=>(
                <div className="p-field-radiobutton" key={it.addrid}>
                  <RadioButton inputId={it.slotid} value={it.slotid} onChange={(e) => {this.setDelSot(e.value)}} checked={this.state.ordobj.slotid == it.slotid} />
                  <label htmlFor={it.slotid} style={{fontSize:12,fontWeight:'700'}}>{`${it.slot} - ${it.deltext}`} </label>
                  <br/>
                </div>

              ))}
              
            </Panel>}
            </Panel>
            
 
            </div>

            
        <Dialog footer={this.renderFooter('addressDialog')} header={'Add Address'}
        visible={this.state.addressDialog} style={{width:'100%',height:'100%',verticalAlign:'middle',padding:'20px'}}  
        blockScroll onHide = {()=>{this.setState({addressDialog:false})}} position="center">
            <div className="p-grid" style={{width:'100%',padding:'40px'}}>
              
            <div className="p-col-12 p-md-6 p-lg-4">
                    
                    <span className="p-float-label">
                        <InputText id={'addr1'} type="text" style={{width:'300px'}} value={this.state.addrobj.addr} 
                        onChange={(e)=>{
                            this.setState({addrobj: Object.assign(this.state.addrobj,{addr:e.target.value})})
                        }} tooltip={'Flat/House Number'} 
                        tooltipOptions={{position: 'top'}}
                        />
                        <label htmlFor={'addr1'}>Address1</label>
                    </span> 
        
          </div>
             <div className="p-col-12 p-md-6 p-lg-4"> 
                <span className="p-float-label">
                        <Dropdown id={'locdata'} appendTo={document.body}  value={this.state.addrobj.loc}  options={this.state.locdata} size={40} style={{minWidth:'300px'}}
                                        ariaLabel={'Promo Type'} onChange={(e) => {
                                            for(let i=0; i<this.state.loclist.length;i++){
                                              if(this.state.loclist[i]['loc'] == e.target.value){
                                                this.setState({addrobj: Object.assign(this.state.addrobj,
                                                  {loc:e.target.value,locid:this.state.loclist[i]['locid'],city:this.state.loclist[i]['city'],
                                                  state:this.state.loclist[i]['state'],zipcode:this.state.loclist[i]['zipcode'],addr2:this.state.loclist[i]['locname'],
                                                  lat:this.state.loclist[i]['lat'],lon:this.state.loclist[i]['lan']})});
                                                  console.log(this.state.addrobj);
                                                  break;

                                              }
                                            }
                                            
                                            
                                        }} 
                                        optionLabel="" tooltip={'Please choose Location'} tooltipOptions={{position: 'top'}} placeholder={'Location'} 
                                        />
                        {this.state.addrobj.loc && <label htmlFor={'locdata'}>{'Location'}</label>}
                </span>
                                        
                </div>
                <div className="p-col-12 p-md-6 p-lg-4">
                    
                    <span className="p-float-label">
                        <InputText id={'addr2'} type="text" style={{width:'300px'}} value={this.state.addrobj.addr2} 
                        onChange={(e)=>{
                            this.setState({addrobj: Object.assign(this.state.addrobj,{addr2:e.target.value})})
                        }} tooltip={'Address Line 2'} 
                        tooltipOptions={{position: 'top'}}
                        />
                        <label htmlFor={'addr2'}>Address2</label>
                    </span> 
        
                </div>

                
                <div className="p-col-12 p-md-6 p-lg-4">
                    
                    <span className="p-float-label">
                        <InputText id={'city'} type="text" style={{width:'300px'}} value={this.state.addrobj.city} disabled={true}
                        onChange={(e)=>{
                            this.setState({addrobj: Object.assign(this.state.addrobj,{city:e.target.value})})
                        }} tooltip={'City'} 
                        tooltipOptions={{position: 'top'}}
                        />
                        <label htmlFor={'city'}>City</label>
                    </span> 
        
                </div>
                
                
                <div className="p-col-12 p-md-6 p-lg-4">
                    
                    <span className="p-float-label">
                        <InputText id={'state'} type="text" style={{width:'300px'}} value={this.state.addrobj.state} disabled={true}
                        onChange={(e)=>{
                            this.setState({addrobj: Object.assign(this.state.addrobj,{state:e.target.value})})
                        }} tooltip={'State'} 
                        tooltipOptions={{position: 'top'}}
                        />
                        <label htmlFor={'state'}>State</label>
                    </span> 
        
                </div>
                
                <div className="p-col-12 p-md-6 p-lg-4">
                    
                    <span className="p-float-label">
                        <InputText id={'zipcode'} type="text" style={{width:'300px'}} value={this.state.addrobj.zipcode}  disabled={true}
                        onChange={(e)=>{
                            this.setState({addrobj: Object.assign(this.state.addrobj,{zipcode:e.target.value})})
                        }} tooltip={'Pin Code'} 
                        tooltipOptions={{position: 'top'}}
                        />
                        <label htmlFor={'zipcode'}>Pin Code</label>
                    </span> 
        
                </div>

            </div>

            </Dialog>

          </div> </>
        )
            
    }

    
}

export default Createorder;