import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, Col, Row } from 'reactstrap';

function REAgentStatsListing() {
    const { id } = useParams()
    console.log(id);
  return (
    <div className='content'>
        <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Hello</CardTitle>
                    </CardHeader>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default REAgentStatsListing
