import React from 'react';
import callsvc from '../utils/Services';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
import AppSpinner from '../components/AppSpinner';
import {TabView,TabPanel} from 'primereact/tabview';
import Orgobjects from '../components/Orgobjects'; 
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,setScrOptions,delDataRow} from '../utils/ServiceCalls';

import DeleteDialog from '../components/DeleteDialog';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';



class Orglist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            scrTitle:'Orgnization List', modalTitle: 'Orgnization',
            objtype:'ADMINORG_FLDS_LIST',idfld:'',
            userobj:userProfile.getUserObj(),
            showSpinner:false,
            titleIcon:'pi pi-bars p-toolbar-separator',
            data:[],
            orglist:[],
            selectedRow: [],
            deleteDialog:false,editDialog:false,dynamicColumns:[],exportFldArr:[],opArr:[],fldArr:[],
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false},
            
            
        }
       

    }

    componentDidMount(){


      setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)
      getObjFlds({objtype:this.state.objtype},this.setData,this.growl,this.customBody,'getobjflds');
      getObjData({objtype:this.state.objtype},this.setData,this.growl,'getobjdata');
     

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
                return a;
        })
        
        this.setState({opArr:opArr,editDialog:true})

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


    customCheckBody = (rowData, column) => {
        
        return <i className={rowData[column.field] ? "pi pi-check" : "pi pi-times"} 
        style={rowData[column.field] ? {fontSize:'14px',color:'green'}: {fontSize:'14px',color:'red'}} /> 
    }
            

    deleteRow = ()=>{
        this.setState({deleteDialog:false})
        let a = {objtype : this.state.objtype,selorgid:this.state.selectedRow.selorgid};
        // a[this.state.idfld] = this.state.selectedRow[this.state.idfld];
        delDataRow(a,this.state.data,this.state.idfld,this.setData,this.growl,'delobjdata')
       
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

    

    saveRow = ()=>{
        let isFldMissing=false;
        let opArr = this.state.opArr.map((it)=>{
            if(it.req && it.val.length == 0){
                isFldMissing = true;
                it.inpstyle = {border:'1px solid red'}
            }else{
                it.inpstyle = {border:'1px solid #a6a6a6'}
            }
            return it;
        })
        this.setState({opArr:opArr})
        if(isFldMissing){
            this.growl.show({severity: 'warn', summary: 'Missing Fields', detail: 'Looks like you missing some fields! Please check',life:6000});
            return;
        }

        let a ={objtype:this.state.objtype};
        for(let i=0;i<this.state.opArr.length;i++){
            a[this.state.opArr[i]['field']] = this.state.opArr[i]['val']
        }
        this.setState({showSpinner:true});
        callsvc(a,'insobjdata')
        .then((res)=>{
            if(res.code == '999'){
                this.setState({editDialog:false});
                getObjData({objtype:this.state.objtype},this.setData,this.growl,'getobjdata');
                
            }else{
                this.growl.show({severity: 'warn', summary: 'Admin Error', detail: res.message,life:6000});
            }
        })
        .catch((err)=>{
             this.growl.show({severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR,life:6000});
        })
        .finally(()=>{
            this.setState({showSpinner:false});
        })

        

    }


    showEditModal = (op)=>{
        

        let opArr = this.state.fldArr.map((it)=>{
                let a =  Object.assign({},it,{val:(op == 'EDIT') ? this.state.selectedRow[it.field] : it.val});
                a.val = (a.val == 'NULL' || a.val == null)? '':a.val;
                a.val = (a.type == 'num') ? Number(a.val) :a.val;
                return a;
            
            

        })
        
        this.setState({opArr:opArr,editDialog:true})

    }

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    myUploader = (event) => {
        uploadImg(event,this.state.opArr,this.setData,this.growl);
       
    }

    render (){
        
        return (
            <div style={{position:'relative',height:window.screen.height-210}}> 
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
                {(this.state.selectedRow) &&
                <TabView style={{marginTop:5}} activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
                    {/* <TabPanel header="More Info">
                        <ProductFrom ProDetail={this.state.selectedRow}/> 
                    </TabPanel> */}
                    <TabPanel header="Employees">
                        <div>Employees</div>
                    </TabPanel>
                    <TabPanel header="Screens">
                    <div>Screens</div>
                    </TabPanel>
                    <TabPanel header="Objects">
                    <Orgobjects parid={this.state.selectedRow.selorgid} 
                    parname={this.state.selectedRow['name'] || ''}
                    scrOptions = {this.state.scrOptions}
                    />
                    </TabPanel>
                    {/* <TabPanel header="Damage Items">
                        <DamageProd proDetail={this.state.selectedRow} />
                    </TabPanel> */}
                </TabView>}
                <DeleteDialog  
                        title       =  {this.state.selectedRow ? this.state.selectedRow['name']:''} 
                        visible     =  {this.state.deleteDialog} 
                        hideDialog  =  {()=>{this.setState({deleteDialog:false})}}
                        deleteBtn   =  {this.deleteRow}
                    />
                    <AddDialog
                       dataArr      =  {this.state.opArr}
                       title        =  "Add/Edit Modal"
                       hideDialog   =  {()=>{this.setState({editDialog:false})}}
                       inpValue     =  {this.setInpVal}
                       visible      =  {this.state.editDialog}
                       saveBtn      =  {this.saveRow}
                       fileUpload   =   {this.myUploader}
                    />
                
               
            
                
               

            </div> 
        )// end render and above div is parent div
    }

    
}

export default Orglist;