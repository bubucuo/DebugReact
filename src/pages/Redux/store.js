import {createStore} from 'redux'
import reducers from './reducer'

const store = createStore(reducers)

export default store
