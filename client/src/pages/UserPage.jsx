import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

export default function UserPage() {

  const [user, setUser] = useState(null);
  const {username} = useParams();
  const showToast = useShowToast();
  


  const getUser = async() => {
    try {
      const res = await fetch(`/api/user/profile/${username}`);
      const data = await res.json();
      if(data.error){
        showToast('Error', data.error, 'error');
        console.log('error');
        return;
      }
      setUser(data);
    } catch (error) {
      showToast('Error', error, 'error');
    }
  }

  useEffect(()=>{    
    getUser();
  }, [username])

  return (
    <div>
        {user ? <UserHeader user={user}></UserHeader> : <p>Loading user data..</p>}
        {/* <UserPost likes='1200' replies='361' postImg='/post1.png' postTitle='Lets talk about threads'></UserPost>
        <UserPost likes='740' replies='251' postImg='/post2.png' postTitle='The talking on any issue is addressable here..'></UserPost>
        <UserPost likes='1451' replies='84' postImg='/post3.png' postTitle='How are you guys doin, Wanna know about space tech with me!!?'></UserPost>
        <UserPost likes='1270' replies='169' postTitle='This is my very first post'></UserPost> */}
    </div>
  )
}