import React from 'react'
import { Card, CardHeader, CardTitle, Form, Input } from 'reactstrap'
import '../assets/additional/chatbox.css'

function ChatBox() {
  return (
    <div className='chatscreen'>
        <div className='chatscreen-left'>
            <div className='chat-header'>
                <h4>My Chats</h4>
            </div>
            <div className='groups'>
                <div className='group'>
                    <h5>Group Name</h5>
                    <p><span>Bilal</span>: Hello there</p>
                </div>
                <div className='group'>
                    <h5>Group Name</h5>
                    <p><span>Bilal</span>: Hello there Hello there Hello there</p>
                </div>
                <div className='group'>
                    <h5>Group Name</h5>
                    <p><span>Bilal</span>: Hello there</p>
                </div>
                <div className='group'>
                    <h5>Group Name</h5>
                    <p><span>Bilal</span>: Hello there</p>
                </div>
                <div className='group'>
                    <h5>Group Name</h5>
                    <p><span>Bilal</span>: Hello there</p>
                </div>
                <div className='group'>
                    <h5>Group Name</h5>
                    <p><span>Bilal</span>: Hello there</p>
                </div>
            </div>
        </div>
        <div className='chatscreen-right'>
            <div className='chat-header'>
                <h4>Chatgroup</h4>
            </div>
            <div className='chatbox'>
                hhhhhhhhhhhhh
            </div>
            <Form>
                <div className='send-box'>
                    <Input type='text' placeholder='Write something ...'/>
                    <i className='nc-icon nc-send' />
                </div>
            </Form>
        </div>
    </div>
  )
}

export default ChatBox