import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import Neworders from '../components/Neworders';
import Suborders from '../components/Suborders';
import { APP_ID } from '../utils/Constants';

class Orderlist extends React.Component {

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
            <TabPanel header="New Orders" >
              <Neworders name="New Orders" navProps={this.props.navProps} ordstat="SUBMITTED"/>
            </TabPanel>
            {APP_ID=="MEEBAZAAR" && <TabPanel header="Processed Orders" >
            <Neworders name="Blocked Orders" navProps={this.props.navProps} ordstat="PROCESSED"/>
          </TabPanel>
            }
            {APP_ID=="MEEBAZAAR" && <TabPanel header="Pickup Orders" >
            <Neworders name="Pickup Orders" navProps={this.props.navProps} ordstat="PICKUP"/>
          </TabPanel>
            }
            {APP_ID=="MEEBAZAAR" && <TabPanel header="Incomplete Orders" >
            <Neworders name="Incomplete Orders" navProps={this.props.navProps} ordstat="INCOMPLETE"/>
          </TabPanel>
            }
            
            <TabPanel header="Ready Orders">
                <Neworders name="Ready Orders" navProps={this.props.navProps} ordstat="ORDER_READY"/>
            
            </TabPanel>
            <TabPanel header="Delivered Orders">
                <Neworders name="Delivered Orders" navProps={this.props.navProps} ordstat="DELIVERED"/>
            </TabPanel>
            <TabPanel header="Cancelled Orders">
                <Neworders name="Cancelled Orders" navProps={this.props.navProps} ordstat="CANCELLED"/>
            </TabPanel>
            <TabPanel header="Inprogress Orders" >
                <Neworders name="Inprogress Orders" navProps={this.props.navProps} ordstat="IN-PROGRESS"/>
            </TabPanel>
            <TabPanel header="Subscription Orders">
             <Suborders name="Inprogress Orders" navProps={this.props.navProps} ordstat="IN-PROGRESS"/>
            
              
            </TabPanel>
        </TabView>
            )
    }

    
}

export default Orderlist;