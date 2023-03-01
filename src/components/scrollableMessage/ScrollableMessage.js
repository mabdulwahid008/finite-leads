import React from 'react'

function ScrollableMessage({ messages }) {
    const myId = localStorage.getItem('user')
  return (
    <>
        {messages && messages.map((message)=>{
            if(message.content)
            return <div key={message._id} className={`message ${myId === message.sender._id ? 'message-right': 'message-left'}`}>
                <p>{myId === message.sender._id ? 'You' : message.sender.name}</p>
                <p>{message.content}</p>
            </div>
        })}
    </>
  )
}

export default ScrollableMessage