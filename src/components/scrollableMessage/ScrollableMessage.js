import React from 'react'

function ScrollableMessage({ messages }) {
    const myId = messages[messages.length - 1].requested_User;
  return (
    <>
        {messages && messages.map((message)=>{
            if(message.content)
            return <div key={message._id} className={`message ${myId === message.sender._id ? 'message-right': 'message-left'}`}>
                <p>{message.sender.name}</p>
                <p>{message.content}</p>
            </div>
        })}
    </>
  )
}

export default ScrollableMessage