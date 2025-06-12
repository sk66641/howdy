import React from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedChatType, selectSelectedContact, setSelectedChatType, setSelectedContact } from '../../../../chatSlice';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../../../../../lib/utils';


const ChatHeader = () => {
    const dispatch = useDispatch();
    const selectedContact = useSelector(selectSelectedContact);
    const selectedChatType = useSelector(selectSelectedChatType);
    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5">
            <div className="flex gap-5 items-center">
                {selectedChatType === "contact" ?
                    <div className="flex gap-3 items-center justify-center">
                        <div >
                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                {selectedContact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${selectedContact.profileImage}`} alt="profile" />
                                    :
                                    // <input type="file" />
                                    <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[selectedContact.color]} rounded-full`}>
                                        {selectedContact.firstName.split('')[0]}
                                    </div>
                                }
                            </Avatar>
                        </div>
                        <div className='flex flex-col'>
                            <span>
                                {selectedContact.firstName + ' ' + selectedContact.lastName}
                            </span>
                            <span className='text-xs'>
                                {selectedContact.email}
                            </span>
                        </div>
                    </div> :
                    <div className="flex gap-3 items-center justify-center">
                        <div >
                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                {selectedContact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${selectedContact.profileImage}`} alt="profile" />
                                    :
                                    // <input type="file" />
                                    <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[selectedContact.color]} rounded-full`}>
                                        {selectedContact.name.split('')[0]}
                                    </div>
                                }
                            </Avatar>
                        </div>
                        <span>
                            {selectedContact.name}
                        </span>

                    </div>}

                <div className="flex items-center justify-center gap-5">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all hover:text-neutral-300" onClick={() => {
                        dispatch(setSelectedContact(null));
                        dispatch(setSelectedChatType(null))
                    }}>
                        <RiCloseFill className="text-3xl cursor-pointer" />
                    </button>
                </div>
            </div>
        </div>

    )
}

export default ChatHeader
