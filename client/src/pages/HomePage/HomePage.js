import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { compact, debounce } from 'lodash-es';
import { selectDatabase } from '../../slices/databaseSlice';
import {
	Badge,
	Box,
	Button,
	Input,
	List,
	ListItem,
	Radio,
	RadioGroup,
	SimpleGrid,
	Stack,
	Text,
	useToast,
} from '@chakra-ui/core';
import { copyText, removePunctuation, fixQuotes } from '../../lib/util';

const HomePage = () => {
	const [primaryLanguage, setPrimaryLanguage] = useState('english');
	const [jsonType, setJsonType] = useState('word');
	const [results, setResults] = useState({ empty: [], sentences: [] });
	const database = useSelector(selectDatabase);
	const toast = useToast();
	const delayedSearch = useCallback(
		debounce((q) => handleSubmit(q), 500),
		[primaryLanguage]
	);

	const handleChange = (e) => {
		delayedSearch(e.target.value);
	};

	const handleSubmit = (input) => {
		const sentenceArray = [];
		const noResultsArray = [];
		const wordArray = compact(
			fixQuotes(removePunctuation(input)).trim().toLowerCase().split(' ')
		);
		wordArray.forEach((word) => {
			const results = database.filter((phrase) => {
				if (primaryLanguage === 'english') {
					const englishArr = compact(fixQuotes(removePunctuation(phrase.english.toLowerCase())).split(' '))
					if (englishArr.includes(word)) {
						return true;
					}
					return false;
				} else {
					const koreanString = removePunctuation(phrase.korean);
					const koreanArray = compact(koreanString.split(' '));
					return koreanArray.includes(word);
				}
			});
			if (results.length) {
				sentenceArray.push({
					query: word,
					sentence: results.reduce((a, b) =>
						a.english.length <= b.english.length ? a : b
					),
				});
			} else {
				noResultsArray.push(word);
			}
		});
		setResults({ empty: noResultsArray, sentences: sentenceArray });
	};

	return (
		<div>
			<form>
				<Input onChange={handleChange} placeholder="search" variant="filled" />
				<SimpleGrid minChildWidth="200px" my={3}>
					<Box>
						<Text>Primary Language</Text>
						<RadioGroup
							isInline
							onChange={(e) => setPrimaryLanguage(e.target.value)}
							value={primaryLanguage}
						>
							<Radio value="english">English</Radio>
							<Radio value="korean">Korean</Radio>
						</RadioGroup>
					</Box>
					<Box>
						<Text>JSON Type</Text>
						<RadioGroup
							isInline
							onChange={(e) => setJsonType(e.target.value)}
							value={jsonType}
						>
							<Radio value="word">Word</Radio>
							<Radio value="phrase">Phrase</Radio>
						</RadioGroup>
					</Box>
				</SimpleGrid>
			</form>
			<section>
				<Stack isInline my={3} shouldWrapChildren>
					{results.sentences.map(({ query }, index) => (
						<Badge key={index} spacing={2}>
							{query}
						</Badge>
					))}
				</Stack>
				<SimpleGrid columns={2} spacing={6}>
					<Box p={3} bg="gray.50">
						<span>Results:</span>
						<Button
							bg="cyan.400"
							size="sm"
							ml={6}
							onClick={() => {
								copyText();
								toast({
									title: 'JSON Copied',
									status: 'success',
									duration: 2000,
									isClosable: true,
								});
							}}
						>
							Copy results
						</Button>
						<div id="json">
							{results.sentences.map((e, index) => {
								const { sentence: { english, korean, notes } } = e
								return (
									<div key={e.sentence['_id']}>
										<pre>
											{jsonType === 'phrase' ? (
												primaryLanguage === 'english' ? (
													<code>
														{JSON.stringify(
															{
																type: 'phrase',
																content: `${english}`,
																translation: `${korean}`,
																notes: notes.length ? notes : [],
																examples: [],
															},
															null,
															4
														)}
													</code>
												) : (
													<code>
														{JSON.stringify(
															{
																type: 'phrase',
																content: `${korean}`,
																translation: `${english}`,
																notes: notes.length ? notes : [],
																examples: [],
															},
															null,
															4
														)}
													</code>
												)
											) : primaryLanguage === 'english' ? (
												<code>
													{JSON.stringify(
														{
															type: 'word',
															word: e.query,
															content: `${english}`,
															translation: `${korean}`,
															notes: notes.length ? notes : [],
															examples: [],
														},
														null,
														4
													)}
												</code>
											) : (
												<code>
													{JSON.stringify(
														{
															type: 'word',
															word: e.query,
															content: `${korean}`,
															translation: `${english}`,
															notes: notes.length ? notes : [],
															examples: [],
														},
														null,
														4
													)}
												</code>
											)}
											{ }

											{index !== results.sentences.length - 1 ? ',' : ''}
										</pre>
									</div>
								)
							})}
						</div>
					</Box>
					<Box bg="red.200" p={3}>
						<div id="noResult">
							<h1>No results:</h1>
							<List>
								{results.empty.map((e, index) => (
									<ListItem key={index}>{e}</ListItem>
								))}
							</List>
						</div>
					</Box>
				</SimpleGrid>
			</section>
		</div>
	);
};

export default HomePage;
