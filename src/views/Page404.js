import React from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'

function Page404() {
  return (
    <div className='content'>
      <Row>
        <Col md="12">
            <Card>
                <CardBody style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', height:500}}>
                    <h1>OOPS!!!</h1>
                    <h2>404, Page Not Found</h2>
                </CardBody>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Page404
