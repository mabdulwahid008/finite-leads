import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import '../../assets/additional/popup.css'
import { RxCross1 } from 'react-icons/rx'

function DeactivatePopup({ setDeactivePopup, agentToBeDeactiveOrActive, setAgentToBeDeactiveOrActive, onSubmitDeactiveAgent }) {
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
                <Button className='btn-danger' style={{width:'100%'}} onClick={onSubmitDeactiveAgent}>Deactivate</Button>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeactivatePopup