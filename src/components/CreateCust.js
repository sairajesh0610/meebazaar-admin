import React,{useState} from 'react';
import {Card} from 'primereact/react';
import { InputText } from 'primereact/inputtext';
import {Button} from 'primereact/button';
import callsvc from "../utils/Services";

export default function CreateCust(){
    const [fstname,setName] = useState('');
    const [accid,setAccId] = useState('');
    const [addr1,setAddr1] = useState('');
    const [addr2,setAddr2] = useState('');
    const [city,setCity] = useState('');
    const [state,setState] = useState('');
    const [zipcode,setZip] = useState('');
    const [locid,setLocid] = useState('');
    const [loclist,setLocList] = useState('');
    const [lat,setLat] = useState('');
    const [lon,setLon] = useState('');

    return(
    <Card>
        <span className="p-float-label">
         <InputText id={'fstname'} type="text" size={40} value={fstname} onChange={(e)=>{setName({fstname:e.target.value})}} />
         <label htmlFor={'fstname'}>Customer Name</label>
        </span> 

        <span className="p-float-label">
         <InputText id={'accid'} type="text" size={40} value={accid} onChange={(e)=>{setAccId({accid:e.target.value})}} />
         <label htmlFor={'accid'}>Customer Name</label>
        </span> 


    </Card>)
} 