import {REQ_FIELDS} from './Constants';
import userProfile from './Userprofile';


export function checkreq(inpObj){
    let missingFlds=[];
    for(let i=0; i<inpObj.length; i++){
        if(inpObj[i]['val'].length ==0){
            missingFlds.push(inpObj[i]['field'])
        }
    }
    return missingFlds;
}

export function createNavItems(inpArr){
    if(!inpArr) return;
    if(inpArr.length==0) return; 
    
    let navItems = [];
    for(let i=0;i<inpArr.length;i++){
        switch (inpArr[i]['navpath']){
            case '/dashboard':
            case '/screenlist':
            case '/ordlist':
            case '/categories':
            case '/custlist':
            case '/poslist':
            case '/reports': 
            case '/franchiselist':
            case '/orgobjects':
            case '/tempscreen':
            case '/articles':
            case '/roles':
            case '/storecats':
            case '/storeproducts':
            case '/bensubscribers':
            case '/sampleeditor':
            case '/orglist':
            case '/employee':
            case '/apphome' : {
                navItems.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],
                addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
                break;
            }
            case '/productlist':
            case '/productitems':
            case '/deals':
            case '/lowstock' : {
                let isProd = false;
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Products') {
                        isProd = true; break;
                    }
                }
                if(!isProd){
                    navItems.push({label:'Products',icon:'pi pi-fw pi-bars',items:[]});
                }
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Products') {
                        navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
                        break;
                    }
                }
                break;
                
                
            }
            case '/locationlist':
            case '/maincats' : {
                let isProd = false;
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Locations') {
                        isProd = true; break;
                    }
                }
                if(!isProd){
                    navItems.push({label:'Locations',icon:'pi pi-fw pi-bars',items:[]});
                }
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Locations') {
                        navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
                        break;
                    }
                }
                break;
                
                
            }
            case '/benlocations':
            case '/benemployee':
            case '/benroles' : {
                let isProd = false;
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Organization') {
                        isProd = true; break;
                    }
                }
                if(!isProd){
                    navItems.push({label:'Organization',icon:'pi pi-fw pi-bars',items:[]});
                }
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Organization') {
                        navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
                        break;
                    }
                }
                break;
                
                
            }
            case '/agencylist':
            case '/cashtns':
            case '/agencytxns': {
                let isProd = false;
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Agency') {
                        isProd = true; break;
                    }
                }
                if(!isProd){
                    navItems.push({label:'Agency',icon:'pi pi-fw pi-bars',items:[]});
                }
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Agency') {
                        navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
                        break;
                    }
                }
                break;
            }

            case '/terms':
            case '/importdata':
            case '/exportdata':
            case '/covid':
            case '/faqs':
            case '/aboutus':
            case '/ppolicy':
            case '/bannerlist':
            case '/slotlist':
            case '/tags':
            case '/feedback':
            case '/promolist':
            case '/alerts':
            case '/volunteer':
            case '/smartbannerlist':
            case '/hsncode' : {
                let isProd = false;
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Settings') {
                        isProd = true; break;
                    }
                }
                if(!isProd){
                    navItems.push({label:'Settings',icon:'pi pi-fw pi-bars',items:[]});
                }
                for(let j=0;j<navItems.length;j++){
                    if(navItems[j].label == 'Settings') {
                        navItems[j].items.push({label:inpArr[i]['scrname'],icon:inpArr[i]['scricon'],navpath:inpArr[i]['navpath'],addopt:inpArr[i]['addopt'],editopt:inpArr[i]['editopt'],delopt:inpArr[i]['delopt'],expopt:inpArr[i]['expopt']});
                        break;
                    }
                }
                break;
                
                
            }
            default:break;

        }

    } // end for
    return navItems;

} // end function




export function convertLangAttr(inpobj,langArr){
    let objFields = ['name','descpt'];
    let langAttr = {};

    for(let i=0;i<langArr.length;i++){
         langAttr[langArr[i]] = {};
            let langStr = langArr[i].toLowerCase().substr(0,3); 
        for(let j=0;j<objFields.length;j++){
            let langkey = langStr+'-'+objFields[j]
            langAttr[langArr[i]][objFields[j]] = inpobj[langkey]
        }


    }
    inpobj.langattr = langAttr;
    return inpobj;

}



export function checkreqold(valArr,inpObj){
    let missingFlds='';
    for(let i=0; i<valArr.length; i++){
        if(!inpObj[valArr[i]]){
            missingFlds+=valArr[i]["0"].toUpperCase()+valArr[i].slice(1)+',';
        }
    }
    if(missingFlds){
        return missingFlds.substr(0,missingFlds.length-1);
    }else{
        return missingFlds;
    }
}

export function convertampm(inpstr){
    
    let isAMPM = '';
    let hour = '';
    let min = '';
    let inpArr = inpstr.split(":");
    min = inpArr[1];
    if(parseInt(inpArr[0]) > 12)
    { isAMPM = 'PM';
    }else {
    isAMPM = 'AM';
    }
    hour = inpArr[0]%12 || 12;
    return `${hour}:${min} ${isAMPM}`;
}

export function  checkReqLangs(inpobj,inparr,fldname){
   
    let langAttr = userProfile.getUserObj().orglang;
    let langArr = langAttr.split(',');
    let fieldsMissing='';
    
    for(let i=0;i<langArr.length;i++){
        for(let j=0;j<inparr.length;j++){
                      if(!inpobj[inparr[j]][langArr[i]]){
                        fieldsMissing+= (!fieldsMissing) ? langArr[i]+[inparr[j]]:','+langArr[i] + [inparr[j]]
        }
    }
    }
    return fieldsMissing;

}

export function  checkReqLang(inpobj,inparr,fldname){
    let langAttr = userProfile.getUserObj().orglang;
    let langArr = langAttr.split(',');
    let fieldsMissing='';
    
    for(let i=0;i<langArr.length;i++){
        for(let j=0;j<inparr.length;j++){
                      if(!inpobj[fldname][langArr[i]][inparr[j]]){
                        fieldsMissing+= (!fieldsMissing) ? langArr[i] + inparr[j]:','+langArr[i] + inparr[j]
                      }
        }
    }
    return fieldsMissing;

}



 