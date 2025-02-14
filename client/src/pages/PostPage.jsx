import {Flex, Avatar, Image, Text, Box, Divider, Button, Spinner} from '@chakra-ui/react';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

export default function PostPage() {

  const {user, loading} = useGetUserProfile();
  const [post, setPost] = useState(null);
  const showToast = useShowToast();
  const {pid} = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();


  async function handleDeletePost(){
    try {
      if(!window.confirm('Are you sure you want to delete the post?')) return;
      const res = await fetch (`/api/post/${post._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if(data.error){
        showToast('Error', data.error, 'error');
        return;
      }
      showToast('Success', 'Post deleted!', 'success');
      navigate(`/${user.username}`);
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  }

  async function getPost(){
    try {
      const res = await fetch(`/api/post/${pid}`);
      const data = await res.json();
      if(data.error){
        showToast('Error', data.error, 'error');
        return;
      }
      setPost(data);
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  }

  useEffect(()=>{
    getPost();
  }, [pid])

  if(loading){
    return(
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    )
  }

  if(!post) return null;

  return (
    <>
      <Flex>

        <Flex w='full' alignItems='center' gap='3'>
          <Avatar style={{ cursor: 'pointer' }} onClick={()=>{navigate(`/${user?.username}`)}} src={user.profilePic} size='md' name={user.name} />
          <Flex>
            <Text style={{ cursor: 'pointer' }} onClick={()=>{navigate(`/${user?.username}`)}} fontSize='sm' fontWeight='bold'>{user.username}</Text>
            <Image src='/verified.png' w='4' h='4' ml='2'></Image>
          </Flex>
        </Flex>

        <Flex gap='4' alignItems='center'>
          <Text fontSize='xs' width='36' textAlign='right' color='gray.light' >{formatDistanceToNow(new Date(post.createdAt)).replace('about ', '')} ago</Text>
              {currentUser?._id === user?._id && (
                <DeleteIcon onClick={handleDeletePost} style={{cursor: 'pointer'}} />
              )}
        </Flex>

      </Flex>

      <Text my='3'>{post?.text}</Text>

      {post.img && (
        <Box borderRadius='6' overflow='hidden' border='1px solid' borderColor='gray.light'>
          <Image src={post.img} w='full' />
        </Box>
      )}

      <Flex gap='3' my='3'>
        <Actions post={post} setPost={setPost} />
      </Flex>

      <Divider my='4' />

      <Flex justifyContent='space-between'>
        <Flex gap='2' alignItems='center'>
          <Text fontSize='2xl'>👋</Text>
          <Text textColor='gray.light'>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>

      <Divider my='4'/>

      {post.replies.map(reply => (
        <Comment key={reply._id} reply={reply} lastReply={reply._id === post.replies[post.replies.length - 1]._id} />
      ))}

    </>
  )
}
