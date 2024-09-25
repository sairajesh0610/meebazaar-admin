import React from 'react';


import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';

import AppSpinner from '../components/AppSpinner';
import userProfile from '../utils/Userprofile';
import callsvc from "../utils/Services";
import { appTheme, ADMIN_ERROR } from '../utils/Constants';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from '../components/PrintReceipt';
import BarcodeReader from 'react-barcode-reader'



const tableArr = [
    { quantity: "1.00", desc: "ARDUINO UNO R3", price: "$25.00" },
    { quantity: "2.00", desc: "JAVASCRIPT BOOK", price: "$10.00" },
    { quantity: "3.00", desc: "STICKER PACK", price: "$15.00" },
    { quantity: "", desc: "TOTAL", price: "$50.00" }
  ]

  

class Employees extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userobj: userProfile.getUserObj(), prdData: [], searchProdData: [], cartpanel: false, orderpanel: false, customerpanel: false,
            searchInp: '', addrlist: [], delMethods: [], loclist: [], locdata: [],
            ordobj: {
                custid: '', orgid: '', deladdr: '', ordid: '', date: '', sttime: '', endtime: '', slot: '', slotid: '', loc: '', comments: '',
                addrid: '', addr1: '', addr2: '', city: '', state: '', zipcode: '', paymethod: '', comments: '', promocode: '',
                ordtotal: 0, delmethod: 'Store Pickup', promodscnt: 0, delprice: 0.00, pmtid: '', pmstatus: '', day: '', pmtamt: 0,
                walamt: 0, source: 'APP', locid: '', lat: 0.00, lon: 0.00, fstname: '', accid: '', addrdiv: '', fulladdr: '', netpayble: 0,status:''
            },
            showdiv: { searchdiv: true, crtcust: false, crtorder: false, chooseaddr: false, crtaddr: false },
            daySlot: [], walletBal: 0, availableBal: 0, addressDialog: false,
            cartobj: { orditlist: [] },
            addrobj: { addr: '', addr2: '', addrid: '', city: '', state: '', zipcode: '', lat: '', lon: '', defaultaddr: true, addrtag: 'Home', loc: '' },
            placeOrderDialog: false,
            paymenttype: ['CASH', 'CARD', 'UPI', 'G PAY', 'PHONEPE'],
            amountpaid: '', statusCheckbox:true,
            remainingamount:'',barcodeInp:'', printorder:false
        }
        this.handleScan = this.handleScan.bind(this)
    }

    componentDidMount() {
        console.log(this.props);
        this.getPrdData();
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
    setSearchInp = (e) => {
        if (e.target.value.length < 11) {
            let str = e.target.value
            let pattern = /^\d+$/;
            let isNum = pattern.test(str.charAt(str.length - 1));
            if (isNum)
                this.state.ordobj.accid = e.target.value
            this.setState({ ordobj: this.state.ordobj });
            if (this.state.ordobj.accid.length == 10) {
                this.searchCustomer();
            }
        }
    }

    searchCustomer = () => {
        this.setState({ showSpinner: true });
        let inpobj = { orgid: this.state.userobj.orgid, empid: this.state.userobj.empid, accid: this.state.ordobj.accid };
        callsvc(inpobj, 'searchbyaccid', false)
            .then((res) => {
                if (res.code == '999') {
                    this.state.ordobj.custid = res.data.custid;
                    this.state.ordobj.orgid = res.data.orgid;
                    this.state.ordobj.fstname = res.data.fstname;
                    this.state.ordobj.accid = res.data.accid;
                    // this.addDelMethods();
                    this.getCart();
                    //this.getWalletBalance();

                    if (res.data.ordexist) {
                        this.state.ordobj.ordid = res.data.ordid;
                    }
                    if (res.data.addrexist) {
                        if (res.data.addrlist.length == 1) {
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
                        this.setState({ addrlist: res.data.addrlist })



                    } else {


                    }




                } else if (res.code == '9991') {
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
                    this.state.addrlist = [];


                }

            })
            .catch((err => {
                console.log(err)
            }))
            .finally(() => { this.setState({ showSpinner: false }); })
    }

    addCustomer = () => {
        this.setState({ showSpinner: true })
        let inpobj = { orgid: this.state.userobj.orgid, empid: this.state.userobj.empid, accid: this.state.ordobj.accid, fstname: this.state.ordobj.fstname };
        callsvc(inpobj, 'addcustomer', false)
            .then((res) => {
                if (res.code == '999') {
                    this.state.ordobj.custid = res.custid;

                } else {
                    this.growl.show({ severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR, life: 6000 });

                }

            }).catch((err) => {
                this.growl.show({ severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR, life: 6000 });

            }).finally(() => {
                this.setState({ showSpinner: false })
            })


    }

    doBarcodeSearch = (val) => {
            
        this.setState({barcodeInp:val});

        if(val.length >= 10) {
            let searchProdData = this.state.prdData.filter((it) => {
                return (it.barcodes.includes(val));
            })
            //console.log(searchProdData);
            if(searchProdData.length > 0){
                
                let it = searchProdData[0];
                let existCart = this.state.cartobj.orditlist.filter ((item)=> (item.prditid == it.prditid))
                let itemQuan = 1;
                if(existCart.length > 0){
                    itemQuan = existCart[0].prdquan + 1
                }
                
                this.addItemToCart({ prdid: it.parid, prditid: it.prditid, custid: this.state.ordobj.custid, orgid: this.state.userobj.orgid, empid: this.state.userobj.empid, ordquan: itemQuan }, true)

            }

        }
        
        
        
  }

    addItemToCart = (it, cartInc = false) => {
        let inpobj = {};
        if (cartInc)
            inpobj = it;
        else
            inpobj = { prdid: it.parid, prditid: it.prditid, custid: this.state.ordobj.custid, orgid: this.state.userobj.orgid, empid: this.state.userobj.empid, ordquan: 1 }
        this.setState({ showSpinner: true });
        callsvc(inpobj, 'addtocartnew', false)
            .then((res) => {
                if (res.code == '999') {
                    // this.growl.show({severity: 'warn', summary: 'Item added to Cart', detail: 'Item succesfully added to Cart!',life:6000});
                    this.getCart()
                } else {
                    this.growl.show({ severity: 'warn', summary: 'Code Error', detail: res.message, life: 6000 });
                }

            }).catch((err) => {
                this.growl.show({ severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR, life: 6000 });
            }).finally(() => {
                this.setState({ showSpinner: false });
            })
    }

    getCart = () => {

        callsvc({ custid: this.state.ordobj.custid, orgid: this.state.ordobj.orgid, langpref: 'English' }, 'getnewcart', false)
            .then(res => {
                this.setState({barcodeInp:''});
                if (res.code == '999') {
                    for (let i = 0; i < res.orditlist.length; i++) {
                        res.orditlist[i]['available'] = (res.orditlist[i]['prdquan'] == 0) ? false : true;
                        res.orditlist[i]['showdscnt'] = (parseFloat(res.orditlist[i]['orditdscnt']) > 0) ? true : false
                        res.orditlist[i]['itprice'] = parseFloat(res.orditlist[i]['ordittot']) + parseFloat(res.orditlist[i]['orditdscnt']);
                        res.orditlist[i]['itdscnttxt'] = 'Rs ' + parseFloat(res.orditlist[i]['orditdscnt']) + ' ' + 'Saved now';
                        res.orditlist[i]['prdquan'] = parseInt(res.orditlist[i]['prdquan']);
                    }

                    this.setState({ cartobj: res }, () => { this.calcNetPayble() });

                } else if (res.code === '9991') {
                    this.setState({ cartobj: res })
                }

            })
            .catch(error => {
                console.log(error);

            })
            .finally(() => {

            });
    };

    calcNetPayble = () => {
        // ordertotal - (walbal + delcharges + promodiscnt)
        let orderTotal = parseFloat(this.state.cartobj.ordtotal) + parseFloat(this.state.ordobj.delprice) - parseFloat(this.state.ordobj.promodscnt);

        let netpayble = parseFloat(this.state.cartobj.ordtotal) + parseFloat(this.state.ordobj.delprice) - (parseFloat(this.state.ordobj.walamt) + parseFloat(this.state.ordobj.promodscnt))
        if (this.state.ordobj.paymethod == 'CASH-PAID') {
            this.state.ordobj.pmtid = 'CASH-PAID';
            this.state.ordobj.pmtamt = netpayble
        } else {
            this.state.ordobj.pmtid = '';
            this.state.ordobj.pmtamt = 0
        }
        //this.setState({ordobj:Object.assign(this.state.ordobj,{paymethod:'CASH-PAID',pmtid:'CASH-PAID',pmtamt:this.state.ordobj.netpayble})});
        this.setState({ ordobj: Object.assign(this.state.ordobj, { netpayble: netpayble }) });


    }

    quanUpd = (it, op) => {

        let itemQuan = (op) ? parseInt(it.prdquan) + 1 : parseInt(it.prdquan) - 1;
        this.addItemToCart({ prdid: it.prdid, prditid: it.prditid, custid: this.state.ordobj.custid, orgid: this.state.userobj.orgid, empid: this.state.userobj.empid, ordquan: itemQuan }, true)

    }

    showAddButtons = (rowData) => {
        return (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button icon="pi pi-minus-circle" onClick={() => { this.quanUpd(rowData, false) }} />
                {/* <div style={{width:'40px',backgroundColor:appTheme.primaryColor,borderRadius:'10%',display:'flex',justifyContent:'center',alignItems:'center',fontSize:'28',color:'#fff'}} onClick={()=>{this.quanUpd(it,false)}}>-</div> */}
                <div style={{ width: '40px', borderRadius: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24', color: '#333' }}>{rowData.prdquan}</div>
                <Button icon="pi pi-plus-circle" onClick={() => { this.quanUpd(rowData, true) }} />
                {/* <div style={{width:'40px',backgroundColor:appTheme.primaryColor,borderRadius:'10%',display:'flex',justifyContent:'center',alignItems:'center',fontSize:'28',color:'#fff'}} onClick={()=>{this.quanUpd(it,true)}}>+</div> */}

            </div>
        )
    }

    submitOrder = () => {
      
         console.log(this.state.ordobj);
        if (['CARD', 'UPI', 'G PAY', 'PHONEPE'].includes(this.state.ordobj.paymethod)) {
            if( this.state.ordobj.pmtid.length > 3){
            this.state.ordobj.pmtamt = this.state.cartobj.netpayble;
            } else{
            this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Please add transaction id !',life:6000});
            return;
            }
        }

        if(this.state.ordobj.paymethod == 'CASH'){
            if(this.state.amountpaid){
                this.state.ordobj.pmtamt = this.state.cartobj.netpayble; 
            }else {
            this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Please add amount paid !',life:6000});
            return;
            }
        }
        
        if(!this.state.ordobj.paymethod && this.state.ordobj.netpayble > 0){
          this.growl.show({severity: 'warn', summary: 'Input Error', detail: 'Please choose the payment method!',life:6000});
            return;
        }
        this.state.ordobj.ordid = this.state.cartobj.ordid;
        this.state.ordobj.ordtotal = parseFloat(this.state.cartobj.ordtotal) + parseFloat(this.state.ordobj.delprice) - parseFloat(this.state.ordobj.promodscnt)
        this.state.ordobj.pmstatus = 'PAYNOW';
        this.state.ordobj.source =  'WEB';
        this.state.ordobj.status = this.state.statusCheckbox ? 'DELIVERED' : 'SUBMITTED';
        callsvc(this.state.ordobj,'ordersubmit',false) 
        .then((res)=>{
          if(res.code == '999'){
            this.growl.show({severity: 'warn', summary: 'Order Submit', detail: res.message,life:6000});
            this.setState({placeOrderDialog:false,printorder:true});
            this.printElem();
            
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

     

      handleReceiptPrint = ()=>{
        window.print();
      }


       printElem = () => {
             let currDt = new Date().toLocaleString();
            let htmlStr = `
            <div style="width:250px; max-width:250px; display:flex; flex-direction:column; align-items:center; padding:4px">
                <div style="text-align:center;font-size:20px;">Mee Bazaar Online <div>
                <div style="text-align:center;font-size:16px;"> Online Super market</div>
                <div style="text-align:center;font-size:14px;"><small>Motupalli vari Street</small></div> 
                <div style="text-align:center;font-size:14px;">Bhimavaram. West Godavari</div>
                <div style="text-align:center;font-size:14px;"> GST NO :37AATFV4921A1Z1 </div>
                <hr/>
                <div style="text-align:center;font-size:14px;"> Tax Invoice</div>
                <div style="text-align:center;font-size:12px;">Bill No: ${this.state.cartobj.ordid}</div>
                <div style="text-align:center;font-size:12px; margin-bottom:8px">Date: ${currDt}</div>
                <hr/>
                
                
                
                <table style="width:100%;justify-content:center;">
                    <tr>
                        <th style="font-size:12px;maxwidth:40%;" >Item</th>
                        <th style="font-size:12px;maxwidth:15%;" >Qty</th>
                        <th style="font-size:12px;maxwidth:15%;" >Mrp</th>
                        <th style="font-size:12px;maxwidth:15%;" >Rate</th>
                        <th style="font-size:12px;maxwidth:15%;" >Amount</th>
                    </tr>`
                   
                    for(let i=0;i<this.state.cartobj.orditlist.length;i++){
                        let it = this.state.cartobj.orditlist[i];
                        htmlStr += `
                        <tr>
                            <td style="font-size:12px;maxwidth:40%;">${it.name}-${it.size}</td>
                            <td style="font-size:12px;maxwidth:15%;">${it.prdquan}</td>
                            <td style="font-size:12px;maxwidth:15%;">${it.actprice}</td>
                            <td style="font-size:12px;maxwidth:15%;">${it.actpromoprice}</td>
                            <td style="font-size:12px;maxwidth:15%;">${it.ordittot}</td>
                        </tr>

                        `
                    }

                    htmlStr += `

                    </table>
                <hr/>
                <div style="display:flex; justify-content:space-between">
                    <div style="text-align:center;font-size:14px;">Mrp Total</div>
                    <div style="text-align:center;font-size:14px;">${this.state.cartobj.ordsubtotal}</div>
                </div>
                
                <div style="display:flex; justify-content:space-between">
                    <div style="text-align:center;font-size:14px;">Discount</div>
                    <div style="text-align:center;font-size:14px;">${this.state.cartobj.orddscnt}</div>
                </div>
                
                <div style="display:flex; justify-content:space-between">
                    <div style="text-align:center;font-size:14px;">Total</div>
                    <div style="text-align:center;font-size:14px;">${this.state.cartobj.ordtotal}</div>
                </div>
                    <hr/>
                    <div style="text-align:center;font-size:18px;">NET AMOUNT ₹ ${this.state.cartobj.ordtotal} <div> 
                    <hr/>
                    <div style="text-align:center;font-size:14px;"> YOU HAVE SAVED RUPEES ${this.state.cartobj.orddscnt}</div>
                    <hr/>`
                    if(this.state.ordobj.paymethod == 'CASH'){
                    htmlStr += `
                    <div style="display:flex; justify-content:space-between">
                        <div style="text-align:center;font-size:12px;">TENDER AMT: ${this.state.amountpaid}</div>
                        <div style="text-align:center;font-size:12px;">CHANGE: ${this.state.remainingamount}</div>
                    </div> `
                    } else {
                        htmlStr += `
                        <div style="display:flex; justify-content:space-between">
                            <div style="text-align:center;font-size:12px;">Payment method:${this.state.ordobj.paymethod} </div>
                            <div style="text-align:center;font-size:12px;">Transaction last4: ${this.state.ordobj.pmtid}</div>
                        </div> `

                    }
                    
                    htmlStr += `
                    <hr/>
                 <div style= "text-align: center;align-content: center; font-size:12px;margin-top:8px">Thanks for your purchase!</div>
                <div style= "text-align: center;align-content: center; font-size:12px"> <small>Download Meebazaar app for homedelivery </small> </div>
                <div style= "text-align: center;align-content: center; font-size:12px"> <small>www.meebazaar.com </small> </div>
            
            </div>
       

            `;

            let htmlHdr = `
            <html>
            <head>
            <title>' + document.title  + '</title>
            
            
            </head> <body style="font-size: 12px; font-family: 'Times New Roman';">
            `
            var mywindow = window.open('', 'PRINT', 'height=400,width=600');

            mywindow.document.write(htmlHdr);
            mywindow.document.write(htmlStr);
            mywindow.document.write('</body></html>');
            
            mywindow.onload=function(){ // necessary if the div contain images
               console.log('loaded');
                mywindow.focus(); // necessary for IE >= 10
                mywindow.print();
                mywindow.close();
            };
        
            return true;
        }

        handleScan(data) {
            console.log(data);
        }

    
        doProductSearch = (val) => {
            val = val.toLowerCase();
            this.setState({ searchInp: val })
            if (val.length > 2) {
                this.state.searchProdData = this.state.prdData.filter((it) => {
                    return (
                        it.name.toLowerCase().indexOf(val) > -1
    
    
                    );
                })
            } else {
                this.state.searchProdData = []
            }
            this.setState({ searchProdData: this.state.searchProdData })
    
    
        }
    


    render() {
        const products = []

       


        return (

            

            
            
            <div className="p-grid" style={{ margin: 4, height: window.innerHeight - 130 }}>
                {this.state.showSpinner && <AppSpinner />}
                <Growl ref={(el) => this.growl = el} sticky={true} />
                <div className="p-col-12 p-md-6" style={{ border: '1px solid #c8c8c8', }}>
                    <div>
                        <div style={{display:'flex',flexDirection:'row',backgroundColor: '#f4f4f4', border: '1px solid #c8c8c8',
                                color: '##333333', padding: 4}}>
                            <div className="p-m-2">Customer Details </div>

                            <div style={{ position: 'relative', padding: '4px' }}>
                            <InputText size={60} style={{ width: '100%' }} value={this.state.barcodeInp} type="text"
                                onChange={(e) => { this.doBarcodeSearch(e.target.value) }}
                                placeholder="Barcode Scanner" />
                            {this.state.searchInp.length > 0 && <i className="pi pi-times" style={{ position: 'absolute', right: 12, top: '40%', color: '#a9a9a9', fontSize: 12 }} onClick={() => { this.doProductSearch('') }} />}
                        </div>
                        

                        </div>
                        
                        <div className="p-grid" style={{marginTop:8}}>
                            <div className="p-col-12 p-md-4">
                                <InputText size={40} style={{ width: '100%', marginBottom: 12 }} placeholder="Mobile Number" value={this.state.ordobj.accid} onChange={(e) => { this.setSearchInp(e) }} disabled={this.state.cartobj.orditlist.length > 0} />
                            </div>
                            <div className="p-col-12 p-md-4">
                                <InputText size={40} style={{ width: '100%', marginBottom: 12 }} placeholder="Customer Name" value={this.state.ordobj.fstname} onChange={(e) => this.setState(Object.assign(this.state.ordobj, { fstname: e.target.value }))} disabled={this.state.cartobj.orditlist.length > 0} />
                            </div>
                            
                            <div className="p-col-12 p-md-4">
                                {(this.state.ordobj.accid.length === 10 && this.state.ordobj.custid.length < 2) && <Button label="Add  Customer" style={{ marginBottom: 12 }} onClick={(e) => { this.addCustomer() }} />}
                                {(this.state.cartobj && this.state.cartobj.cartcount > 0) && <Button label="Place Order" style={{ marginBottom: 12 }} onClick={() => this.setState({ placeOrderDialog: true })} />}
                            </div>
                        </div>
                    </div>


                    <DataTable value={this.state.cartobj.orditlist} style={{ height: window.innerHeight - 250, overflow: 'scroll' }}>
                        <Column field="name" header="Product"></Column>
                        <Column field="size" header="Size"></Column>
                        <Column field="actprice" header="Orginal Price"></Column>
                        <Column field="actpromoprice" header="Discount Price"></Column>
                        <Column field="ordittot" header="Total"></Column>
                        <Column field="" header={`Items ( ${this.state.cartobj.cartcount || 0} )`} body={this.showAddButtons}></Column>
                    </DataTable>



                </div>
                <div className="p-col-12 p-md-6">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f4f4f4', border: '1px solid #c8c8c8', color: '##333333' }}>
                        <div className="p-m-2">Search for Products</div>
                        <div style={{ position: 'relative', padding: '4px' }}>
                            <InputText size={60} style={{ width: '100%' }} value={this.state.searchInp} type="text"
                                onChange={(e) => { this.doProductSearch(e.target.value) }}
                                placeholder="Search for Products" />
                            {this.state.searchInp.length > 0 && <i className="pi pi-times" style={{ position: 'absolute', right: 12, top: '40%', color: '#a9a9a9', fontSize: 12 }} onClick={() => { this.doProductSearch('') }} />}
                        </div>

                    </div>
                    {!this.state.ordobj.custid ? <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Add Customer and Search for Products</div> :
                        <div style={{ height: window.innerHeight - 140, overflow: 'scroll' }}>
                            {this.state.searchProdData.map((it) =>
                                <div key={it.prditid} style={{ display: 'flex', position: 'relative', flexDirection: 'row', margin: 1, border: '1px solid #c8c8c8', alignItems: 'center' }}>

                                    <img src={it.image} style={{ height: 60, width: 60, marginLeft: 12 }} />


                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 12 }}>
                                        <div>{it.name}-{it.size}</div>
                                        {it.onpromo ? <div> Rs {it.promoprice} <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Rs {it.price}</span> </div> : <div>Rs {it.price}</div>}
                                    </div>
                                    <div>
                                        <Button label="Add Product" style={{ position: 'absolute', right: 10, top: '40%' }} onClick={(e) => { this.addItemToCart(it) }} />
                                    </div>

                                </div>
                            )}</div>}
                </div>
                <Dialog visible={this.state.placeOrderDialog} style={{ width: '40%', verticalAlign: 'middle' }} blockScroll onHide={() => this.setState({ placeOrderDialog: false })} position="center">

                    <div style={{ backgroundColor: '#fff', padding: '8px' }}>
                        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }} className="p-grid" >
                            <div className="p-col-8">SubTotal:</div> <div className="p-col-4" style={{ textAlign: 'right' }}>{this.state.cartobj.ordsubtotal}</div>

                        </div>
                        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }} className="p-grid" >
                            <div className="p-col-8">(-) Savings:</div> <div className="p-col-4" style={{ textAlign: 'right' }}>{this.state.cartobj.orddscnt}</div>

                        </div>

                        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }} className="p-grid" >
                            <div className="p-col-8">Net Payble:</div> <div className="p-col-4" style={{ textAlign: 'right' }}>{this.state.ordobj.netpayble}</div>

                        </div>
                        <div>
                            <Checkbox inputId={'check'} value={this.state.statusCheckbox} onChange = {(e) => {this.setState({statusCheckbox:!this.state.statusCheckbox})}} checked={this.state.statusCheckbox} 
                            tooltip={"Order Delivered"} tooltipOptions={{position: 'top'}} disabled={!this.state.ordobj.accid}></Checkbox>
                            <label style={{marginLeft:'8px'}} htmlFor={'check'} className="check-label p-checkbox-label">Delivered?</label>
                            </div>
                        <br/>
                        <Dropdown id={'type'} appendTo={document.body} value={this.state.ordobj.paymethod} options={this.state.paymenttype} size={40} style={{ width: '300px' }}
                            ariaLabel={'Payment Type'} onChange={(e) => {
                                this.setState({ ordobj: Object.assign(this.state.ordobj, { paymethod: e.target.value }) })

                            }}
                            optionLabel="" tooltip={'Payment Type'} tooltipOptions={{ position: 'top' }} placeholder={'Payment Type'}
                        />
                        
                        {this.state.ordobj.paymethod === 'CASH' &&
                            <div style={{ marginTop: '8px' }}>
                                <InputText id={'amountpaid'} type="text" style={{ width: '300px' }} value={this.state.amountpaid}
                                    placeholder={'Amount paid'}
                                    onChange={(e) => {
                                        this.setState({ amountpaid: e.target.value },()=>{
                                            this.setState({remainingamount:parseFloat(this.state.amountpaid)- parseFloat(this.state.ordobj.netpayble)})
                                        })
                                    }}
                                />
                                {this.state.amountpaid && this.state.remainingamount !== 'NaN' &&
                                <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4, marginTop: 8 }} className="p-grid" >
                                    <div className="p-col-8">Remaining Amount:</div> <div className="p-col-4" style={{ textAlign: 'right' }}>{this.state.remainingamount}</div>
                                </div> }

                            </div> }
                            {this.state.ordobj.paymethod && this.state.ordobj.paymethod !== 'CASH' &&
                                <div style={{ marginTop: '8px' }}>
                                <InputText type="text" style={{ width: '300px' }} value={this.state.ordobj.pmtid}
                                    placeholder={'Last 4-digits Trasaction id'}
                                    onChange={(e) => {
                                        this.setState({ ordobj: Object.assign(this.state.ordobj, { pmtid: e.target.value }) })
        
                                    }}
                                />
                            </div>}
                        {(this.state.ordobj.pmtid || this.state.remainingamount || (this.state.ordobj.netpayble - this.state.amountpaid == 0)) && <div >
                            <Button label="Submit Order" style={{ width: '100%',marginTop:10 }} onClick={() => { this.submitOrder() 
                            }} />
                            <ReactToPrint trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return <a href="#">Print this out!</a>;
          }}
          content={() => this.componentRef}
        />
                        </div>}

                    </div>
                </Dialog>
                <ComponentToPrint ref={el => (this.componentRef = el)} />

            </div>
            
        )
    }


}

export default Employees;