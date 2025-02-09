import { combineReducers } from 'redux';
import restaurantReducer from './counterReducer';

const rootReducer = combineReducers({
  counter: restaurantReducer,
});

export default rootReducer;