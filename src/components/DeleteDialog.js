import React,{Component} from 'react';
import { Dialog } from 'primereact/dialog';
import {appTheme} from '../utils/Constants';
import {Button } from 'primereact/button';


export default function DeleteDialog  (props){
   
  const  renderFooter = (name) => {
   
        return (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={() => props.deleteBtn()} className="p-button-danger" />
                <Button label="No" icon="pi pi-times" onClick={() => props.hideDialog()} className="p-button-secondary"/>
            </div>
        );
  }
 return (
     
          <Dialog footer={renderFooter()} visible={props.visible} onHide = {()=>props.hideDialog()} header={<label style={{color:appTheme.primaryColor}}>oops... Deleting Record!</label>}   blockScroll  position="topright">
            <div>
                <p> You are about to delete <span style={{ fontWeight: 'bold', color: appTheme.primaryColor }}>{props.title}</span>  </p>
                
            </div>
                
            </Dialog>
     
 )
}
 