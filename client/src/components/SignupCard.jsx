import {Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link } from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";

export default function SignupCard() {

	const setAuthScreen = useSetRecoilState(authScreenAtom);

	const [showPassword, setShowPassword] = useState(false);
	const [input, setInput] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: ""
	})

	async function handleSignup(){
		try {
			const res = await fetch(`/api/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(input)
			});

			const data = await res.json();
			console.log(data);

		} catch (error) {
			console.log(error);
		}
	}


	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>First name</FormLabel>
									<Input type='text' onChange={(e)=> setInput({...input, firstName: e.target.value})} value={input.firstName}/>
								</FormControl>
							</Box>
							<Box>
								<FormControl>
									<FormLabel>Last name</FormLabel>
									<Input type='text' onChange={(e)=> setInput({...input, lastName: e.target.value})} value={input.lastName} />
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email address</FormLabel>
							<Input type='email' onChange={(e)=> setInput({...input, email: e.target.value})} value={input.email} />
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e)=> setInput({...input, password: e.target.value})} value={input.password}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText='Submitting'
								size='lg'
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								onClick={handleSignup}
							>
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Already a user?{" "}
								<Link onClick={()=> setAuthScreen('login')} color={"blue.400"}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}