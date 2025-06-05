import React from 'react'
import ProfileInfo from './components/profile-info/ProfileInfo'
import NewDm from './components/new-dm/NewDm'
import { FiMessageCircle, FiMessageSquare } from 'react-icons/fi'

const Contacts = () => {
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
            </div>

            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Channels" />
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