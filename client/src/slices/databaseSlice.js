import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../util/API';

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
	reducers: {},
	extraReducers: {
		[fetchDatabase.pending]: (state) => {
			state.status = 'loading';
		},
		[fetchDatabase.fulfilled]: (state, action) => {
			state.status = 'succeeded';
			state.data.push(action.payload);
		},
		[fetchDatabase.rejected]: (state, action) => {
			state.status = 'failed';
			state.error = action.error.message;
		},
	},
});

export const {} = databaseSlice.actions;

export const selectDatabase = (state) => state.database.data;

export default databaseSlice.reducer;
