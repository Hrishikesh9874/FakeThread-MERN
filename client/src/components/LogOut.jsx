import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/UseShowToast";

export default function Logout(){

    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();


    async function handleLogout(){
        try {           
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await res.json();

            if(data.error){
                showToast("Error", data.error, "error");
                return;
            }

            setUser(null);
            localStorage.removeItem('user-threads');
        } catch (error) {
            showToast("Error", error, "error");
            console.log(error);
        }
    }

    return (
        <Button position='fixed' top='30px' right='30px' size='sm' onClick={handleLogout}>Logout</Button>
    )
}
