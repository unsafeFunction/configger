import { useReducer } from 'react';

function useCustomFilters(initialState) {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'setValue':
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        };
      case 'reset':
        return {
          ...state,
          ...initialState,
        };
      default:
        throw new Error();
    }
  };

  const [filtersState, filtersDispatch] = useReducer(reducer, initialState);

  const isEmpty = Object.values(filtersState).every(
    (x) => x === null || x === '' || x?.length === 0,
  );

  return [filtersState, filtersDispatch, isEmpty];
}

export default useCustomFilters;
