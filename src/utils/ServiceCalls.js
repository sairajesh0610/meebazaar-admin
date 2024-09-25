import callsvc,{callsvcforupload} from './Services';
import {ADMIN_ERROR} from './Constants';
import { Column } from 'primereact/column';
import React from 'react'

export function getObjData(inpobj,setData,growl,svcname='getobjdata'){

    callsvc(inpobj,svcname)
        .then((res)=>{
              console.log("res",res);
             if(res.code == '999' || res.code == '9991' ){
                setData({
                    data:(res.code == '999')? res.data:[],
                    selectedRow:(res.code == '999') ? res.data[0]:{},
                    showSpinner:false});
               
             }else{
                console.log(res.code)
                setData({data:[],selectedRow:{},showSpinner:false});
                growl.show({severity: 'warn', summary: 'Error', detail:res.message,life:6000});
             }
        })
        .catch((err)=>{
            console.log(err);
            setData({data:[],selectedRow:{},showSpinner:false});
            
            growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
        })
        .finally(()=>{
            
        });

}



export function getObjFlds(inpobj,setData,growl,customBody,svcname='getobjflds'){
    callsvc(inpobj,svcname)
    .then((res)=>{ 
        
        if(res.code == '999'){
        let dynamicColumns = [];
        let exportFldArr = []; 
        let idfld
        for(let i = 0; i<res.fldlist.length;i++){
             let col = res.fldlist[i];
            if(col.tableshow){
                
                let a = (col.type == 'check' || col.type == 'img')  ? 
                <Column  style={col.style} key={col.field} field={col.field} header={col.tblheader} sortable={col.sortable} body={customBody}  /> 
                : (col.type == 'date') ? <Column  style={col.style} key={col.field} field={col.field} header={col.tblheader} sortable={col.sortable} />:
                <Column  style={col.style} key={col.field} field={col.field} header={col.tblheader} sortable={col.sortable} />;
                dynamicColumns.push(a);
            }
            if(col.export){
                exportFldArr.push({ value: col.field, header: col.tblheader,type:col.type })
            }

            if(col.spl == 'IDGEN'){
                idfld = col['field'];
             }
        }

        
          setData({dynamicColumns:dynamicColumns,fldArr:res.fldlist,exportFldArr:exportFldArr,idfld:idfld})
    } else {
        growl.show({severity: 'warn', summary: 'Code Error', detail: res.message,life:6000});
    }
    })
    .catch((err)=>{
        console.log(err)
        growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
    })
    .finally(()=>{});

}


export function uploadImg(event,opArr,setData,growl){
    const data = new FormData();
    //console.log(event[0]['size'])
    if(event[0]['size']>40960){
        growl.show({severity: 'warn', summary: 'Unable to Upload', detail: 'File size is greater than 40KB, please compress the image or contact your administrator',life:6000});
        return
    }
        data.append('file', event[0]);
        callsvcforupload(data, 'fileupload', false)
            .then((res) => {
                if(!res.error){
                let a = opArr.map((it)=>{
                    if(it.field == 'image'){
                        it.val = res.imgurl
                        return it;
                    }else {return it}
                })
                setData({opArr:a});
            }else {
                growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
            }
               
            })
            .catch((err) => {
                console.log(err)
                growl.show({severity: 'warn', summary: 'Code Error', detail: ADMIN_ERROR,life:6000});
            })
            .finally(() => {})

}

export function saveDataRow(inpobj,data,setData,growl,idfld,svcName='insobjdata'){
    setData({showSpinner:true});
    let selectedRow;
    callsvc(inpobj,svcName)
        .then((res)=>{
            if(res.code == '999'){
                Object.keys(res.datarow).map((it)=>{
                    //console.log(it);
                    if(res.datarow[it] === 'true'){
                        res.datarow[it] = true;
                    }else if(res.datarow[it] === 'false'){
                        res.datarow[it] = false;
                    }
                })
                
                if(inpobj[idfld]){
                    for(let i=0;i<data.length;i++){

                        if(data[i][idfld] == res.datarow[idfld]){
                            data.splice(i,1,res.datarow);
                            selectedRow = data[i];
                            
                            break;
                        }
                    }
                    // edit
                }else {
                    // insert
                    data.splice(0,0,res.datarow);
                    selectedRow = data[0];
                }
                setData({showSpinner:false,data:data,selectedRow:selectedRow,editDialog:false});
            }else{
                setData({editDialog:false,showSpinner:false});
                growl.show({severity: 'warn', summary: 'Admin Error', detail: res.message,life:6000});
            }
        })
        .catch((err)=>{
            setData({editDialog:false,showSpinner:false});
            growl.show({severity: 'warn', summary: 'Admin Error', detail: ADMIN_ERROR,life:6000});
        })
       
        
}

