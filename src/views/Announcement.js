import React from 'react'
import { Card, CardHeader, CardTitle, Col, Row } from 'reactstrap'

function Announcement() {
  return (
    <div className='content'>
      <Row>
        <Col>
            <Card>
                <CardHeader>
                    <CardTitle tag="h4">Announcement</CardTitle>
                </CardHeader>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Announcement
