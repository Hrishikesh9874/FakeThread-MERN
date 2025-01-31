import { Link } from "react-router-dom";
import {Button, Flex} from '@chakra-ui/react';


export default function HomePage() {
  return (
    <Link to={'/markzukerberg'}>
        <Flex w='full' justifyContent='center'>
            <Button mx='auto'>Visit Profile Page</Button>
        </Flex>
    </Link>
  )
}
