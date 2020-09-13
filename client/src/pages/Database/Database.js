import React from 'react';
import { useSelector } from 'react-redux';
import { selectDatabase } from '../../slices/databaseSlice';

const Database = () => {
	const database = useSelector(selectDatabase);
	return <div>Database</div>;
};

export default Database;
