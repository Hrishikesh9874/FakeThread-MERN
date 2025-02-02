import { Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { app } from "../firebase";
import {useNavigate} from 'react-router-dom';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import useShowToast from "../hooks/UseShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";


export default function OAuth() {

    const navigate = useNavigate();
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);


    async function handleGoogleClick(){
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const res = await fetch(`/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, profilePic: result.user.photoURL})
            })

            const data = await res.json();
            if(data.error){
                showToast('Error', data.error, "error");
            }

            localStorage.setItem('user-threads', JSON.stringify(data));
            setUser(data);
            navigate('/');
        } catch (error) {
            showToast("Error", error, "error");
        }
    }

  return (
    <Button onClick={handleGoogleClick} type='button' bgColor={'red.800'} size='lg'>Continue with Google  <FcGoogle style={{ marginLeft: "8px", marginTop: '2px' }} /></Button>
  )
}
