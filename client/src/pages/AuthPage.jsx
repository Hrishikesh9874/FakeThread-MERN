import SignupCard from "../components/SignupCard";
import SigninCard from "../components/SigninCard";
import authScreenAtom from "../atoms/authAtom";
import { useRecoilValue } from "recoil";



export default function AuthPage() {

  const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <>
        {authScreenState === 'login' ? <SigninCard/> : <SignupCard/>}
    </>
  )
}
