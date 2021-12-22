import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createAction, handleActions} from 'redux-actions';
import thunk from 'redux-thunk';
const appInitialState = {
  loading: false,
  prays: [],
  error: '',
};

const FETCH_PRAYS_REQUEST = 'FETCH_PRAYS_REQUEST';
const FETCH_PRAYS_SUCCESS = 'FETCH_PRAYS_SUCCESS';
const FETCH_PRAYS_FAILURE = 'FETCH_PRAYS_FAILURE';

export const fetchPraysRequest = createAction(FETCH_PRAYS_REQUEST);
export const fetchPraysSuccess = createAction(FETCH_PRAYS_SUCCESS);
export const fetchPraysFailure = createAction(FETCH_PRAYS_FAILURE);

const requestActionReducer = handleActions(
  {
    [FETCH_PRAYS_REQUEST]: (state, {payload}) => ({
      ...state,
      loading: true,
    }),
    [FETCH_PRAYS_SUCCESS]: (state, {payload}) => ({
      loading: false,
      prays: payload,
      error: '',
    }),
    [FETCH_PRAYS_FAILURE]: (state, {payload}) => ({
      loading: false,
      prays: [],
      error: payload,
    }),
  },
  appInitialState,
);
const rootReducer = combineReducers({
  requestActionReducer,
});

const configureStore = () => createStore(rootReducer, applyMiddleware(thunk));
export const store = configureStore();

// successActionReducer,
// failureActionReducer,
// export const fetchPraysRequest = () => {
//   return {
//     type: FETCH_PRAYS_REQUEST,
//   };
// };
// export const fetchPraysSuccess = users => {
//   return {
//     type: FETCH_PRAYS_SUCCESS,
//     payload: users,
//   };
// };
// export const fetchPraysFailure = error => {
//   return {
//     type: FETCH_PRAYS_FAILURE,
//     payload: error,
//   };
// };
// const reducer = (state = appInitialState, action) => {
//   switch (action.type) {
//     case FETCH_PRAYS_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };
//     case FETCH_PRAYS_SUCCESS:
//       return {
//         loading: false,
//         users: action.payload,
//         error: '',
//       };
//     case FETCH_PRAYS_FAILURE:
//       return {
//         loading: false,
//         users: [],
//         error: action.payload,
//       };
//   }
// };
