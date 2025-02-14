import { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import useShowToast from "./useShowToast";


export default function useGetUserProfile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username} = useParams();
  const showToast = useShowToast();



  async function getUser(){
    try {
        const res = await fetch(`/api/user/profile/${username}`);
        const data = await res.json();
        if(data.error){
            showToast('Error', data.error, 'error');
            return;
        }
        setUser(data);
    } catch (error) {
        showToast('Error', error.message, 'error');
    } finally{
        setLoading(false);
    }
  }

  useEffect(()=>{
    getUser();
  }, [username])


  return {loading, user};

}
