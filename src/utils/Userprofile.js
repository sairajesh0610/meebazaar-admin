
class userProfile {

    static userobj = {};
    static navobj = {};
    static orderItObj = {};
    static ordprinObj = {}

    static setOrderItObj(inpobj){
        this.orderItObj = inpobj;
       window.localStorage.setItem('orddata', JSON.stringify(inpobj));
    }

    static getOrderItObj(){
        let orderItObj =  window.localStorage.getItem('orddata');
        if(orderItObj){
            orderItObj = JSON.parse(orderItObj)
        }
        this.orderItObj = orderItObj
        console.log(this.orderItObj)
        return this.orderItObj
        
    }
    static setordprintObj(inpobj){
        this.ordprinObj = inpobj;
       window.localStorage.setItem('printdata', JSON.stringify(inpobj));
    }

    static getOrdprintItObj(){
        let ordprinObj =  window.localStorage.getItem('printdata');
        if(ordprinObj){
            ordprinObj = JSON.parse(ordprinObj)
        }
        this.ordprinObj = ordprinObj
        return this.ordprinObj
    }

    static setUserObj(inpobj){
        this.userobj = inpobj;
        window.localStorage.setItem('sessdata', JSON.stringify(inpobj));
    }

    static getUserObj(){
        if(this.userobj && this.userobj.empid){
            return this.userobj;
        }else {
            let userobj = window.localStorage.getItem('sessdata');
            if(userobj){
                userobj = JSON.parse(userobj)
            }
            this.userobj = userobj || null;
            return userobj;
        }
    }

    // static setnavObj(inpobj){
    //     this.navobj = inpobj;
    //     window.localStorage.setItem('Screenbar', JSON.stringify(inpobj));
    // }

    // static getnavObj(){
    //     if(this.navobj && this.navobj.empid){
    //         return this.navobj;
    //     }else {
    //         let navobj = window.localStorage.getItem('Screenbar');
    //         if(navobj){
    //             navobj = JSON.parse(navobj)
    //         }
    //         this.navobj = navobj || null;
    //         return navobj;
    //     }
    // }

     static getScrIcon (locPath){
        let navItems = this.userobj.roleoptions
      
             
            for(let i=0; i<navItems.length;i++){
                 
                if(navItems[i].items && navItems[i].items.length > 0){
                  
                  for (let j=0;j<navItems[i].items.length;j++){
                   
                   if (locPath == navItems[i].items[j].navpath) {
                     return navItems[i].items[j]['icon'];
                     
                   }
                   
                  }
                  
                }else {
                 if(navItems[i]['navpath'] == locPath)
                 return navItems[i]['icon'];
                 
                }
             }
    
    }

}

export default userProfile;