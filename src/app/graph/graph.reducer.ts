import { HttpClient } from '@angular/common/http';


const initialState = {
graph :[],
avg_elv:0
}
export function graphReducer(state = initialState, action : any){

switch(action.type){
case "LOADING_GRAPH" : {
return {
    ...state,
    graph : action.payload
};
}


default : { return state; }

}
    
}