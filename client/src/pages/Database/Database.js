import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../../lib/util'
import { selectDatabase } from '../../slices/databaseSlice';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	Link,
	Text,
	Textarea,
} from '@chakra-ui/core'

const Database = () => {
	const [input, setInput] = useState()
	const [isConfirmOpen, setIsConfirmOpen] = useState();
	const cancelRef = React.useRef();


	const database = useSelector(selectDatabase);

	const onConfirmClose = () => setIsConfirmOpen(false);


	const handleSubmit = () => {
		alert('submitted')
		setIsConfirmOpen(false)
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
		<Button color="blue.500" my={3} onClick={() => setIsConfirmOpen(true)}>
			Submit New Entries
			</Button>

		<AlertDialog
			isOpen={isConfirmOpen}
			leastDestructiveRef={cancelRef}
			onClose={onConfirmClose}
		>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader fontSize="lg" fontWeight="bold">
					Delete Customer
			</AlertDialogHeader>

				<AlertDialogBody>
					Are you sure? You can't undo this action afterwards.
			</AlertDialogBody>

				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={onConfirmClose}>
						Cancel
				</Button>
					<Button variantColor="green" onClick={handleSubmit} ml={3}>
						Submit
				</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div >;
};

export default Database;
