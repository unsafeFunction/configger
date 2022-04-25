import * as Sentry from '@sentry/react';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import moment from 'moment-timezone';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// eslint-disable-next-line import/no-extraneous-dependencies
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import labConfig from 'utils/labConfig';
// app styles
import './global.scss';
import reducers from './redux/reducers';
import sagas from './redux/sagas';
import Router from './router';
import * as serviceWorker from './serviceWorker';

moment.tz.setDefault(labConfig[process.env.REACT_APP_LAB_ID].timezone);

// middlewared
const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [sagaMiddleware, routeMiddleware];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}
const store = createStore(
  reducers(history),
  composeWithDevTools(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(sagas);

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://5fe6afa6c0b34747ae480c508935c33b@sentry.mirimus.com/14',
    environment: process.env.NODE_ENV,
  });
}

ReactDOM.render(
  <Sentry.ErrorBoundary fallback="An error has occurred">
    <Provider store={store}>
      <Router history={history} />
    </Provider>
  </Sentry.ErrorBoundary>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
export { store, history };
