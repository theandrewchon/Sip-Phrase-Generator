import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './Routes.css';
import HomePage from '../../pages/HomePage';
import Database from '../../pages/Database';

const Routes = () => {
	return (
		<section className="container">
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/database" component={Database} />
			</Switch>
		</section>
	);
};

export default Routes;
