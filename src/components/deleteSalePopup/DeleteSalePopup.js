import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

function DeleteSalePopup({ saleToBeDeleted, setSaleToBeDeleted, setDeleteSalePopup}) {

  const [loading, setLoading] = useState(false)

  const deleteSale = async() => {
    setLoading(true)
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/sale/${saleToBeDeleted._id}`,{
      method: 'DELETE',
      headers:{
        'Content-Type' : 'Application/json',
        token: localStorage.getItem('token')
      }
    })
    const res = await response.json()
    if(response.status === 200){
      toast.success(res.message)
      setDeleteSalePopup(false)
    }
    else
      toast.error(res.message)
    setLoading(false)
  }

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
                <Button className='btn-danger' style={{width:'100%'}} disabled={loading? true : false} onClick={deleteSale}>{`${loading? 'Please Wait' : 'Delete'}`}</Button>
            </CardBody>
        </Card>
    </div>
  )
}

export default DeleteSalePopup