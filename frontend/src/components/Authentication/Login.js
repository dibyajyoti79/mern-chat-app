import React, { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
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

        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            }

            const { data } = await axios.post('/api/user/login', { email, password }, config);

            toast({
                title: 'Login Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');

        } catch (err) {
            toast({
                title: 'Invalid Email or Password!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
        }

    };

    return (
        <VStack spacing="5px">
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    value={email}
                    focusBorderColor='yellow.400'
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        value={password}
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

            <Button
                colorScheme={"yellow"}
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                color="white"
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                colorScheme={"green"}
                width="100%"
                color="white"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("guest123");
                }}
            >
                Get Guest Id
            </Button>

        </VStack >
    )
}

export default Login