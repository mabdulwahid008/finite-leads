import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'

function DeleteGroup({ selectedGroup, setDeletGroupPopup, setRefreash }) {
    const [loading, setLoading] = useState(false)
    const onSubmit = async() => {
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/chat/delete-group`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(selectedGroup)
        })

        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setRefreash(true)
            setDeletGroupPopup(false)
        }
        else    
            toast.error(res.message)
        setLoading(false)
    }
  return (
    <div className='popup'>
        <div className="overlay"></div>
        <Card className="card-popup">
            <CardHeader>
                <CardTitle tag="h5">Are You Sure?</CardTitle>
                <RxCross1 onClick={()=>setDeletGroupPopup(false)}/>
            </CardHeader>
            <CardBody>
                <p>Deleting {selectedGroup.groupName}</p>
                <Button className='btn-danger' style={{width: '100%'}} disabled={loading? true : false} onClick={onSubmit}>{loading? "Please Wait" : "Delete"}</Button>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeleteGroup