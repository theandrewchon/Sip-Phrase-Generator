import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<CSSReset />
				<App />
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
