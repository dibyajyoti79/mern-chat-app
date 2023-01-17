import React, { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

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

    const handleClose = () => {
        setSelectedUsers([]);
        setGroupChatName("");
        setSearch("");
        setSearchResult([]);
        onClose();
    }

    const handleSubmit = async () => {
        if (!groupChatName) {
            toast({
                title: "Please enter a group name",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        if (selectedUsers.length === 0) {
            toast({
                title: "Please add atleast one user",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(user => user._id))
            }, config);

            console.log(data);
            setChats([data, ...chats]);
            setSelectedUsers([]);
            setGroupChatName("");
            setSearch("");
            setSearchResult([]);
            onClose();

            toast({
                title: "Group chat created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })


        }
        catch (error) {
            toast({
                title: "Error",
                description: "Error in creating group chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
        }



    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {

            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })

            return;
        }
        else {
            setSelectedUsers([...selectedUsers, userToAdd]);
        }
    }

    const handleDelete = (userToRemove) => {
        setSelectedUsers(
            selectedUsers.filter(user => user._id !== userToRemove._id)
        );
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display={"flex"}
                        justifyContent={"center"}
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton onClick={handleClose} />
                    <ModalBody display={"flex"} flexDir="column" alignItems={"center"}>
                        <FormControl id="groupName" >
                            <Input
                                focusBorderColor='yellow.400'
                                placeholder='Enter Group Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id="users" >
                            <Input
                                focusBorderColor='yellow.400'
                                placeholder="Add Members eg. 'Dibya, John, Pikun'"
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {
                                selectedUsers.map((user) => (
                                    <UserBadgeItem key={user._id}
                                        user={user}
                                        handleFunction={() => handleDelete(user)}
                                    />
                                ))
                            }
                        </Box>
                        {
                            loading ? <div>loading...</div> : (
                                searchResult?.slice(0, 4).map((user) => (
                                    <UserListItem key={user._id} user={user}
                                        handleFunction={() => handleGroup(user)}

                                    />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='yellow' onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal