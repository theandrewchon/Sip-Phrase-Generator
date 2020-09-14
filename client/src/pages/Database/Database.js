import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../../lib/util'
import { selectDatabase } from '../../slices/databaseSlice';
import { Button, Link, Text, Textarea } from '@chakra-ui/core'

const Database = () => {
	const [input, setInput] = useState()
	const database = useSelector(selectDatabase);

	const handleSubmit = () => {
		alert('hi')
	}
	return <div>
		<header>
			<Text fontSize='3xl'>Multiple New Entries:</Text>
			<Text>
				Can use this to convert CSV to JSON{' '}
				<Link color="blue.400" target="_blank" href="https://csvjson.com/csv2json">
					https://csvjson.com/csv2json
			</Link>
			</Text>
			<Text>Make sure the keys are "english" and "korean"!!</Text>
		</header>
		<Textarea
			size='sm'
			onChange={(e) => { setInput(e.target.value) }}
			placeholder="Make sure entries are valid JSONs"
			value={input} />
		<Button color="blue.500" my={3} onClick={handleSubmit}>
			Submit New Entries
			</Button>
	</div>;
};

export default Database;
