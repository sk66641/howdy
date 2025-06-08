import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedContact, selectSelectedChatType, selectDmContactList, selectSelectedChatMessages, setSelectedChatType, setSelectedChatMessages, setSelectedContact, EmptySelectedChatMessages } from '../../../../chatSlice'
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
            {contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedContact && selectedContact._id === contact._id
                        ? "bg-[#8417ff] hover:bg-[#8417ff]"
                        : "hover:bg-[#f1f1f1]"
                        }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {!isChannel &&
                            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                    :
                                    // <input type="file" />
                                    <div className={`uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
                                        {contact.firstName.split('')[0]}
                                    </div>
                                }
                            </Avatar>}

                        {isChannel && (
                            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                                #
                            </div>
                        )}
                        {isChannel ? (
                            <span>{contact.name}</span>
                        ) : (
                            <div className='flex flex-col'>
                                <span>

                                    {contact.firstName + ' ' + contact.lastName}
                                </span>
                                <span className='text-xs'>
                                    {contact.email}
                                </span>
                            </div>
                        )}

                    </div>
                </div>
            ))}
        </div>
    );

}

export default DmList
