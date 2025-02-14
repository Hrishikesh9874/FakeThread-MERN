import React, { useState } from 'react'
import { VStack, Flex, Box, Text, Avatar, Link, useToast } from '@chakra-ui/react'
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { Menu, MenuButton, MenuList, MenuItem, Portal, Button } from "@chakra-ui/react";
import {useRecoilValue} from 'recoil';
import userAtom from '../atoms/userAtom';
import {Link as RouterLink} from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

export default function UserHeader({user}) {

    const toast = useToast();
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(currentUser ? user.followers.includes(currentUser._id) : false);
    const showToast = useShowToast();
    const [updating, setUpdating] = useState(false);


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

    async function handleFollow(){
        setUpdating(true);
        try {
            const res = await fetch(`/api/user/follow/${user._id}`, {
                method: 'POST',
                headres: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if(data.error){
                showToast('Error', data.error, 'error');
                return;
            }

            if(following){
                showToast('Siccess', `Unfollowed ${user.name}`, 'success');
                user.followers.pop();
            }else{
                showToast('Siccess', `Followed ${user.name}`, 'success');
                user.followers.push(currentUser._id);
            }
            setFollowing(!following);
        } catch (error) {
            showToast('Error', error, 'error');
        } finally{
            setUpdating(false);
        }
    }

  return (
    <VStack gap='4' alignItems='start'>

        <Flex justifyContent='space-between' w='full'>

            <Box> 
                <Text fontSize='2xl' fontWeight='bold'>{user.name}</Text>
                <Flex gap='2' alignItems='center'>
                    <Text fontSize='sm'>@{user.username}</Text>
                    <Text fontSize='xs' bg='gray.dark' color='gray.light' p='1' borderRadius='full'>threads.net</Text>
                </Flex>
            </Box>
            <Box>
            
                {
                    user.profilePic && (
                        <Avatar name={user.name} src={user.profilePic} size={{base: 'lg', sm: 'xl'}}></Avatar>
                    )
                }
                {
                    !user.profilePic && (
                        <Avatar name={user.name} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRef5fdhKGUWxEzIU9GlwVEJOtDLIj0aRYyW2_z4Z9pvsBWy_IMnPgylYQ&s' size={{base: 'lg', sm: 'xl'}}></Avatar>
                    )
                }
            </Box>

        </Flex>
        <Text>{user.bio}</Text>

        {currentUser && currentUser._id === user._id &&(
            <RouterLink to='/update'>
                <Button size='sm'>Update Profile</Button>
            </RouterLink>
        )}
        {currentUser && currentUser._id !== user._id &&(
            <Button onClick={handleFollow} size='sm' isLoading={updating}>{following ? 'Unfollow' : 'Follow'}</Button>
        )}

        <Flex w='full' justifyContent='space-between'>
            <Flex gap='2' alignItems={'center'}> 
                <Text color='gray.light'>{user.followers.length} {user.followers.length > 1 ? 'followers' : 'follower'}</Text>
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
