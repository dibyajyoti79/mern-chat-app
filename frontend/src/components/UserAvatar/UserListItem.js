import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({ user, handleFunction }) => {


    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
        >
            <Box
                onClick={handleFunction}
                cursor="pointer"
                bg="gray.100"
                _hover={{
                    background: "yellow.400",
                    color: "white"
                }}
                w="80%"
                display="flex"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                borderRadius="lg"

            >
                <Avatar
                    mr={2}
                    size="sm"
                    cursor={"pointer"}
                    name={user.name}
                    src={user.pic}
                />
                <Box>
                    <Text>{user.name}</Text>
                    <Text fontSize="xs">
                        <b>Email : </b>
                        {user.email}
                    </Text>

                </Box>
            </Box>
        </Box>
    )
}

export default UserListItem