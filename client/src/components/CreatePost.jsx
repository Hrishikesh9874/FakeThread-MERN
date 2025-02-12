import { AddIcon } from "@chakra-ui/icons";
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {BsFillImageFill} from 'react-icons/bs';
import useShowToast from "../hooks/useShowToast";

const maxChar = 500;

export default function CreatePost() {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [postText, setPostText] = useState('');
    const fileRef = useRef(null);
    const [imgUrl, setImgUrl] = useState('');
    const [file, setFile] = useState(undefined);
    const showToast = useShowToast();
    const [remainingCharacters, setRemainingCharacters] = useState(maxChar);
    const [uploadingImage, setUploadingImage] = useState(false);


    function handleTextChange(e){
        const inputText = e.target.value;

        if(inputText.length > maxChar){
            const truncatedText = inputText.slice(0, maxChar);
            setPostText(truncatedText);
            setRemainingCharacters(0);
        }else{
            setPostText(inputText);
            setRemainingCharacters(maxChar - inputText.length);
        }
    }
    
    async function handleCreatePost(){
        try {
            const res = await fetch(`/api/post/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({text: postText, img: imgUrl})
            })
            const data = await res.json();
            if(data.error){
                showToast('Error', data.error, 'error');
                return;
            }
            showToast('Success', 'Post created', 'success');
            onClose();
            setImgUrl('');
            setPostText('');
        } catch (error) {
            showToast('Error', error, 'error');
        }
    }

    function handleFileUpload(file) {
        setUploadingImage(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
    
        const xhr = new XMLHttpRequest();
    
        xhr.open("POST", "https://api.cloudinary.com/v1_1/dbzrbmfi8/image/upload");
    
      
        xhr.onload = () => {
          setUploadingImage(false);
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setImgUrl(response.url);
          } else {
            showToast('Error', xhr.status, 'error');
          }
        };
    
        xhr.onerror = () => {
          setUploadingImage(false);
          showToast('Error', 'Error uploading the image', 'error');
        };
    
        xhr.send(data);      
      }


    useEffect(()=>{
        if(file){
            handleFileUpload(file);
        }
    }, [file])

  return (
    <>
        <Button onClick={onOpen} position='fixed' bottom='10' right='10' leftIcon={<AddIcon/>} bg={useColorModeValue('gray.300', 'gray.dark')}>Post</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>

            <ModalContent>
                <ModalHeader>Create Post</ModalHeader>
                <ModalCloseButton/>

                <ModalBody pb='6'>

                    <FormControl>
                        <Textarea placeholder="Post content goes here..." onChange={handleTextChange} value={postText} />
                        <Text fontSize='xs' fontWeight='bold' textAlign='right' m='1' color={remainingCharacters < 10 ? 'red.800' : 'gray.800'}>{remainingCharacters}/{maxChar}</Text>
                        <Input onChange={(e)=> setFile(e.target.files[0])} accept="image/*" type="file" hidden ref={fileRef}/>
                        <BsFillImageFill style={{marginLeft: '5px', cursor: 'pointer'}} size='16' onClick={()=>fileRef.current.click()} />
                    </FormControl>

                    {imgUrl && (
                        <Flex mt='5' w='full' position='relative'>
                            <Image src={imgUrl} alt='Selected img' />
                            <CloseButton onClick={()=>setImgUrl('')} bg='gray.800' position='absolute' top='2' right='2'/>
                        </Flex>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr='3' disabled={uploadingImage} onClick={handleCreatePost}>Post</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    </>
  )
}
