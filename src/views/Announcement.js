import Loading from 'components/Loading/Loading'
import AnnouncementPopup from 'components/announcementPopup/AnnouncementPopup'
import DeleteAnnouncement from 'components/deleteAnnouncement/DeleteAnnouncement'
import ViewAnnouncement from 'components/viewAnnouncement/ViewAnnouncement'
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'

function Announcement() {
  const [postPopup, setPostPopup] = useState(false)
  const [announcement, setAnnouncement] = useState(null)
  const [lightBox, setLightBox] = useState(false)
  const [image, setImage] = useState(null)
  const [deletePopup, setDeletePopup] = useState(false)
  const [announcementId, setAnnouncementId] = useState(null)

  const userGroup = [
    {value: 0, label: 'Sales Agent'},
    {value: 1, label: 'Marketing Agent'},
    {value: 2, label: 'Real Estate Agent'},
  ]

  const fetchAnnouncements = async() => {
    const response = await fetch(`/announcement`, {
      method: 'GET',
      headers: {
          'Content-Type': 'Application/json',
          token: localStorage.getItem('token')
      }
    })
    const res = await response.json()
    if(response.status === 200)
       setAnnouncement(res);
    else
        console.log(res.message)
  }

  useEffect(()=>{
      fetchAnnouncements()
  }, [postPopup, deletePopup])

  return (
    <div className='content'>
      <Row>
        <Col>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Announcement</CardTitle>
                    <Button onClick={()=>setPostPopup(true)}>Post</Button>
                </CardHeader>
                <CardBody>
                    {!announcement && <Loading />}
                    {announcement?.length === 0 && <p>No Announcement posted yet</p>}
                     <Row>
                    {announcement?.map((announce, index)=>{
                        return <Col md="3" key={index} className='announcement'>
                          <div onClick={()=>{setImage(announce.image);setLightBox(true)}}> 
                            <img src={`${process.env.REACT_APP_IMAGE_URL}/${announce.image}`}/>
                          </div>
                          <div>
                            <div>
                              <p style={{padding:'8px 0px 5px'}}>For {userGroup.filter((user)=> user.value == announce.for_user_role)[0].label} </p>
                              <p style={{padding:'5px 0px'}}>Posted On: {announce.created_at}</p>
                            </div>
                            <FaTrash onClick={()=>{setAnnouncementId(announce._id); setDeletePopup(true)}}/>
                          </div>
                        </Col>
                    })}
                    </Row>
                </CardBody>
            </Card>
        </Col>
      </Row>
      {postPopup && <AnnouncementPopup setPostPopup={setPostPopup}/>}
      {lightBox && image && <ViewAnnouncement image={image} setLightBox={setLightBox}/>}
      {deletePopup && announcementId && <DeleteAnnouncement setDeletePopup={setDeletePopup} announcementId={announcementId}/>}
    </div>
  )
}

export default Announcement
