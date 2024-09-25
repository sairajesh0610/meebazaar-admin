import React,{Component,Fragment} from "react";
import {connect} from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {Card} from 'primereact/card';
import readXlsxFile from 'read-excel-file';
import callsvc from "../utils/Services";
import { Button } from 'primereact/button';
import {Growl} from 'primereact/growl';
import Dropzone from 'react-dropzone';
import { callsvcforupload } from "../utils/Services";
import {Toolbar} from 'primereact/toolbar';
import {appTheme as themeColor} from '../utils/Constants';
import { Dialog } from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import AppSpinner from '../components/AppSpinner';


class Importdata extends Component {
    constructor(props){
        super(props)
        const input = document.getElementById('file');
        this.state = {
            catidArr:[],
            subcatidArr:[],
            prdArr:[],
            importProdArr:[],
            selectedRow:{},
            showButton:false,
            imgpath:[],showError:false,errorMsg:'', validated:false,
            catfieldList : ['status','cat-name-eng','cat-name-tel','cat-desc-eng','cat-desc-tel','image','seq','active','upcoming','parent'],
            dynamicColumns:[], data:[], showTable:false, uploadedFiles:[],
            importType : [
                {label: 'Categories', value: 'CAT'},
                {label: 'Products', value: 'PRD'},
                
            ],
            selectedImpType:'', showSpinner: false,
            prdFieldList:['status','prod-name-eng','prod-name-tel','prod-desc-eng','prod-desc-tel','sub-catname',
            'image','brand','agency','searchtags','prdactive','prdseq','taxble','taxincluded','hsncode','size','price','onpromo',
            'promoprice','purchase','showindeal','qtyavailable','minqty','itactive','itseq','dealseq','subscribe','barcode']
            
            
        }
    }
    componentDidMount(){
      
    }

  


    
  
   

    

    
    

    
    importCat = (files) => {
        this.setState({showSpinner:true});
        readXlsxFile(files[files.length-1]).then((data) => {
            let catfieldList = this.state.catfieldList;
            let missingFldList=''
            for(let i=1;i<catfieldList.length;i++){
                let fldname = catfieldList[i] ;
                let a = data[0].filter(it=>it==fldname);
                if(a.length == 0){
                    missingFldList+=fldname + ',';
                }
            }
            
            if(missingFldList){
            missingFldList = missingFldList.substr(0,missingFldList.length) + ' are Missing.Please check!'
            this.setState({showError:true,errorMsg:missingFldList,showSpinner:false})
            return
            //console.log(missingFldList)
            }
            let inpObj=[];
            for(let k=1;k<data.length;k++){
                let a={}
                for(let l=0;l<data[k].length;l++){
                    a[data[0][l]] = data[k][l]
                }
                inpObj.push(a);
                
            }
            for(let i=0;i<inpObj.length;i++){
                inpObj[i]['status'] = 'Imported';
            }
            let dynamicColumns = [];
            for(let i=0; i<catfieldList.length;i++){
                dynamicColumns.push(<Column  style={{width:'120px'}} key={catfieldList[i]} field={catfieldList[i]} header={catfieldList[i]} sortable={false}  />);
            }
            this.setState({showError:false,errorMsg:'',dynamicColumns:dynamicColumns,data:inpObj,showTable:true,showImportDialog:false,showSpinner:false});
            
           // callsvc({orgid:orgid,empid:empid,catlist:JSON.stringify(inpObj)},'catbulkupload',false); 
            //console.log(this.props.userProfile)

            

            

            console.log(data);
        });
        
    }

    importPrd = (files) => {
        this.setState({showSpinner:true});
        readXlsxFile(files[files.length-1]).then((data) => {
            let prdFieldList = this.state.prdFieldList;
            let missingFldList=''
            for(let i=1;i<prdFieldList.length;i++){
                let fldname = prdFieldList[i] ;
                let a = data[0].filter(it=>it==fldname);
                if(a.length == 0){
                    if(fldname=="brand" || fldname=="agency"){
                    }else{
                        missingFldList+=fldname + ',';
                    }
                    
                }
            }
            
            if(missingFldList){
            missingFldList = missingFldList.substr(0,missingFldList.length) + ' are Missing.Please check!'
            this.setState({showError:true,errorMsg:missingFldList,showSpinner:false})
            return
            //console.log(missingFldList)
            }
            let inpObj=[];
            for(let k=1;k<data.length;k++){
                let a={}
                for(let l=0;l<data[k].length;l++){
                    a[data[0][l]] = data[k][l]
                }
                inpObj.push(a);
                
            }
            for(let i=0;i<inpObj.length;i++){
                inpObj[i]['status'] = 'Imported';
            }
            let dynamicColumns = [];
            for(let i=0; i<prdFieldList.length;i++){
                dynamicColumns.push(<Column  style={{width:'160px'}} key={prdFieldList[i]} field={prdFieldList[i]} header={prdFieldList[i]} sortable={false}  />);
            }
            this.setState({showError:false,errorMsg:'',dynamicColumns:dynamicColumns,data:inpObj,showTable:true,showImportDialog:false,showSpinner:false});
            
           // callsvc({orgid:orgid,empid:empid,catlist:JSON.stringify(inpObj)},'catbulkupload',false); 
            //console.log(this.props.userProfile)

            

            

            console.log(data);
        });
        
    }

    myUploader = (event) => {
        this.setState({showSpinner:true});
        console.log('called!');
        console.log(event);
        for(let i=0;i<event.length;i++){
        if(event[i]['size']>102400){
            continue;
        }
        const data = new FormData();
        data.append('file', event[i]);
        callsvcforupload(data, 'filebulkupload', false)
            .then((res) => {
                this.state.uploadedFiles.push({imgurl:res['imgurl'], id:parseInt(Math.random()*1000)})
                this.setState({uploadedFiles:this.state.uploadedFiles});
                console.log(this.state.uploadedFiles);
                //this.setState({ addCatObj: Object.assign(this.state.addCatObj, { imgpath: res['imgurl'] }) })
            })
            .catch((err) => {})
            .finally(() => {})
     }
     this.setState({showSpinner:false});
    }

    imgupload =(files)=>{
        if(this.state.selectedImpType == 'CAT'){
                this.importCat(files);
        }else {
                this.importPrd(files);
        }
        
       


    }


    onImport = () =>{
        if(!this.state.selectedImpType && this.state.data.length > 0){
            this.setState({showError:true,errorMsg:'You need to upload file & select type to be downloaded'});
            return;
        }else{
            this.setState({showError:false,errorMsg:'',showImportDialog:false});
        }

    }

    renderFooter(name) {
        if(name == 'showImportDialog'){
            return (
                <div>
                    <Button label="No" icon="pi pi-times" onClick={() => this.setState({showImportDialog:false,showError:false,errorMsg:'',data:[],selectedImpType:'',dynamicColumns:[]})} className="p-button-danger" />
                    <Button disabled={this.state.data.length == 0 ? true : false} label="Yes" icon="pi pi-check" onClick={() => this.onImport()} className="p-button-secondary"/>
                </div>
            );
        } 
        
    }

    importData = ()=>{ 
        
        this.setState({showSpinner:true});
        const {orgid,empid} = this.props.userProfile;
        if(this.state.selectedImpType == 'CAT'){
            this.setState({validated:false});
            let a = this.state.data.map((it)=>{
                return Object.assign({},it,
                    {'cat-name-eng':encodeURIComponent(it['cat-name-eng']),
                'cat-name-tel':encodeURIComponent(it['cat-name-tel']),
                
                'cat-desc-eng' : encodeURIComponent(it['cat-desc-eng']),
                'cat-desc-tel' : encodeURIComponent(it['cat-desc-tel']),
                'parent': (it['parent'] ? encodeURIComponent(it['parent']):'')
                });
            })
            this.catSvcCall(a,orgid,empid);
            
            
        } else {
            this.setState({validated:false});
            let a = this.state.data.map((it)=>{
                return Object.assign({},it,
                    {'prod-name-eng':encodeURIComponent(it['prod-name-eng']),
                'prod-name-tel':encodeURIComponent(it['prod-name-tel']),
                
                'prod-desc-eng' : encodeURIComponent(it['prod-desc-eng']),
                'prod-desc-tel' : encodeURIComponent(it['prod-desc-tel']),
                'size' : encodeURIComponent(it['size']),
                'brand': encodeURIComponent(it['brand']),
                'searchtags': encodeURIComponent(it['searchtags']),
                'sub-catname': (it['sub-catname'] ? encodeURIComponent(it['sub-catname']):'')
                });
            })
            this.prodSvcCall(a,orgid,empid);
        }
    }

