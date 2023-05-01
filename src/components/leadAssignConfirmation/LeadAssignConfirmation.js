import React from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

function LeadAssignConfirmation({ agentName, assignLead, setConfirmAssignPopup }) {
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h4">{agentName} Exceed Monthly Limit</CardTitle>
                <RxCross1 onClick={()=> setConfirmAssignPopup(false)}/>
            </CardHeader>
            <CardBody>
                <p>Are you sure assigning this lead to {agentName}?</p>
                <Button style={{width:'100%'}} color="danger" onClick={assignLead}>Assign</Button>
            </CardBody>
        </Card>
    </div>
  )
}

export default LeadAssignConfirmation
