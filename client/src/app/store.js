import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import databaseReducer from '../slices/databaseSlice';

export default configureStore({
	reducer: {
		counter: counterReducer,
		database: databaseReducer,
	},
});