    catSvcCall = (dataArr,orgid,empid)=>{
        let currArr = [];
        let remainArr = [];
        for(let i=0;i<dataArr.length;i++){
            if(i<5){
                currArr.push(dataArr[i]);
            }else{
                remainArr.push(dataArr[i]);
            }
        }
        if(currArr.length > 0){

        callsvc({orgid:orgid,empid:empid,catlist:JSON.stringify(currArr)},'catbulkupload',false)
            .then((res)=>{
                for(let i=0;i<res.length;i++){
                    for(let j=0;j<this.state.data.length;j++){
                        if(res[i]['name'] == this.state.data[j]['cat-name-eng']){
                            this.state.data[j]['status'] = res[i]['status'];
                            break;
                        }
                    }
                }
                this.setState({data:this.state.data});
            })
            .catch(()=>{})
            .finally(()=>{
                this.catSvcCall(remainArr,orgid,empid);
            })
        }else {
            this.setState({showSpinner:false});
            this.growl.show({severity: 'success', summary: 'Import Completed!', detail: 'Import Completed!, Please check, if any errors',life:6000});
        }

    }


    prodSvcCall = (dataArr,orgid,empid)=>{
        
        let currArr = [];
        let remainArr = [];
        for(let i=0;i<dataArr.length;i++){
            if(i<5){
                currArr.push(dataArr[i]);
            }else{
                remainArr.push(dataArr[i]);
            }
        }
        if(currArr.length > 0){
            callsvc({orgid:orgid,empid:empid,prdlist:JSON.stringify(currArr)},'prdbulkupload',false)
                .then((res)=>{
                    for(let i=0;i<res.length;i++){
                        for(let j=0;j<this.state.data.length;j++){
                            if(res[i]['name'] == this.state.data[j]['prod-name-eng'] && res[i]['size'] == this.state.data[j]['size']){
                                this.state.data[j]['status'] = res[i]['status'];
                                break;
                            }
                        }
                    }
                    this.setState({data:this.state.data});
                })
                .catch(()=>{})
                .finally(()=>{
                    this.prodSvcCall(remainArr,orgid,empid);
                })
        }else {
            this.setState({showSpinner:false});
            this.growl.show({severity: 'success', summary: 'Import Completed!', detail: 'Import Completed!, Please check, if any errors',life:6000});
        }
    }

    validateData = () =>{
        
        for(let i=0;i<this.state.data.length;i++){
                let obj = this.state.data[i];
                let err =''
                if(this.state.selectedImpType == 'CAT'){
                    this.state.data[i]['cat-name-eng'].replace("'", '');
                    this.state.data[i]['cat-name-tel'].replace("'", '');
                    this.state.data[i]['cat-desc-eng'].replace("'", '');
                    this.state.data[i]['cat-desc-tel'].replace("'", '');
                    
                    this.state.data[i]['cat-name-eng'].replace("’", '');
                    this.state.data[i]['cat-name-tel'].replace("’", '');
                    this.state.data[i]['cat-desc-eng'].replace("’", '');
                    this.state.data[i]['cat-desc-tel'].replace("’", '');
                    this.state.data[i]['image'].replace("'", '');
                    this.state.data[i]['image'].replace("&", '');
                    this.state.data[i]['image'].trim().replace(" ",'');
                    
                    

                    
                    
                    

                }else{
                    console.log('I am here');    
                    console.log(this.state.data[i]);
                    this.state.data[i]['prod-name-eng'].replace("'", '');
                    this.state.data[i]['prod-name-tel'].replace("'", '');
                    this.state.data[i]['prod-desc-eng'].replace("'", '');
                    this.state.data[i]['prod-desc-tel'].replace("'", '');
                    
                    this.state.data[i]['prod-name-eng'].replace("’", '');
                    this.state.data[i]['prod-name-tel'].replace("’", '');
                    this.state.data[i]['prod-desc-eng'].replace("’", '');
                    this.state.data[i]['prod-desc-tel'].replace("’", '');
                    this.state.data[i]['image'].replace("'", '');
                    this.state.data[i]['image'].replace("&", '');
                    this.state.data[i]['image'].trim().replace(" ",'');
                    this.state.data[i]['searchtags'].replace("'", '');
                    this.state.data[i]['searchtags'].replace("’", '');
                    
                    this.state.data[i]['searchtags'].replace("&", '');
                    this.state.data[i]['searchtags'].trim().replace(" ",'');

                    
                     
                    
                   
                }
                this.state.data[i]['status'] = (err.trim())? err : 'validated';
                
        }
        let validated = true;
        for(let i=0;i<this.state.data.length;i++){
            if(this.state.data[i]['status'] != 'validated'){
                validated = false; break;
            }
        }
        if(validated){
            this.growl.show({severity: 'success', summary: 'Validation Complete', detail: 'Validation complete, You can import the data now!',life:6000});
        }else{
            this.growl.show({severity: 'warn', summary: 'Validation Errors', detail: 'Validation complete, There seems to be few errors, Please fix and import again!',life:6000}); 
        }
       
        this.setState({data:this.state.data,validated:validated});
        
    }

