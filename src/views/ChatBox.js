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

function ChatBox() {
    const userRole = localStorage.getItem('userRole')

    const [refreash, setRefreash] = useState(false)

    //popups
    const [createGroupPopup, setCreateGroupPopup] = useState(false)
    const [groupDetails, setGroupDetails] = useState(false)
    const [editGroupNamePopup, setEditGroupNamePopup] = useState(false)
    const [removeUserPopup, setRemoveUserPopup] = useState(false)

    const [myGroups, setMyGroups] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)

    const fetchMyGroups = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/chat/my-groups`,{
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

    useEffect(()=> {
        setRefreash(false)

        fetchMyGroups()
    }, [refreash])
    
    fetchMyGroups()
  return (
    <div className='chatscreen'>
        <div className='chatscreen-left'>
            <div className='chat-header'>
                <h4>My Chats</h4>
                {(userRole == 3 || userRole === 5) && <i className='nc-icon nc-simple-add' onClick={()=>setCreateGroupPopup(true)}/>}
            </div>
            <div className='groups'>
                {!myGroups && <Loading />}
                {myGroups && myGroups.map((group, index) => {
                    return  <div className='group' key={index} onClick={()=>setSelectedGroup(group)}>
                                <h5>{group.groupName}</h5>
                                <p><span>Bilal</span>: Hello there</p>
                            </div>
                })}
               
            </div>
        </div>
        <div className='chatscreen-right'>
            <div className='chat-header'>
                {!selectedGroup && <h4>Group</h4>}
                {selectedGroup && <h4>{selectedGroup.groupName}</h4>}
                <div>
                    {(userRole == 3 || userRole == 5) && <>
                        <HiUserAdd />
                        <HiUserRemove onClick={()=> setRemoveUserPopup(true)}/>
                        <MdOutlineDriveFileRenameOutline onClick={()=>setEditGroupNamePopup(true)}/>
                        <FaTrash />
                    </>}
                    <BsThreeDotsVertical onClick={()=>setGroupDetails(true)}/>
                </div>
            </div>
            <div className='chatbox'>
                hhhhhhhhhhhhh
            </div>
            <Form>
                <div className='send-box'>
                    <Input type='text' placeholder='Write something ...'/>
                    <Button>
                        <i className='nc-icon nc-send' />
                    </Button>
                </div>
            </Form>
        </div>
        {groupDetails && <GroupDetails selectedGroup={selectedGroup} setGroupDetails={setGroupDetails}/>}
        {removeUserPopup && <RemoveUserFromGroup  selectedGroup={selectedGroup} setRemoveUserPopup={setRemoveUserPopup} setRefreash={setRefreash}/>}
        {editGroupNamePopup && <EditGroupName selectedGroup={selectedGroup} setEditGroupNamePopup={setEditGroupNamePopup} setRefreash={setRefreash}/>}
        {createGroupPopup && <CreateGroupPopup setCreateGroupPopup={setCreateGroupPopup} setRefreash={setRefreash}/>}
    </div>
  )
}

export default ChatBox