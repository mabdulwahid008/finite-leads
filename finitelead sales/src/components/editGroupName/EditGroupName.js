import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Input } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'

function EditGroupName({ selectedGroup, setEditGroupNamePopup, setRefreash}) {
    const [updatedGroupName, setUpdatedGroupName] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        if(updatedGroupName.length < 5){
            setLoading(false)
            return toast.error("Group name should be 5 characters long")
        }

        let data = {
            _id: selectedGroup._id,
            updatedGroupName: updatedGroupName
        }
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/chat/update-group-name`,{
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
            setRefreash(true)
            setEditGroupNamePopup(false)
        }
        else
        	toast.error(res.message)
        setLoading(true)
    }
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Edit Group Name</CardTitle>
                <RxCross1 onClick={()=>setEditGroupNamePopup(false)}/>
            </CardHeader>
            <CardBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <label>New Name</label>
                        <Input type='text' name="updatedGroupName" required onChange={(e)=> setUpdatedGroupName(e.target.value)} />
                    </FormGroup>
                    <Button style={{width:'100%'}} disabled={loading? true : false}>{`${loading? 'Please Wait': 'Update'}`}</Button>
                </Form>
            </CardBody>
        </Card>
    </div>
  )
}

export default EditGroupName