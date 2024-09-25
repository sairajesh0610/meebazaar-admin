import axios from 'axios';
import {API_URL,MOBILE_API_URL} from  './Constants';
import userProfile from './Userprofile';

function buildDataRequest(inpobj) {
    let userObj = userProfile.getUserObj();
    let isorgid = false,isempid = false;
    var reqData = '';
    inpobj.orgid = userObj && userObj.orgid ? userObj.orgid : '';
    inpobj.empid = userObj&& userObj.empid ? userObj.empid : '';
    inpobj.langpref = 'English';
    for (var prop in inpobj) {
        reqData = reqData + '&' + prop + "=" + inpobj[prop];
    }
       

    return reqData.substr(1);
}

function getHeaders(){
    return  { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
}

function getSecureHeaders(methodName){
    let userObj = userProfile.getUserObj();
    let returnObj = {}
    switch(methodName){
        case 'emplogin':
        case 'checksess':{
            returnObj = {'Content-Type': 'application/x-www-form-urlencoded'};
            break;
        }
        
        default: {
            returnObj = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'sessid' : userObj.sessid,
               
            };
        }
        
    }
    return returnObj
    
}




export default function callsvc(inpobj,methodName,secure=true){
    
    axios.defaults.headers = getSecureHeaders(methodName) 
    return new Promise((resolve,reject)=>{
        axios({
            method: 'post',
            url: API_URL+methodName,
            data: buildDataRequest(inpobj)
            //config: headers
        }).then((res)=>resolve(res.data))
            .catch((err)=>reject(err))
    })
}

export  function callmobilesvc(inpobj,methodName,secure=false){
    let headers = (secure) ?  getSecureHeaders() : getHeaders();

    return new Promise((resolve,reject)=>{
        axios({
            method: 'post',
            url: MOBILE_API_URL+methodName,
            data: buildDataRequest(inpobj),
            config: headers
        }).then((res)=>resolve(res.data))
            .catch((err)=>reject(err))
    })
}

function getUploadHeaders(){
    return  { headers: {'Content-Type': 'multipart/form-data' }}
}

export function callsvcforupload(data,methodName,secure=false){
    let headers = getUploadHeaders();

    return new Promise((resolve,reject)=>{
        axios({
            method: 'post',
            url: API_URL+methodName,
            data: data,
            config: headers
        }).then((res)=>resolve(res.data))
            .catch((err)=>reject(err))
    })
}