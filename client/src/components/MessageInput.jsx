import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { IoSendSharp } from 'react-icons/io5';

export default function MessageInput() {
  return (
    <form>
        <InputGroup>
            <Input w='full' placeholder='type a message'></Input>
            <InputRightElement>
                <IoSendSharp/>
            </InputRightElement>
        </InputGroup>
    </form>
  )
}
