import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';

export default function UserPage() {

  const {user, loading} = useGetUserProfile();
  const {username} = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  

  const getUserPosts = async() => {
    try {
      const res = await fetch(`/api/post/user/${username}`);
      const data = await res.json();
      if(data.error){
        showToast('Error', data.error, 'error');
      }
      setPosts(data);
    } catch (error) {
      showToast('Error', error.message, 'error');
      setPosts([]);
    } finally{
      setFetchingPosts(false);
    }
  }

  useEffect(()=>{
    getUserPosts();
  }, [username])

  if(!user && loading){
    return(
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    )
  }

  if(!user && !loading){
    return <h1>User not Found!</h1>
  }

  return (
    <div>
        <UserHeader user={user}></UserHeader>

        {!fetchingPosts && posts.length === 0 && <h1 style={{ paddingTop: '16px', paddingLeft: '16px' }}>User has no posts...</h1>}
        {fetchingPosts && (
          <Flex justifyContent='center' my='12'>
            <Spinner size='xl' />
          </Flex>
        )}

        {posts.map((post)=> (
          <Post key={post._id} post={post} />
        ))}
        
    </div>
  )
}