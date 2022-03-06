import { combineReducers } from 'redux';

import todosReducer from './features/todos/todosSlise';
import filtersReducer from './features/filters/filtersSlice';

const rootReducer = combineReducers({
  todos: todosReducer,
  filters: filtersReducer,
});

export default rootReducer;
