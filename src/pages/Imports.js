
import React from 'react';
import callsvc from '../utils/Services';
import {callsvcforupload} from '../utils/Services';
import userProfile from '../utils/Userprofile';
import {Growl} from 'primereact/growl';
import {appTheme,ADMIN_ERROR,GLOBAL_ERROR} from '../utils/Constants';
import AppSpinner from '../components/AppSpinner';
import {Toolbar} from 'primereact/toolbar';
import {Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import CustomBadge from '../components/CustomBadge';
import { Dialog } from 'primereact/dialog';

import Dropzone from 'react-dropzone';
import ExcelExport from '../components/ExcelExport';

//prime Components

//custom Imports


class Imports extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            titleIcon:'pi pi-bars p-toolbar-separator',
            showSpinner:false,
            userobj:userProfile.getUserObj(),
            orglang:[],
            
        }
        this.state.orglang = this.state.userobj.orglang.split(","); 
    }

    componentDidMount(){
        let scrIcon = userProfile.getScrIcon(this.props.navProps.location.pathname);
        if(scrIcon)
        this.setState({titleIcon:scrIcon})
    }

    render (){
        return (<div style={{position:'relative',height:window.screen.height-210}}> 
        {this.state.showSpinner && <AppSpinner spinColor="dark" showText={false} scrHeight={window.screen.height-210}/>}
        
        <Growl ref={(el) => this.growl = el} sticky={true}/>
        <Toolbar>
        <div className="p-toolbar-group-left">
             <div style={{display:'flex'}}>
                <i className={this.state.titleIcon} style={{marginRight:'24px',alignSelf:'center'}} />
                <p style={{margin:'0px',color:appTheme.primaryColor,fontSize:'20px',fontWeight:700}}>Imports</p>
             </div>
            
        </div>
        <div className="p-toolbar-group-right">
            <Button icon="pi pi-folder-open"  style={{marginRight:'.25em'}}  tooltip="Import Categories" tooltipOptions={{position: 'top'}}  > </Button>
            <Button icon="pi pi-tags" className="p-button-warning" style={{marginRight:'.25em'}} tooltip="Import Products" tooltipOptions={{position: 'top'}} >  </Button>  
            
        </div>
           
        </Toolbar>
        </div>)
    }

    
}

export default Imports;