import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,Redirect,
  Link
} from "react-router-dom"; 

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Primeflex.css'
import './App.css';
import Launch from './pages/Launch';
import TestRoute from './pages/TestRoute';
import configureStore from './Reducers/Store';
import {Provider} from 'react-redux';
// this is appjs

export const appStore = configureStore();

class App extends React.Component {
  constructor(props){
    super(props);
    
  }
  
  render() {
    return (
      
      <Provider store={appStore}>
        <Router basename={'/'}>
        
            <Switch>
              
              <Route  component = {Launch} />
              
            </Switch>
        </Router>
      </Provider>
      
    );
  }
}


export default App;
