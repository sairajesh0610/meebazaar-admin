import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import {TabView,TabPanel} from 'primereact/tabview';
import TableData from '../components/TableData'
import {getObjData,setScrOptions,getObjFlds,uploadImg,saveDataRow,checkReq,delDataRow} from '../utils/ServiceCalls';
import callsvc from '../utils/Services';
import { Dialog } from 'primereact/dialog';
import {Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
import AddDailog from "../components/AddDailog";
import { Column } from 'primereact/column';

class Roleoptions extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            objtype:'ORG_ROLE_FLDS', roleList :[],
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }
    
    componentDidMount(){
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody)
        this.getData();
        console.log(this.props.roleid);
    }

    componentDidUpdate(prevProps){
        if(this.props.roleid != prevProps.roleid){
            if(this.props.roleid)
            this.getData();
            else
                this.setState({data:[],selectedRow:{}})
        }
        //console.log(this.props.forgid)
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
    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            this.setState({
                [`${key}`]: inpobj[key]
            });
        })
    }
    rowsSelect = (value) =>{
        this.setState({ selectedRow: value })
    }
    gFilterVal = (value) => {
        this.setState({ globalFilter: value })
    }

    showEditModal = (op)=>{
        
        let opArr = this.state.fldArr.map((it)=>{
                let a =  Object.assign({},it,{val:(op == 'EDIT') ? this.state.selectedRow[it.field] : it.val});
                a.val = (a.val == 'NULL' || a.val == null)? '':a.val;
                a.val = (a.type == 'num') ? Number(a.val) :a.val;
                
                return a;
            
        })
        console.log(this.state.dynamicColumns);
        console.log("data",this.state.data);
        this.setState({opArr:opArr,editDialog:true},()=> console.log("opArr",this.state.opArr))

    }
    onChangeDropdown = (val,it) => {
        for(let i=0;i<this.state.opArr.length;i++){
            if(this.state.opArr[i].field == it.field){
                this.state.opArr[i].val = val;
            }
        }
        this.setState({opArr:this.state.opArr})

    }

    
    getData(){
        callsvc({roleid:this.props.roleid},'getrolescreens')
        .then((res)=>{
            if(res.code == '999'){
                console.log("data",res.data);
                this.setState({data:res.data});
                console.log("flds",this.state.fldArr);

            } else{
                this.growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
            }
        })
        .catch((err)=>{
            this.growl.show({severity: 'warn', summary: 'Error', detail:ADMIN_ERROR,life:6000});
            console.log(err);
        })
        .finally(()=>{})
    }
    setData = (inpobj)=>{
        Object.keys(inpobj).map((key)=>{
            this.setState({
                [`${key}`]: inpobj[key]
            });
        })
    }

    dec2hex (dec) {
        return dec.toString(16).padStart(2, "0")
      }
      
      // generateId :: Integer -> String
      generateId (len) {
        var arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return Array.from(arr, this.dec2hex).join('')
      }
    saveRow = ()=>{
        let isFldMissing = checkReq(this.state.opArr,this.setData)
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: `${isFldMissing} seems to be missing! Please check`,life:6000});
            return;
        }
        let a ={objtype:this.state.objtype};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val']
        }
        
        a['roleid'] = this.props.roleid;
        a['roleoptid'] = this.generateId(15).toUpperCase();
        console.log('a',a)
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'insertroleoptions');
    }
    setInpVal = (val,obj)=>{
            
        let a = this.state.opArr.map((it)=>{
            if(it.field == obj.field){
                it.val = val; return it;
            }else {
                return it;
            }
        })
        this.setState({opArr:a})
    }

    deleteRow = ()=>{
        this.setState({deleteDialog:false})
        let a = {objtype : this.state.objtype};
        a[this.state.idfld] = this.state.selectedRow[this.state.idfld];
        delDataRow(a,this.state.data,this.state.idfld,this.setData,this.growl,'delobjdata')
       
    }
    render(){
        return (
            <>
        <div style={{position:'relative'}}> 
            {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
            <Growl ref={(el) => this.growl = el} sticky={true}/>
        
                <TableData 
                    screenopt        =  {Object.assign({},this.props.scrOptions,{name:`Screens for ${this.props.parname}`})}
                    dataValue        =  {this.state.data} 
                    rowSelected      =  {this.state.selectedRow} 
                    rowSelectUpdate  =  {this.rowsSelect} 
                    dynamicColumns   =  {this.state.dynamicColumns}
                    gFilter          =  {this.state.globalFilter}
                    gFilterval       =  {this.gFilterVal}
                    exportData       =  {this.state.exportFldArr}
                    addModal         =  {this.showEditModal}
                    deleteModal      =  {()=>{this.setState({deleteDialog:true})}}
                    
                />

                <DeleteDialog  
                    title       =  {this.state.selectedRow ? this.state.selectedRow['city-eng']:''} 
                    visible     =  {this.state.deleteDialog} 
                    hideDialog  =  {()=>{this.setState({deleteDialog:false})}}
                    deleteBtn   =  {this.deleteRow}
                />
                <AddDailog
                dataArr      =  {this.state.opArr}
                title        =  "Add/Edit Screens"
                hideDialog   =  {()=>{this.setState({editDialog:false})}}
                inpValue     =  {this.setInpVal}
                visible      =  {this.state.editDialog}
                saveBtn      =  {this.saveRow}
                fileUpload   =   {this.myUploader}
                />
                
        </div>
         </>
      )
   }
}

export default Roleoptions;