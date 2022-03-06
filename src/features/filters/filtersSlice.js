const initialState = {
  status: 'All',
  colors: []
};

export default function filtersReducer (state = initialState, action) {
  switch (action.type) {
    case 'filters/statusFilterChanged':
      return ({
        ...state,
        status: action.payload,
      });
    case 'filters/colorFilterChanged':
      return ({
        ...state,
        colors: action.payload.changeType === 'added'
          ? [...state.colors, action.payload.color]
          : state.colors.filter((color) => color !== action.payload.color),
      });
    default:
      return state;
  }
}
