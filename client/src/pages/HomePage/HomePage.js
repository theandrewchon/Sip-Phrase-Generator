import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectDatabase } from '../../slices/databaseSlice';

const HomePage = () => {
	const database = useSelector(selectDatabase);
	return <div>Home Page</div>;
};

export default HomePage;
