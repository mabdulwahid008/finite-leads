import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import ReactSelect from 'react-select'
import { toast } from 'react-toastify'
import Loading from 'components/Loading/Loading'

function CreateGroupPopup({ setCreateGroupPopup, setRefreash }) {
    const [loading, setLoading] = useState(false)

    const [usersOption, setUsersOption] = useState(null)
    const [selectedUsers, setSelectedUsers] = useState(null)
    const [groupName, setGroupName] = useState('')

    const createGroup = async(e) => {
        e.preventDefault();
        setLoading(true)
        if(selectedUsers === null){
            setLoading(false)
            return toast.error("Users should me more than 2 to create a group")
        }
        if(selectedUsers.length < 2){
            setLoading(false)
            return toast.error("Users should me more than 2 to create a group")
        }
        
        let users = []
        for (let i = 0; i < selectedUsers.length; i++) {
            users[i] = selectedUsers[i].value
        }

        let data = {
            groupName: groupName,
            users: users
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/chat/create-group`,{
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setRefreash(true)
            setCreateGroupPopup(false)
        }
        else 
            toast.error(res.message)
        setLoading(false)
    }

    const fetchUsers = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/user/99`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            const options = []
            for (let i = 0; i < res.length; i++) {
               let obj = {
                   value: res[i]._id,
                   label: res[i].name
               }
               options.push(obj)
            }
            setUsersOption(options)
        }
        else
            toast.error(res.message)
    }

    useEffect(() => {
        fetchUsers()
    }, [])
    
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Create New Group</CardTitle>
                <RxCross1 onClick={()=> setCreateGroupPopup(false)}/>
            </CardHeader>
            <CardBody>
                {!usersOption && <Loading />}
                {usersOption && <Form onSubmit={createGroup}>
                    <FormGroup>
                        <label>Group Name</label>
                        <Input type='text' name='groupName' required onChange={(e)=> setGroupName(e.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Select Members</label>
                        <ReactSelect isMulti options={usersOption} required onChange={(value)=>setSelectedUsers(value)}/>
                    </FormGroup>
                    <Button disabled={loading? true : false}>{`${loading? 'Please Wait': 'Create'}`}</Button>
                </Form>}
            </CardBody>
        </Card>
    </div>
  )
}

export default CreateGroupPopup