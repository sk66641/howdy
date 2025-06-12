import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info/ProfileInfo'
import NewDm from './components/new-dm/NewDm'
import { FiMessageCircle, FiMessageSquare } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser } from '../../../auth/authSlice'
import { getChannelsAsync, getDmContactListAsync, selectDmContactList } from '../../chatSlice'
import DmList from './components/dm-list/DmList'
import CreateChannel from './components/create-channel/CreateChannel'

const Contacts = () => {

    const user = useSelector(selectLoggedInUser);
    const dispatch = useDispatch();
    const DmContactList = useSelector(selectDmContactList);
    // console.log("DmContactList", DmContactList);


    useEffect(() => {
        dispatch(getDmContactListAsync(user._id));
        dispatch(getChannelsAsync(user._id));
    }, [user]);

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            <div className="pt-3 flex items-center px-5 gap-3">
                <FiMessageSquare color='yellow' />
                <span>HOWDY</span>
            </div>

            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Direct Messages" />
                    <NewDm />
                </div>
                <div className="max-h-[38vw] overflow-y-auto scrollbar-hidden">
                    <DmList />
                </div>
            </div>

            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Channels" />
                    <CreateChannel />
                </div>
                <div className="max-h-[38vw] overflow-y-auto scrollbar-hidden">
                    <DmList isChannel={true} />
                </div>
            </div>
            <ProfileInfo />
        </div>
    )
}

export default Contacts


const Title = ({ text }) => {
    return (
        <h2 className="text-gray-400 text-lg font-semibold pl-5">
            {text}
        </h2>
    )
}