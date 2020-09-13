import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './Routes.css';
import HomePage from '../../pages/HomePage';
import Database from '../../pages/Database';
import { useSelector } from 'react-redux';
import { Spinner } from '@chakra-ui/core';

const Routes = () => {
	const databaseStatus = useSelector((state) => state.database.status);

	if (databaseStatus === 'loading') {
		return (
			<div className="loadingSpinner">
				<Spinner size="xl" />
			</div>
		);
	}
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
