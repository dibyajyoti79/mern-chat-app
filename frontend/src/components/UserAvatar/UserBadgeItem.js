import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={1}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            backgroundColor="green"
            color="white"
            cursor={"pointer"}
            onClick={handleFunction}

        >
            {user.name}
            <CloseIcon paddingLeft={1} />
        </Box>
    )
}

export default UserBadgeItem