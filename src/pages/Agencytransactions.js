import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import AgencyTxns from '../components/AgencyTxns';
import { APP_ID } from '../utils/Constants';

class Agencytransactions extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            activeIndex:0
        }
    }

    componentDidMount(){
        console.log(this.props)
    }

    render (){
        return (
        
            
            <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
            <TabPanel header="Pending" >
              <AgencyTxns name="Pending Transactions" navProps={this.props.navProps} cleared="N"/>
            </TabPanel>
            <TabPanel header="Successful" >
              <AgencyTxns name="Successful Transactions" navProps={this.props.navProps} cleared="Y"/>
            </TabPanel>
            
        </TabView>
            )
    }

    
}

export default Agencytransactions;