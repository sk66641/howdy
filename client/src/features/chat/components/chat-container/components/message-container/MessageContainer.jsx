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
import { useSocket } from '../../../../../../context/SocketContext';
// import { getChannelMessages } from '../../../../../../../../server/controllers/ChannelController';

const MessageContainer = () => {
  const socket = useSocket();
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

  const handleDirectMessageDelete = (messageId) => {
    socket.emit('delete-direct-message', {
      senderId: user._id,
      receiverId: currentChat._id,
      messageId: messageId,
    });
  }

  const handleChannelMessageDelete = (channelMessageId, byAdmin) => {
    console.log("handleChannelMessageDelete", byAdmin)
    if (byAdmin) {
      socket.emit('delete-channel-message-by-admin', {
        channelId: currentChat._id,
        channelMessageId: channelMessageId,
      });
      return;
    }
    socket.emit('delete-channel-message', {
      channelId: currentChat._id,
      channelMessageId: channelMessageId,
    });
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
              className={`relative group inline-block p-3 rounded-lg my-1 break-words ${isCurrentUser
                ? "bg-[#8417ff] text-white rounded-tr-none"
                : "bg-[#2a2b33] text-white rounded-tl-none"
                }`}
              style={{ wordBreak: 'break-word' }}
            >
              {/* Enhanced Delete Button */}
              {message.sender === user._id &&
                <button
                  onClick={() => handleDirectMessageDelete(message._id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                         bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110"
                  title="Delete message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>}
              {message.content}
            </div>
          )}

          {/* File Messages */}
          {message.messageType === "file" && (
            <div
              className={`relative group inline-block p-2 rounded-lg my-1 ${isCurrentUser
                ? "bg-[#8417ff]/10 border border-[#8417ff]/20 rounded-tr-none"
                : "bg-[#2a2b33]/10 border border-[#2a2b33]/20 rounded-tl-none"
                }`}
            >
              {/* Enhanced Delete Button */}
              {message.sender === user._id &&
                <button
                  onClick={() => handleDirectMessageDelete(message._id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                         bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110 z-10"
                  title="Delete message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>}

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
    const isCurrentUser = user._id === message.sender._id;
    const admin = user._id === currentChat.admin._id;

    return (
      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
        {!isCurrentUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              {message.sender.profileImage ? (
                <img
                  src={`${import.meta.env.VITE_HOST}/${message.sender.profileImage}`}
                  alt={message.sender.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {message.sender.profileImage ? (
                    <AvatarImage
                      className="object-cover w-full h-full bg-black"
                      src={`${import.meta.env.VITE_HOST}/${message.sender.profileImage}`}
                      alt="profile"
                    />
                  ) : (
                    <div className={`uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center ${colors[message.sender.color]} rounded-full`}>
                      {message.sender.fullName.split('')[0]}
                    </div>
                  )}
                </Avatar>
              )}
            </div>
          </div>
        )}

        <div className={`max-w-[70%] ${isCurrentUser ? "text-right" : "text-left"}`}>
          {!isCurrentUser && (
            <div className="text-sm font-medium mb-1">
              <span className="text-gray-200">{message.sender.fullName}</span>
              <span className="text-gray-400 ml-2">@{message.sender.username}</span>
            </div>
          )}

          {/* Text Messages */}
          {message.isDeleted &&
            <span className='text-red-500'>Deleted by admin</span>
          }

          {!message.isDeleted && message.messageType === "text" && (
            <div
              className={`relative group inline-block p-3 rounded-lg my-1 break-words ${isCurrentUser
                ? "bg-[#8417ff] text-white rounded-tr-none"
                : "bg-[#2a2b33] text-white rounded-tl-none"
                }`}
              style={{ wordBreak: 'break-word' }}
            >
              {/* Enhanced Delete Button */}
              {(isCurrentUser || admin) && (
                <button
                  onClick={() =>
                    handleChannelMessageDelete(message._id, (admin && !isCurrentUser))}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                          bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110"
                  title="Delete message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {message.content}
            </div>
          )}

          {/* File Messages */}
          {!message.isDeleted && message.messageType === "file" && (
            <div
              className={`relative group inline-block p-2 rounded-lg my-1 ${isCurrentUser
                ? "bg-[#8417ff]/10 border border-[#8417ff]/20 rounded-tr-none"
                : "bg-[#2a2b33]/10 border border-[#2a2b33]/20 rounded-tl-none"
                }`}
            >
              {/* Enhanced Delete Button */}
              {(isCurrentUser || isAdmin) && (
                <button
                  onClick={() => {
                    handleChannelMessageDelete(message._id, message.sender !== currentChat.admin._id);
                  }}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                          bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110 z-10"
                  title="Delete message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

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
                    <span className='text-gray-200'>{message.fileURL.split("/").pop()}</span>
                  </div>
                  {!isDownloading ? (
                    <button
                      onClick={() => dispatch(downloadFileAsync(message.fileURL))}
                      className="bg-black/20 p-2 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    >
                      <IoMdArrowRoundDown color={isCurrentUser ? "#8417ff" : "grey"} />
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">{FileDownloadProgress}%</span>
                  )}
                </div>
              )}
            </div>
          )}

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