export function checkReq(opArr,insobj,setData){
    let isFldMissing=false;
    let opArr1 = opArr.map((it)=>{
        if(insobj[it.field]){
            it.val = insobj[it.field];
        }
        if(it.req && it.val.length == 0){
            isFldMissing = (isFldMissing) ? `${isFldMissing}, ${it.tblheader}`: it.tblheader;
            it.inpstyle = {border:'1px solid red'}
        }else{
            it.inpstyle = {border:'1px solid #a6a6a6'}
        }
        return it;
    })
    if(isFldMissing) setData({opArr:opArr1});
    return isFldMissing;

}

export function checkReqForObj(objToCheck,reqArr){
    let isFldMissing= '';
    console.log(objToCheck)
    reqArr.map((it)=>{

        if(!objToCheck[it]){
        
            isFldMissing = isFldMissing+ objToCheck[it];
            console.log("it", objToCheck[it])
        }
       
        
    })
    
    return isFldMissing;

}



export function setScrOptions(roleoptions,pathname, setData){
    let scrOptions = {}
    for(let i=0;i < roleoptions.length;i++){
        if(roleoptions[i].items && roleoptions[i].items.length > 0){
            for(let j=0;j<roleoptions[i].items.length;j++){
                if(roleoptions[i]['items'][j]['navpath'] == pathname ){
                    scrOptions.name = roleoptions[i]['items'][j].label;
                    scrOptions.icon = roleoptions[i]['items'][j].icon;
                    scrOptions.addopt = roleoptions[i]['items'][j].addopt;
                    scrOptions.delopt = roleoptions[i]['items'][j].delopt;
                    scrOptions.editopt = roleoptions[i]['items'][j].editopt;
                    scrOptions.expopt = roleoptions[i]['items'][j].expopt;
                    setData({scrOptions:scrOptions}); return;
                    
                }
            }
        }
        if(roleoptions[i].navpath == pathname ){
            scrOptions.name = roleoptions[i].label;
            scrOptions.icon = roleoptions[i].icon;
            scrOptions.addopt = roleoptions[i].addopt;
            scrOptions.delopt = roleoptions[i].delopt;
            scrOptions.editopt = roleoptions[i].editopt;
            scrOptions.expopt = roleoptions[i].expopt;
            setData({scrOptions:scrOptions}); return;
            
        }
    }
    
    
}

export function delDataRow(inpobj,data,idfld,setData,growl,svcname){
    let selectedRow;
    callsvc(inpobj,svcname)
    .then((res)=>{
        if(res.code == '999'){
            growl.show({severity: 'warn', summary: 'Delete Record', detail: 'Record deleted succesfully!',life:6000});
            
            for(let i=0;i<data.length;i++){
                if(data[i][idfld] == inpobj[idfld]){
                    data.splice(i,1);
                    if(data.length > 0){
                        selectedRow = data[i];
                    }
                    break;
                }
            }
            
            setData({deleteDialog:false,data:data,selectedRow:selectedRow});
            //this.getOrgList();
        }else{
            growl.show({severity: 'warn', summary: 'Error', detail: ADMIN_ERROR,life:6000});
            setData({deleteDialog:false});
        }
    })
    .catch((err)=>{
        console.log(err);
        growl.show({severity: 'warn', summary: 'Error', detail: ADMIN_ERROR,life:6000});
        setData({deleteDialog:false});
        
    })
    .finally(()=>{})

}

