import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedContact, selectSelectedChatType, selectDmContactList, selectSelectedChatMessages, setSelectedChatType, setSelectedChatMessages, setSelectedContact, EmptySelectedChatMessages, selectChannelList } from '../../../../chatSlice'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../../../../../lib/utils'
// import { set } from 'mongoose'


const DmList = ({ isChannel = false }) => {
    const dispatch = useDispatch();

    const contacts = useSelector(selectDmContactList);
    // console.log("DmList contacts", contacts);
    const selectedContact = useSelector(selectSelectedContact);
    const selectedChatType = useSelector(selectSelectedChatType);
    const selectedChatMessages = useSelector(selectSelectedChatMessages);
    const channelsList = useSelector(selectChannelList);

    const handleClick = (contact) => {
        if (isChannel) {
            dispatch(setSelectedChatType("channel"));
        }
        else {
            dispatch(setSelectedChatType("contact"));
            dispatch(setSelectedContact(contact));
        }
        if (selectedContact && selectedContact._id !== contact._id) {
            dispatch(EmptySelectedChatMessages());
        }
    }
    return (
        <div className="mt-5">
            {!isChannel && contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedContact && selectedContact._id === contact._id
                        ? "bg-[#8417ff] hover:bg-[#8417ff]"
                        : "hover:bg-[#f1f1f1]"
                        }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                            {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                :
                                // <input type="file" />
                                <div className={`uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
                                    {contact.firstName.split('')[0]}
                                </div>
                            }
                        </Avatar>

                        <div className='flex flex-col'>
                            <span>
                                {contact.firstName + ' ' + contact.lastName}
                            </span>
                            <span className='text-xs'>
                                {contact.email}
                            </span>
                        </div>

                    </div>
                </div>
            ))}
            {
                isChannel && channelsList.map((channel) => (
                    <div
                        key={channel._id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatType === "channel" && selectedContact && selectedContact._id === channel._id
                            ? "bg-[#8417ff] hover:bg-[#8417ff]"
                            : "hover:bg-[#f1f1f1]"
                            }`}
                        onClick={() => {
                            dispatch(setSelectedChatType("channel"));
                            dispatch(setSelectedContact(channel));
                            // dispatch(setSelectedChatMessages(channel.messages));
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
                                    {channel.description}
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
