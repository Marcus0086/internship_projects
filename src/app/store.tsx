import { createStore } from 'redux';
import dataReducer from '../components/reducers/dataReducer'

const store = createStore(dataReducer)
export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch