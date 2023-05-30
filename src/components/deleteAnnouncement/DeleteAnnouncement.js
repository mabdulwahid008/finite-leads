import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

function DeleteAnnouncement({ setDeletePopup, announcementId }) {
    const [loading, setLoading] = useState(false)

    const deleteAnnouncement = async() => {
        setLoading(true)
        const response = await fetch(`/announcement/${announcementId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type':'Application/json',
                token: localStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setDeletePopup(false)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h4">Delete Announcement</CardTitle>
                <RxCross1 onClick={()=>setDeletePopup(false)}/>
            </CardHeader>
            <CardBody>
                <Button className='btn-danger' style={{width: '100%'}} disabled={loading? true : false} onClick={deleteAnnouncement}>{loading? 'Please Wait':'Delete'}</Button>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeleteAnnouncement
