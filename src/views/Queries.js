import React from 'react'
import { Button, Form, Input } from 'reactstrap'

function Queries() {
  return (
    <div className='chatscreen'>
        <div className='chatscreen-left'>
            <div className='chat-header'>
                <h4>Inbox</h4>
            </div>
            <div className='groups'>
                {/* {!myGroups && <div style={{color: 'white', padding:'10px 0'}}>No groups yet</div>}
                {myGroups && myGroups.length === 0 && <div style={{padding:10, color:'white'}}>No groups yet</div>}
                {myGroups && myGroups.map((group, index) => {
                    return  <div className='group' key={index} onClick={()=>{setSelectedGroup(group); socket.emit('join chat', group._id)}}>
                                <h5>{group.groupname}</h5>
                                {group.latestmessage && <p><span>{localStorage.getItem('user') == group.latestmessage_sender_id ? 'You' : group.latestmessage_sender_name}</span>: {group.latestmessage.substr(0, 30)}</p>}
                                {!group.latestmessage && <p>No mesages yet</p>}
                            </div>
                })}
                */}
            </div>
        </div>
        <div className='chatscreen-right'>
            <div className='chat-header'>
            </div>
            <div className='chatbox'>
                <div> No messages yet </div>
                {/* {messages && <ScrollableMessage messages={messages}/>} */}
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
