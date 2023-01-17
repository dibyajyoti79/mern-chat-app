import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import { useNavigate } from 'react-router-dom';

import { ChatState } from '../context/ChatProvider';

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState();

    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setLoggedInUser(userInfo);
        if (!userInfo) {
            navigate('/');
        }

    }, [navigate]);

    return (
        <div style={{ width: "100%" }}>

            {user && <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="90vh"
                p="10px"
            >

                {user && <MyChats fetchAgain={fetchAgain} loggedInUser={loggedInUser} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

            </Box>
        </div>
    )
}

export default ChatPage