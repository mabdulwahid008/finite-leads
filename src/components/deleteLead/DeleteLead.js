import React from 'react'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import '../../assets/additional/popup.css'
import { RxCross1 } from 'react-icons/rx'

function DeleteLead({leadToBeDelete, setDeleteLeadPopup, deleteLead }) {
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup active-deactive-popup'>
            <CardHeader>
                <CardTitle tag="h5">Are You Sure?</CardTitle>
                <RxCross1 onClick={()=> {setDeleteLeadPopup(false)}}/>
            </CardHeader>
            <CardBody>
                <p>Deleting {leadToBeDelete.name}'s Lead.</p>
                <button className='btn-danger2' style={{width:'100%'}} onClick={deleteLead}>Delete Permanently</button>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeleteLead
