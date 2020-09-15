import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../lib/API';

export const fetchDatabase = createAsyncThunk(
	'database/fetchDatabase',
	async () => {
		const { data } = await API.getAllSentences();
		return data;
	}
);

export const databaseSlice = createSlice({
	name: 'database',
	initialState: { data: [], status: 'idle', error: null },

	extraReducers: {
		[fetchDatabase.pending]: (state) => {
			state.status = 'loading';
		},
		[fetchDatabase.fulfilled]: (state, action) => {
			state.status = 'succeeded';
			state.data = [...action.payload];
		},
		[fetchDatabase.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
	},
});

export const selectDatabase = (state) => state.database.data;

export default databaseSlice.reducer;
