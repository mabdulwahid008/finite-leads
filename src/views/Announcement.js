import AnnouncementPopup from 'components/announcementPopup/AnnouncementPopup'
import React, { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, Col, Row } from 'reactstrap'

function Announcement() {
  const [postPopup, setPostPopup] = useState(false)
  return (
    <div className='content'>
      <Row>
        <Col>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Announcement</CardTitle>
                    <Button onClick={()=>setPostPopup(true)}>Post</Button>
                </CardHeader>
            </Card>
        </Col>
      </Row>
      {postPopup && <AnnouncementPopup setPostPopup={setPostPopup}/>}
    </div>
  )
}

export default Announcement
