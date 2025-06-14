import React, { useState } from 'react'
import { RiCloseFill, RiEditLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { removeMemberAsync, selectChannelMembers, selectChatType, selectContacts, selectCurrentChat, setChannelMembersEmpty, setChatType, setCurrentChat } from '../../../../chatSlice';
import { FaEdit, FaPlus, FaRemoveFormat, FaSearch } from 'react-icons/fa'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { colors } from '../../../../../../lib/utils';
import { selectLoggedInUser } from '../../../../../auth/authSlice';
import { current } from '@reduxjs/toolkit';
import InlineUserSelector from './MultipleSelect';
import ChannelProfile from '../../../../../profile/ChannelProfile';
import { FiDelete, FiEdit } from 'react-icons/fi';
import { IoMdExit } from 'react-icons/io';
import { GrView } from 'react-icons/gr';
import { IoRemove } from 'react-icons/io5';


const ChatHeader = () => {
    const dispatch = useDispatch();
    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [openChannelProfileModal, setOpenChannelProfileModal] = useState(false);
    const user = useSelector(selectLoggedInUser);
    const channelMembers = useSelector(selectChannelMembers);
    const [addMembersMode, setAddMembersMode] = useState(false);
    const contacts = useSelector(selectContacts);

    const handleOpenChange = () => {
        if (addMembersMode) {
            setAddMembersMode(false);
            return;
        }
        setOpenNewContactModal(false);
        setSearchQuery('');
    }

    const handleRemoveMember = (channelId, memberId) => {
        dispatch(removeMemberAsync({ channelId, memberId }));
    }

    const handleAddMembers = () => {
        setAddMembersMode(true);
        // Logic to add members to the channel
        // This could involve opening a modal or redirecting to a contact selection page
        console.log("Add members logic goes here");
    }

    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5">
            <div className="flex gap-5 items-center">
                {chatType === "contact" &&
                    <div className="flex gap-3 items-center justify-center">
                        <div >
                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                {currentChat.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${currentChat.profileImage}`} alt="profile" />
                                    :
                                    <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[currentChat.color]} rounded-full`}>
                                        {currentChat.fullName.split('')[0]}
                                    </div>
                                }
                            </Avatar>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex gap-1 items-center'>
                                <span>
                                    {currentChat.fullName}
                                </span>
                                <span className='text-xs'>
                                    @{currentChat.username}
                                </span>
                            </div>

                            <span className='text-xs'>
                                {currentChat.bio}
                            </span>
                        </div>
                    </div>}
                {chatType === "channel" &&
                    <div className="flex gap-3 items-center justify-center">
                        <div >
                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                {currentChat.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${currentChat.profileImage}`} alt="profile" />
                                    :
                                    <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[currentChat.color]} rounded-full`}>
                                        {currentChat.name.split('')[0]}
                                    </div>
                                }
                            </Avatar>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex gap-1 items-center'>
                                <span>
                                    {currentChat.name}
                                </span>
                                <span className='text-xs'>
                                    @{currentChat.handle}
                                </span>
                            </div>

                            <span className='text-xs'>
                                {currentChat.bio}
                            </span>
                        </div>

                        <Tooltip>
                            <TooltipTrigger>
                                <GrView
                                    className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                                    onClick={() => {
                                        setOpenNewContactModal(true);
                                    }}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                View Channel
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <RiEditLine
                                    className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                                    onClick={() => {
                                        setOpenChannelProfileModal(true);
                                    }}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                Edit Channel
                            </TooltipContent>
                        </Tooltip>

                        <Dialog open={openNewContactModal} onOpenChange={handleOpenChange}>
                            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>

                                        <div className='flex gap-1 items-center'>
                                            <span className='text-xl'>
                                                {currentChat.name}
                                            </span>
                                            <span className='text-sm'>
                                                @{currentChat.handle}
                                            </span>
                                        </div>

                                    </DialogTitle>
                                    <DialogDescription>{currentChat.bio}</DialogDescription>
                                </DialogHeader>
                                {addMembersMode ? <InlineUserSelector setAddMembersMode={setAddMembersMode} /> :
                                    <>
                                        <div className='flex gap-3 items-center'>
                                            <div className='w-3/4 flex items-center justify-around bg-gray-600 gap-3 py-3 rounded-md'>
                                                <span>
                                                    {channelMembers.length}{channelMembers.length === 1 || channelMembers.length === 0 ? " member" : " members"}
                                                </span>
                                                <FaSearch />
                                            </div>
                                            <button type='button' className="w-1/4 bg-[#8417ff] rounded-md flex items-center justify-center px-5 py-3 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all cursor-pointer" onClick={handleAddMembers} >+ Add</button>
                                        </div>
                                        <ScrollArea className="mt-3 h-[200px]">
                                            <div className='flex flex-col justify-center'>
                                                <div className='flex gap-3 items-center justify-start cursor-pointer rounded-lg hover:bg-gray-700 p-2'>
                                                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                        {currentChat.admin.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${currentChat.admin.profileImage}`} alt="profile" />
                                                            :
                                                            <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[currentChat.admin.color]} rounded-full`}>
                                                                {currentChat.admin.fullName.split('')[0]}
                                                            </div>
                                                        }
                                                    </Avatar>
                                                    <div className='flex flex-col'>
                                                        <span>

                                                            {currentChat.admin.fullName}
                                                        </span>
                                                        <span className='text-xs'>
                                                            @{currentChat.admin.username}
                                                        </span>
                                                    </div>
                                                    <span className='text-white rounded-md bg-green-700 px-2'>
                                                        admin
                                                    </span>
                                                </div>
                                                {channelMembers.map((contact) => (
                                                    <div className='flex items-center justify-between'>
                                                        <div className='w-full flex gap-3 items-center justify-start cursor-pointer rounded-lg hover:bg-gray-700 p-2' key={contact._id}>
                                                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                                {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                                                    :
                                                                    <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
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
                                                            <span className='text-white rounded-md bg-yellow-700 px-2'>
                                                                member
                                                            </span>
                                                        </div>
                                                        {/* <div className='flex justify-center items-center'> */}
                                                        <FiDelete color='red' size='20' className='cursor-pointer ml-[24px]' onClick={() => handleRemoveMember(currentChat._id, contact._id)} />
                                                        {/* </div> */}
                                                    </div>))}
                                            </div>
                                        </ScrollArea>
                                    </>}
                            </DialogContent>
                        </Dialog>

                        <ChannelProfile openChannelProfileModal={openChannelProfileModal} setOpenChannelProfileModal={setOpenChannelProfileModal} />

                    </div>}

                <div className="flex items-center justify-center gap-5">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all hover:text-neutral-300" onClick={() => {
                        dispatch(setCurrentChat(null));
                        dispatch(setChatType(null));
                        if (channelMembers.length !== 0) {
                            dispatch(setChannelMembersEmpty());
                        };
                    }}>
                        <RiCloseFill className="text-3xl cursor-pointer" />
                    </button>
                </div>
            </div>
        </div>

    )
}

export default ChatHeader