    render(){
        
        return(

        <Fragment>
              {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
              <Growl ref={(el) => this.growl = el} sticky={true}/>
              

            <Card className="left-align-table">
                
                <Toolbar>
                    <div className="p-toolbar-group-left">
                        <div style={{display:'flex'}}>
                            <i className="pi pi-arrow-circle-up" style={{fontSize:'30px',alignSelf:'center'}} />
                            <p style={{margin:'0px',color:themeColor.primaryColor,fontSize:'20px',fontWeight:700}}>Import</p>
                        </div>
                        
                    </div>
                    <div className="p-toolbar-group-right">
                       
                        
                        
                        <Button icon="pi pi-upload"  style={{marginRight:'.25em'}}  tooltip="Import Excel" tooltipOptions={{position: 'top'}} onClick={()=>{ this.setState({showImportDialog:true,showError:false,errorMsg:'',data:[],selectedImpType:'',validated:false,dynamicColumns:[]})}} />
                        <Button  disabled= {this.state.data.length > 0 ? false:true} icon="pi pi-check-circle"  style={{marginRight:'.25em'}} tooltip="Validate Data" tooltipOptions={{position: 'top'}} onClick={()=>{ this.validateData()}} /> 
                        <Button  disabled= {this.state.validated > 0 ? false:true} icon="pi pi-arrow-circle-down"  style={{marginRight:'.25em'}} tooltip="Import Data" tooltipOptions={{position: 'top'}} onClick={()=>{ this.importData()}} /> 
                        
                    </div>
                    
                </Toolbar>
                
             
            {this.state.showTable &&
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
            </DataTable> }
            </Card> 

            <Card title="Upload Images here!">
            <Dropzone onDrop={(files) => this.myUploader(files)}>
                        {({ getRootProps, getInputProps, acceptedFiles }) => (
                            <section className="container">
                                <div style={styleDrag} {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' Drop Images Here</p>
                                    
                                </div>
                                
                            </section>
                        )}
                    </Dropzone>

            <div className="p-grid">{this.state.uploadedFiles.length > 0 && this.state.uploadedFiles.map((it)=>{
                return (<div className="p-col-6 p-md-3 p-lg-2" key={it.id}>
                        <img src={it.imgurl} style={{height:120,width:120}} />
                </div>)
            })}

            </div>
            </Card>
           
            <Dialog   footer={this.renderFooter('showImportDialog')} header={<label style={{color:themeColor.primaryColor}}>Import Data</label>} visible={this.state.showImportDialog}  blockScroll onHide={() => this.setState({ showImportDialog: false })} position="topright">
                <div style={{padding:'24px'}}>
                {this.state.showError && <div style={{color:'red',fontWeight:'bold',maxWidth:'300px',textAlign:'center',marginBottom:'12px'}}>{this.state.errorMsg}</div>}
                <Dropdown style = {{width:'200px'}} value={this.state.selectedImpType} options={this.state.importType} onChange={(e) => {this.setState({selectedImpType: e.value})}} placeholder="Select Object to be Imported"/>
                 
                {this.state.selectedImpType && <Dropzone onDrop={(files)=>this.imgupload(files)}>
                    {({getRootProps, getInputProps,acceptedFiles}) => (
                    <section className="container">
                        <div style={styleDrag} {...getRootProps({className: 'dropzone'})}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' Drop File Here</p>
                            </div>
                            {/* <h4>Files</h4> */}
                        </section>
                        )}
                </Dropzone>}
                </div>          
                </Dialog>

            {/* {this.state.imgpath.map(url=>
                <div key={url} style={{position:'relative'}} >
                  <img style={{ marginTop:"2%",padding:'2px'}} height="200px" width="200px" src={url.imgurl}/>
               </div>
               )} */}
        </Fragment>
        )
    }
 }
 const styleDrag = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    margin:'30px 0px'
}
function mapStateToProps(state) {
    return {
        userProfile: state.userProfile
    }
}

export default connect(mapStateToProps)(Importdata)
