import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

//#region Redux
  // Import Create Store
  import { createStore} from 'redux'
  // Import Provider
  import { Provider } from 'react-redux'
  // Import Combined Reducers
  import allReducers from './reducer'

  // make variable for createStore
  const globalState = createStore(allReducers)

  // subscribe variabel global state for console.log each time we call the react
  globalState.subscribe(() => {
    console.log("Global State : ", globalState.getState())
  })
//#endregion


ReactDOM.render(
  <Provider store={globalState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
