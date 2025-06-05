import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser, signOutAsync } from '../../../../../auth/authSlice'
import { colors } from '../../../../../../lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger, TooltipProvider
} from "@/components/ui/tooltip"
import { FiEdit, FiEdit2 } from 'react-icons/fi'
import { IoPower } from 'react-icons/io5'
import { Navigate, useNavigate } from 'react-router-dom'

// import <Avatar></Avatar>

const ProfileInfo = () => {
    const user = useSelector(selectLoggedInUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className='flex gap-5 items-center justify-center'>
                <div >
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {user.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${user.profileImage}`} alt="profile" />
                            :
                            // <input type="file" />
                            <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[user.color]} rounded-full`}>
                                {user.firstName.split('')[0]}
                            </div>
                        }
                    </Avatar>
                </div>
                <div className='flex flex-col'>
                    <span>
                        {user.firstName + ' ' + user.lastName}
                    </span>
                    <span className='text-xs'>
                        {user.email}
                    </span>
                </div>
                <div className='flex gap-5 items-center justify-center'>
                    {/* <TooltipProvider> */}
                    <Tooltip>
                        <TooltipTrigger className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:text-neutral-300">
                            <FiEdit2 onClick={() => navigate('/profile')} className="text-2xl" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Logout
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:text-neutral-300">
                            <IoPower onClick={() => dispatch(signOutAsync())} className="text-2xl" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Logout
                        </TooltipContent>
                    </Tooltip>
                    {/* </TooltipProvider> */}
                </div>
            </div>
        </div>

    )
}

export default ProfileInfo
