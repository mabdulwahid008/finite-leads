import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'

function ScrollableMessage({ messages }) {
    const myId = localStorage.getItem('user')
  return (
    <ScrollableFeed>
        {messages && messages.map((message)=>{
            if(message.content)
            return <div key={message._id} className={`message ${myId == message.sender_id ? 'message-right': 'message-left'}`}>
                <p>{myId === message.sender_id ? 'You' : message.sender}</p>
                <p>{message.content}</p>
            </div>
        })}
    </ScrollableFeed>
  )
}

export default ScrollableMessage