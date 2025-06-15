import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser } from '../../../../../auth/authSlice'
import { downloadFileAsync, getChannelMessagesAsync, getMessagesAsync, selectFileDownloadProgress, selectFileUploadProgress, selectIsDownloading, selectIsUploading, selectChatMessages, selectChatType, selectCurrentChat, setFileDownloadProgress } from '../../../../chatSlice';
import moment from 'moment';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { GrDocumentZip, GrUpload } from 'react-icons/gr';
import { IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../../../../../lib/utils';
// import { getChannelMessages } from '../../../../../../../../server/controllers/ChannelController';

const MessageContainer = () => {
  const scrollRef = useRef();
  const user = useSelector(selectLoggedInUser);
  const currentChat = useSelector(selectCurrentChat);
  const chatMessages = useSelector(selectChatMessages);
  const chatType = useSelector(selectChatType);
  const dispatch = useDispatch();
  const [showImage, setShowImage] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const isDownloading = useSelector(selectIsDownloading);
  const isUploading = useSelector(selectIsUploading);
  const FileUploadProgress = useSelector(selectFileUploadProgress);
  const FileDownloadProgress = useSelector(selectFileDownloadProgress);

  useEffect(() => {

    if (chatType == "contact") {
      dispatch(getMessagesAsync({
        senderId: user._id,
        receiverId: currentChat._id,
      }));
    }
    else if (chatType == "channel") {
      dispatch(getChannelMessagesAsync({ channelId: currentChat._id }))
    }
  }, [chatType, currentChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [chatMessages]);


  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const handleImageClick = (filePath) => {
    setShowImage(true);
    setFilePath(filePath);
  }

  const renderMessages = () => {
    let lastDate = null;
    // console.log(chatMessages)

    return (
      chatMessages.map((message, index) => {
        const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <div key={index}>
            {showDate && (
              <div className="text-center text-gray-500 my-2">
                {moment(message.timestamp).format("LL")}
              </div>
            )}
            {chatType === "contact" && renderDMMessages(message)}
            {chatType === "channel" && renderChannelMessages(message)}
          </div>
        );
      }));
  };

  const renderDMMessages = (message) => {
    const isCurrentUser = message.sender === user._id;

    return (
      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-[70%] ${isCurrentUser ? "text-right" : "text-left"}`}>
          {/* Text Messages */}
          {message.messageType === "text" && (
            <div
              className={`inline-block p-3 rounded-lg my-1 break-words ${isCurrentUser
                ? "bg-[#8417ff] text-white rounded-tr-none"
                : "bg-[#2a2b33] text-white rounded-tl-none"
                }`}
              style={{ wordBreak: 'break-word' }}
            >
              {message.content}
            </div>
          )}

          {/* File Messages */}
          {message.messageType === "file" && (
            <div
              className={`inline-block p-2 rounded-lg my-1 ${isCurrentUser
                ? "bg-[#8417ff]/10 border border-[#8417ff]/20 rounded-tr-none"
                : "bg-[#2a2b33]/10 border border-[#2a2b33]/20 rounded-tl-none"
                }`}
            >
              {checkIfImage(message.fileURL) ? (
                <div onClick={() => handleImageClick(message.fileURL)} className='cursor-pointer'>
                  <img
                    className="max-h-64 rounded-md"
                    src={`${import.meta.env.VITE_HOST}/${message.fileURL}`}
                    alt="img"
                  />
                </div>
              ) : (
                <div className="flex items-center flex-wrap justify-between gap-4 p-2">
                  <div className="flex items-center gap-3">
                    <GrDocumentZip color={isCurrentUser ? "#8417ff" : "grey"} size={24} />
                    <span className={isCurrentUser ? "text-[#8417ff]" : "text-gray-200"}>
                      {message.fileURL.split("/").pop()}
                    </span>
                  </div>
                  {!isDownloading ? (
                    <button
                      onClick={() => dispatch(downloadFileAsync(message.fileURL))}
                      className="bg-black/20 p-2 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    >
                      <IoMdArrowRoundDown color={isCurrentUser ? "#8417ff" : "grey"} />
                    </button>
                  ) : (
                    <span className={`text-sm ${isCurrentUser ? "text-[#8417ff]/80" : "text-gray-400"}`}>
                      {FileDownloadProgress}%
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Timestamp and Read Receipts */}
          <div className={`text-xs mt-1 ${isCurrentUser ? "text-gray-400" : "text-gray-500"}`}>
            {moment(message.timestamp).format("hh:mm A")}
            {message.isRead && isCurrentUser && (
              <span className="ml-1 text-blue-400">✓✓</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`flex ${user._id === message.sender._id ? "justify-end" : "justify-start"} mb-4`}
      >
        {user._id !== message.sender._id && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              {message.sender.profileImage ? (
                <img
                  src={`${import.meta.env.VITE_HOST}/${message.sender.profileImage}`}
                  alt={message.sender.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                // <div>hi</div>
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {message.sender.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${message.sender.profileImage}`} alt="profile" />
                    :
                    <div className={`uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center ${colors[message.sender.color]} rounded-full`}>
                      {message.sender.fullName.split('')[0]}
                    </div>
                  }
                </Avatar>
              )}
            </div>
          </div>
        )}

        <div className={`max-w-[70%] ${user._id === message.sender._id ? "text-right" : "text-left"}`}>
          {user._id !== message.sender._id && (
            <div className="text-sm font-medium mb-1">
              <span className="text-gray-200">{message.sender.fullName}</span>
              <span className="text-gray-400 ml-2">@{message.sender.username}</span>
            </div>
          )}

          {message.messageType === "text" && (
            <div
              className={`inline-block p-3 rounded-lg my-1 break-words ${user._id === message.sender._id
                ? "bg-[#8417ff] text-white rounded-tr-none"
                : "bg-[#2a2b33] text-white rounded-tl-none"
                }`}
              style={{ wordBreak: 'break-word' }}
            >
              {message.content}
            </div>
          )}

          {message.messageType === "file" && (
            <div
              className={`inline-block p-2 rounded-lg my-1 ${user._id === message.sender._id
                ? "bg-[#8417ff]/10 border border-[#8417ff]/20 rounded-tr-none"
                : "bg-[#2a2b33]/10 border border-[#2a2b33]/20 rounded-tl-none"
                }`}
            >
              {checkIfImage(message.fileURL) ? (
                <div onClick={() => handleImageClick(message.fileURL)} className='cursor-pointer'>
                  <img
                    className="max-h-64 rounded-md"
                    src={`${import.meta.env.VITE_HOST}/${message.fileURL}`}
                    alt="img"
                  />
                </div>
              ) : (
                <div className="flex items-center flex-wrap justify-between gap-4 p-2">
                  <div className="flex items-center gap-3">
                    <GrDocumentZip color={user._id === message.sender._id ? "#8417ff" : "grey"} size={24} />
                    <span className='text-gray-200'>{message.fileURL.split("/").pop()}</span>
                  </div>
                  {!isDownloading ? (
                    <button
                      onClick={() => dispatch(downloadFileAsync(message.fileURL))}
                      className="bg-black/20 p-2 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    >
                      <IoMdArrowRoundDown color={user._id === message.sender._id ? "#8417ff" : "grey"} />
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">{FileDownloadProgress}%</span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className={`text-xs mt-1 ${user._id === message.sender._id ? "text-gray-400" : "text-gray-500"}`}>
            {moment(message.timestamp).format("hh:mm A")}
            {message.isRead && user._id === message.sender._id && (
              <span className="ml-1 text-blue-400">✓✓</span>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className='flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-hidden'>
      {renderMessages()}
      {
        showImage && (
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex flex-col items-center justify-center backdrop-blur-lg">
            <div>
              <img src={`${import.meta.env.VITE_HOST}/${filePath}`} alt="img" className='h-[80vh]' />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => dispatch(downloadFileAsync(filePath))}
              >
                <IoMdArrowRoundDown />
              </button>
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  setShowImage(false);
                  setFilePath(null)
                }}
              >
                <IoCloseSharp />
              </button>
            </div>
          </div>
        )
      }
      {
        isUploading && <span> <GrUpload />
          Uploading... {FileUploadProgress}%
        </span>
      }
      <div ref={scrollRef} />
    </div>
  )
}

export default MessageContainer
