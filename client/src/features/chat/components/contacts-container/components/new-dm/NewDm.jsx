import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from '../../../../../../lib/utils'
import { ScrollArea } from "@/components/ui/scroll-area"
// import { searchedQuery } from '../../../../chatAPI'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchContactsAsync, selectContacts, setContactsNull, setSelectedContact, setSelectedChatType } from '../../../../chatSlice'
// import { set } from 'mongoose'

const NewDm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const dispatch = useDispatch();
    const contacts = useSelector(selectContacts);
    const handleNewContact = () => {
        setOpenNewContactModal(false);
        setSearchQuery('');
        dispatch(setContactsNull());
    };
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
        dispatch(setContactsNull());
        if (e.target.value.trim().length > 0) {
            dispatch(searchContactsAsync({ searchTerm: e.target.value }));
        }
    }
    const handleSelectContact = (contact) => {
        dispatch(setSelectedChatType('contact'));
        setOpenNewContactModal(false);
        setSearchQuery('');
        dispatch(setContactsNull());
        dispatch(setSelectedContact(contact));
    }
    return (
        <>
            {/* <TooltipProvider> */}
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus
                        className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        onClick={() => {
                            setOpenNewContactModal(true);
                        }}
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Select New Contact
                </TooltipContent>
            </Tooltip>
            {/* </TooltipProvider> */}
            <Dialog open={openNewContactModal} onOpenChange={handleNewContact}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription>howdy</DialogDescription>
                    </DialogHeader>
                    <div>
                        <input
                            placeholder="Search Contacts"
                            className="rounded-lg p-3 bg-[#2c2e3b] border-none w-full"
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                    </div>
                    <ScrollArea className="mt-3 h-[200px]">
                        <div className='flex flex-col justify-center'>
                            {contacts && contacts.map((contact) => (
                                <div className='flex gap-3 items-center justify-start cursor-pointer rounded-lg hover:bg-gray-700 p-3' key={contact._id} onClick={() => handleSelectContact(contact)}>
                                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                        {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                            :
                                            // <input type="file" />
                                            <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
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
                                </div>))}
                        </div>


                    </ScrollArea>
                    {/* {contacts &&
                        <div className="flex flex-col gap-3 mt-5 overflow-y-auto h-[300px]">
                            {contacts.map((contact) => (
                                <div
                                    key={contact._id}   >{contact.firstName}</div>))}</div>} */}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewDm;
