import { Box, Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
    return (
        <Box width="100%" display={"flex"} justifyContent="center" alignItems={"center"}>
            <Stack width="100%" >
                <Skeleton height='50px' borderRadius="lg" />
                <Skeleton height='50px' borderRadius="lg" />
                <Skeleton height='50px' borderRadius="lg" />
                <Skeleton height='50px' borderRadius="lg" />
                <Skeleton height='50px' borderRadius="lg" />
                <Skeleton height='50px' borderRadius="lg" />

            </Stack>
        </Box>
    )
}

export default ChatLoading