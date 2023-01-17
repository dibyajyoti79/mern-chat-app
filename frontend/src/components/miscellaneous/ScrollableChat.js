import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics'
import { ChatState } from '../../context/ChatProvider'


const ScrollableChat = ({ messages }) => {


    const { user } = ChatState()

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <span
                            style={{
                                // backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                //     }`,
                                // background: "linear-gradient(90deg, rgba(190,227,248,1) 0%, rgba(185,245,208,1) 100%)",
                                // background: "linear-gradient(98.63deg, #24e4f0 0%, #358ff9 100%)",
                                background: `${m.sender._id === user._id ? "linear-gradient(98.63deg, #24e4f0 0%, #358ff9 100%)" : "linear-gradient(98.63deg, #f9a225 0%, #f95f35 100%)"}`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                // color: "white",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat