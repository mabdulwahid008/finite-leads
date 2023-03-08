import CreateGroupPopup from 'components/createGroupPopup/CreateGroupPopup'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Form, Input } from 'reactstrap'
import '../assets/additional/chatbox.css'
import Loading from '../components/Loading/Loading'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { HiUserAdd, HiUserRemove } from 'react-icons/hi';
import GroupDetails from 'components/groupDetails/GroupDetails'
import EditGroupName from 'components/editGroupName/EditGroupName'
import RemoveUserFromGroup from 'components/removeUserFromGroup/RemoveUserFromGroup'
import AddnewUserPopup from 'components/addnewUserGroupPopup/AddnewUserPopup'
import DeleteGroup from 'components/deleteGroup/DeleteGroup'
import ScrollableMessage from 'components/scrollableMessage/ScrollableMessage'
import io from 'socket.io-client'


const ENDPOINT = process.env.REACT_APP_BACKEND_HOST
let socket, selectedChatCompare

function ChatBox() {
    const userRole = localStorage.getItem('userRole')

    const [refreash, setRefreash] = useState(false)

    //popups
    const [createGroupPopup, setCreateGroupPopup] = useState(false)
    const [groupDetails, setGroupDetails] = useState(false)
    const [editGroupNamePopup, setEditGroupNamePopup] = useState(false)
    const [removeUserPopup, setRemoveUserPopup] = useState(false)
    const [addUserPopup, setAddUserPopup] = useState(false)
    const [deletGroupPopup, setDeletGroupPopup] = useState(false)

    const [myGroups, setMyGroups] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [messages, setMessages] = useState(null)
    const [messageContent, setMessageContent] = useState("")


    

    const sendMessage = async(e) => {
        e.preventDefault()
       
    }

    const fetchMessages = async() => {
        
    
    }

    const fetchMyGroups = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/chat/my-chats`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
        })
        const res = await response.json()
        if(response.status === 200){
            setMyGroups(res)
            setSelectedGroup(res[0])
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        if(selectedGroup){
            fetchMessages()
        }
        if(!selectedGroup)
            setMessages(null)
    }, [selectedGroup])

    useEffect(()=> {
        setRefreash(false)

        fetchMyGroups()
    }, [refreash])

    useEffect(()=>{
       
    })
    
  return (
    <div className='chatscreen'>
        <div className='chatscreen-left'>
            <div className='chat-header'>
                <h4>My Chats</h4>
                {(userRole == 3 || userRole === 5) && <i className='nc-icon nc-simple-add' onClick={()=>setCreateGroupPopup(true)}/>}
            </div>
            <div className='groups'>
                {!myGroups && <div>No groups yet</div>}
                {myGroups && myGroups.length === 0 && <div style={{padding:10, color:'white'}}>No groups yet</div>}
                {myGroups && myGroups.map((group, index) => {
                    return  <div className='group' key={index} onClick={()=>setSelectedGroup(group)}>
                                <h5>{group.groupname}</h5>
                                {group.latestMessage && <p><span>{localStorage.getItem('user') === group.latestMessage.sender._id ? 'You' : group.latestMessage.sender.name}</span>: {group.latestMessage.content.substr(0, 30)}</p>}
                                {!group.latestMessage && <p>No mesages yet</p>}
                            </div>
                })}
               
            </div>
        </div>
        <div className='chatscreen-right'>
            <div className='chat-header'>
                {!selectedGroup && <h4>Group</h4>}
                {selectedGroup && <h4>{selectedGroup.groupName}</h4>}
               {myGroups && myGroups.length > 0 && <div>
                    {(userRole == 3 || userRole == 5) && <>
                        <HiUserAdd onClick={()=>setAddUserPopup(true)}/>
                        <HiUserRemove onClick={()=> setRemoveUserPopup(true)}/>
                        <MdOutlineDriveFileRenameOutline onClick={()=>setEditGroupNamePopup(true)}/>
                        <FaTrash onClick={()=>setDeletGroupPopup(true)}/>
                    </>}
                    <BsThreeDotsVertical onClick={()=>setGroupDetails(true)}/>
                </div>}
            </div>
            <div className='chatbox'>
                {!messages && <div> No messages yet </div>}
                {messages && <ScrollableMessage messages={messages}/>}
            </div>
            <Form onSubmit={sendMessage}>
                <div className='send-box'>
                    <Input type='text' value={messageContent} placeholder='Write something ...' required onChange={(e) => setMessageContent(e.target.value)}/>
                    <Button>
                        <i className='nc-icon nc-send' />
                    </Button>
                </div>
            </Form>
        </div>
        {groupDetails && <GroupDetails selectedGroup={selectedGroup} setGroupDetails={setGroupDetails}/>}
        {removeUserPopup && <RemoveUserFromGroup  selectedGroup={selectedGroup} setRemoveUserPopup={setRemoveUserPopup} setRefreash={setRefreash}/>}
        {deletGroupPopup && <DeleteGroup selectedGroup={selectedGroup} setDeletGroupPopup={setDeletGroupPopup} setRefreash={setRefreash}/>}
        {addUserPopup && <AddnewUserPopup  selectedGroup={selectedGroup} setAddUserPopup={setAddUserPopup} setRefreash={setRefreash}/>}
        {editGroupNamePopup && <EditGroupName selectedGroup={selectedGroup} setEditGroupNamePopup={setEditGroupNamePopup} setRefreash={setRefreash}/>}
        {createGroupPopup && <CreateGroupPopup setCreateGroupPopup={setCreateGroupPopup} setRefreash={setRefreash}/>}
    </div>
  )
}

export default ChatBox