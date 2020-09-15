import React, { useState } from 'react';
import { Box, Heading, Flex, Text, Link } from '@chakra-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const MenuItems = ({ children }) => (
	<Text mt={{ base: 4, md: 0 }} mr={6} display="block">
		{children}
	</Text>
);

const Header = (props) => {
	const [show, setShow] = useState(false);
	const handleToggle = () => setShow(!show);

	return (
		<Flex
			as="nav"
			align="center"
			justify="space-between"
			wrap="wrap"
			padding="1rem"
			bg="blue.900"
			color="white"
			{...props}
		>
			<Flex
				align="center"
				mr={{ md: '5' }}
				width={{ base: '100%', md: 'auto' }}
				justifyContent={{ base: 'space-between', md: 'flex-start' }}
			>
				<Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
					<Link href="/">S.P.G.</Link>
				</Heading>

				<Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
					<svg
						fill="white"
						width="12px"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</Box>
			</Flex>

			<Box
				display={{ base: show ? 'block' : 'none', md: 'flex' }}
				width={{ base: '100%', md: 'auto' }}
				alignItems="center"
				flexGrow={1}
			>
				<MenuItems>
					<Link onClick={handleToggle} as={RouterLink} to="/">
						Search
					</Link>
				</MenuItems>
				<MenuItems>
					<Link as={RouterLink} to="/database" onClick={handleToggle}>
						Database
					</Link>
				</MenuItems>
				<MenuItems>
					<Link href="https://spg-english.herokuapp.com/">English SPG</Link>
				</MenuItems>
				<MenuItems>
					<Link href="https://spg-korean.herokuapp.com/">Korean SPG</Link>
				</MenuItems>
			</Box>
		</Flex>
	);
};

export default Header;
