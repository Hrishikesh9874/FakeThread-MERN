import {useNavigate} from 'react-router-dom';
import { Flex, Avatar, Box, Text, Image } from '@chakra-ui/react';
import Actions from './Actions';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import {formatDistanceToNow} from 'date-fns';
import {DeleteIcon} from '@chakra-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';

export default function Post({post}) {

    const userId = post.postedBy;
    const showToast = useShowToast();
    const [user, setUser] = useState(null);
    const navigate = useNavigate()
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);


    async function handleDeletePost(){
        try {
            if(!window.confirm('Are you sure you want to delete this post?')) return;
            const res = await fetch(`/api/post/${post._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if(data.error){
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Post deleted!', 'success');
            setPosts(posts.filter((p)=> p._id !== post._id));
        } catch (error) {
            showToast('Error', error.message, 'error');
        }
    }

    useEffect(()=>{
        async function getUser(){
            try {
                const res = await fetch(`/api/user/profile/${userId}`);
                const  data = await res.json();
                if(data.error){
                    showToast('Error', data.error, 'error');
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
                setUser(null);
            }
        }
        getUser();
    }, [userId]);

  return (
        <Flex gap='3' mb='4' py='5'>

            <Flex flexDirection='column' alignItems='center'>
                <Avatar style={{ cursor: 'pointer' }} onClick={()=>{navigate(`/${user?.username}`)}} size='md' name={user?.name} src={user?.profilePic}></Avatar>
                <Box w='1px' h='full' bg='gray.light' my='2'></Box>
                <Box position='relative' w='full'>
                    {post.replies.length === 0 && <Text textAlign='center'>🥱</Text> }
                    {post.replies[0] && <Avatar size='xs' name={post.replies[0].username} src={post.replies[0].userProfilePic} position='absolute' top='0px' left='15px' padding='2px' />}
                    {post.replies[1] && <Avatar size='xs' name={post.replies[1].username} src={post.replies[1].userProfilePic} position='absolute' bottom='0px' right='-5px' padding='2px' />}
                    {post.replies[2] && <Avatar size='xs' name={post.replies[2].username} src={post.replies[2].userProfilePic} position='absolute' bottom='0px' left='4px' padding='2px' />}
                </Box>
            </Flex>

            <Flex flex='1' flexDirection='column' gap='2'>
                <Flex justifyContent='space-between' w='full'>
                    <Flex w='full' alignItems='center'>
                        <Text style={{ cursor: 'pointer' }} onClick={()=>{navigate(`/${user?.username}`)}} fontSize='sm' fontWeight='bold'>{user?.username}</Text>
                        <Image src='/verified.png' w='4' h='4' ml='1' />
                    </Flex>
                    <Flex gap='4' alignItems='center'>
                        <Text fontSize='xs' width='36' textAlign='right' color='gray.light' >{formatDistanceToNow(new Date(post.createdAt)).replace('about ', '')} ago</Text>
                        {currentUser?._id === user?._id && (
                            <DeleteIcon onClick={handleDeletePost} style={{cursor: 'pointer'}} />
                        )}
                    </Flex>
                </Flex>
                <Text style={{ cursor: 'pointer' }} onClick={()=>{navigate(`/${user?.username}/post/${post._id}`)}} fontSize='sm'>{post.text}</Text>
               {post.img ? ( <Box style={{ cursor: 'pointer' }} onClick={()=>{navigate(`/${user?.username}/post/${post._id}`)}} borderRadius='6' overflow='hidden' border='1px solid' borderColor='gray.light'>
                    <Image src={post.img} w='full' />
                </Box>) : ''}
                <Flex gap='3' my='1'>
                    <Actions post={post}/>
                </Flex>                
            </Flex>

        </Flex>
  )
}
