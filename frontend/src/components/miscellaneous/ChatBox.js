import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgian, setFetchAgain }) => {

    const { selectedChat } = ChatState();


    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            p={3}
            bg="rgba(255, 255, 255, 0.64)"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >

            <SingleChat fetchAgian={fetchAgian} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatBox