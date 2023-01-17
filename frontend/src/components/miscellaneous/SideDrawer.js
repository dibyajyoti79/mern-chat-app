import { Avatar, Box, Button, Divider, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Toast } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom'
import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Image } from '@chakra-ui/react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge';
const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    // const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const toast = useToast();

    const { user, setUser, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setChats([]);
        setNotifications([]);
        setUser(null);
        setSelectedChat(null);
        navigate('/');
    }

    const handleSearchClick = () => {
        onOpen();
        // setSearch("");
        setSearchResult([]);
    }


    const handleSearch = async (e) => {
        // setSearch(e.target.value);
        // console.log(e.target.value);
        // console.log(searchResult);
        if (e.target.value.length === 0) {
            setSearchResult([]);
            setLoading(false);
        }

        else {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.get(`/api/user?search=${e.target.value}`, config);
                setSearchResult(data);
                setLoading(false);
            }
            catch (error) {
                setLoading(false);
                toast({
                    title: "Error Occured",
                    description: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left"
                })
            }

        }

    }

    const accessChat = async (userId) => {
        try {
            setSearchResult([]);
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("/api/chat", { userId }, config);

            const chatExists = chats.find(chat => chat._id === data._id);
            if (chatExists) {
                setChats([...chats, data]);
            }
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="rgba(255, 255, 255, 0.64)"
                w="100%"
                p="5px 10px 5px 10px"

            // borderWidth="5px"
            >
                <Tooltip
                    label="Search User to chat"
                    hasArrow
                    placement='bottom-end'

                >
                    <Button variant="ghost" onClick={handleSearchClick} _hover={{ bg: "transparent" }}>
                        <SearchIcon />
                        <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans" fontWeight={"bold"}>
                    GAAP SAP
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notifications.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notifications.length && "No New Messages"}
                            {notifications.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotifications(notifications.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} backgroundColor={"transparent"} _hover={{ backgroundColor: "transparent" }}
                            _active={{ backgroundColor: "transparent" }} _focus={{ backgroundColor: "transparent" }}
                        >
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>

            </Box>

            <Modal size="lg" isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent >

                    <div style={{ display: "flex", alignItems: "stretch" }}>

                        <InputGroup

                        >

                            <Input
                                variant={"unstyled"}
                                width="100%"
                                height="68px"
                                paddingLeft="68px"
                                fontSize='1.2em'
                                onChange={handleSearch}
                                placeholder='Search by name or email' />
                            <InputLeftElement
                                left={"18px"}
                                height="68px"
                                pointerEvents='none'
                                color='gray.300'
                                fontSize='1.2em'
                                children={<SearchIcon color='yellow.500' />}
                            />
                        </InputGroup>
                    </div>



                    {

                        loading ? (<ChatLoading />) :

                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}


                                />
                            ))
                    }

                    {loadingChat && <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='yellow.500'
                        size='xl'
                        position="inherit"
                    />}

                </ModalContent>
            </Modal>



        </>
    )
}

export default SideDrawer