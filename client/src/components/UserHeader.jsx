import React from 'react'
import { VStack, Flex, Box, Text, Avatar, Link, useToast, Center } from '@chakra-ui/react'
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { Menu, MenuButton, MenuList, MenuItem, Portal, Button } from "@chakra-ui/react";

export default function UserHeader() {

    const toast = useToast();


    function copyUrl(){
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(()=>{
            toast({
                title: 'Account created.',
                status: 'success',
                duration: 2000,
                description: 'Profile link copied',
                isClosable: true
            });
        })
    }

  return (
    <VStack gap='4' alignItems='start'>

        <Flex justifyContent='space-between' w='full'>

            <Box> 
                <Text fontSize='2xl' fontWeight='bold'>Mark Zukerberg</Text>
                <Flex gap='2' alignItems='center'>
                    <Text fontSize='sm'>markzukergerg</Text>
                    <Text fontSize='xs' bg='gray.dark' color='gray.light' p='1' borderRadius='full'>threads.net</Text>
                </Flex>
            </Box>
            <Box>
                <Avatar name='Mark Zukerberg' src='/zuck-avatar.png' size='xl'></Avatar>
            </Box>

        </Flex>
        <Text>Co-founder, executive chairman and CEO of Meta Platform</Text>

        <Flex w='full' justifyContent='space-between'>
            <Flex gap='2' alignItems={'center'}> 
                <Text color='gray.light'>3.2k followerd</Text>
                <Box w='1' h='1' bg={'gray.light'} borderRadius='full'></Box>
                <Link color='gray.light'>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <BsInstagram size='24' cursor='pointer'></BsInstagram>
                </Box>
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size='24' cursor='pointer'></CgMoreO>
                        </MenuButton>
                        <Portal>
                            <MenuList bg='gray.dark'>
                                <MenuItem onClick={copyUrl} bg='gray.dark'>Copy link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>                    
                </Box>
            </Flex>
        </Flex>

        <Flex w='full'>
            <Flex flex='1' borderBottom='1.5px solid white' justifyContent='center' pb='3' cursor='pointer'>
                <Text fontWeight='bold'>Threads</Text>
            </Flex>
            <Flex flex='1' borderBottom='1px solid gray' color={'gray.light'} justifyContent='center' pb='3' cursor='pointer'>
                <Text fontWeight='bold'>Replies</Text>
            </Flex>
        </Flex>

    </VStack>
  )
}
