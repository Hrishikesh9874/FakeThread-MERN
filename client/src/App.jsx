import { Box, Container } from '@chakra-ui/react';
import { Routes, Route, Navigate} from 'react-router-dom';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import UpdateProfilepage from './pages/UpdateProfilepage';
import CreatePost from './components/CreatePost';
import ChatPage from './pages/ChatPage';

function App() {

  const user = useRecoilValue(userAtom);

  return (
    <Box position='relative' w='full'>
    <Container maxW="620px">
      <Header></Header>
      <Routes>
        <Route path='/' element={user ? <HomePage/> : <Navigate to='/auth' />} />
        <Route path='/auth' element={!user ? <AuthPage/> : <Navigate to='/' />}/>
        <Route path='/update' element={user ? <UpdateProfilepage/> : <Navigate to='/auth' />}/>
        <Route path="/:username" element={user ? (
          <>
            <UserPage/>
            <CreatePost/>
          </>
        ) : ( <UserPage/> )}/>
        <Route path="/:username/post/:pid" element={<PostPage/>}/>
        <Route path="/chat" element={user ? <ChatPage/> : <Navigate to ={'/auth'}/>}/>
      </Routes>
    </Container>
    </Box>
  )
}

export default App
