import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser } from '../../../../../auth/authSlice'
import { downloadFileAsync, getChannelMessagesAsync, getMessagesAsync, selectFileDownloadProgress, selectFileUploadProgress, selectIsDownloading, selectIsUploading, selectChatMessages, selectChatType, selectCurrentChat, setFileDownloadProgress } from '../../../../chatSlice';
import moment from 'moment';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { GrDocumentZip, GrUpload } from 'react-icons/gr';
import { IoCloseSharp } from 'react-icons/io5';
import axios from 'axios';
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
    return (

      <div
        className={`${message.sender !== user._id ? "text-left" : "text-right"

          }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${message.sender !== user._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${message.sender === currentChat._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileURL) ?
              <div onClick={() => handleImageClick(message.fileURL)} className='cursor-pointer'>
                <img height={300} width={300} src={`${import.meta.env.VITE_HOST}/${message.fileURL}`} alt="img" />
              </div> :
              <div className="flex items-center flex-wrap justify-center gap-4">
                {/* <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3"> */}
                <GrDocumentZip color='grey' size={24} />
                {/* </span> */}
                <span className='text-center'>{message.fileURL.split("/").pop()}</span>
                {
                  !isDownloading ? <span onClick={() => dispatch(downloadFileAsync(message.fileURL))} className="bg-black/20 p-3 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  >
                    <IoMdArrowRoundDown />
                  </span> : <span>{FileDownloadProgress}%</span>
                }


              </div>

            }
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    )
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`${user._id === message.sender._id ? "text-right" : "text-left"

          }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${user._id === message.sender._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${user._id === currentChat._id
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileURL) ?
              <div onClick={() => handleImageClick(message.fileURL)} className='cursor-pointer'>
                <img height={300} width={300} src={`${import.meta.env.VITE_HOST}/${message.fileURL}`} alt="img" />
              </div> :
              <div className="flex items-center flex-wrap justify-center gap-4">
                {/* <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3"> */}
                <GrDocumentZip color='grey' size={24} />
                {/* </span> */}
                <span className='text-center'>{message.fileURL.split("/").pop()}</span>
                {
                  !isDownloading ? <span onClick={() => dispatch(downloadFileAsync(message.fileURL))} className="bg-black/20 p-3 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  >
                    <IoMdArrowRoundDown />
                  </span> : <span>{FileDownloadProgress}%</span>
                }


              </div>

            }
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>)
  }

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
