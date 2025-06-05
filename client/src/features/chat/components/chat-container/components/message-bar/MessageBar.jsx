import React from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useRef, useEffect } from 'react'

const MessageBar = () => {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [message, setMessage] = useState('');
    const handleEmojiClick = (emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };
    const emojiRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        // console.log("hi")
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [emojiRef]);


    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <GrAttachment className="text-2xl" />
                </button>

                <div className="relative">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:text-neutral-300" onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div ref={emojiRef} className="absolute bottom-16 right-0">
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            autoFocusSearch={false}
                            theme="dark"
                            open={emojiPickerOpen}

                        />
                    </div>
                </div>
            </div>

            <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all">
                <IoSend className="text-2xl" />
            </button>
        </div>

    )
}

export default MessageBar
