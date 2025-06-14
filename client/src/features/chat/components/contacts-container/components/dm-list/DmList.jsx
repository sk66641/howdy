import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentChat, selectChatType, selectDmContactList, selectChatMessages, setChatType, setChatMessages, setCurrentChat, setChatMessagesEmpty, selectChannelList, getChannelMembersAsync, selectChannelMembers, setChannelMembersEmpty } from '../../../../chatSlice'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../../../../../lib/utils'
import { getChannelMembers } from '../../../../chatAPI'


const DmList = ({ isChannel }) => {
    const dispatch = useDispatch();

    const contacts = useSelector(selectDmContactList);
    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);
    const channelsList = useSelector(selectChannelList);
    const channelMembers = useSelector(selectChannelMembers);

    const handleClick = (contact) => {
        if (isChannel) {
            dispatch(setChatType("channel"));
        }
        else {
            dispatch(setChatType("contact"));
            dispatch(setCurrentChat(contact));
        }
        if (currentChat && currentChat._id !== contact._id) {
            dispatch(setChatMessagesEmpty());
        }
        if (channelMembers.length !== 0) dispatch(setChannelMembersEmpty());
    }
    return (
        <div className="mt-5">
            {!isChannel && contacts.length > 0 && contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`pl-10 m-2 py-2 rounded-md transition-all duration-300 cursor-pointer ${currentChat && currentChat._id === contact._id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                        }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                            {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                :
                                <div className={`uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
                                    {contact.fullName.split('')[0]}
                                </div>
                            }
                        </Avatar>

                        <div className='flex flex-col'>
                            <span>
                                {contact.fullName}
                            </span>
                            <span className='text-xs'>
                                @{contact.username}
                            </span>
                        </div>

                    </div>
                </div>
            ))}
            {isChannel && channelsList.length > 0 && channelsList.map((channel) => (
                <div
                    key={channel._id}
                    className={`pl-10 mx-2 rounded-md py-2 transition-all duration-300 cursor-pointer ${chatType === "channel" && currentChat && currentChat._id === channel._id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                        }`}
                    onClick={() => {
                        dispatch(setChatType("channel"));
                        dispatch(setCurrentChat(channel));
                        dispatch(getChannelMembersAsync({ channelId: channel._id }));
                    }}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                            {channel.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${channel.profileImage}`} alt="profile" />
                                :
                                <div className={`uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center ${colors[channel.color]} rounded-full`}>
                                    {channel.name.split('')[0]}
                                </div>
                            }
                        </Avatar>

                        <div className='flex flex-col'>
                            <span>
                                {channel.name}
                            </span>
                            <span className='text-xs'>
                                @{channel.handle}
                            </span>
                        </div>

                    </div>
                </div>
            ))
            }
        </div >
    );

}

export default DmList
