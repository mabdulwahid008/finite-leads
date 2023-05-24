import React, { useEffect } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'

function Page404({ error, status }) {
  Page404.defaultProps = {
    error: "Page not found",
    status: "404"
  }

  useEffect(()=>{
    setTimeout(()=>{
        document.getElementById('brand-name').innerHTML = status
    }, 100)
  }, [])
  return (
    <div className='content'>
      <Row>
        <Col md="12">
            <Card>
                <CardBody style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', height:500}}>
                    <h1>{status}</h1>
                    <h2>OOPS!, {error}</h2>
                </CardBody>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Page404
