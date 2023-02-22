import React from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

function DeleteSalePopup({ saleToBeDeleted, setSaleToBeDeleted, setDeleteSalePopup}) {
  return (
    <div className='popup'>
        <div className='overlay'></div>
        <Card className='card-popup'>
            <CardHeader>
                <CardTitle tag="h5">Are You Sure?</CardTitle>
                <RxCross1 onClick={()=>{setDeleteSalePopup(false); setSaleToBeDeleted(null)}}/>
            </CardHeader>
            <CardBody>
                <p>Deleting sale of client: {saleToBeDeleted.client_name}</p>
                <Button className='btn-danger' style={{width:'100%'}} onClick={()=>{}}>Delete</Button>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeleteSalePopup