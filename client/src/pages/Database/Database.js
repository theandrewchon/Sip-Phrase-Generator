import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import API from '../../lib/API'
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
	useToast,
} from '@chakra-ui/core'

const Database = () => {
	const [input, setInput] = useState()
	const [isConfirmOpen, setIsConfirmOpen] = useState();
	const cancelRef = useRef();

	const database = useSelector(selectDatabase);
	const toast = useToast();


	const onConfirmClose = () => setIsConfirmOpen(false);

	//Validate object keys based off array of keys
	const validateObject = (obj, keys) => {
		return keys.every((item) => obj.hasOwnProperty(item));
	};

	const handleSubmit = async () => {
		if (!input) {
			alert('Please add some entries')
		}

		let entries
		try {
			entries = JSON.parse(input)
		} catch {
			alert("Not a valid JSON format.  Check {}/[] or put quotes around words")
		}
		if (!Array.isArray(entries)) {
			return alert('Needs to be an array. Enclose object with [ ]');
		}
		const validOjbectKeys = ['english', 'korean'];
		const validation = entries.every((item) =>
			validateObject(item, validOjbectKeys)
		);
		if (validation) {
			try {
				await API.saveSentences(entries)
				toast({
					title: 'Submitted Entries',
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
			} catch {
				toast({
					title: 'Something went wrong',
					description: 'Slack @AndrewChon with exact input that produced error',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
		} else {
			alert(
				"Invalid keys, check to make sure they both exist and are exactly 'korean' and 'english'")
		}

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
					Submit entries
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
