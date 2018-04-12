import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
//import { createStore, applyMiddleware } from 'redux';
//import thunkMiddleware from 'redux-thunk';
//import * as createLogger from 'redux-logger';
//import asyncAwait from 'redux-async-await';
import { ft } from '../../comm/ajax';
import apipath from '../../comm/api';
import { callLoadMenu } from './actions';
import MasterLayout from './Masterlayout';
//import Reducers from './store';

export function AddMasterMenu(ContextObject, store, menu_id = 0) {
    //const store = createStore(Reducers, applyMiddleware(thunkMiddleware, asyncAwait));
    ft<ReturnData<server.Menu[]>>(apipath.GET__api_Menu_GetByLogin, { menu_id: menu_id }).then((data) => {
        var dom = document.getElementById('page_content');
        render(<Provider store={store}>
            <MasterLayout>
                <ContextObject />
            </MasterLayout>
        </Provider>, dom);
        store.dispatch(callLoadMenu(data.data));
    })
}