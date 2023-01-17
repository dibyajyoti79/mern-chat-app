import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../../components/UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';



const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [GroupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toast = useToast();


    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleOpen = () => {
        if (selectedChat) {
            const admin = selectedChat.users.find((user) => user._id === selectedChat.groupAdmin._id);
            if (admin._id === user._id) {
                setIsAdmin(true);
            }
        }
        onOpen();
    }

    const handleRemove = async (user1) => {
        if (!isAdmin) {
            toast({
                title: "Error",
                description: "You are not admin of this group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(`/api/chat/remove`, { chatId: selectedChat._id, userId: user1._id }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error",
                description: "Error in removing user",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false);
        }




    }

    const handleRename = async () => {
        if (!GroupChatName) { return }

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`/api/chat/rename`, { chatId: selectedChat._id, chatName: GroupChatName }, config);
            setFetchAgain(!fetchAgain);
            setSelectedChat(data);
            setRenameLoading(false);
            toast({
                title: "Success",
                description: "Group renamed successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"

            }
            )
            onClose();

        } catch (error) {
            toast({
                title: "Error",
                description: "Error in renaming group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setRenameLoading(false);
        }

        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Error in fetching users",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "Error",
                description: "User already in group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`/api/chat/add`, { chatId: selectedChat._id, userId: user1 }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error",
                description: "Error in adding user",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
        }
    }

    const handleLeave = async () => {
        if (isAdmin) {
            toast({
                title: "Error",
                description: "You are admin of this group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(`/api/chat/remove`, { chatId: selectedChat._id, userId: user._id }, config);

            setSelectedChat();
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error",
                description: "Error in removing user",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false);
        }
        onClose();
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} onClick={handleOpen} icon={<ViewIcon />} backgroundColor="transparent" />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={"flex"}
                        fontFamily="Work sans"
                        fontSize="35px"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {
                                selectedChat.users.map((user) => (
                                    <UserBadgeItem key={user._id}
                                        user={user}
                                        handleFunction={() => handleRemove(user)}
                                    />
                                ))
                            }
                        </Box>
                        <FormControl id="groupName" display={"flex"}>
                            <Input
                                focusBorderColor='yellow.400'
                                placeholder='Enter Group Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button colorScheme='yellow' ml={1} isLoading={renameLoading} onClick={handleRename}>
                                Rename
                            </Button>
                        </FormControl>
                        {

                            isAdmin ? (
                                <FormControl id="users" >
                                    <Input
                                        focusBorderColor='yellow.400'
                                        placeholder="Add Members "
                                        mb={1}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </FormControl>
                            ) : (
                                <></>
                            )
                        }

                        {
                            loading ? (
                                <Spinner size="lg" />  // Loading spinner
                            ) : (
                                searchResult.map((user) => (
                                    <UserListItem key={user._id} user={user}
                                        handleFunction={() => handleAddUser(user)} />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={handleLeave} >
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal