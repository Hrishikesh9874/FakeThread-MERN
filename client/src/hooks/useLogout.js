import userAtom from '../atoms/userAtom';
import { useSetRecoilState } from 'recoil';
import useShowToast from './useShowToast';

export default function useLogout() {

    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast()

  
    async function logout(){
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

    return logout;

}
