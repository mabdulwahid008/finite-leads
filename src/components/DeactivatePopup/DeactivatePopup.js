import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import '../../assets/additional/popup.css'
import { RxCross1 } from 'react-icons/rx'

function DeactivatePopup({ setDeactivePopup, agentToBeDeactiveOrActive, setAgentToBeDeactiveOrActive, onSubmitDeactiveAgent, onSubmitDeleteAgent }) {
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup active-deactive-popup'>
            <CardHeader>
                <CardTitle tag="h5">Are You Sure?</CardTitle>
                <RxCross1 onClick={()=> {setDeactivePopup(false); setAgentToBeDeactiveOrActive(null)}}/>
            </CardHeader>
            <CardBody>
                <p>{agentToBeDeactiveOrActive.name} will not be able to access the system.</p>
                <Row>
                  <Col md="6" className='pr-1'>
                      <Button className='btn-danger' style={{width:'100%'}} onClick={onSubmitDeactiveAgent}>Deactivate</Button>
                  </Col>
                  <Col md="6" className='pl-1'>
                      <button className='btn-danger2' style={{width:'100%'}} onClick={onSubmitDeleteAgent}>Delete Permanently</button>
                  </Col>
                </Row>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeactivatePopup