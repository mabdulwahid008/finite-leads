import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import '../../assets/additional/popup.css'
import { RxCross1 } from 'react-icons/rx'

function ActivateUserPopup({ setActivePopup, agentToBeDeactiveOrActive, setAgentToBeDeactiveOrActive, onSubmitActiveAgent }) {
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup active-deactive-popup'>
            <CardHeader>
                <CardTitle tag="h5">Are You Sure?</CardTitle>
                <RxCross1 onClick={()=> {setActivePopup(false); setAgentToBeDeactiveOrActive(null)}}/>
            </CardHeader>
            <CardBody>
                <p>{agentToBeDeactiveOrActive.name} will be able to access the system.</p>
                <Button className='btn-success' style={{width:'100%'}} onClick={onSubmitActiveAgent}>Activate</Button>
            </CardBody>
        </Card>
    </div>
  )
}
export default ActivateUserPopup
