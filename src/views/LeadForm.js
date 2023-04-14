import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import '../assets/additional/LeadForm.css'

function LeadForm() {
  return (
    <div className='content'>
        <Row style={{display:'flex', margin:0, justifyContent: 'center', alignItems:'center', overflow: 'hiden', padding:'50px 0px', width: '100vw', background: '#f4f3ef'}}>
            <Col md='8'>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Add Lead</CardTitle>
                    </CardHeader>
                    <CardBody>
                        
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default LeadForm