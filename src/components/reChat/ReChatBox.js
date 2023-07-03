import React, { useState } from 'react'
import './ReChatBox.css'
import { BsEnvelope } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'
import { Form, Input } from 'reactstrap'
import { AiOutlineSend } from 'react-icons/ai'
import ScrollableFeed from 'react-scrollable-feed'
import { toast } from 'react-toastify'

function ReChatBox() {
    const [messageBox, setMessageBox] = useState(false)
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState(null)

    const sendMessage = async(e) => {
        e.preventDefault()

        if(loading)
            return;
            
        if(!content && content?.length === 0)
            return;

        setLoading(true)
        const response = await fetch('/query', {
            method:'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify({content})
        })
        const res = await response.json()
        if(response.status === 200){
            document.getElementById('message').value = ''
            setMessages(res)

        }
        else
            toast.error(res.message)
        setLoading(false)
    }
  return (
    <div>
      {!messageBox && <div className='re-chat-box-circle' onClick={()=>setMessageBox(true)}>
        <BsEnvelope />
      </div>}
      {messageBox && <div className='re-chat-box'>
        <div className='re-chat-box-header'>
            <h6>Ask Finite Lead</h6>
            <RxCross2 onClick={()=>setMessageBox(false)}/>
        </div>
        <ScrollableFeed>
            {messages?.map((msg)=>(
                <div key={msg._id} className='query'>
                    <p>{msg.content}</p>
                </div>
            ))}
            {messages?.map((msg)=>(
                <div key={msg._id} className='query'>
                    <p>{msg.content}</p>
                </div>
            ))}
            {messages?.map((msg)=>(
                <div key={msg._id} className='query'>
                    <p>{msg.content}</p>
                </div>
            ))}
            {messages?.map((msg)=>(
                <div key={msg._id} className='query'>
                    <p>{msg.content}</p>
                </div>
            ))}
            {messages?.map((msg)=>(
                <div key={msg._id} className='query'>
                    <p>{msg.content}</p>
                </div>
            ))}
            {messages?.map((msg)=>(
                <div key={msg._id} className='query'>
                    <p>{msg.content}</p>
                </div>
            ))}
        </ScrollableFeed>

        <Form onSubmit={sendMessage} className='type-message'>
            <Input type='text' id='message' onChange={(e)=>setContent(e.target.value)} placeholder='Write your query'/>
            <AiOutlineSend />
        </Form>
      </div>}
    </div>
  )
}

export default ReChatBox
