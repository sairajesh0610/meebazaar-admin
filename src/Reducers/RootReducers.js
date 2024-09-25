//import * as userReducers from './UserReducers';
import {userProfile,productList,catList,addOrg,
    updateOrg,empList,addCat,updateCat,
    addProduct,updateProduct} from "./UserReducers";
import {combineReducers} from 'redux';

//console.log()
export const rootReducer = combineReducers({
    userProfile,
    productList,
    catList,
    addOrg,
    empList,
    addCat,
    updateOrg,
    updateCat,
    addProduct,
    updateProduct
})