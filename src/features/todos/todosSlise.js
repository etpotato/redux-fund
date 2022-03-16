import { createSelector } from 'reselect';
import { client } from '../../api/client';
import {StatusFilters} from '../filters/filtersSlice';

const initialState = {
  status: 'idle',
  entities: [],
};

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todosLoading':
      return {
        ...state,
        status: 'loading',
      };
    case 'todos/todosLoaded':
      return {
        ...state,
        status: 'idle',
        entities: [...state.entities, ...action.payload]
      };
    case 'todos/todoAdded':
      return {
        ...state,
        entities: [...state.entities, action.payload],
      };
    case 'todos/todoDeleted':
      return {
        ...state,
        entities: state.entities.filter((todo) => todo.id !== action.payload),
      };
    case 'todos/todoToggled':
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id === action.payload) return { ...todo, completed: !todo.completed};
          return todo;
        }),
      };
    case 'todos/todoChangedColor':
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id === action.payload.id) return { ...todo, color: action.payload.color };
          return todo;
        }),
      };
    case 'todos/completedAll':
      return {
        ...state,
        entities: state.entities.map((todo) => ({...todo, completed: true})),
      };
    case 'todos/removedCompleted':
      return {
        ...state,
        entities: state.entities.filter((todo) => !todo.completed),
      };
    default:
      return state;
  }
};

export const todosLoaded = (todos) => ({type: 'todos/todosLoaded', payload: todos});

export const todosLoading = () => ({type: 'todos/todosLoading'});

export const fetchTodos = () => async (dispatch) => {
  dispatch(todosLoading());
  const res = await client.get('/fakeApi/todos');
  dispatch(todosLoaded(res.todos));
}

export const todoAdded = (todo) => ({type: 'todos/todoAdded', payload: todo})

export function saveNewTodo(text) {
  const initialTodo = { text }
  return async function saveNewTodoThunk(dispatch, getState) {
    const res = await client.post('/fakeApi/todos', {
      todo: initialTodo,
    })
    dispatch(todoAdded(res.todo));
  }
}

export const selectTodos = (state) => state.todos.entities;

export const selectTodoById = (todos, todoId) => todos.find((todo) => todo.id === todoId);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state) => state.filters,
  (todos, filters) => {
    const {status, colors} = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) return todos;

    const showOnlyCompleted = status === StatusFilters.Completed;
    return todos.filter((todo) => {
      const completeCheck = showAllCompletions || todo.completed === showOnlyCompleted;
      const colorCheck = colors.length === 0 || colors.includes(todo.color);
      return completeCheck && colorCheck;
    });
  }
);

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  filteredTodos => filteredTodos.map(todo => todo.id)
);
