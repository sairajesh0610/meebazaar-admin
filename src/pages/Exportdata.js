import React from 'react';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import AppSpinner from '../components/AppSpinner';
import DeleteDialog from '../components/DeleteDialog';
import TableData from '../components/TableData'
import AddDialog from '../components/AddDailog';
import {getObjData,getObjFlds,uploadImg,saveDataRow,checkReq,delDataRow,setScrOptions} from '../utils/ServiceCalls';
import callsvc from '../utils/Services';
import { Dialog } from 'primereact/dialog';
import {Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import Dropzone from 'react-dropzone';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
import {Card} from 'primereact/card';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {Toolbar} from 'primereact/toolbar';
import ReactExport from "react-data-export";
import { Calendar } from 'primereact/calendar';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;



class Exportdata extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            objtype:'',selobj:'',
            dynamicColumns:[],fldArr:[],exportFldArr:[],data:[],selectedRow:{},opArr:[],
            userobj:userProfile.getUserObj(), expDialog:false,colList:[],langList:[{id:1,name:'English'},{id:2,name:'Telugu'}],selLang:'English',
            deleteDialog:false,editDialog:false,idfld:'', selectedProd:null, showTable:false,
            stDt:'',endDt:'',
            scrOptions:{name:'',icon:'',editopt:false,addopt:false,expopt:false,delopt:false}
        }
    }
    componentDidMount(){
        this.getExportItems();
        console.log(this.props.navProps)
        setScrOptions(this.state.userobj.roleoptions,this.props.navProps.location.pathname,this.setData)

    }

    onChangeDropdown2(val){
        this.setState({selLang:val});
    }

    onChangeDropdown(val){
        this.setState({selobj:val,dynamicColumns:[],data:[]})
        let type = val.objtype
        console.log(val);
        callsvc({orgid:this.state.userobj.orgid,type:type,lang:this.state.selLang.name,stdt:this.state.stDt,enddt:this.state.endDt},val.service)
        .then((res)=>{
            if(res.code == '999'){
                let colArr = []
                Object.keys(res.data[0]).map((key)=>{
                    let a = {header:`${key}`,value:`${key}`}
                    colArr.push(a);
                })
                console.log(colArr);
                let dynamicColumns = [];
                for(let i=0; i<colArr.length;i++){
                    dynamicColumns.push(<Column  style={{width:'120px'}} key={colArr[i]['header']} field={colArr[i]['value']} header={colArr[i]['header']} sortable={false}  />);
                }
                this.setState({showError:false,errorMsg:'',data:res.data,colList:colArr,dynamicColumns:dynamicColumns,showTable:true},()=>console.log(this.state.dynamicColumns));
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

    getExportItems(){
        callsvc({objtype:'EXP_LIST_FLDS'},'getobjdata')
        .then((res)=>{
            if(res.code == '999'){
                let typeArr = []
                for(let i=0; i<res.data.length;i++){
                    let a = {name:res.data[i]['name'],service:res.data[i]['service'],listid:res.data[i].listid,objtype:res.data[i].objtyp};
                    typeArr.push(a);
            }
            console.log(typeArr)
                this.setState({typeList:typeArr});

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
    stDtChange = (value) => {

        let b = new Date (value);
        //b.setDate(b.getDate()+7);
        this.setState({ stDt: value }); 
        

    }
    endDtChange = (value) => {
        this.setState({ endDt: value }, () => {
            //this.graphlist()
        })
    }

    render(){
        let today = new Date();
        return(
            <div>
            <Growl ref={(el) => this.growl = el} sticky={true}/>
            <Card>

            <Toolbar>
    <div className="p-toolbar-group-left">
        <div style={{display:'flex'}}>
            {/* <i className={props.screenopt.icon} style={{marginRight:'24px',alignSelf:'center'}} /> */}
            <i className="pi pi-arrow-circle-down" style={{fontSize:'30px',alignSelf:'center'}} />
            <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>{this.state.scrOptions.name}</p>
        </div>
        
    </div>
    <div className="p-toolbar-group-right">
    <InputText id={'stdt1'} type="date" size={30} value={this.state.stDt} 
            onChange={(e)=>{this.stDtChange(e.target.value)}} tooltip={'Start Date'} 
            tooltipOptions={{position: 'top'}}  disabled={false}
            style={{"width":"150px",'marginRight':'1em'}}/>
    <InputText id={'stdt2'} type="date" size={30} value={this.state.endDt} 
            onChange={(e)=>{this.endDtChange(e.target.value)}} tooltip={'Start Date'} 
            tooltipOptions={{position: 'top'}}  disabled={false}
            style={{"width":"150px",'marginRight':'1em'}}/>
    <Dropdown  value={this.state.selLang}  options={this.state.langList} 
    onChange={(e) => {this.onChangeDropdown2(e.target.value)}}  style = {{minWidth:'100px',verticalAlign:'middle',marginRight:'1em'}}
   optionLabel={"name"} tooltip={"Select Language"} tooltipOptions={{position: 'top'}} 
   disabled={false}  placeholder={"Language"}/> 
    <Dropdown  value={this.state.selobj}  options={this.state.typeList} 
    onChange={(e) => {this.onChangeDropdown(e.target.value)}}  style = {{minWidth:'233px',verticalAlign:'middle',marginRight:'1em'}}
   optionLabel={"name"} tooltip={"Select Option to Export"} tooltipOptions={{position: 'top'}} 
   disabled={false}  placeholder={"Select option"}/> 
   <ExcelFile element={ <Button style={{marginRight:'.25em'}} icon="pi pi-file-excel"  className="p-button-success"  disabled={!this.state.showTable}/>}>
                
                <ExcelSheet data={this.state.data} name={this.state.selobj.name}>
                {/* <ExcelColumn label="active" value="active"/>
                <ExcelColumn label="Img-Path" value="imgpath"/>
                <ExcelColumn label="Cat-Name-Eng" value="eng-name"/>
                <ExcelColumn label="Cat-Descpt-Eng" value="eng-descpt"/>
                <ExcelColumn label="Cat-Name-Tel" value="tel-name"/>
                <ExcelColumn label="Cat-Descpt-Tel" value="tel-descpt"/>
                <ExcelColumn label="Par-Category" value="parent"/>
                <ExcelColumn label="Seq" value="seq"/>
                <ExcelColumn label="Upcoming" value="upcoming"/> */}


                    {this.state.colList.map((it)=>{
                        
                        return <ExcelColumn label={it.header} value={it.value} key={it.header}/>
                        
                        
                        
                    })}
                    
                    
                </ExcelSheet>
               
            </ExcelFile>
        </div>
    
    </Toolbar>
        
        <div>
        {(this.state.showTable) &&
            

            <DataTable

                value={this.state.data}
                scrollable={true}
                scrollHeight={window.screen.height-300 + 'px'}
                style={{width: window.screen.width + 'px',marginTop:'12px'}}
                selection={this.state.selectedRow}
                onSelectionChange={(e) => { this.setState({ selectedRow: e.value }) }}
                selectionMode='single'
                className="left-align-table"
                emptyMessage="No records found..."
                globalFilter={this.state.globalFilter}

                >
                {this.state.dynamicColumns}
            </DataTable>

            
            
        }
        </div>
        </Card>
    </div>
        )
    }

}

export default Exportdata;