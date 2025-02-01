import { Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { app } from "../firebase";
import {useNavigate} from 'react-router-dom';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';


export default function OAuth() {

    const navigate = useNavigate();

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
            console.log(data);
            // navigate('/');
        } catch (error) {
            console.log('Could not singin with google: ', error.message);
        }
    }

  return (
    <Button onClick={handleGoogleClick} type='button' bgColor={'red.800'} size='lg'>Continue with Google  <FcGoogle style={{ marginLeft: "8px", marginTop: '2px' }} /></Button>
  )
}
