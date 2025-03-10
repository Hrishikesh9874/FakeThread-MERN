import { Avatar, Flex, Text, Divider, Menu, Box, Portal, MenuList, MenuItem, MenuButton } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate, useParams } from "react-router-dom";
import postsAtom from "../atoms/postsAtom";


export default function Comment({reply, lastReply}) {

    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const navigate = useNavigate();
    const {pid} = useParams();
    const [posts, setPosts] = useRecoilState(postsAtom);

    async function handleDelete(){
        try {
            const res = await fetch(`/api/post/reply/delete/${reply._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if(data.error){
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', data.message, 'success');
            const updatedPosts = posts.map((p) => {
                if(p._id === pid){
                    return { ...p, replies: p.replies.filter((r) => r._id !== reply._id) }
                }
                return p;
            });
            setPosts(updatedPosts);
        } catch (error) {
            showToast('Error', error.message, 'error');
        }
    }
    
  return (
    <>
        <Flex gap='2' py='2' my='2' w='full'>
            <Avatar style={{ cursor: 'pointer', marginTop: '2px' }} onClick={()=>{navigate(`/${reply.username}`)}} src={reply.userProfilePic} size='sm' />
            <Flex gap='1' w='full' flexDirection='column'>
                <Flex w='full' justifyContent='space-between' alignItems='center'>
                    <Text style={{ cursor: 'pointer' }} onClick={()=>{navigate(`/${reply.username}`)}} fontSize='sm' fontWeight='bold'>{reply.username}</Text>
                    <Flex gap='2' alignItems='center'>
                        <Text fontSize='sm' color='gray.light'>{formatDistanceToNow(new Date(reply?.createdAt)).replace('about ', '')} ago</Text>
                        {currentUser && (
                            <Box mt='-1'>
                            <Menu>
                                <MenuButton pt='3'>
                                    <BsThreeDots size='20' cursor='pointer' />
                                </MenuButton>
                                <Portal>
                                <MenuList minW="80px" w="90px" p='0' bg='gray.dark'>
                                    <MenuItem isDisabled={reply.userId !== currentUser?._id} onClick={handleDelete} bg='gray.dark'>Delete</MenuItem>
                                </MenuList>
                                </Portal>
                            </Menu>                    
                        </Box>
                        )}
                    </Flex>
                </Flex>
                <Text mt='1' ml='2'>{reply.text}</Text>
            </Flex>
        </Flex>
        {!lastReply ? <Divider/> : null}
    </>
  )
}
