import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {

    const showToast = useShowToast();
    const [user, setUser] = useRecoilState(userAtom);
    const [file, setFile] = useState(undefined);
    const [imgUrl, setImgUrl] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [password, setPassword] = useState('');
    const [input, setInput] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic
    })
    const fileRef = useRef(null);

    async function handleSubmit(e){
      e.preventDefault();

      if(password && password.length < 6){
        showToast('Error', 'Password should 6 characters long', 'error');
        return;
      }
      
      if(input.name === user.name && input.username === user.username && input.email === user.email && input.bio === user.bio && input.profilePic === user.profilePic && !password){
        return;
      }

      try {
        const res = await fetch ('/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',            
          },
          body: JSON.stringify(password ? {...input, password: password} : input)
          
        })
        const data = await res.json();
        if(data.error){
          showToast('Error', data.error, 'error');
          return;
        }
        setUser(data);
        localStorage.setItem('user-threads', JSON.stringify(data));
        showToast(`Success`, 'Updated successfully!', 'success');
        setPassword('');
      } catch (error) {
        showToast('Error', error.message, 'error');
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

    useEffect(()=>{      
      if(imgUrl){
        setInput({...input, profilePic: imgUrl});
      }
    }, [imgUrl])

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}/>
              </Center>
              <Center w="full">
                <Button w="full" onClick={()=> fileRef.current.click()}>Change Avatar</Button>
                <Input onChange={(e)=> setFile(e.target.files[0])} accept="image/*" type="file" hidden ref={fileRef} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.name}
              onChange={(e)=>setInput({...input, name: e.target.value})}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="johndoe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.username}
              onChange={(e)=>setInput({...input, username: e.target.value})}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={input.email}
              onChange={(e)=>setInput({...input, email: e.target.value})}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio."
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.bio}
              onChange={(e)=>setInput({...input, bio: e.target.value})}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            {/* <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button> */}
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              disabled={uploadingImage}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
