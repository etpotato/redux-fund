import { client } from '../../api/client';

const initialState = [];

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todosLoaded':
      return action.payload;
    case 'todos/todoAdded':
      return [
          ...state,
          action.payload,
        ];
    case 'todos/todoDeleted':
      return state.filter((todo) => todo.id !== action.payload);
    case 'todos/todoToggled':
      return state.map((todo) => {
          if (todo.id === action.payload) return { ...todo, completed: !todo.completed};
          return todo;
      });
    case 'todos/todoChangedColor':
      return state.map((todo) => {
        if (todo.id === action.payload.id) return { ...todo, color: action.payload.color };
        return todo;
      });
    case 'todos/completedAll':
      return state.map((todo) => ({...todo, completed: true}));
    case 'todos/removedCompleted':
      return state.filter((todo) => !todo.completed);
    default:
      return state;
  }
};

export async function fetchTodos(dispatch, getState) {
  console.log(getState())
  const res = await client.get('/fakeApi/todos');
  dispatch({type: 'todos/todosLoaded', payload: res.todos});
  console.log(getState())
};

export function saveNewTodo(text) {
  const initialTodo = { text }
  return async function saveNewTodoThunk(dispatch, getState) {
    const res = await client.post('/fakeApi/todos', {
      todo: initialTodo,
    })
    dispatch({type: 'todos/todoAdded', payload: res.todo})
  }
}
