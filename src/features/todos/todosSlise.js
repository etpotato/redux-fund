const initialState = [
  { id: 0, text: 'Learn React', completed: true },
  { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
  { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
];

const nextTodoId = (todos) => {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
  return maxId + 1;
};

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todo/todoAdded':
      return ([
          ...state,
          {
            id: nextTodoId(state),
            text: action.payload,
            completed: false,
          },
        ]);
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
