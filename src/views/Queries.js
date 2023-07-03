import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { toast } from 'react-toastify'
import { Button, Form, Input } from 'reactstrap'

function Queries() {

    const [chats, setChats] = useState(null)
    const [messages, setMessages] = useState(null)
    const [selectedChat, setSelectedChat] = useState(null)
    

    const fetchChats = async () => {
        const response = await fetch('/query/admin/chat', {
            method:'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setChats(res)
        }
        else
            toast.error(res.message)
    }

    const fetchMessagges = async () => {
        const response = await fetch(`/query/${selectedChat?._id}`, {
            method:'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setMessages(res)
            console.log(res);
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        fetchMessagges()
    }, [selectedChat])
    useEffect(()=>{
        fetchChats()
    }, [])
  return (
    <div className='chatscreen'>
        <div className='chatscreen-left'>
            <div className='chat-header'>
                <h4>Inbox</h4>
            </div>
            <div className='groups'>
                {!chats || chats?.length === 0 && <div style={{padding:10, color:'white'}}>No chats yet</div>}
                {chats && chats.map((chat, index) => {
                    return  <div className='group query-group' key={index} onClick={()=>setSelectedChat(chat)} style={{backgroundColor: chat._id === selectedChat?._id ? '#212120' : '' }}>
                                <h5>{chat.name}</h5>
                                <div>{chat.unread}</div>
                            </div>
                })}
               
            </div>
        </div>
        <div className='chatscreen-right'>
            <div className='chat-header'>
                <h4>{selectedChat?.name}</h4>
            </div>
            <div className='chatbox'>
                <ScrollableFeed>
                    {messages?.map((msg)=>(
                        <div  key={msg._id} className={`query ${localStorage.getItem('user') == msg.sender_id ? 'query-right' : 'query-left'}`}>
                            <p>{msg.content}</p>
                        </div>
                    ))}
                    {messages?.map((msg)=>(
                        <div  key={msg._id} className={`query ${localStorage.getItem('user') == msg.sender_id ? 'query-right' : 'query-left'}`}>
                            <p>{msg.content}</p>
                        </div>
                    ))}
                    {messages?.map((msg)=>(
                        <div  key={msg._id} className={`query ${localStorage.getItem('user') == msg.sender_id ? 'query-right' : 'query-left'}`}>
                            <p>{msg.content}</p>
                        </div>
                    ))}
                </ScrollableFeed>
            </div>
            <Form>
                <div className='send-box'>
                    <Input type='text' placeholder='Write something ...' required/>
                    <Button>
                        <i className='nc-icon nc-send' />
                    </Button>
                </div>
            </Form>
        </div>
    </div>
  )
}

export default Queries
