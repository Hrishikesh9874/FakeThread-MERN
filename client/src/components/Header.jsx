import { useColorMode, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link } from 'react-router-dom';
import {AiFillHome} from 'react-icons/ai';
import {RxAvatar} from 'react-icons/rx';

export default function Header() {

    const {colorMode, toggleColorMode} = useColorMode();
    const user = useRecoilValue(userAtom);

  return (
    <Flex justifyContent={user ? 'space-between' : 'center'} mt={6} mb='12'>

      {user && (
        <Link to='/'>
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
          cursor='pointer'
          alt='logo'
          w='6'
          src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
          onClick={toggleColorMode}
      />

      {user && (
        <Link to={`/${user.username}`}>
          <RxAvatar size={24} />
        </Link>
      )}

    </Flex>
  )
}
