import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import * as Sentry from '@sentry/react';

import reducers from './redux/reducers';
import sagas from './redux/sagas';
import Router from './router';
import * as serviceWorker from './serviceWorker';
// app styles
import './global.scss';

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
    dsn: 'https://4d4e0fc3fb8541b3876df6a995c083e1@sentry.eloquentbits.com/4',
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
serviceWorker.unregister();
export { store, history };
