import { Text, Box, Container, TabList, TabPanels, TabPanel, Tabs, Tab } from '@chakra-ui/react'
import React from 'react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            navigate('/chats');
        }
    }, [navigate]);

    return (
        <Container maxW='xl' centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={2}
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text
                    textAlign="center"
                    fontSize="3xl"
                    fontFamily="Work Sans"
                    color="black"
                >GAAP SAP</Text>
            </Box>
            <Box
                bg="white"
                w="100%"
                p={4}
                color="black"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Tabs variant='soft-rounded' colorScheme='yellow'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

        </Container>
    )
}

export default HomePage