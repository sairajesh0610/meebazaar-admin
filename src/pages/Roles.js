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
import Roleoptions from './Roleoptions';


class Roles extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            objtype:'ROLE_LIST_FLDS', roleList :[],
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(),
            deleteDialog:false,editDialog:false,idfld:'',showSpinner:false,
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }

    componentDidMount(){
        setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
        getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody)
        getObjData({objtype:this.state.objtype},this.setData,this.growl)
        //this.displayData();
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
                a.disabled = (op == 'EDIT' && (a.field == 'val' || a.field == 'active') ) ? true : false;
               

                return a;
            
        })
        console.log(this.state.dynamicColumns);
        console.log("data",this.state.data);
        this.setState({opArr:opArr,editDialog:true},()=>console.log(this.state.opArr));

    }

    onChangeDropdown = (val,it) => {
        for(let i=0;i<this.state.opArr.length;i++){
            if(this.state.opArr[i].field == it.field){
                this.state.opArr[i].val = val;
            }
        }
        this.setState({opArr:this.state.opArr})

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
        //a['listid'] = Math.floor((Math.random() * 10000000000) + 1);
        a['description'] = encodeURIComponent(a['description']);
        a['atype'] = "EMP_FLDS";
        a['val'] = encodeURIComponent(a['val']);
        //console.log('a',a)
        saveDataRow(a,this.state.data,this.setData,this.growl,this.state.idfld,'insobjdata');
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

    render () {
        return (
            <>
        <div style={{position:'relative'}}> 
            {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
            <Growl ref={(el) => this.growl = el} sticky={true}/>
                <TableData 
                    screenopt        =  {this.state.scrOptions} 
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
                {(this.state.selectedRow && this.state.selectedRow.val) &&
                    <TabView style={{marginTop:5}} activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
                        
                        <TabPanel header="Screens">
                        <Roleoptions 
                            roleid={this.state.selectedRow['val'] || ''} 
                            parname={this.state.selectedRow['val'] || ''}
                            scrOptions = {this.state.scrOptions}
                            loclist = {this.state.data}
                            />
                        </TabPanel>
                        
                    </TabView>}
                <DeleteDialog  
                    title       =  {this.state.selectedRow ? this.state.selectedRow['city-eng']:''} 
                    visible     =  {this.state.deleteDialog} 
                    hideDialog  =  {()=>{this.setState({deleteDialog:false})}}
                    deleteBtn   =  {this.deleteRow}
                />
                <AddDailog
                dataArr      =  {this.state.opArr}
                title        =  "Add/Edit Roles"
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
     

export default Roles;