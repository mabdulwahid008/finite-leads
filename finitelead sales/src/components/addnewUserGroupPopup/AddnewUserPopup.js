import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import ReactSelect from 'react-select'

function AddnewUserPopup({ selectedGroup, setAddUserPopup, setRefreash }) {
    const [options, setOptions] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)

    const fetchUsers = async() =>{
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
            setOptions(options)
        }
        else
            toast.error(res.message)
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        setLoading(true)
        if(!user){
            setLoading(false)
            return toast.error('Please select a user to be added')
        }

        let data = {
            _id: selectedGroup._id,
            userId: user
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/chat/add-new-users`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })

        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setAddUserPopup(false)
            setRefreash(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    useEffect(()=>{
        fetchUsers()
    }, [])
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Add New Member</CardTitle>
                <RxCross1 onClick={()=>setAddUserPopup(false)}/>
            </CardHeader>
            <CardBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <label>Select user</label>
                        <ReactSelect options={options} onChange={(option)=>setUser(option.value)}/>
                    </FormGroup>
                    <Button style={{width:'100%'}} disabled={loading? true : false}>{loading? 'Please Wait' : 'Add Member'}</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default AddnewUserPopup