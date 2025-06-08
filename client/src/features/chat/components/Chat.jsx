import React from 'react'
import ChatContainer from './chat-container/ChatContainer'
import Contacts from './contacts-container/Contacts'
import EmptyChat from './empty-chat-container/EmptyChat'
import { selectSelectedChatType, selectSelectedContact } from '../chatSlice'
import { useSelector } from 'react-redux'

const Chat = () => {
  // const openNewContactModal = useSelector(selectOpenNew  ContactModal);
  const selectedChatType = useSelector(selectSelectedChatType);

  return (
    <div className="flex h-[100vh] overflow-hidden text-white">
      <Contacts />
      {selectedChatType ? <ChatContainer /> : <EmptyChat />}
    </div>
  )
}

export default Chat
