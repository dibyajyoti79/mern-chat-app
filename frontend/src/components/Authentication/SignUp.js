import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);
    const handleClickConfirm = () => setShowConfirm(!showConfirm);

    const setProfile = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            return;
        }

        if (pics.type === 'image/jpeg' || pic.type === 'image/png' || pic.type === 'image/jpg') {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'da2gntehe');
            fetch('https://api.cloudinary.com/v1_1/da2gntehe/image/upload', {
                method: 'post',
                body: data
            }).then(res => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                })
        } else {
            toast({
                title: 'Please Select a JPG/JPEG or PNG Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        }

    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please Fill All The Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Passwords Do Not Match!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            }

            const { data } = await axios.post('/api/user', { name, email, password, pic }, config);
            toast({
                title: "Registration Successful!",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats')

        }
        catch (err) {
            toast({
                title: "An Error Occured!",
                description: err.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
        }

    }

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    focusBorderColor='yellow.400'
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    focusBorderColor='yellow.400'
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        focusBorderColor='yellow.400'
                        type={show ? "text" : "password"}
                        placeholder='Enter Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        {show ? <ViewOffIcon color={"gray.400"} cursor={"pointer"} onClick={handleClick} /> : <ViewIcon color={"gray.400"} cursor={"pointer"} onClick={handleClick} />}
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        focusBorderColor='yellow.400'
                        type={showConfirm ? "text" : "password"}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        {showConfirm ? <ViewOffIcon color={"gray.400"} cursor={"pointer"} onClick={handleClickConfirm} /> : <ViewIcon color={"gray.400"} cursor={"pointer"} onClick={handleClickConfirm} />}
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="pic">
                <FormLabel>Upload Profile Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    onChange={(e) => setProfile(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme={"yellow"}
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                color="white"
                isLoading={loading}
            >
                Sign Up
            </Button>

        </VStack >
    )
}

export default SignUp