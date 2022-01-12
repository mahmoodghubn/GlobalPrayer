import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createAction, handleActions} from 'redux-actions';
import thunk from 'redux-thunk';
const appInitialState = {
  loading: true,
  prays: {},
  error: '',
};

const FETCH_PRAYS_REQUEST = 'FETCH_PRAYS_REQUEST';
const FETCH_PRAYS_SUCCESS = 'FETCH_PRAYS_SUCCESS';
const FETCH_PRAYS_FAILURE = 'FETCH_PRAYS_FAILURE';

export const fetchPraysRequest = createAction(FETCH_PRAYS_REQUEST);
export const fetchPraysSuccess = createAction(FETCH_PRAYS_SUCCESS);
export const fetchPraysFailure = createAction(FETCH_PRAYS_FAILURE);

const actionReducer = handleActions(
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
      prays: {},
      error: payload,
    }),
  },
  appInitialState,
);
// const rootReducer = combineReducers({
//   actionReducer,
// });

const configureStore = () => createStore(actionReducer, applyMiddleware(thunk));
export const store = configureStore();
