import { useState } from "react"
import { Avatar, Flex, Text, Divider } from "@chakra-ui/react";
import Actions from "./Actions";
import { BsThreeDots } from "react-icons/bs";


export default function Comment({comment, createdAt, likes, userName, userAvatar}) {

    const [liked, setLiked] = useState(false);

  return (
    <>
        <Flex gap='4' py='2' my='2' w='full'>
            <Avatar src={userAvatar} size='sm' />
            <Flex gap='1' w='full' flexDirection='column'>
                <Flex w='full' justifyContent='space-between' alignItems='center'>
                    <Text fontSize='sm' fontWeight='bold'>{userName}</Text>
                    <Flex gap='2' alignItems='center'>
                        <Text fontSize='sm' color='gray.light'>{createdAt}</Text>
                        <BsThreeDots/>
                    </Flex>
                </Flex>
                <Text>{comment}</Text>
                <Actions liked={liked} setLiked={setLiked} />
                <Text fontSize='sm' color='gray.light'>{likes + (liked ? 1 : 0)} likes</Text>
            </Flex>
        </Flex>
        <Divider/>
    </>
  )
}
