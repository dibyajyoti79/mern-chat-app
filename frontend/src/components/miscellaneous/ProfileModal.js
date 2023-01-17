import React from 'react'
import { Text, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Image } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return <>

        {
            children ? (<span onClick={onOpen}>{children}</span>) : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                    backgroundColor="transparent"
                >

                </IconButton>
            )
        }

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="320px">
                <ModalHeader
                    fontSize="30px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >{user.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Image
                        borderRadius="full"
                        boxSize="100px"
                        src={user.pic}
                        alt={user.name}
                    />
                    <Text
                        fontSize="25px"
                        fontFamily="Work sans"
                    >
                        Email : {user.email}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='yellow' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </>
}
export default ProfileModal