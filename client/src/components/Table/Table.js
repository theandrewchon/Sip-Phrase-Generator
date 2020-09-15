import React, { useState, useRef } from 'react';
import {
	Box,
	ButtonGroup,
	Button,
	Divider,
	Flex,
	SimpleGrid,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	PopoverArrow,
	useToast,
} from '@chakra-ui/core';
import API from '../../lib/API';

const Table = ({ entry }) => {
	const { _id, english, korean } = entry;
	const [isOpen, setIsOpen] = useState(false);
	const initialFocusRef = useRef();
	const toast = useToast();

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	const handleDelete = async () => {
		try {
			await API.deleteSentences(_id);
			toast({
				title: 'Result deleted.',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
		} catch {
			toast({
				title: 'Error in deleting result.',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	return (
		<div>
			<SimpleGrid columns={3}>
				<Flex align="center">
					<Box>{english}</Box>
				</Flex>
				<Flex align="center">
					<Box>{korean}</Box>
				</Flex>
				<Box>
					<Popover
						initialFocusRef={initialFocusRef}
						isOpen={isOpen}
						onOpen={open}
						onClose={close}
					>
						<PopoverTrigger>
							<Button variantColor="blue">Delete</Button>
						</PopoverTrigger>
						<PopoverContent zIndex={4}>
							<PopoverArrow />
							<PopoverHeader>Confirmation!</PopoverHeader>
							<PopoverBody>
								Are you sure you want to delete this result?
							</PopoverBody>
							<PopoverFooter>
								<ButtonGroup size="sm">
									<Button
										variant="outline"
										ref={initialFocusRef}
										onClick={close}
									>
										Cancel
									</Button>
									<Button variantColor="red" onClick={handleDelete}>
										Delete
									</Button>
								</ButtonGroup>
							</PopoverFooter>
						</PopoverContent>
					</Popover>
				</Box>
			</SimpleGrid>
			<Divider />
		</div>
	);
};

export default Table;
