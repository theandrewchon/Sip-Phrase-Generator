import { configureStore } from '@reduxjs/toolkit';
import databaseReducer from '../slices/databaseSlice';

export default configureStore({
	reducer: {
		database: databaseReducer,
	},
});
