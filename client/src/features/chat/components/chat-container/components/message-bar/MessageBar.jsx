import React from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFilePath, selectSelectedChatType, selectSelectedContact, uploadFileAsync } from '../../../../chatSlice'
import { useSocket } from '../../../../../../context/SocketContext'
import { selectLoggedInUser } from '../../../../../auth/authSlice'

const MessageBar = () => {
    const socket = useSocket();
    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [message, setMessage] = useState('');
    const selectedContact = useSelector(selectSelectedContact);
    const selectedChatType = useSelector(selectSelectedChatType);
    const filePath = useSelector(selectFilePath);
    const user = useSelector(selectLoggedInUser);
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        console.log("Sending message:", message);

        if (selectedChatType === 'contact') {
            socket.emit('sendMessage', {
                sender: user._id,
                receiver: selectedContact._id,
                content: message,
                messageType: 'text',
            });
        }
        if (selectedChatType === "channel") {
            socket.emit('send-channel-message', {
                sender: user._id,
                content: message,
                messageType: 'text',
                receiver: null,
                channelId: selectedContact._id,
                fileURL: undefined,
            })
        }
        setMessage('');
    }

    const handleAttachmentClick = () => {
        fileInputRef.current.click();
    };

    const handleAttachmentChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large! Must be under 5MB.");
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        // dispatch(setIsUploading(true));
        dispatch(uploadFileAsync(formData));

    }

    useEffect(() => {
        if (filePath) {
            console.log("File uploaded successfully:", filePath);
            if (selectedChatType === 'contact') {
                socket.emit('sendMessage', {
                    sender: user._id,
                    receiver: selectedContact._id,
                    messageType: 'file',
                    fileURL: filePath,
                });
            }
            else if( selectedChatType === 'channel') {
                socket.emit('send-channel-message', {
                    sender: user._id,
                    channelId: selectedContact._id,
                    receiver: null,
                    messageType: 'file',
                    fileURL: filePath,
                    content: undefined,
                });
            }
            // dispatch(setIsUploading(false));
            // console.log("File uploaded successfully:", filePath);
        }
    }, [filePath])


    return (
        <form onSubmit={handleSendMessage} className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input
                    type="text"
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button onClick={handleAttachmentClick} type='button' className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <GrAttachment className="text-2xl" />
                </button>
                <input type='file' className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />
                <div className="relative">
                    <button type='button' className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:text-neutral-300" onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
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

            <button type='submit' disabled={message.trim() === ""} className={`bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all ${message.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
                <IoSend className="text-2xl" />
            </button>
        </form>

    )
}

export default MessageBar
