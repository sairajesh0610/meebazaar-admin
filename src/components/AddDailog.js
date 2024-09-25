import React,{Component} from 'react';
import { Dialog } from 'primereact/dialog';
import {Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import Dropzone from 'react-dropzone';
import {appTheme,ADMIN_ERROR,styleDrag} from '../utils/Constants';
export default function AddDialog  (props){
   
  const  renderFooter = () => {
   
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={()=>props.hideDialog()} className="p-button-secondary"/>
                <Button label="Save" icon="pi pi-check" onClick={() =>props.saveBtn()} className="p-button-primary" />
                
            </div>
        );
}
 return (
     
    <Dialog footer={renderFooter()} header={props.title} visible={props.visible} style={{width:window.screen.width,height:window.screen.height,verticalAlign:'middle'}}  blockScroll onHide = {()=>props.hideDialog(props.stateProp)} position="center">
    <>
    <div className="p-grid" style={{width:'100%',padding:'40px'}}>
        
        {props.dataArr.map((it)=>{
            if(it.formshow){
                if(it.type == 'text'){
                    return (
                    <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                        <span className="p-float-label">
                            <InputText id={it.field} type="text" size={30} value={it.val} 
                            onChange={(e)=>{props.inpValue(e.target.value,it)}} tooltip={it.tooltip} 
                            tooltipOptions={{position: 'top'}}  disabled={it.disabled}
                            style={it.inpstyle}/>
                            <label htmlFor={it.field}>{it.tblheader}</label>
                        </span> 
                    </div>)


                }else if(it.type == 'time'){
                    return (
                    <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                        <span className="p-float-label">
                            <InputText id={it.field} type="time" size={30} value={it.val} 
                            onChange={(e)=>{props.inpValue(e.target.value,it)}} tooltip={it.tooltip} 
                            tooltipOptions={{position: 'top'}}  disabled={it.disabled}
                            style={it.inpstyle}/>
                            <label htmlFor={it.field}>{it.tblheader}</label>
                        </span> 
                    </div>)


                }else if(it.type == 'date'){
                    return (
                    <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                        <span className="p-float-label">
                            <InputText id={it.field} type="date" size={30} value={it.val} 
                            onChange={(e)=>{props.inpValue(e.target.value,it)}} tooltip={it.tooltip} 
                            tooltipOptions={{position: 'top'}}  disabled={it.disabled}
                            style={it.inpstyle}/>
                            <label htmlFor={it.field}>{it.tblheader}</label>
                        </span> 
                    </div>)


                }else if(it.type == 'textarea'){
                    return (
                    <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                        <span className="p-float-label">
                            <InputTextarea id={it.field}  style = {{width:'233px',maxHeight:'50px'}} rows={3} value={it.val} 
                            onChange={(e) => {props.inpValue(e.target.value,it)}} tooltip={it.tooltip} tooltipOptions={{position: 'top'}} 
                            placeholder={it.tblheader} disabled={it.disabled} style={it.inpstyle} />
                            {/* <label htmlFor={it.field}>{it.tblheader}</label> */}
                        </span> 
                    </div>)
                    

                }else if(it.type == 'num'){
                    return (
                    <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                        <span className="p-float-label">
                            <InputNumber id={it.field}  size={30} value={it.val} onChange={(e) => {props.inpValue(e.target.value,it)}} 
                            tooltip={it.tooltip} tooltipOptions={{position: 'top'}} disabled={it.disabled} style={it.inpstyle} />
                            <label htmlFor={it.field}>{it.tblheader}</label>
                        </span> 
                    </div>)
                    

                }else if(it.type == 'list'){
                    return (
                        <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                              <span className="p-float-label">
                                <Dropdown id={it.field} value={it.val} style={{width:'233px'}} options={this.state.parcatlist} 
                                ariaLabel={it.tblheader} onChange={(e) => {props.inpValue(e.target.value,it)}} 
                                optionLabel="field" tooltip={it.tooltip} tooltipOptions={{position: 'top'}} placeholder={it.tblheader} 
                                disabled={it.disabled} style={it.inpstyle}/>
                                
                             </span>
                        </div>)

                  

                }else if(it.type == 'check'){
                    return (
                        <div className="p-col-12 p-md-6 p-lg-4" key={it.seq}>
                              <span className="p-float-label">
                              <Checkbox inputId={it.field} value={it.field} onChange = {(e) => {props.inpValue(!it.val,it)}} checked={it.val} 
                              tooltip={it.tooltip} tooltipOptions={{position: 'top'}} disabled={it.disabled}></Checkbox>
                                <label style={{marginLeft:'8px'}} htmlFor={it.field} className="check-label p-checkbox-label">{it.field}</label>
                             </span>
                        </div>)

                  

                }
            }
            
        })}
        
    </div>
    <div>
        {props.dataArr.map((it)=>{
            if(it.type == 'img' && it.formshow){
                return ( <Dropzone onDrop={(files) => props.fileUpload(files)} key={it.seq}>
     {({ getRootProps, getInputProps, acceptedFiles }) => (
         <section className="p-grid">
             <div className="p-col-12 p-md-6"style={styleDrag} {...getRootProps({ className: 'dropzone' })}>
                 <input {...getInputProps()} />
                 <p>Drag 'n' Drop category image here, or click to select files</p>
                 <p>Please Upload one Image</p>
             </div>
             <div className="p-col-12 p-md-6">
             <h4 style={{textAlign:'center'}}>Uploaded Files (required)</h4>
             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '100%' }}>
                 {it.val && <div style={{
                     padding: '10px',
                     backgroundColor: '#f9f9f9',
                     margin: '6px',
                     position: 'relative'
                 }}>
                     <i className="pi pi-times"
                     style={{
                         position: 'absolute',
                         top: '2px',
                         right: '4px',
                         fontSize: '20px'
                     }} onClick={(e) => {props.inpValue('',it)}} />
                     <img src={it.val}
                         style={{
                             width: '160px',
                             height: '160px',
                         }}
                     />
                 </div>
                 }
             </div>
             </div>
         </section>
     )}
 </Dropzone>)
 

             }
        })}

    </div>
     </>
    </Dialog>
     
 )
}
 