import { combineReducers } from 'redux';
import userReducer from './userReducer';
import {historyReducer} from './historyReducer'

const allReducers = combineReducers ({
    user: userReducer,
    history: historyReducer
})

export default allReducers