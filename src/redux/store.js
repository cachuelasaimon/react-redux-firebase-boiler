import { compose, createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import Reducers from './reducers'
import Sagas from './sagas'

//// Initial State ////
const initialState = {}

//// Middlewares ////
const sagaMiddleware = createSagaMiddleware()
const middleware = [thunk, sagaMiddleware]

/// Store variable ///
const store = createStore(
    Reducers,
    initialState,
    compose(
        applyMiddleware(...middleware)
    )
)

/// Saga listener (maybe) ///
sagaMiddleware.run(Sagas)

export default store