import React from 'react';
import {InputText} from 'primereact/inputtext';
import callsvc from '../utils/Services';
import userProfile from '../utils/Userprofile';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';


class TempScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fname:'',
            userobj:userProfile.getUserObj(),
            data:[],
            objtype: 'FRANCHISE_FLDS',
            dynamicColumns: [
               
            ]
        }
    }

    componentDidMount () {
        console.log(this.state.userobj);
        console.log("hi");
        callsvc ({objtype:this.state.objtype},'getobjflds',true)
        .then((res)=>{
            console.log(res);

        }).catch((err)=>{

        }).finally(()=>{})

        callsvc({objtype:this.state.objtype},'getobjdata',true)
        .then((res)=>{
            if(res.code == '999'){
                this.setState({data:res.data});
            }
            console.log(res);
        }).catch((err)=>{
            console.log(err)
        }).finally(()=>{})

    }

    render () {
        return (<div> 
            
            <DataTable value={this.state.data}>
                {this.state.dynamicColumns}
            </DataTable>
            
            </div>)
    }
}

export default TempScreen