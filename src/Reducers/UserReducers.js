
import * as ActionTypes from './Types';
import {createReducer} from '../utils/CreateReducer';

export const userProfile = createReducer({}, {
    [ActionTypes.ADD_USER]: (state, action) => {
      return action.user;
    }
})

export const productList = createReducer([], {
    [ActionTypes.ADD_USER]: (state, action) => {
        return state;
    }
})

export const catList = createReducer([],{
    [ActionTypes.ADD_CATLIST]:(state,action)=>{
        return state;
    }
})

export const addOrg = createReducer([],{
    [ActionTypes.ADD_ORG]:(state,action)=>{
        return state;
    }
})

export const updateOrg = createReducer([],{
    [ActionTypes.UPDATE_ORG]:(state,action)=>{
        return state;
    }
})

export const empList = createReducer([],{
    [ActionTypes.ADD_EMPLIST]:(state,action)=>{
        return state;
    }
})

export const addCat = createReducer([],{
    [ActionTypes.ADD_CAT]:(state,action)=>{
        return state;
    }
})
export const addProduct = createReducer([],{
    [ActionTypes.ADD_PRD]:(state,action)=>{
        return state;
    }
})

export const updateCat = createReducer([],{
    [ActionTypes.UPDATE_CAT]:(state,action)=>{
        return state;
    }
})

export const updateProduct = createReducer([],{
    [ActionTypes.UPDATE_PRODUCT]:(state,action)=>{
        return state;
    }
})