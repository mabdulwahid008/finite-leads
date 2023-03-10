import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import '../../assets/additional/popup.css'
import { RxCross1 } from 'react-icons/rx'

function DeletePopup({ setDeletePopup, agentToBeDeleted, setAgentToBeDeleted, onSubmitDeleteAgent }) {
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Are You Sure?</CardTitle>
                <RxCross1 onClick={()=> {setDeletePopup(false); setAgentToBeDeleted(null)}}/>
            </CardHeader>
            <CardBody>
                <p>Deleting {agentToBeDeleted.name} will also delete all his activities.</p>
                <Button className='btn-danger' style={{width:'100%'}} onClick={onSubmitDeleteAgent}>Delete</Button>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeletePopup