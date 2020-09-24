import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../../lib/API';
import { selectDatabase } from '../../slices/databaseSlice';
import { removePunctuation, fixQuotes } from '../../lib/util';
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
	Flex,
	Input,
	Textarea,
	Radio,
	RadioGroup,
	useToast,
} from '@chakra-ui/core';
import Table from '../../components/Table';
import { debounce, compact } from 'lodash-es';

const Database = () => {
	const [input, setInput] = useState();
	const [isConfirmOpen, setIsConfirmOpen] = useState();
	const [radio, setRadio] = useState('english');
	const [results, setResults] = useState([]);
	const [lang, setLang] = useState(null)
	const cancelRef = useRef();
	const delayedSearch = useCallback(
		debounce((q) => handleSearch(q), 500),
		[radio]
	);
	const database = useSelector(selectDatabase);
	const toast = useToast();

	useEffect(() => {
		const init = () => {
			const url = window.location.href
			if (url.includes('korean')) {
				setLang('korean')
			} else {
				setLang('english')
			}
		}
		if (lang === null) init()
	}, [lang])

	const onConfirmClose = () => setIsConfirmOpen(false);

	//Validate object keys based off array of keys
	const validateObject = (obj, keys) => {
		return keys.every((item) => obj.hasOwnProperty(item));
	};

	const handleSubmit = async () => {
		if (!input) {
			alert('Please add some entries');
		}

		let entries;
		try {
			entries = JSON.parse(fixQuotes(input));
		} catch {
			alert('Not a valid JSON format.  Check {}/[] or put quotes around words');
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
				await API.saveSentences(entries);
				toast({
					title: 'Submitted Entries, refresh to see',
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
				"Invalid keys, check to make sure they both exist and are exactly 'korean' and 'english'"
			);
		}

		setIsConfirmOpen(false);
	};

	const handleChange = (e) => {
		delayedSearch(e.target.value);
	};

	const handleSearch = (search) => {
		const resultsArr = [];
		if (!search) return;

		database.forEach((obj) => {
			const { english, korean } = obj;
			if (radio === 'english') {
				const englishArr = compact(fixQuotes(removePunctuation(english.toLowerCase())).split(' '))
				if (englishArr.includes(fixQuotes(removePunctuation(search.trim().toLowerCase())))) {
					resultsArr.push(obj);
				}
			} else {
				//search Korean
				const koreanString = removePunctuation(korean);
				const koreanArr = koreanString.split(' ');
				if (koreanArr.includes(removePunctuation(search.trim()))) {
					resultsArr.push(obj);
				}
			}
		});
		setResults(resultsArr);
	};

	return (
		<div>
			<header>
				<Text fontSize="3xl">Multiple New Entries:</Text>
				<Text>
					Can use this to convert CSV to JSON{' '}
					<Link
						color="blue.400"
						target="_blank"
						href="https://csvjson.com/csv2json"
					>
						https://csvjson.com/csv2json
					</Link>
				</Text>
				<Text>Make sure the keys are "english" and "korean"!!</Text>
			</header>
			<Textarea
				size="sm"
				onChange={(e) => {
					setInput(e.target.value);
				}}
				placeholder={lang === 'korean' ? "Upload to database for KOREAN leaners"
					: 'Upload to database for ENGLISH learners'}
				value={input}
			/>
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
			<section>
				<Input placeholder="Search database" onChange={handleChange} />
				<Flex my={3}>
					<Flex align="center" mr={3}>
						<Text>Primary Language:</Text>
					</Flex>
					<Flex align="center">
						<RadioGroup
							isInline
							onChange={(e) => setRadio(e.target.value)}
							value={radio}
						>
							<Radio value="english">English</Radio>
							<Radio value="korean">Korean</Radio>
						</RadioGroup>
					</Flex>
				</Flex>
				<Text fontSize="2xl">Results:</Text>
				{results.map((obj, index) => (
					<Table entry={obj} key={index} />
				))}
				{results.length === 0 && <Text>No results displayed</Text>}
			</section>
		</div>
	);
};

export default Database;
