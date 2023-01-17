import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        console.log(selectedChat)
        setSelectedChat(selectedChat);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get('/api/chat', config);
            setChats(data);

        } catch (error) {
            toast({
                title: "Error",
                description: "Error in fetching chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }


    useEffect(() => {
        fetchChats();
    }, [fetchAgain])




    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            p={3}
            bg="rgba(255, 255, 255, 0.64)"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >

            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display={"flex"}
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display={"flex"}
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                        colorScheme="teal"
                    >
                        Create Group

                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                p={3}
                bg="transparent"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflow="hidden"
            >

                {
                    chats ? (

                        <Stack overflowY="scroll">
                            {
                                console.log(chats)
                            }
                            {chats.map(chat => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "yellow.500" : "teal.50"}
                                    color={selectedChat === chat ? "black" : "gray.500"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}

                                >
                                    <Text>
                                        {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                                    </Text>

                                </Box>
                            ))}

                        </Stack>
                    ) : (
                        <ChatLoading />
                    )
                }

            </Box>

        </Box>
    )
}

export default MyChats