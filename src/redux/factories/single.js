export default function single({ types }) {
    const [requestType, successType, failureType] = types;
    return reducer => {
      const initialState = {
        ...reducer(undefined, {}),
      };

      return (state = initialState, action = {}) => {
        switch (action.type) {
          case requestType:
            return {
              ...state,
              isLoading: true,
            };
          case successType:
            return {
              ...action.payload,
              isLoading: false,
            };
          case failureType:
            return {
              ...state,
              isLoading: false,
            };
          default:
            return reducer(state, action);
        }
      };
    };
  }
