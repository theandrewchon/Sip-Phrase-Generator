import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { compact } from 'lodash-es';
import { selectDatabase } from '../../slices/databaseSlice';
import {
	Badge,
	Box,
	Button,
	ButtonGroup,
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
import { copyText, removePunctuation } from '../../lib/util';
import './HomePage.css';

const HomePage = () => {
	const [input, setInput] = useState('');
	const [primaryLanguage, setPrimaryLanguage] = useState('english');
	const [jsonType, setJsonType] = useState('word');
	const [results, setResults] = useState({ empty: [], sentences: [] });
	console.log('HomePage -> results', results);
	const database = useSelector(selectDatabase);
	const toast = useToast();

	const handleSubmit = () => {
		const sentenceArray = [];
		const noResultsArray = [];
		const wordArray = compact(
			removePunctuation(input).trim().toLowerCase().split(' ')
		);
		wordArray.forEach((word) => {
			const results = database.filter((phrase) => {
				if (primaryLanguage === 'english') {
					if (new RegExp(`\\b${word}\\b`).test(phrase.english.toLowerCase())) {
						return true;
					}
					return false;
				}
				const koreanString = removePunctuation(phrase.korean);
				const koreanArray = compact(koreanString.split(' '));
				return koreanArray.includes(word);
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

	const handleClear = () => {
		setInput('');
		setResults({ empty: [], sentences: [] });
	};

	return (
		<div>
			<form>
				<Input
					onChange={(e) => setInput(e.target.value)}
					placeholder="search"
					variant="filled"
					value={input}
				/>
				<SimpleGrid minChildWidth="200px" my={3}>
					<Box>
						<ButtonGroup mt={3} spacing={3}>
							<Button
								leftIcon="search"
								onClick={handleSubmit}
								variantColor="green"
							>
								Search
							</Button>
							<Button leftIcon="close" onClick={handleClear} variantColor="red">
								Clear
							</Button>
						</ButtonGroup>
					</Box>
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
							{results.sentences.map((e, index) => (
								<div key={index}>
									<pre>
										{jsonType === 'phrase' ? (
											primaryLanguage === 'english' ? (
												<code>
													{JSON.stringify(
														{
															type: 'phrase',
															content: `${e.sentence.english}`,
															translation: `${e.sentence.korean}`,
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
															content: `${e.sentence.korean}`,
															translation: `${e.sentence.english}`,
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
														content: `${e.sentence.english}`,
														translation: `${e.sentence.korean}`,
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
														content: `${e.sentence.korean}`,
														translation: `${e.sentence.english}`,
														examples: [],
													},
													null,
													4
												)}
											</code>
										)}
										{}

										{index !== results.sentences.length - 1 ? ',' : ''}
									</pre>
								</div>
							))}
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
